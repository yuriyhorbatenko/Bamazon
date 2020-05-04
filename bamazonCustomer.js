var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require("colors");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root1234",
    database: "bamazon"
});


connection.connect(function (err) {
    if (err) throw err;
    hello();
});


function hello() {

    inquirer

        .prompt({
            name: "select",
            type: "list",
            message: "\n  --------Welcome to Bamazon--------\n  ----------------------------------\n  ------Select your Department------\n".brightYellow,
            choices: [
                " *AUTOMOTIVE*",
                " *HOME SPORT*",
                "  *OUTDOOR*"
            ]
        })

        .then(function (answer) {
            switch (answer.select) {
                case " *AUTOMOTIVE*":
                    autoMotive();
                    break;

                case " *HOME SPORT*":
                    homeSport();
                    break;

                case "  *OUTDOOR*":
                    outDoor();
                    break;
            }
        });
}


function options() {

    inquirer

        .prompt({
            name: "options",
            type: "list",
            message: "\n  What you like to do: ".brightYellow,
            choices: [
                "Buy",
                "Go Back",
                "Exit"
            ]
        })

        .then(function (answer) {
            switch (answer.options) {
                case "Buy":
                    buy();
                    break;

                case "Go Back":
                    hello();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

function autoMotive() {

    connection.query("SELECT item_id, product_name, price FROM products WHERE department_name = 'Automotive'", function (err, results) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {

            var itemID = results[i].item_id;
            var productName = results[i].product_name;
            var productPrice = results[i].price;

            console.log("  iD# - ".brightCyan + colors.brightRed(itemID) + " - " + colors.brightCyan(productName) + " - " + colors.brightRed(productPrice) + " $".brightCyan)
        }
        options();
    });
}


var buy = function () {

    inquirer.prompt([{

        name: "productID",
        type: "input",
        message: "Please enter product ID for product you want:".brightYellow,
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    },

    {
        name: "productUnits",
        type: "input",
        message: "How many units do you want?".brightYellow,
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false
        }
    }])

        .then(function (answer) {


        });
};

