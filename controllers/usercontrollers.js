const User = require('../model/user')
const bcrypt= require('bcryptjs')
const nodemailer = require('nodemailer')

const registerView=async(req,res,next)=>{
    try {
        res.render('user/register')
    } catch (error) {
        next(error)
    }
}

const loginView=async(req,res,next)=>{
    try {
        if(req.session.loggedIn){
            res.redirect('/home')
        }else{
            res.render('user/login')
        }
    } catch (error) {
        next(error)
    }
}

const otpView= async(req,res,next)=>{
    res.render('user/otp')
}

const otpUser=async(req,res,next)=>{
    const {otp1,otp2,otp3,otp4}=req.body
    const enteredOTP= ""+ otp1+otp2+otp3+otp4;
    const generetedOTP= req.session.OTP
    if(enteredOTP===generetedOTP){
        res.redirect('/login')
    }else{
        res.render('user/otp')
    }
}

const registerUser= async(req,res,next)=>{
    const {name, email, password,confirm}= req.body

    //check fields are empty
    if(!name || !email ||!password||!confirm){
        return res.render("user/register",{
            name,email,password,confirm,errorMessage:"Fill empty fields",
        })
    }

    //confirm password
    if(password!=confirm){
        return res.render('user/register',{
            name,email,password,confirm,errorMessage:"Password must match"
        })
    }

    try {
        //check if the email already exists
        const user = await User.findOne({email:email});
        if(user){
            return res.render("user/register",{
                name,email,password,confirm,errorMessage:"Email alreadt exists"
            })
        }

        //Genereted and send otp
        function genereteOTP(){
            const min=1000
            const max = 9999
            return Math.floor(Math.random()*(max-min+1)+min).toString()
        }

        const OTP= genereteOTP()
            req.session.OTP= OTP

            //otp verification
            const transporter= nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:process.env.EMAIL,
                    pass:process.env.PASSWORD,
                }
            })

            const mailOptions={
                from:"nideeshnd313@gmail.com",
                to:email,
                subject:"Organic give a otp",
                text:`This is your one-time password please don't share ${OTP}`,   
            }

            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error);
                }else{
                    console.log("Email sent"+ info.response);
                }
            })
            console.log('email send');

            const newUser= new User({
                name,email,password,
            })

            const salt = await bcrypt.genSalt(10);
            newUser.password= await bcrypt.hash(newUser.password,salt);

            await newUser.save()
            res.redirect('/otp')
    } catch (error) {
        res.status(500).send('Error during registration')
        
    }
}


const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.redirect('/login');
    }
  
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.redirect('/login');
      }
  
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          req.session.user = user; 
          return res.redirect('/home');
        } else {
          return res.redirect('/login');
        }
      });
    } catch (error) {
      next(error);
    }
  };
  

module.exports={
    registerView,
    loginView,
    registerUser,
    otpView,
    loginUser,
    otpUser
}