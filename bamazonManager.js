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
            conn.query("UPDATE products SET ? WHERE ?",[{stock_quantity:newInv},{item_id:id}], function(err,res){
                if(err) throw err;
                console.log("Item ID " + id + " is now updated." + "The current quantity is now " + newInv);
                manager();
            })
        }
    })
}

function addNewProduct(){
   
    inquirer.prompt([
        {
            name:"item",
            message:"Please enter the name of the product that you would like to add."

        },
        {
            name:"department",
            message:"Please choose the department you would like to add your product to."
        },
        {
            name:"price",
            message:"Please enter the price for this product."
        },
        {
            name:"stock",
            message:"Plese enter a quantity for this item to be entered into current Inventory"
        }
    ]).then(function(answer){

        addProduct(answer.item,answer.department,answer.price,answer.stock)
    });

};

function addProduct(a,b,c,d){
    var item = a.trim();
    var department = b.trim();
    var price = Number(c);
    var stock = parseInt(d);

    var queryString = "INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES (?,?,?,?)"

    conn.query(queryString,[item, department, price, stock], function(err,res){
        if(err) throw err;
        console.log(item + " now has been added to your inventory succesfully!");
        manager();
    })
}

manager();