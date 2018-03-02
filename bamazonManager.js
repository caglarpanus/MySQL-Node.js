require('dotenv').config();

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});    

conn.connect(function(err){
    if(err) throw err;
    console.log("Connected as ID " + conn.threadId);
   
});

var manager = function(){

    inquirer.prompt([
        {
            name:"action",
            type:"list",
            choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]
        }
    ]).then(function(answer){
        switch(answer.action){
            case "View Products for Sale":
            showInventory(function(){
                manager();
            });
            break;

            case "View Low Inventory":
            showLowInventory(function(){
                manager();
            });
            break;

            case "Add to Inventory":
            addInventory();
            break;

            case "Add New Product":
            addNewProduct();
            break;
        }
    });
};

function showInventory(){

};

function showLowInventory(){

};

function addInventory(){

};

function addNewProduct(){

};