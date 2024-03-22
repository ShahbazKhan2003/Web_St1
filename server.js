const express = require("express")
const mongoose = require("mongoose")
const User = require("./model/User")
const nodemailer = require("nodemailer");

//import .env package, config means in search in root directory
require('dotenv').config();                   

// to send email using nodeMailer , create is used how it will connect to mail
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"shahbazkhan25022003@gmail.com",
        pass:process.env.PASS,
    }
})


mongoose.connect("mongodb://localhost:27017/RegisterOtp").then(()=>{
    console.log("Connection to db succesfull");
}).catch(err=>{
    console.log(err);
})


const app = express();

app.set('view engine','hbs');  //use handlebar for rendering html
app.set('views','views')      // looks in view folder

app.use(express.urlencoded());     // incoming form data submitted through the post method 

app.listen(3000,()=>{
    console.log("http://localhost:3000");       // start the application
})


app.get('/',(req,res)=>{
    res.send("Welcome to my Website :)");   // show this msg when u render root path
})
 
app.get('/register',(req,res)=>{               // 7766renders a view/template named 'register' using the Handlebars view engine.
    res.render("register");                       // hsb k ander jo action mei likha hai usse render krne k liye
})                      

let email;
let Otp;
app.post('/register',async (req,res)=>{
    const data = req.body;
    const newUser = new User(data);
    
    try{
        await newUser.save();
        email=newUser.email
        Otp=random();
        mail1()
        res.render("otp");
    }catch{
        res.send("Error");
    }
})

//Verification k liye

app.post('/verify',async (req,res)=>{
    const otp = req.body;
    const user = await User.findOne().where('email').equals(email);
    if(otp.otp==Otp)
    {

        user.verified=true;
        await user.save();
        res.send("Success");
    }
    else   
        res.send("Failed");
})



function random() {
    var randomNumber = Math.floor(Math.random() * 9000) + 1000;
    console.log(randomNumber);
    return randomNumber;
}



function mail1(){
    const mail = {
        from:"shahbazkhan25022003@gmail.com",
        to:email,
        subject:'OTP Verification',
        text:`Your Otp is ${Otp}`,
    }
    transporter.sendMail(mail);
}
