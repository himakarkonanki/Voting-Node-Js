const express=require('express');
const User=require('../models/user');
const jwt=require('jsonwebtoken');
const tokenVerify = require('../middleware/verifyToken');
const router=express.Router();

const signup= router.post('/signup',async(req,res)=>{
try
    {
        const data =req.body;
        const userexist= await User.findOne({aadhar:req.body.aadhar});
        if(userexist)
        {
            return res.status(400).json({message:"user already registered"})
        }

        const createuser=new User(data);
        await createuser.save();

        res.status(200).json({message:"User created"})

    }
catch(err)
    {
        console.log(err)
        res.status(500).json({message:"internal server error"})
    }
})



const login= router.post('/login', async(req,res)=>{
try
    {
        const {aadhar,password}=req.body;
        const user=await User.findOne({aadhar})
        if(!user)
        {
            return res.status(400).json({message:"no user registered"})
        }

        //jwt.sign method contains three parameters payload-consists of user info, secretkey, token expiration.
        const token=jwt.sign({id:user.id},'jjj',{expiresIn:'1h'});
        res.status(200).json({token})

    }

catch(err)
    {   
        console.error(err)
        res.json({msg:"internal server error"})
    }
})

const profiles= router.get('/profiles', tokenVerify, async(req,res)=>{
    const profiles=await User.find();
    res.status(200).json({profiles})
})

const profilesbyid=router.get('/profiles/:id', tokenVerify, async(req,res)=>{
    const id=req.params.id;
    const pId= await User.findById(id)
    res.status(200).json({pId});
})

module.exports={signup,login,profiles,profilesbyid};