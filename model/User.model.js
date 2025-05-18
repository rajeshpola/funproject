import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import { type } from "os";

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    isVerified :{
        type:Boolean,
        default:false
    },

    verificationToken:{
        type:String,
    
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpires: {
        type:Date
    }

},
{timestamps:true}
);

    

userSchema.pre('save',function(next){
    console.log(this);    
    if(this.isModified('password')){
        console.log("password got changed");
    } else 
    {
        console.log("no Change");
    }
    next();
})


const User =  mongoose.model("User",userSchema);


export default User

