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
            showInventory();
            break;

            case "View Low Inventory":
            showLowInventory();
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
        
    })
};

function showLowInventory(){
    conn.query("SELECT * FROM products WHERE stock_quantity < 10", function(err,res){
        if(err) throw err;
        if(res.length === 0){
            console.log("There is no item with low inventory!");
            
        }
        else{
            var table = new Table ({
                head: ["item_id","product_name","department_name","price","stock_quantity"]
            });
            console.log("=== HERE IS THE CURRENT INVENTORY ===");
    
            for(var i = 0; i < res.length; i++){
                table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
            }
            console.log(table.toString());
            console.log("These are all the items that are low on inventory.");
            showLowInventory();
        }
    })
};

function addInventory(){
   
    inquirer.prompt([
        {
            name:"choice",
            message:"Which product would you like to add more of that are currently in your inventory?",
                validate: function(value){
                    if(isNaN(value) === false && parseInt(value) > 0){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
        },

        {
            name:"quantity",
            message:"How many units would you like to add?",
            validate:function(value){
                if(isNaN(value) === false && parseInt(value) > 0){
                    return  true;
                }
                else{
                    return false;
                }
            }
        }
    
        ]).then(function(answer){
        
        updateInventory(answer.choice, answer.quantity);
        });
};

function updateInventory(id,amount){
    var num = parseInt(amount);
    conn.query("SELECT stock_quantity FROM products WHERE ?", {item_id:id}, function(err,res){
        if(err) throw err;
        if(res && res.length){
            var newInv = parseInt(res[0].stock_quantity) + num;
        }
    })
}

function addNewProduct(){
    var departments= [];
    conn.query('SELECT department_name FROM Departments', function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            departments.push(res[i].department_name);
        }
    });

    inquirer.prompt([
        {
            name:"item",
            type:"input",
            message:"Please enter the name of the product that you would like to add."

        },
        {
            name:"department",
            type:"list",
            message:"Please choose the department you would like to add your product to."
        },
        {
            name:"price",
            type:"input",
            message:"Please enter the price for this product."
        },
        {
            name:"stock",
            type:"input",
            message:"Plese enter a quantity for this item to be entered into current Inventory"
        }
    ]).then(function(answer){

        var item = {
            product_name:answer.item,
            department_name:answer.department,
            price:answer.price,
            stock_quantity:answer.stock
        }
        conn.query("INSTER INTO products SET ?", item, function(err,res){
            if(err) throw err;
            console.log(item.product_name + " has been added to your inventory succesfully!");
            manager();
        })
    });

};

manager();