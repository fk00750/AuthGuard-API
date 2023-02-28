# AuthGuard Authentication API

<img src="./public/README_img.png">

## 👋 Introduction

AuthGuard authentication API provides a strong and secure solution to your authentication needs for web applications. The API is designed with Node.js and TypeScript, and utilizes MongoDB with Mongoose as its data storage engine. It provides user registration, login/logout, email verification, password management, two-factor authentication, and admin functions.

> Advanced security measures protect user data with refresh token rotation and peppered password hashing. A simple and scalable authentication API. This API delivers a reliable, scalable solution for web applications.

---

## ✨ Features

- **User Authentication**: Register, login, and logout users securely.
- **Password Management**: Users can update their password and make forgot password requests.
- **Email Verification System**: Users can verify their email addresses to activate their accounts.
- **Two-Factor Authentication**: Secure user accounts with two-factor authentication
- **Peppered Password Hashing**: User passwords are hashed using a pepper to prevent attacks.
- **Refresh Token Rotation**: Access tokens are refreshed periodically to ensure security.
- **Role-Based Authentication**: Implement role-based authentication with user and admin roles.
- **Admin Functions**: Admins can get all users, get single user details, and delete users securely.

---

## 🎮 Technology Used

- **Node.js with Express.js**: Used to build the server-side of the application.
- **Typescript**: Adds type annotations and other features to improve code reliability and maintainability.
- **MongoDB with Mongoose**: NoSQL database used for storing user data.
- **Nodemon**: Monitors for changes in code and automatically restarts the server.
- **Passport.js**: Used for authentication middleware.
- **Jsonwebtoken**: Used to generate and verify JWT tokens for secure user authentication.
- **bcrypt**: Used for password hashing.
- **Joi**: Used for data validation.
- **Nodemailer**: Used for email verification and password reset requests.
- **Google API**: Used to send emails through Gmail for features such as email verification and password reset requests

---

## ⚙️ Getting Started

Follow the given instructions for getting started

##  📌 Prerequisites

Before you begin, ensure that you have the following installed on your machine:

- Node.js (version 12 or higher)
- MongoDB (version 4.0 or higher)

## 📌 Installation and Setup

1. Clone the repository to your local machine:

```
git clone https://github.com/fk00750/AuthGuard-API.git
```

2. Navigate to the project directory:

```
cd AuthGuard-API
```

3. Install the project dependencies:

```
npm install
```

4. Set up environment variables:

```
MONGO_URI=<your_mongodb_url>
```

5. Run the project:

```
node server.js
```

This will start the server and the application will be running on http://localhost:3000.

You should now be able to access the application in your web browser and start using the authentication API.

---

## 🎯 Usage

- Register a new user by making a POST request to /api/auth/register with a JSON body containing the user's email and password.

- Log in with an existing user by making a POST request to /api/auth/login with a JSON body containing the user's email and password. This will return an access token and a refresh token.

- Use the access token to make authenticated requests to protected endpoints. Include the token in the Authorization header of the request, like this:

```
Authorization: Bearer <access_token>
```

If the token is valid, the request will be allowed to proceed.

- To refresh the access token, make a GET request to /api/auth/token with a JSON body containing the refresh token. This will return a new access token and a new refresh token.

- To log out, make a POST request to /api/auth/logout with the refresh token. This will invalidate both the access and refresh tokens.

- If a user forgets their password, they can make a POST request to /api/auth/forgot-password with their email address. This will send an email with a link to a password reset page.

- The user can then navigate to the password reset page and enter a new password.

- The API also includes endpoints for email verification, two-factor authentication, and administrative functions for managing user accounts.

To see the complete API documentation and test the endpoints, you can use the Swagger UI provided with the project.

You can access the Swagger documentation for this project by clicking on the link below. It will provide you with a detailed overview of the API endpoints and how to use them.

> [Click Here for Documentation](https://authguard-api.onrender.com/api-docs)

---

##  📋 JSDoc Reference

For detailed information about the functions, methods and parameters, please refer to the following link.

> [JSDoc Reference](https://ubiquitous-travesseiro-50149d.netlify.app/)

---

## 📬 Have a question? Want to Chat? Ran into a problem?

Please feel free to contact me via my email address ( fk7384329@gmail.com ) or you can also message me directly on [Twitter](https://twitter.com/Fk00750)

---

## 🏷 License
>You can check out the full license [here](https://github.com/fk00750/Fruit-Shop-API/blob/master/LICENSE)

This project is licensed under the terms of the **MIT** license.