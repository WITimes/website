//jshint esversion:8
import express from "express";
//import indexController from "../controllers/indexController";
import homePageController from "../controllers/homePageController";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import auth from "../validation/authValidation";
import passport from "passport";
import initPassportLocal from "../controllers/passportLocalController";
import eventsController from "../controllers/eventsController";
 

// Init all passport
initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/",(req,res)=>{
        res.render("index")
    });
     
    //router.get("/index", indexController.handleindex, loginController.checkLoggedIn);
    router.get("/homepage", loginController.checkLoggedIn, homePageController.handleHelloWorld);
    router.get("/events", loginController.checkLoggedIn, eventsController.handleHelloWorld);
    router.get("/login",loginController.checkLoggedOut, loginController.getPageLogin);
    router.post("/login", passport.authenticate("local", {
        successRedirect: "/homepage",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true

    
    }));
    router.get("/curricular",(req,res)=>{
        res.render("curricular")
    });
    router.get("/uploadnotice",(req,res)=>{
        res.render("uploadnotice")
    });
    router.get("/noticeboard",(req,res)=>{
        res.render("noticeboard")
    });
    
    
    router.get("/commonnotice",(req,res)=>{
        res.render("commonnotice")
    });
    router.get("/display",(req,res)=>{
        res.render("display")
    });
    router.get("/tnpnotice",(req,res)=>{
        res.render("tnpnotice")
    });
    router.get
    router.get("/tnpdisplay",(req,res)=>{
        res.render("tnpdisplay")
    });
    router.get("/nssnotice",(req,res)=>{
        res.render("nssnotice")
    });
    router.get("/nssdisplay",(req,res)=>{
        res.render("nssdisplay")
    });
    router.get("/events",(req,res)=>{
        res.render("events")
    });
    router.get("/ISTEUpload",(req,res)=>{
        res.render("ISTEUpload")
    });
    router.get("/SSDCUpload",(req,res)=>{
        res.render("SSDCUpload")
    });
    router.get("/WITechnotice",(req,res)=>{
        res.render("WITechnotice")
    });
    router.get("/register", registerController.getPageRegister);
    router.post("/register", auth.validateRegister, registerController.createNewUser);
    router.post("/logout", loginController.postLogOut);
    return app.use("/", router);

    
    
};
module.exports = initWebRoutes;
