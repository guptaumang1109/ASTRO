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
        res.json({success:true , message:chats});
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