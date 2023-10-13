import express from "express";
import {
    getAllUsers,
    register,
    login,
    logout,
    getMyProfile
}  from "../controllers/userController.js";

import { isAuthenticated } from "../middlewares/auth.js";


const userRouter =  express.Router();


userRouter.post('/new', register);

userRouter.post('/login', login);

userRouter.get('/logout', logout);

userRouter.get('/me', isAuthenticated, getMyProfile);

userRouter.get('/all', isAuthenticated, getAllUsers);



export default userRouter;