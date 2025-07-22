import express  from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

import connectDB from './db/connect.js';

app.get('/', (req, res) => {
  res.send('Hello from simple Node.js app!');
});


const connection = async()=>{
    try{
        connectDB(process.env.MONGODB)
        .then(() => {
           app.listen(PORT, () => {
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
