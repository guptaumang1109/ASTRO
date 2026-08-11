import Chat from "../models/Chat.js";


//API CONTROLLER FOR CREATING A NEW CHAT
export const createChat = async (req,res) => {
    try {
        const userId = req.user._id;
        const chatData = {
            userId ,
            messages : [],
            userName : req.user.name ,
            name :"New Chat",
        }

        await Chat.create(chatData);
        res.json({success:true , message:"Chat Created"});
        } catch (error) {
        res.json({success:false , message:error.message});
    }
}

//API CONTROLLER FOR GETIING ALL CHAT
export const getChats = async (req,res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({userId}).sort({updatedAt : -1});

        // Auto-fix legacy stored ImageKit URLs missing the /astro/ path
        const cleanedChats = chats.map(chat => {
            const chatObj = chat.toObject();
            chatObj.messages = chatObj.messages.map(msg => {
                if (msg.isImage && msg.content && typeof msg.content === 'string' && msg.content.includes('ik.imagekit.io') && !msg.content.includes('/astro/')) {
                    msg.content = msg.content.replace('/3b2z3x3e1/astro_', '/3b2z3x3e1/astro/astro_');
                }
                return msg;
            });
            return chatObj;
        });

        res.json({success:true , chats: cleanedChats});
    } catch (error) {
        res.json({success:false , message:error.message});
    }
}

//API CONTROLLER TO DELETE CHAT
export const deleteChat = async(req,res) =>{
    try {
        const userId = req.user._id;
        const {chatId} = req.body ;

        await Chat.deleteOne({_id : chatId , userId});

        res.json({success:true , message:"Chat Deleted"});
    } catch (error) {
        res.json({success:false , message:error.message});
    }
}