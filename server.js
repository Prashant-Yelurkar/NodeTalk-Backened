import express, { json } from 'express';
import dotenv from 'dotenv';
import CORS from 'cors';
import connectDB from './db/connect.js';
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;
app.use(CORS());


// Middleware
app.use(express.json());


// Routes

import authRoute from './auth/authRoute.js';
import useRoute from './routes/userRoute.js'
import authenticateToken from './auth/authMiddleware.js';

app.use('/auth', authRoute);
app.use('/user', authenticateToken  ,useRoute )

app.get('/', (req, res) => {

  res.json({ message: 'Welcome to the NodeTalk backend!' , status:200, appName: process.env.APP_NAME || 'NodeTalk' , time: new Date().toISOString() });
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

connection()

