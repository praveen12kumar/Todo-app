import {User} from "../models/userModel.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";


//@desc: login function
//route: /api/v1/user/login
//@access: public

const login = asyncHandler( async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error(`Enter the required fields`)
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        res.status(400).json({
            success: false,
            message: `Invalid email or password`,
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        res.status(400).json({
            success: false,
            message: `Invalid email or password`,
        })
    }
    else{
        generateToken(res, user._id, 201);
        res.status(200).json({
            success:true,
            message: `Welcome back ${user.name}`,
            id: user._id,
            name: user.name,
            email: user.email
        });
    }
});

//@desc: logout function
//route: /api/v1/user/logout
//@access: private

const logout = asyncHandler( async(req, res)=>{
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        sameSite:process.env.NODE_ENV === 'development' ? 'lax':"none",
        secure:process.env.NODE_ENV === 'development' ? false :true,
    
    }).json({
        success:true,
        message: `Logout successfully`
    })
});

//@desc: to register new user
//route: /api/v1/user/new
//@access: public
const register = asyncHandler( async(req, res)=>{
    const {name, email, password} = req.body;

    // check if we get name, email and password
    if(!name || !email || !password){
        res.status(400);
        throw new Error('Please enter all required fields')
    }
    // find user 
    const user = await User.findOne({email});

    if(user){
        res.status(404).json({
            status:false,
            message: "User already registered"
        })
    }
    // hashed password
    const salt = await bcrypt.genSalt(10);
    const hassedPassword = await bcrypt.hash(password, salt);
    // create new user
    const newUser = await User.create({
        name, 
        email, 
        password: hassedPassword
    });

    if(newUser){
        generateToken(res, newUser._id, 200);
        res.json({
            success: true,
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        })
    }
    else{
        res.status(400);
        throw new Error(`Invalid user data`);
    }
});


//@desc: to get all users
//route: /api/v1/user/all
//@access: private


const getAllUsers = asyncHandler( async(req, res)=>{
    const user = await User.find({});
    if(!user){
        res.status(400).json({
            success: false,
        });
    }
    res.status(200).json({
        success: true,
        message: "All users found",
        user
    })
});


//@desc: function return the user profile
//route: /api/v1/user/me
//@access: private

const getMyProfile = (req, res)=>{
    // we need id to access the user profile
    // How?
    // well we have cookie and we can get the user_id from the cookie and using findById({}) we can get the user details
    res.status(200).json({
        success: true,
        message: 'User profile',
        user: req.user
        })
};


export {
    getAllUsers,
    login,
    logout,
    register,
    getMyProfile
}