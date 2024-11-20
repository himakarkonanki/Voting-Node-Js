const jwt=require('jsonwebtoken')
const User=require('../models/user')

const tokenVerify=async(req,res,next)=>{
try 
{
    const token=req.headers.token;
    if(!token) 
    {
        return res.status(400).json({message:"Authentication failed"})
    }
    const decoded=jwt.verify(token,'jjj');
    req.user=decoded;
    console.log(req.user)
    next();

}
catch(err)
{
    console.log(err);
    res.status(500).json({message:"internal server error"})
}
}

module.exports=tokenVerify;

