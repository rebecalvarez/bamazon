var mysql = require("mysql");

var inquirer = require('inquirer');

// package to give game color
var clc = require('cli-color');

//Pre-defined color for correct guess
var greenColor = clc.green.bold;
//Pre-defined color for correct guess
var redColor = clc.red.bold;
// color for the game text;
var storeColor = clc.yellowBright;
//Pre-defined color for startgamewords
var startStoreMenu = clc.cyanBright;


var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(error) {
  if (error) throw error;
 
  start();
  
});

function start(){
        var menu =[
          {
            type: 'list',
            name: 'option',
            message: 'Choose your option',
            choices: ['Products for Sale', 'Low Inventory', 'Add to Inventory', 'Add New Product',"Exit"],
            filter: function (val) {
                return val;
          }
        }
        ];
        inquirer.prompt(menu).then(answer =>{
          if(answer.option === 'Products for Sale'){
             productsForSale();
         //   console.log(greenColor('Products for Sale'));
          }else if(answer.option === 'Low Inventory'){
            
           lowInventory();
        // console.log(greenColor('Low Inventory'));
          }else if(answer.option === 'Add to Inventory'){
            addInventory();
   //   console.log(greenColor('Add Inventory'));
          }else if(answer.option === 'Add New Product'){
            //console.log(greenColor('Add New Product'));
          addNewProduct();
          }
          else{
            // if user doesn't want to play again, exit game.
            console.log(greenColor("Good bye! Come back soon."));
            return;
          }
        });
      }

      function productsForSale(){
        connection.query("SELECT * FROM products", function(error, response) {
         
            console.log(greenColor("      ==========  PRODUCTS FOR SALE ========== "));
          for(var i = 0; i< response.length; i++){
              console.log(response[i].item_id + " | " + response[i].product_name + " | " + response[i].department_name + " | " + "$ "+ response[i].price + " | " + "In-Stock: " +response[i].stock_quantity)
          }
          console.log(storeColor("      ===== GO BACK TO MENU ====="));
          confirmMenu();
        
        });
       
      }

      function lowInventory(){
        connection.query("SELECT * FROM products", function(error, response) {
         
            console.log(greenColor("      ==========  PRODUCTS WITH LOW INVENTORY  ========== "));
          for(var i = 0; i< response.length; i++){
              if(response[i].stock_quantity <= 5){
              console.log(response[i].item_id + " | " + response[i].product_name + " | " + response[i].department_name + " | " + "$ "+ response[i].price + " | " + "In-Stock: " + response[i].stock_quantity)
            }
          }
          console.log(storeColor("      ===== GO BACK TO MENU ====="));
          confirmMenu();
        
        });
       
      }



      function addInventory() {
        // query the database for all items for purchase
        connection.query("SELECT * FROM products", function(err, results) {
          if (err) throw err;
          // once you have the items, prompt the user for which they'd like to add inventory on
          inquirer
            .prompt([
              {
                name: "choice",
                type: "rawlist",
                choices: function() {
                  var choiceArray = [];
                  for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].product_name);
                  }
                  return choiceArray;
                },
                message: "Which product would you like to add more Inventory to? "
              },
              {
                name: "quantity",
                type: "input",
                message: "How much more would you like to add?"
              }
            ])
            .then(function(answer) {
              // get the information of the chosen item
              var chosenItem;
              for (var i = 0; i < results.length; i++) {
                if (results[i].product_name === answer.choice) {
                  chosenItem = results[i];
                }
              }
                var oldQuantity = chosenItem.stock_quantity
                var newQuantity = oldQuantity + parseInt(answer.quantity);
             
                connection.query(
                  "UPDATE products SET ? WHERE ?",
                  [
                    {
                      stock_quantity: newQuantity
                    },
                    {
                        item_id: chosenItem.item_id
                    }
                  ],
                  function(error) {
                    if (error) throw err;
                    
                    console.log(storeColor("Your inventory was added succesfuly"));
                    console.log(greenColor('The old stock for '+ chosenItem.product_name +" was: " + oldQuantity));
                    console.log(greenColor('The available stock for '+ chosenItem.product_name +" now is: " + newQuantity));
                   
                    confirmMenu();
                  }
                );
             
            });
        });
      }



      function  addNewProduct(){
        // prompt for info about the item being put up for auction
        inquirer
          .prompt([
            {
              name: "productName",
              type: "input",
              message: "What would you like to call your Product"
            },
            {
              name: "departmentName",
              type: "input",
              message: "What department is this item associated with?"
            },
            {
              name: "priceValue",
              type: "input",
              message: "What would be the price?",
              validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
            },
            {
                name: "stockQuantity",
                type: "input",
                message: "What would be the stock Quantity?",
                validate: function(value) {
                  if (isNaN(value) === false) {
                    return true;
                  }
                  return false;
                }
              }
          ])
          .then(function(answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
              "INSERT INTO products SET ?",
              {
                product_name: answer.productName,
                department_name: answer.departmentName,
                price: answer.priceValue,
                stock_quantity: answer.stockQuantity
              },
              function(err) {
                if (err) throw err;
                console.log(greenColor("You added a new Product to the Store"));
                // re-prompt the user for if they want to bid or post
                confirmMenu();
               
              }
            );
          });
      }

//   item_id 
//   product_name VARCHAR(45) NULL,
//   department_name VARCHAR(45) NULL,
//   price DECIMAL(10,2) NULL,
//   stock_quantity INT NULL,

      function confirmMenu(){
        var backToMenu =[
            {
              type: 'confirm',
              name: 'goBack',
              message: 'Would you like go back to main Menu?',
              default: true
            }
        
          ];
          inquirer.prompt(backToMenu).then(answers => {
            // if the user confirms they want to buy again.
            if (answers.goBack){
              console.log(storeColor("      ===== MAIN MENU ====="));
              start();
            } 
            else {
              console.log(greenColor("Good bye!"));
              return;
            }
          });
      }