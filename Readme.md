User Authentication:

/api/auth/register (POST): Register a new user account.
/api/auth/login (POST): Authenticate and log in a user.
/api/auth/logout (POST): Log out the current user.
/api/auth/user (GET): Get information about the currently authenticated user.
Product Management:

/api/products (GET): Get a list of all available products.
/api/products/:productID (GET): Get details of a specific product.
/api/products (POST): Add a new product to the inventory (admin).
/api/products/:productID (PUT): Update product details (admin).
/api/products/:productID (DELETE): Delete a product from the inventory (admin).
Product Reviews and Ratings:

/api/products/:productID/reviews (GET): Get all reviews for a specific product.
/api/products/:productID/reviews (POST): Add a review for a product (authenticated user).
/api/products/:productID/ratings (GET): Get the average rating for a product.
Categories:

/api/categories (GET): Get a list of all product categories.
/api/categories/:categoryID (GET): Get products within a specific category.
Orders:

/api/orders (GET): Get a list of all orders placed by the current user.
/api/orders (POST): Place a new order for selected products (authenticated user).
/api/orders/:orderID (GET): Get details of a specific order.
/api/orders/:orderID (PUT): Update the status of an order (admin).
/api/orders/:orderID (DELETE): Cancel an order (authenticated user).
Payments:

/api/orders/:orderID/payment (POST): Make a payment for an order (authenticated user).
/api/orders/:orderID/payment (GET): Get payment details for an order.
Admin Dashboard:

/api/admin/users (GET): Get a list of all users (admin).
/api/admin/users/:userID (GET): Get details of a specific user (admin).
/api/admin/products (GET): Get a list of all products (admin).
/api/admin/orders (GET): Get a list of all orders (admin).



