import mongoose from "mongoose";

const connectDB = (url) => {
  try {
    const connect = mongoose.connect(url);
    if (connect) {
      console.log("MongoDB Connected");
      return connect;
    }
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;