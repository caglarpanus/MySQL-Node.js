require('dotenv').config();

var mysql = require("mysql");
var inquirer = require("inquirer");


var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

function validateInput(value){
    var integar=Number.isInteger(parseFloat(value));
    var sing = Math.sign(value);
    if(integar && (sign === 1)){
        return true
    }
    else{
        return "Please enter a numerical value and a non-zero number!"
    }
};
    

conn.connect(function(err){
    if(err) throw err;
    console.log("Connected as ID " + conn.threadId);
    start();
});

function start() {
            
    inquirer.prompt([
        {
            name:"productList",
            type:"rawlist",
            message:"Which ID of the product would like to buy?",
            validate:validateInput(),
            choices:function(){
                var choicesArray=[];
                console.log('Existing Inventory: ');
                for(var i=0; i < res.length; i++){
                    choicesArray.push(res[i].product_name + " | " + res[i].department_name + " | Price: " + res[i].price + " | Quantity: " + res[i].stock_quantity);
                }
                return choicesArray;
            }
        },
        {
            name:"quantity",
                type:"input",
                message:"How many units of the product would you like to buy?",
                validate:validateInput()
        }

        ]).then(function(answer){
            //var qty = answer.quantity;
            console.log(answer.quantity, itemId);
            console.log(price);
            conn.query("UPDATE products SET ? WHERE ?",[{stock_quantity:answer.quantity},{item_id:itemId}], function(err,res){
                //var price = 
                if(err) throw err;
                console.log(res);
            
            });
            
        });
            
};
