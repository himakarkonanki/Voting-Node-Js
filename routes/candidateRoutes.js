 const express=require('express');
 const Candidate=require('../models/candidate')
 const router=express.Router()
const User = require('../models/user');
const tokenVerify = require('../middleware/verifyToken');
 

const Admin= async (userid)=>{
try{
    const user=await User.findById(userid)
    return user?.role==='admin';
}
catch(err){
    return false;
}

}

router.post('/' ,tokenVerify,async(req,res)=>{
try{

    const isAdmin = await Admin(req.user.id);
    if (!isAdmin) {
      return res.status(403).json({ message: "You need to be an admin to perform this action." });
    }

    const data=req.body;
    const candidateexist=await Candidate.findOne(data)

    if(candidateexist)
    {
        return res.status(400).json({message:"candidate already exists"})
    }

    const newcandidate= new Candidate(data)
    await newcandidate.save()
    res.status(200).json({message:"candidate created"})
}
catch(error){
    console.log(error);
    res.status(200).json({message:"internal server error"})
}
})

router.put('/:cid',tokenVerify,async(req,res)=>{
try
{
    if(!Admin(req.user.id))
    {
        return res.status(400).json({message:"you need to be a admin to perform this"})
    }
    const cid=req.params.id
    const updated=await Candidate.findByIdAndUpdate(cid,req.body);
    console.log("updated")
    res.status(200).json({message:"updated sucessfully",updated})
}
catch(err)
{
    console.log(err);
    res.status(500).json({message:"internal server error"})
}
})

router.get('/',tokenVerify,async(req,res)=>{
    const candidates=await Candidate.find();
    res.status(200).json({candidates})
})


router.post('/vote/:candidateID', tokenVerify, async (req, res)=>{
    // no admin can vote
    // user can only vote once
    
     const candidateID = req.params.candidateID;
     const userId = req.user.id;
     console.log(userId)

    try{
        // Find the Candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID);
        if(!candidate)
        {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const user = await User.findById(userId);
        if(!user)
        {
            return res.status(404).json({ message: 'user not found' });
        }
        if(user.role == 'admin')
        {
            return res.status(403).json({ message: 'admin is not allowed'});
        }
        if(user.isVoted) //cannot vote twice
        {
            return res.status(400).json({ message: 'You have already voted' });
        }

        // Update the Candidate document to record the vote
        candidate.votes.push({user: userId})
        candidate.voteCount++;
        await candidate.save();

        // update the user document
        user.isVoted = true
        await user.save();

        return res.status(200).json({ message: 'Vote recorded successfully' });
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/votes',async(req,res)=>{
    const display=await Candidate.find();
    const votelist =await display.map((data)=>{
        return{
            party:data.party,
            count:data.voteCount
        }
    })
    res.status(200).json({votelist})
})


module.exports=router;