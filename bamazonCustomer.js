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
                " Automotive",
                " Home Sport",
                " Outdoor",
            ]
        })

        .then(function (answer) {
            switch (answer.select) {
                case " Automotive":
                    autoMotive();
                    break;

                case " Home Sport":
                    homeSport();
                    break;

                case " Outdoor":
                    outDoor();
                    break;
            }
        });
}


function autoMotive() {

    connection.query("SELECT product_name, price FROM products WHERE department_name = 'Automotive'", function (err, results) {
        if (err) throw err;

        inquirer

            .prompt([
                {
                    name: "choice",
                    type: "list",
                    message: "Here is some items for you".brightYellow,
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name + " - " + results[i].price + " $".green);
                        }
                        return choiceArray;
                    },

                },
            ])

            .then(function (answer) {
                console.log(answer.choice)
            });
    });
}




