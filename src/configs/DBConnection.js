//jshint esversion:8
require('dotenv').config();
const mysql = require("mysql2");

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(function(err) {
    if (err) 
    {throw err;
    }else{
    console.log("Database connected!");
    }
});

module.exports = connection;
