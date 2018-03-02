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
            choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"],
            message:"Hello, what would you like to do?"
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
//The manager wants to see the current inventory.
function showInventory(){
    conn.query("SELECT * FROM products", function(err,res){
        //CLI tabel will help you to see table more clearly.
        var table = new Table ({
            head: ["item_id","product_name","department_name","price","stock_quantity"]
        });
        console.log("=== HERE IS THE CURRENT INVENTORY ===");

        for(var i = 0; i < res.length; i++){
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
        }
        console.log(table.toString());
        showInventory();
    })
};

function showLowInventory(){

};

function addInventory(){

};

function addNewProduct(){

};

manager();