import mongoose from "mongoose";
import User from "../model/user.model.js";
import { log } from "console";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

dotenv.config();

const registerUser = async (req, resp) => {
  dotenv.config();

  const { email, name, password } = req.body;

  if (!name || !email || !password) {
    return resp.status(400).json({ message: "Required data is not found" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    const hash = await bcrypt.hashSync(password, process.env.HASH);
    const newUser = await new User({ name, email, password: hash });

    await newUser
      .save()
      .then(() => {
        console.log("saved correctly");
        return resp.status(200).json({ message: "User Saved" });
      })
      .catch((e) => {
        console.log("error" + e);
        return resp.status(200).json({ message: "user already exists" });
      });

    //send email
    const email_ConfigOptions = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_TOKEN,
      },
    };

    const transporter = nodemailer.createTransport(email_ConfigOptions);

    transporter.verify((error, sucess) => {
      error ? console.log(error) : console.log("suceeding the transport");
    });

    //Token Generation
    const tokenString = "12345676890abcdefghijklmnopqrstuvwxy";

    let token = "";
    for (let i = 0; i < tokenString.length; i++) {
      token += tokenString[Math.floor(Math.random() * tokenString.length)];
    }

    //message
    let message = {
      from: "raj2ps@getMaxListeners.com",
      to: email,
      subject: "send mailer ",
      text: `Please click following link ${process.env.BASE_URL}/api/verify/${token}`,
    };

    await transporter
      .sendMail(message)
      .then(() => console.log("suceeded in sending"))
      .catch((e) => console.log(e));

    //await newUser.updateOne({verificationToken:token});
    newUser.verificationToken = token;
    await newUser.save();
  } else {
    return resp.status(200).json("user already exists");
  }
};

const verifyUser = async (req, resp) => {
  let { token } = req.params;
  console.log(token);
  if (!token) {
    return resp.status(404).json({ message: "No token" });
  }

  const verifiedUser = await User.findOne({ verificationToken: token });

  if (!verifiedUser) {
    console.log("not a valid user  ");
    return resp.status(404).json({ message: "invlid token" });
  }

  verifiedUser.verificationToken = undefined;
  verifiedUser.isVerified = true;
  await verifiedUser.save();

  console.log("User got verified");

  return resp.status(200).json({ message: "user Got verified" });

  return resp.status(200).json({ messge: "suceeded in parsing the token" });
};

const loginUser = async (req, resp) => {
  //username and password needs to be checked
  //check is verified
  //JSON Web token issue
  //save in the  cookies
  //dotenv.config();
  const { email, password } = req.body;
  console.log("====================================");
  console.log(email + password);
  console.log("====================================");
  if (!email || !password) {
    return resp.status(200).json({ message: "no Data" });
    console.log("returned");
  }

  const user = await User.findOne({ email });

  if (!user) {
    console.log("user not found");
  } else {
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return resp.status(200).json({ message: "password not matched" });
    }

    //Since Password Matched Create a JWT Token and save in cookie
    console.log(process.env.SECRET_KEY);
    const jwtToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      process.env.SECRET_KEY
    );

    resp.cookie("authToken", jwtToken, {
      httpOnly: true,
      secure: true,
      samSite: "Strict",
      maxAge: 60 * 60 * 100,
    });

    return resp.status(200).json({ messaage: "Successful" });
  }

  return resp.status(200).json({ message: "successfully reached" });
};

const getUser = async(req,resp) =>{
   const {email,password} = req.body;
   let user =User.findOne({email})
   console.log(user);
   

   return resp.status(200).json({message:"successfully reached end"})

}

const logOut = (req,resp)=>{
   resp.cookie("token","",{});
   return resp.status(200).json({message:"sccessfully logged out"})
}
export { registerUser, verifyUser, loginUser,getUser ,logOut};
