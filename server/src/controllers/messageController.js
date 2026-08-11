import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import openai from "../configs/openai.js";
import axios from "axios";


//TEXT-BASED-AI CHAT MESSAGE CONTROLLER
export const textMessageController = async(req,res) => {
    try {
        const userId = req.user._id;
        //Check credits
        if(req.user.credits < 1){
            return res.json({success:false , message : "You don't have enough credits"});
        }

        const {chatId , prompt} = req.body;
        
        if(!chatId){
            return res.json({success:false , message : "Chat ID is required"});
        }

        const chat = await Chat.findOne({userId , _id:chatId});
        if(!chat){
            return res.json({success:false , message : "Chat not found"});
        }

        chat.messages.push({role : "user" , content : prompt , timestamp : Date.now() ,
        isImage : false});

        const {choices} = await openai.chat.completions.create({
        model: "gemini-3.6-flash",
        messages: [
            {
                role: "user",
                content: prompt,
            },
            ],
        });

        const reply = {...choices[0].message , timestamp:Date.now() , isImage:false};

        chat.messages.push(reply);
        await chat.save();

        await User.updateOne({_id:userId} , {$inc : {credits : -1}});
        res.json({success : true , reply});
    } catch (error) {
        res.json({success:false , message:error.message})
    }
}

//IMAGE GENERATION MESSAGE CONTROLLER
export const imageMessageController = async (req,res) =>{
    try {
        const userId = req.user._id;

        //Check credits
        if(req.user.credits < 2){
            return res.json({success:false , message : "You don't have enough credits"});
        }

        const {prompt , chatId , isPublished} = req.body ;

        //Find Chat
        const chat = await Chat.findOne({userId , _id:chatId});
        if(!chat){
            return res.json({success:false , message : "Chat not found"});
        }

        //Push user data
        chat.messages.push({
            role : "user" ,
            content : prompt ,
            timestamp : Date.now() ,
            isImage : false
        });

        //Encode the prompt
        const encodedPrompt = encodeURIComponent(prompt);
        const randomSeed = Math.floor(Math.random() * 1000000);

        let imageBuffer = null;

        const aiSources = [
            `https://image.pollinations.ai/prompt/${encodedPrompt}`,
            `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${randomSeed}`,
            `https://image.pollinations.ai/prompt/${encodedPrompt}?model=turbo`,
            `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux`
        ];

        for (const aiUrl of aiSources) {
            if (!aiUrl || aiUrl.startsWith('/')) continue;
            try {
                const response = await axios.get(aiUrl, {
                    responseType: "arraybuffer",
                    timeout: 12000,
                    headers: { 
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                    }
                });

                const buf = Buffer.from(response.data);
                if (buf.length > 2000) {
                    const headerHex = buf.slice(0, 4).toString('hex').toLowerCase();
                    // Magic byte check: PNG (89504e47), JPEG (ffd8ff), WEBP (52494646 - RIFF), GIF (47494638)
                    if (headerHex.startsWith('89504e47') || headerHex.startsWith('ffd8ff') || headerHex.startsWith('52494646') || headerHex.startsWith('47494638')) {
                        imageBuffer = buf;
                        break;
                    }
                }
            } catch (err) {
                // Try next AI source
            }
        }

        if (!imageBuffer) {
            return res.json({ success: false, message: "AI image service is currently busy. Please try sending your request again." });
        }

        const base64Str = imageBuffer.toString('base64');
        const base64DataUri = `data:image/png;base64,${base64Str}`;
        let finalImageUrl = base64DataUri;

        // Upload Base64 string to ImageKit under /astro folder
        if (imageBuffer) {
            try {
                const uploadResponse = await imagekit.upload({
                    file: base64Str,
                    fileName: `astro_${Date.now()}.png`,
                    folder: "/astro",
                    useUniqueFileName: true
                });
                if (uploadResponse && uploadResponse.url) {
                    finalImageUrl = uploadResponse.url;
                }
            } catch (uploadErr) {
                finalImageUrl = base64DataUri;
            }
        }

        const reply = {
            role : 'assistant' ,
            content : finalImageUrl ,
            timestamp : Date.now(), 
            isImage : true ,
            isPublished
        };

        chat.messages.push(reply);
        await chat.save();

        await User.updateOne({_id:userId} , {$inc : {credits : -2}});
        res.json({success : true , reply});
    } catch (error) {
        res.json({success:false , message : error.message});
    }
}
    
