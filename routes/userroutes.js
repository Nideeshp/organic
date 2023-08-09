const express = require("express");
const userRoute = express.Router();
const app = express();
const user = require("../model/user");
const nocache= require('nocache')

module.exports = userRoute;

//REQUIRE ALL CONTROLLERS
const usercontroller = require("../controllers/usercontrollers");
const dashboradcontroller = require("../controllers/dashboardcontroller");
const auth=require('../middlewares/userauth')


const setNoCacheHeader = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
  };



//dashborad view
userRoute.get("/", dashboradcontroller.homeview);
userRoute.get('/home',dashboradcontroller.homeview)


//user register 
userRoute.get("/register",usercontroller.registerView);
userRoute.post('/register',usercontroller.registerUser)

//loginview
userRoute.get("/login",setNoCacheHeader,usercontroller.loginView);
userRoute.post("/login", usercontroller.loginUser);

//otp
userRoute.get('/otp',auth.islogout,usercontroller.otpView)
userRoute.post('/otp',usercontroller.otpUser)

//log out
userRoute.get('/logout',auth.islogout)


//home view
