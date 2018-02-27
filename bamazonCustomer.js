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
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_DATABASE

conn.connect(function(err){
    if(err) throw err;
    console.log("Connected as ID " + conn.threadId);
    start();
});

function start() {
    conn.query("SELECT * FROM products", function(err,res){
        if(err){
            throw err;
        }
        else{
            inquirer.prompt([
                {
                    name:"productList",
                    type:"rawlist",
                    message:"Which ID of the product would like to buy?",
                    choices:function(){
                        var choicesArray=[];
                        for(var i=0; i < res.length; i++){
                            choicesArray.push(res[i].product_name + " | " + res[i].department_name + " | Price: " + res[i].price + " | Quantity: " + res[i].stock_quantity);
                        }
                        return choicesArray;
                    }
                }

            ]).then(function(answer){
                console.log(answer.productList);
                inquirer.prompt([
                    {
                        name:"quantity",
                        type:"input",
                        message:"How many units of the product would you like to buy?",
                        validate:function(value){
                            if(isNaN(value)=== false){
                                return true;
                            }
                            else{
                                return false;
                            }
                        }   
                    }

                ]).then(function(answer){

                    console.log(answer.quantity);
                });

            });

        }

    });
    conn.end();
};

