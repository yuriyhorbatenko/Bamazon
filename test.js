var mysql = require("mysql");
var inquirer = require("inquirer");
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


function autoMotive() {

    connection.query("SELECT product_name, price FROM products WHERE department_name = 'Automotive'", function (err, results) {
        if (err) throw err;

        var choiceArray = [];
        var priceArray = [];
        var listArray = [];


        for (var i = 0; i < results.length; i++) {
            listArray.push(results[i].product_name + results[i].price)
            choiceArray.push(results[i].product_name)
            priceArray.push(results[i].price)
        }


        console.log(priceArray)
        console.log(choiceArray)
        console.log(listArray)

        inquirer

            .prompt([

                {
                    name: "choice",
                    type: "list",
                    message: "Here is some items for you:".brightYellow,
                    choices: listArray

                },

            ])

            .then(function (answer) {

                var item = answer.choice
                console.log(item)
                console.log(listArray)


                inquirer

                    .prompt([

                        {
                            name: "quantity",
                            type: "input",
                            message: "\n  Please select quantity for: ".brightYellow + item,
                            validate: function (value) {
                                if (isNaN(value) === false) {
                                    return true;
                                }
                                return false;
                            }
                        },
                        {
                            name: "purchase",
                            type: "list",
                            message: "\n  Would you like to buy: ".brightYellow + item + " ?".brightYellow,
                            choices: [
                                "Yes",
                                "No, Go Back",
                                "Main Menu"
                            ]
                        },
                    ])

                    .then(function (answer) {

                        if (answer.purchase === "Yes") {


                            var query = "SELECT stock_quantity FROM products WHERE ?";

                            connection.query(query, { product_name: item }, function (err, res) {

                                var itemQuantity = res[0].stock_quantity;

                                if (itemQuantity === 0) {
                                    console.log("  Sorry! \n  This Item: ".brightRed + item + "\n  Out of Stock!".brightRed)
                                    //autoMotive();
                                }

                                else if (itemQuantity < answer.quantity) {
                                    console.log("  Sorry! \n  Not Enough: ".brightRed + item + "\n  Only ".brightRed + itemQuantity + " In Stock!".brightRed)
                                    //autoMotive();
                                }

                                else if (itemQuantity >= answer.quantity) {
                                    console.log("  Congratulations! \n  Your Item: ".brightCyan + item + "\n  Have Been Purchased!".brightCyan)
                                    //autoMotive();
                                }

                            });

                        }

                        else if (answer.purchase === "No, Go Back") {
                            autoMotive();
                        }

                        else {
                            hello();
                        }
                    });
            });
    });
}



