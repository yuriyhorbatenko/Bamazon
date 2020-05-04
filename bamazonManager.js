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
            message: "\n  --------Bamazon Manager--------\n  -------------------------------\n  ------Select your Option-------\n".brightYellow,
            choices: [
                "  * VIEW PRODUCTS FOR SALE *",
                "  * VIEW LOW INVENTORY *",
                "  * ADD TO INVENTORY *",
                "  * ADD NEW PRODUCT *"
            ]
        })

        .then(function (answer) {
            switch (answer.select) {
                case "  * VIEW PRODUCTS FOR SALE *":
                    viewProducts();
                    break;

                case "  * VIEW LOW INVENTORY *":
                    viewInventory();
                    break;

                case "  * ADD TO INVENTORY *":
                    listing();
                    break;

                case "  * ADD NEW PRODUCT *":
                    addProduct();
                    break;
            }
        });
}


function option1() {

    inquirer

        .prompt({
            name: "options",
            type: "list",
            message: "\n  What You Would Like To Do ? \n".brightYellow,
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


function viewProducts() {

    var query = "Select * FROM products";

    connection.query(query, function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {

            var itemID = res[i].item_id;
            var productName = res[i].product_name;
            var departmentName = res[i].department_name;
            var productPrice = res[i].price;
            var stockQuantity = res[i].stock_quantity;

            console.log(
                "\n  iD# ".brightYellow + colors.brightRed(itemID) +
                " Product: ".brightGreen + colors.brightCyan(productName) +
                " Department: ".brightGreen + colors.brightCyan(departmentName) +
                " Price: ".brightGreen + colors.brightRed(productPrice) + " $".brightCyan +
                " Quantity: ".brightGreen + colors.brightRed(stockQuantity)
            )
        }

        option1();
    });
};


function viewInventory() {

    var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5";

    connection.query(query, function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {

            var itemID = res[i].item_id;
            var productName = res[i].product_name;
            var departmentName = res[i].department_name;
            var productPrice = res[i].price;
            var stockQuantity = res[i].stock_quantity;

            console.log(
                "\n  iD# ".brightYellow + colors.brightRed(itemID) +
                " Product: ".brightGreen + colors.brightCyan(productName) +
                " Department: ".brightGreen + colors.brightCyan(departmentName) +
                " Price: ".brightGreen + colors.brightRed(productPrice) + " $".brightCyan +
                " Quantity: ".brightGreen + colors.brightRed(stockQuantity)
            )
        }

        option1();
    });
};


function listing() {

    var query = "Select * FROM products";

    connection.query(query, function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {

            var itemID = res[i].item_id;
            var productName = res[i].product_name;
            var departmentName = res[i].department_name;
            var productPrice = res[i].price;
            var stockQuantity = res[i].stock_quantity;

            console.log(
                "\n  iD# ".brightYellow + colors.brightRed(itemID) +
                " Product: ".brightGreen + colors.brightCyan(productName) +
                " Department: ".brightGreen + colors.brightCyan(departmentName) +
                " Price: ".brightGreen + colors.brightRed(productPrice) + " $".brightCyan +
                " Quantity: ".brightGreen + colors.brightRed(stockQuantity)
            )
        }
        addInventory();
    });
}

function addInventory() {

    inquirer.prompt([

        {
            name: "productID",
            type: "input",
            message: "\n  Enter Product iD# That You Would Like to Add Quantity:".brightYellow
        },

        {
            name: "stock",
            type: "input",
            message: "\n  How Much Quantity You Would Like to Add ?".brightYellow
        }

    ])

        .then(function (answer) {

            connection.query("SELECT * FROM products", function (err, results) {


                for (var i = 0; i < results.length; i++) {

                    if (results[i].item_id === parseInt(answer.productID)) {

                        var chosenItem = results[i];
                        var itemID = results[i].item_id;
                        var productName = results[i].product_name;
                        var departmentName = results[i].department_name;
                        var productPrice = results[i].price;
                    }
                }

                var updatedStock = parseInt(chosenItem.stock_quantity) + parseInt(answer.stock);

                console.log("\n  Updated to: ".brightYellow + colors.brightRed(updatedStock));
                console.log("\n  New Value is: ".brightYellow);
                console.log(
                    "\n  iD# ".brightYellow + colors.brightRed(itemID) +
                    " Product: ".brightGreen + colors.brightCyan(productName) +
                    " Department: ".brightGreen + colors.brightCyan(departmentName) +
                    " Price: ".brightGreen + colors.brightRed(productPrice) + " $".brightCyan +
                    " Quantity: ".brightGreen + colors.brightRed(updatedStock)
                )

                connection.query("UPDATE products SET ? WHERE ?", [

                    {
                        stock_quantity: updatedStock
                    },

                    {
                        item_id: answer.productID
                    }

                ], function (err, res) {
                    if (err) {
                        throw err;
                    }

                    else {
                        option1();
                    }
                });
            });
        });
};


function addProduct() {

    inquirer.prompt([

        {
            name: "product_name",
            type: "input",
            message: "\n  Enter Product Name You Would Like to Add:".brightYellow,
        },

        {
            name: "department_name",
            type: "input",
            message: "\n  Enter Department Name You Would Like to Add:".brightYellow,
        },

        {
            name: "price",
            type: "input",
            message: "\n  Enter Price for This Product:".brightYellow,
        },

        {
            name: "stock_quantity",
            type: "input",
            message: "\n  Enter Quantity for This Product:".brightYellow,
        }
    ])

        .then(function (answer) {

            connection.query("INSERT INTO products SET ?",

                {
                    product_name: answer.product_name,
                    department_name: answer.department_name,
                    price: answer.price,
                    stock_quantity: answer.stock_quantity

                }, function (err, res) {
                    if (err) {
                        throw err;
                    }

                    else {

                        console.log(
                            "\n  Your".brightYellow + " Product: ".brightGreen + colors.brightCyan(answer.product_name) +
                            " Department: ".brightGreen + colors.brightCyan(answer.department_name) +
                            " Price: ".brightGreen + colors.brightRed(answer.price) + " $".brightCyan +
                            " Quantity: ".brightGreen + colors.brightRed(answer.stock_quantity) +
                            "\n  Successfully Added !".brightYellow
                        );
                        option1();
                    }
                });
        });
};