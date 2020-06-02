DROP DATABASE IF EXISTS developer_db;

CREATE DATABASE developer_db;


USE developer_db;

CREATE TABLE ucbxUsers (
id INTEGER NOT NULL AUTO_INCREMENT,
first_name VARCHAR (50) NOT NULL,
last_name VARCHAR (50) NOT NULL,
strength VARCHAR (100) NOT NULL,
weakness VARCHAR (100) NOT NULL,
bio VARCHAR (500) NOT NULL,
email VARCHAR (50) NOT NULL,
github VARCHAR (50) NOT NULL,
badge VARCHAR (200),
PRIMARY KEY (id)
);