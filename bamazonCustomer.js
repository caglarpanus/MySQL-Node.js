require('dotenv').config();

var mysql = require("mysql");
var inquirer = require("inquirer");

var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

conn.connect(function(err){
    if(err) throw err;
    console.log("Connected as ID " + conn.threadId);
    start();
});


