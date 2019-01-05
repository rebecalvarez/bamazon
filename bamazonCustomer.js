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
 // console.log("connected as id " + connection.threadId);
  queryAllProducts();
  purchase();
  
});

//   item_id 
//   product_name VARCHAR(45) NULL,
//   department_name VARCHAR(45) NULL,
//   price DECIMAL(10,2) NULL,
//   stock_quantity INT NULL,

function queryAllProducts() {
    connection.query("SELECT * FROM products", function(error, response) {
     
        console.log(greenColor("      ==========  WELCOME TO BAMAZON ========== "));
      for(var i = 0; i< response.length; i++){
          console.log(response[i].item_id + " | " + response[i].product_name + " | " + response[i].department_name + " | " + "$ "+ response[i].price + " | " + "In-Stock: " +response[i].stock_quantity)
      }
     
     
    
    });
  }


  
function purchase() {
    // query the database for all items for purchase
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to purchase on
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
            message: "What Product would you like to buy?"
          },
          {
            name: "quantity",
            type: "input",
            message: "How much would you like to buy?"
          }
        ])
        .then(function(answer) {
          // get the information of the chosen item
          var chosenItem;
          var productSalesItem;
          for (var i = 0; i < results.length; i++) {
            if (results[i].product_name === answer.choice) {
              chosenItem = results[i];
              
            }
          }
         
          var inputQuantity = parseInt(answer.quantity);
            var enoughProduct = chosenItem.stock_quantity - inputQuantity;
            
          // determine if there is enough product
          if (enoughProduct >= 0) {
            // there is enough, so update db
            var totalPurchase = chosenItem.price * inputQuantity;
                totalPurchase = totalPurchase.toFixed(2);
                // the sum of all the sales plus the new sale
                productSalesItem = parseInt(chosenItem.product_sales) + parseInt(totalPurchase);
              
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: enoughProduct
                },
                {
                    item_id: chosenItem.item_id
                }
              ],
              function(error) {
                if (error) throw err;
                
                console.log(storeColor("Order placed successfully!"));
                console.log(greenColor('Your Total was : '+ totalPurchase));
                console.log(greenColor("Item Purchased: "+ chosenItem.product_name));
                buyAgain();
              }
            );
// Updating product sales
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    product_sales: productSalesItem
                  },
                  {
                      item_id: chosenItem.item_id
                  }
                ],
                function(error) {
                  if (error) throw err;
                  
                //   console.log(storeColor("Order placed successfully!"));
                //   console.log(greenColor('Your Total was : '+ totalPurchase));
                //   console.log(greenColor("Item Purchased: "+ chosenItem.product_name));
                //   buyAgain();
                }
              );
          }
          else {
            // There is not enough product for purchase, so apologize and start over
            console.log(redColor("There is not enough product for purchase. Try again..."));
           // start();
           purchase();
          }
        });
    });
  }


  function buyAgain() {
        var readyToBuyAgain =[
          {
            type: 'confirm',
            name: 'readyToBuy',
            message: 'Would you like to purchase another product?',
            default: true
          }
      
        ];
        inquirer.prompt(readyToBuyAgain).then(answers => {
          // if the user confirms they want to buy again.
          if (answers.readyToBuy){
            console.log(storeColor("      ===== GREAT! CHECK OUT THESE PRODUCTS! ====="));
            queryAllProducts();
            purchase();
          } 
          else {
            console.log(redColor("Thank you for your purchase. Come back Soon!"));
            return;
          }
        });
      }