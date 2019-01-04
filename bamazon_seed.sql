DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

ALTER TABLE products
ADD COLUMN product_sales DECIMAL(10,2) AFTER stock_quantity;

ALTER TABLE products
MODIFY product_sales BIGINT NOT NULL DEFAULT 0;

ALTER TABLE products
MODIFY product_sales  DECIMAL(10,2) NOT NULL;

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("Cable Knit Beanie", "Clothing", 12.99, 20);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("White Shirt", "Clothing", 10.50, 100);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("Floral Ring", "Jewelery", 120, 30);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("Dangle Hook Earrings", "Jewelery", 9.99, 35);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("Flash Storage Memory Stick", "Electronics", 10.99, 75);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("Electric Toothbrush", "Electronics", 119.99, 50);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("Black Jacket", "Clothing", 45.20, 30);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("Pajama Pants", "Clothing", 19.99, 60);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("Gold Necklace", "Jewelery", 36.25, 25);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("Pink Bracelet", "Jewelery", 8.25, 55);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("iPhone X Charger", "Electronics", 10.99, 150);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("SSD Hard Drive", "Electronics", 205.55, 85);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NULL,
  over_head_costs DECIMAL(10,2) NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments  (department_name, over_head_costs)
VALUES ("Electronics", 6500);

INSERT INTO departments  (department_name, over_head_costs)
VALUES ("Jewelery", 5500);

INSERT INTO departments  (department_name, over_head_costs)
VALUES ("Clothing", 5400);


ALTER TABLE departments
ADD COLUMN product_sales DECIMAL(10,2) AFTER over_head_costs;

ALTER TABLE departments
ADD COLUMN total_profit DECIMAL(10,2) AFTER product_sales;
