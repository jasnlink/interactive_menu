# Interactive menu with QR code order summary

## Purpose
This app lets customers browse through the restaurant's menu and see what they have. When customers place an order, a QR code is generated on their phone screen. They can then show the code to the cashier to let them know what they ordered. This works well when the customer wants to start an order but the cashier is busy while also not letting the customer directly place an order either.

## Challenges faced
I needed to host the frontend and the backend on the same VPS.

I served the frontend on an NGINX web server with built static React files. The backend is a nodeJS server with Express middleware listening on a different port. The problem is that NGINX would interfere with API requests made to this port. I resolved this by setting up a proxy pass for API requests in the NGINX settings.

I needed way to let users manage their menu via an easy to use interface.

I created a CRUD interface to interact with the MySQL database. It also needed to be secured with a login authentication.

![orderflow](https://msmtech.ca/wp-content/uploads/2022/04/5.jpg)
![orderflow](https://msmtech.ca/wp-content/uploads/2022/04/6-1.jpg)

Customers get an order summary and a QR code that they present to the cashier.



![admin](https://msmtech.ca/wp-content/uploads/2022/04/11.jpg)

Management backend to allow the staff to make changes to the menu.

## Technologies used:
- react.js
- node.js
- Material UI
- HTML
- CSS
- PHP
- MySQL
- LEMP stack setup on Linode

## Main features
- Easy to navigate interactive menu, select and zoom to get more information on each product.
- Cart system with order summary to easily summarize what we want to order.
- Easily generate a QR code with order information to let staff know what you ordered.
- Create, edit, reorder and remove items with the secured management backend.

## Admin features
- Login screen before accessing
- Enable or Disable cart system
- Full category, subcategory and food menu customization system
- Customization system includes create, edit, reorder and remove items

## Demo
- https://mitsuki.qbmenu.ca
- https://mitsuki.qbmenu.ca/admin
