import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: false,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    isGoogleUser: {
        type: Boolean,
        default: false,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    lastActive:{
        type:Date,
        default :new Date(),
    },
    profile:{
        type: String,
    },
    tokenVersion: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const User = mongoose.model('User', userSchema);
export default User;