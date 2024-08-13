
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    phone_number:{
        type:String,
        required: false
    },
    address:{
        type:String,
        required: false
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type:String,
        required: true,
        default: "admin"
    },
    provider:{
        type:String,
        default: "local"
    },
    googleId:{
        type:String,
        default: null
    },
    facebookId:{
        type:String,
        default: null
    }


})

export default mongoose.model("user",userSchema);