import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false, // during login when the email and password are passed, it wont give you the password.
    }
},{
    timestamps:true,
});

export const User = mongoose.model("User",userSchema);