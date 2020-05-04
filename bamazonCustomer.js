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


function option1() {

    inquirer

        .prompt({
            name: "options",
            type: "list",
            message: "\n  What you would like to do: \n".brightYellow,
            choices: [
                "Buy Item",
                "Go Back",
                "Exit"
            ]
        })

        .then(function (answer) {
            switch (answer.options) {
                case "Buy Item":
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


function option2() {

    inquirer

        .prompt({
            name: "options",
            type: "list",
            message: "\n  What you would like to do: \n".brightYellow,
            choices: [
                "Main Menu",
                "Exit"
            ]
        })

        .then(function (answer) {
            switch (answer.options) {
                case "Main Menu":
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
        option1();
    });
}


function homeSport() {

    connection.query("SELECT item_id, product_name, price FROM products WHERE department_name = 'Home Sport'", function (err, results) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {

            var itemID = results[i].item_id;
            var productName = results[i].product_name;
            var productPrice = results[i].price;

            console.log("  iD# - ".brightCyan + colors.brightRed(itemID) + " - " + colors.brightCyan(productName) + " - " + colors.brightRed(productPrice) + " $".brightCyan)
        }
        option1();
    });
}


function outDoor() {

    connection.query("SELECT item_id, product_name, price FROM products WHERE department_name = 'Outdoor'", function (err, results) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {

            var itemID = results[i].item_id;
            var productName = results[i].product_name;
            var productPrice = results[i].price;

            console.log("  iD# - ".brightCyan + colors.brightRed(itemID) + " - " + colors.brightCyan(productName) + " - " + colors.brightRed(productPrice) + " $".brightCyan)
        }
        option1();
    });
}


function buy() {

    inquirer.prompt([{

        name: "productID",
        type: "input",
        message: "\n  Please enter product iD# for product you want:\n".brightYellow,
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    },

    {
        name: "quantity",
        type: "input",
        message: "\n  How many units do you want?\n".brightYellow,
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false
        }
    }])


        .then(function (answer) {

            var query = "Select stock_quantity, price, product_name, department_name FROM products WHERE ?";

            connection.query(query, { item_id: answer.productID }, function (err, res) {

                if (err) throw err;

                var productName = res[0].product_name;
                var departmentName = res[0].department_name;
                var price = res[0].price;
                var stockQuantity = res[0].stock_quantity;
                var selectedProductID = answer.productID;
                var selectedQuantity = answer.quantity;


                if (stockQuantity === 0) {
                    console.log("  Sorry! \n  This Item: ".brightRed + productName + "\n  Out of Stock!\n".brightRed)
                    option2();
                }

                else if (stockQuantity < selectedQuantity) {
                    console.log("  Sorry! \n  Not Enough: ".brightRed + productName + "\n  Only ".brightRed + stockQuantity + " In Stock!\n".brightRed)
                    option2();
                }

                else if (stockQuantity >= selectedQuantity) {

                    confirm(productName, departmentName, price, stockQuantity, selectedProductID, selectedQuantity);
                }
            });
        });
};


function confirm(productName, departmentName, price, stockQuantity, selectedProductID, selectedQuantity, totalPrice) {

    var totalPrice = price * selectedQuantity;

    inquirer

        .prompt({
            name: "confirm",
            type: "list",
            message: "\n  Are you sure you want to buy: ".brightYellow + colors.brightCyan(productName) + "\n  In Quantity: ".brightYellow + colors.brightCyan(selectedQuantity) + "\n  With Total: ".brightYellow + colors.brightRed(totalPrice) + " $\n".brightCyan,
            choices: [
                "Yes, Continue",
                "No"
            ]
        })

        .then(function (answer) {
            switch (answer.confirm) {
                case "Yes, Continue":
                    keepBuying(productName, departmentName, totalPrice, stockQuantity, selectedProductID, selectedQuantity);
                    break;

                case "No":
                    option2();
                    break;
            }
        });
}


function keepBuying(productName, departmentName, totalPrice, stockQuantity, selectedProductID, selectedQuantity) {

    var updatedStockQuantity = stockQuantity - selectedQuantity;

    var query = "UPDATE products SET ? WHERE ?";

    connection.query(query, [{

        item_id: selectedProductID,
        stock_quantity: updatedStockQuantity,

    },
    {
        item_id: selectedProductID
    }],
        function (err, res) {

            if (err) throw err;

            console.log("\n  --------------------------------------".brightYellow)
            console.log("\n  Congratulations!".brightYellow)
            console.log("\n  Your Item: ".brightYellow + colors.brightCyan(productName))
            console.log("\n  In Quantity: ".brightYellow + colors.brightCyan(selectedQuantity))
            console.log("\n  Have Been Purchased".brightYellow + " for: ".brightYellow + colors.brightRed(totalPrice) + " $".brightCyan)
            console.log("\n  --------------------------------------".brightYellow)

            option2();

        });
};
