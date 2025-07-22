import express, { json } from 'express';
import dotenv from 'dotenv';
import CORS from 'cors';
import connectDB from './db/connect.js';
import { Server as SocketIO } from 'socket.io';
import http from 'http';
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

// const server = http.createServer(app);
// const io = new SocketIO(server, {
//   cors: {
//     origin:  process.env.NODE_ENV === "development"
//     ? process.env.APP_DEVELOPMENT_LINK
//     : process.env.APP_PRODUCTION_LINK, // your frontend origin
//     methods: ['GET', 'POST'],
//   },
// });



// app.use(CORS({
//   origin:  process.env.NODE_ENV === "development"
//     ? process.env.APP_DEVELOPMENT_LINK
//     : process.env.APP_PRODUCTION_LINK,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));


// Middleware
// app.use(express.json());



// import authRoute from './auth/authRoute.js';
// import useRoute from './routes/userRoute.js'
// import authenticateToken from './auth/authMiddleware.js';
// import chatRoute from './routes/chatRoute.js'
// import { validateToken } from './auth/authController.js';
// import User from './model/userModel.js';
// import MessageModal from './model/messsageModel.js';
// import chatModel from './model/chatModel.js';
// app.use('/auth', authRoute);
// app.use('/user', authenticateToken  ,useRoute )
// app.use('/chat',authenticateToken, chatRoute)

app.get('/', (req, res) => {

  res.json({ message: 'Welcome to the NodeTalk backend!' , status:200, appName: process.env.APP_NAME || 'NodeTalk' , time: new Date().toISOString() });
});


// const ActiveUser =new  Map();
// io.on('connection', async (socket) => {
//   const token = socket.handshake.auth.token;
//   try {
//     const decodedUser = validateToken(token);
//     const user = await User.findOne({ email: decodedUser.email });
//     if (!user) return;
//     ActiveUser.set(decodedUser.id.toString() , socket.id )
//     user.isOnline = true;
//     await user.save();

//     console.log(`🔌 User connected: ${socket.id}`);

//     socket.on('message', async (data) => {
//         try {
//             const senderId = validateToken(socket.handshake.auth.token).id;
//             const { chatId, userId, message } = data;
//             console.log(userId , senderId);
    

//             let chat;

//             if (chatId) {
//                 chat = await chatModel.findById(chatId);
//             }


//             if (!chat) {
//                 const members = [senderId, userId].sort(); 
//                 chat = await chatModel.findOne({
//                     members: members,
//                     isGroup: false
//                 });
//                 if (!chat) {
//                     chat = new chatModel({
//                     members: members,
//                     isGroup: false,
//                     lastMessage: message.text
//                     });

//                     await chat.save(); 
//                 }
//             }
            
//                 chat.lastMessage = message.text;
//                 await chat.save();

//                 const newMessage = new MessageModal({
//                     chatId: chat._id,
//                     sender: senderId,
//                     text: message.text,
//                     type: message.type
//                 });

//                 await newMessage.save();
//                 const receiverSocketId = ActiveUser.get(userId);
//                 console.log(receiverSocketId);
                
//                 if(receiverSocketId)
//                     {
//                         io.to(receiverSocketId).emit("receiveMessage", {
//                             chatId:chat?._id,
//                             message:{...message, sender:senderId},
//                         });
//                     }
//             } catch (error) {
//                 console.error('Message error:', error);
//             }
//             });


//     socket.on('disconnect', async () => {
//       console.log(`❌ User disconnected: ${socket.id}`);
//       user.isOnline = false;
//       user.lastActive = new Date()
//       await user.save();
//       ActiveUser.delete(user._id.toString());
//     });

//   } catch (error) {
//     console.error('Socket auth error:', error.message);
//     socket.disconnect(); 
//   }
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const connection = async()=>{
    try{
        connectDB(process.env.MONGODB)
        .then(() => {
           app.listen(port, () => {
                console.log(`Server is running at http://localhost:${port}`);
            });
        })
        .catch((error) => console.log(error));
    }
    catch(error){
            console.error("MongoDB Connection Error:", error);
    }; 
}

// connection()

