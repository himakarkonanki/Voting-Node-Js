const express=require('express');
const mongoose=require('mongoose');
const userRoutes=require('./routes/userRoutes');
const router = require('./routes/candidateRoutes');


const app=express();
app.use(express.json());

mongoose.connect('mongodb+srv://himakar:12345@cluster0.cq6uq.mongodb.net/VotingApp?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>console.log('mongoose connected'))
.catch(()=>console.log("connection failed"));

app.use('/', userRoutes.signup);
app.use('/', userRoutes.login);
app.use('/', userRoutes.profiles);
app.use('/candidate',router)

const PORT=3000;

app.listen(PORT,()=>{
    console.log('server started on port 3000')
});