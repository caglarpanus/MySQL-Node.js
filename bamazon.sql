drop database if exists bamazon;
create database bamazon;
use bamazon;

create table products(
	item_id int(10) auto_increment not null,
    product_name varchar(30) not null,
    department_name varchar(30) not null,
    price int(10) not null,
    stock_quantity int(10),
    primary key(item_id)
);

select * from products;
insert into products(product_name,department_name,price,stock_quantity)
values("Shirt","Clothing",30,50);

insert into products(product_name,department_name,price,stock_quantity)
values("Jean","Clothing",50,75);

insert into products(product_name,department_name,price,stock_quantity)
values("PC","Electronics",400,30);

insert into products(product_name,department_name,price,stock_quantity)
values("TV","Electronics",250,20);

insert into products(product_name,department_name,price,stock_quantity)
values("MacBook Pro","Electronics",750,45);

insert into products(product_name,department_name,price,stock_quantity)
values("Crime and Punishment","Book",20,100);

insert into products(product_name,department_name,price,stock_quantity)
values("Eloquent JavaScript","Book",25,150);

insert into products(product_name,department_name,price,stock_quantity)
values("Orange","Grocery",3,200);

insert into products(product_name,department_name,price,stock_quantity)
values("Arugula","Grocery",5,120);

insert into products(product_name,department_name,price,stock_quantity)
values("Mushroom","Grocery",4,90);




