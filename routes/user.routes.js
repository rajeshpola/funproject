import mongoose from "mongoose";
import express from "express";
import {registerUser,verifyUser,loginUser,getUser} from '../controller/user.controller.js'


const router = express.Router();

router.get('/api/register',registerUser);
router.get('/api/verify/:token',verifyUser);
router.get('/api/login',loginUser);
router.get('/api/getUser',getUser);




export default router

