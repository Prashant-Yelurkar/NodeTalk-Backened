import { validateToken } from "../auth/authController.js";
import chatModel from "../model/chatModel.js";
import MessageModal from "../model/messsageModel.js";

const connectionFn = async (io , socket, chats, decodedUser,user,  ActiveUser)=>{
    try{
        console.log(`🔌 User connected: ${socket.id}`);
        user.isOnline = true;
        await user.save();

        for (const chat of chats) {
            for (const member of chat.members) {
                if (member._id.toString() !== decodedUser.id.toString()) {
                const receiverSocketId = ActiveUser.get(member._id.toString());                
                    if (receiverSocketId) {
                        updateUserState(io, receiverSocketId , chat , true)
                    }
                }
            }
        }
    }
    catch(error)
    {
        console.log(error);
    }
}


const sendMessageFn = async (socket , io, ActiveUser, data ) =>{    
    try {
        console.log(data);
        
        const senderId = validateToken(socket.handshake.auth.token).id;
        const { chatId, userId, message } = data;
        let chat;

        if (chatId) {
            chat = await chatModel.findById(chatId);
        }
        
        if (!chat) {
            const members = [senderId, userId].sort(); 
            chat = await chatModel.findOne({
                members: members,
                isGroup: false
            });
            if (!chat) {
                chat = new chatModel({
                members: members,
                isGroup: false,
                lastMessage: message.text
                });

                await chat.save(); 
            }
        }
        
            chat.lastMessage = message.text;
            await chat.save();

            const newMessage = new MessageModal({
                chatId: chat._id,
                sender: senderId,
                text: message.text,
                type: message.type,
                url:message.url? message.url: null
            });

            await newMessage.save();
            const receiverSocketId = ActiveUser.get(userId);            
            if(receiverSocketId)
                {
                    io.to(receiverSocketId).emit("receiveMessage", {
                        chatId:chat?._id,
                        message:{...message, sender:senderId},
                    });
                }
    } catch (error) {
        console.error('Message error:', error);
    }
}


const disconnectSocketFn =  (socket , io, ActiveUser, user, chats )=>{
    return async ()=>{
    try {
        
            console.log(`❌ User disconnected: ${socket.id}`);
            user.isOnline = false;
            user.lastActive = new Date();
            await user.save();
            for (const chat of chats) {
                for (const member of chat.members) {
                    if (member._id.toString() !== user.id.toString()) {
                    const receiverSocketId = ActiveUser.get(member._id.toString());
                        if (receiverSocketId) {
                            updateUserState(io, receiverSocketId , chat , false)
                        }
                    }
                }
            }
            ActiveUser.delete(user._id.toString());

        } catch (err) {
            console.error("Error during disconnect:", err.message);
        }
    }
}


const updateUserState =(io, socketId, chat , status)=>{
    if (socketId) {
        io.to(socketId).emit("userStatus", {
            chatId: chat._id,
            isOnline: status,
            lastActive: new Date()
        });
    }


}


export {connectionFn, sendMessageFn, disconnectSocketFn}