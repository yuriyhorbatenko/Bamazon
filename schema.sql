DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pirelli All Season Tires", "Automotive", 399.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Enkei 18inch Rims - Metallic", "Automotive", 799.99, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Enkei 19inch Rims - Black", "Automotive", 949.99, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Windshield Sun Cover", "Automotive", 14.99, 0);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iFit Dumbbells", "Home Sport", 289.99, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iFit Flex Bands", "Home Sport", 49.99, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("HyperStrong Extreme Mat", "Home Sport", 84.99, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("MyHome Firepalce", "Outdoor", 119.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Chef BBQ Charcoal Grill", "Outdoor", 199.99, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("MyHome Outdoor Chairs", "Outdoor", 120.49, 4);
