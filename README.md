# Serverless Backend for Products and Orders

## Running this Project Locally

To run the development server, run this command

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser

<hr>

## Access the Application in Production

<hr>

 ## Choice of frameworks and libraries

- I understand that Reebelo uses React/ Nextjs with typescript as a frontend library, so I went ahead and built the application with Nextjs with typescript

- Formik and zod have been used for form management and validation

- Styled components have been used for styling the application

<hr>

## Functionality

- The landing page of the application will present all the current products as a list of cards, with a CTA to add a new product

- When one of the card is clicked, a user can edit the product name/ quanitity/ price, delete the product or return to the previous page

- A user can view existing orders by clicking on the "Orders" from the side nav

- On the Orders page, a user can either add a new order or click into one of the existing products

- Upon clicking on "Place a new order", a drop down with existing products are presented to the user, along with a choice of required quantity and shipping address.

- An assumption has been made that Quantity, Product and Shipping address can't be updated, but Order status and shipping status can.

- Upon submission there is a validation layer to verify that the quantity of ordered products are less than or equal the available quantity.

## Limitations

- The application is not currently fully mobile responsive. There are some basic responsiveness when it comes to the product cards grid, other elements in the app are not

- The backend allows for multiple products for a single order, but the frontend doesn't at this point

- There is no authentication layer for this application. Currently the same user can place an order, add a product, update an order, update a product.. etc. There is no layer of user permission implemented in the app

