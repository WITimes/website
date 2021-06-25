//jshint esversion:8
require('dotenv').config();
const express = require("express");
//Init app
let app = express();

const path = require('path')
const passportLocalController=require("./controllers/passportLocalController");
var serviceAccount = require('/passport/serviceAccountKey.json');
const multer =require('multer');
const ejs=require('ejs');
var admin = require('firebase-admin');
var blob = require('blob');
var blobStream = require('blob-stream');
const {format} = require('util');
var storage = require('@google-cloud/storage');
 

const configViewEngine = require("./configs/viewEngine");
require('dotenv').config({ path: 'path/to/.env' });
const initWebRoutes = require("./routes/web");
const  bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const connectFlash = require("connect-flash");
const passport =  require("passport");
const { request } = require('express');
const connection = require('./configs/DBConnection');

  
 
 
//use cookie parser
app.use(cookieParser('secret'));
//ejs 
 

//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
    }
}));

// Enable body parser post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Config view engine
configViewEngine(app);

//Enable flash message
app.use(connectFlash());

//Config passport middleware
app.use(passport.initialize());
app.use(passport.session());

// init all web routes
initWebRoutes(app);

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(require('/passport/serviceAccountKey.json'))
   
  });
  var storage = admin.storage();
  var bucket = storage.bucket('gs://witimes-f9925.appspot.com');
  var extension


 
const upload=multer({
storage:multer.memoryStorage(),
    limits:{fileSize:5000000},
    fileFilter:function(req,file,cb){
        checkfiletype(file,cb);
    }
});
//check File type
function checkfiletype(file,cb){
    //Allowed ext
    const filetypes=/jpeg|jpg|png|pdf/;
    //check ext
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mimetype
    const mimetype=filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('Error:Images Only');
    }
}

app.post('/upload',upload.fields([{ name: 'img', maxCount: 1 }]),(req,res)=>{
  // console.log(userItem.enrid);
   extension = path.extname(req.files.img[0].originalname);
   blob = bucket.file('Notices/' + req.body.title + extension);
   blobStream = blob.createWriteStream({
    metadata: {
        contentType: blob.mimetype
    }
    });
    blobStream.on('error', err => {
        console.log(err);
        //next(err);
    });
    blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.id}`
        );
        console.log(publicUrl);
        
    });
    blobStream.end(req.files.img[0].buffer);
    console.log(blob.id);
    connection.query( ' INSERT INTO notice (imgid,title,filetype) values (?,?,?) ',[blob.id,req.body.title,req.body.filetype],function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log(blob.id);
            res.render("commonnotice",{result:blob.id});
            
        }
    } );
     

});
//display pages
app.post("/display",function(req,res){
    connection.query('select imgid from notice where filetype=101',function(err,rows){
        if(err){
            console.log(err);
        }else{
            res.render("display",{rows})
        }
    })
  })
  app.post("/tnpdisplay",function(req,res){
    connection.query('select imgid from notice where filetype=102',function(err,rows){
        if(err){
            console.log(err);
        }else{
            res.render("tnpdisplay",{rows})
        }
    })
  })
  app.post("/nssdisplay",function(req,res){
    connection.query('select imgid from notice where filetype=103',function(err,rows){
        if(err){
            console.log(err);
        }else{
            res.render("nssdisplay",{rows})
        }
    })
  })
  //EVENTS
  app.post("/ISTEdisplay",function(req,res){
    connection.query('select imgid from notice where filetype=104',function(err,rows){
        if(err){
            console.log(err);
        }else{
            res.render("ISTEdisplay",{rows})
        }
    })
  })
  app.post("/SSDCdisplay",function(req,res){
    connection.query('select imgid from notice where filetype=105',function(err,rows){
        if(err){
            console.log(err);
        }else{
            res.render("SSDCdisplay",{rows})
        }
    })
  })
  app.post("/WITechdisplay",function(req,res){
    connection.query('select imgid from notice where filetype=106',function(err,rows){
        if(err){
            console.log(err);
        }else{
            res.render("WITechdisplay",{rows})
        }
    })
  })
//   app.post("/display",function(req,res){
//     connection.query('select imgid from notice where filetype=102',function(err,rows){
//         if(err){
//             console.log(err);
//         }else{
//             res.render("display",{rows})
//         }
//     })
//   })
//   app.post("/display",function(req,res){
//     connection.query('select imgid from notice where filetype=103',function(err,rows){
//         if(err){
//             console.log(err);
//         }else{
//             res.render("display",{rows})
//         }
//     })
//   })


  


let port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Building a login system with NodeJS is running on port ${port}!`));
