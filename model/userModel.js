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
    profile:{
        type: String,
        default: 'https://res.cloudinary.com/dz3qj1x8h/image/upload/v1698851234/default-profile-picture.png'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const User = mongoose.model('User', userSchema);
export default User;