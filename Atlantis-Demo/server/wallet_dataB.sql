CREATE DATABASE Wallet_DB

CREATE SCHEMA wallet
;

CREATE TABLE "wallet"."User"
(
    user_id serial PRIMARY KEY,
    name VARCHAR ( 50 ) NOT NULL,
    username VARCHAR ( 50 ) UNIQUE NOT NULL,
    password VARCHAR ( 50 ) NOT NULL,
    email VARCHAR ( 255 ) UNIQUE NOT NULL,
    budget NUMERIC ( 255 ) ,
    created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP
);

--already corrected and updated
CREATE TABLE "Category"
(
    category_id serial PRIMARY KEY,
    cat_name VARCHAR ( 50 ) UNIQUE NOT NULL,
    target_budget numeric ( 50 ) NOT NULL,
    current_bal numeric ( 50 ),
    cat_type VARCHAR ( 50 ) NOT NULL,

)


--already corrected and updated
CREATE TABLE "wallet"."User_Category"
(
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    created_on TIMESTAMP,
    PRIMARY KEY (user_id, category_id),
    FOREIGN KEY (category_id) REFERENCES "wallet"."Category" (category_id),
    FOREIGN KEY (user_id) REFERENCES "wallet"."User" (user_id)
)


--already corrected and updated
CREATE TABLE "wallet"."Expense"
(
    expense_id serial PRIMARY KEY,
    FOREIGN KEY (category_id)
      REFERENCES "wallet"."Category" (category_id),
    expense_name VARCHAR ( 50 ) NOT NULL,
    category_id INT NOT NULL,
    created_on TIMESTAMP

)