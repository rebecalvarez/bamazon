var mysql = require("mysql");

var inquirer = require('inquirer');

// package to give game color
var clc = require('cli-color');

var columnify = require('columnify');

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
    console.log(greenColor("      ==========  WELCOME TO BAMAZON SUPERVISOR MENU ========== "));
    var menu =[
      {
        type: 'list',
        name: 'option',
        message: 'Choose your option',
        choices: ['View Product Sales by Department', 'Create New Department','Exit'],
        filter: function (val) {
            return val;
      }
    }
    ];
    inquirer.prompt(menu).then(answer =>{
      if(answer.option === 'View Product Sales by Department'){
         viewSales();
     //   console.log(greenColor('View Product Sales by Department'));
      }else if(answer.option === 'Create New Department'){
        
       newDepartment();
    // console.log(greenColor('Create New Department'));
      }else{
        // if user doesn't want choose again, exit app.
        console.log(greenColor("Good bye! See you soon."));
        return;
      }
    });
  }

  function  viewSales(){
      connection.query(`SELECT department_id AS 'Department ID', department_name AS 'Department Name',  
      over_head_costs AS 'Overhead Costs', b.product_sales AS 'Product Sales', (b.product_sales - over_head_costs) as 'Total Profit'
    
      FROM bamazon.departments a
      LEFT JOIN
          (SELECT DEPARTMENT_NAME as dept_name, SUM(PRODUCT_SALES) AS product_sales
          from bamazon.products
         group by department_name) b
      on a.department_name= b.dept_name`
      
    , function(error,results){
                                   if(error) throw error;
                                console.log(storeColor(`\n=========================================================================================\n`));
                               console.log(greenColor(columnify(results, {columnSplitter: ' | ' }, {columns: ['Department ID','Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit' ]})));
                           //     console.log(greenColor(columnify(results, {columns: [department_id,department_name, over_head_costs, b.product_sales, total_profit ]})));
                                console.log(storeColor(`\n=========================================================================================\n`));
                            
                                start();
                            })

  };



  function  newDepartment(){

    inquirer.prompt([{
        name: "new_dept",
        message: "What is the Name of the new Department?",
        type: "input",
        validate: (value) => {
            if (value.length < 1) {
                return "Please enter a Product";
            } else {
                return true;
            }
        }
    }, {
        name: "new_overhead",
        message: "What is this departments overhead costs",
        type: "input",
        validate: (value) => {
            let valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number'
        }
    }]).then(function(answers) {
        connection.query(`INSERT INTO departments 
    (department_name, over_head_costs) VALUES ("${answers.new_dept}", ${answers.new_overhead})`, function(error, results) {})
   
    console.log(storeColor(`\n- - - - - - - - -\n`));
        console.log(storeColor(`Department Added Successfully!`));
     console.log(storeColor(`\n- - - - - - - - -\n`));
    start();
    } )
      
};




 