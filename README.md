# AuthGuard Authentication API

<img src="./public/README_img.png">

## 👋 Introduction

My authentication API provides a strong and secure solution to your authentication needs for web applications. The API is designed with Node.js and TypeScript, and utilizes MongoDB with Mongoose as its data storage engine. It provides user registration, login/logout, email verification, password management, two-factor authentication, and admin functions.

> Advanced security measures protect user data with refresh token rotation and peppered password hashing. A simple and scalable authentication API. This API delivers a reliable, scalable solution for web applications.

---

## ✨ Features

- [x] **User Authentication**: Register, login, and logout users securely.
- [x] **Password Management**: Users can update their password and make forgot password requests.
- [x] **Email Verification System**: Users can verify their email addresses to activate their accounts.
- [x] **Two-Factor Authentication**: Secure user accounts with two-factor authentication
- [x] **Peppered Password Hashing**: User passwords are hashed using a pepper to prevent attacks.
- [x] **Refresh Token Rotation**: Access tokens are refreshed periodically to ensure security.
- [x] **Role-Based Authentication**: Implement role-based authentication with user and admin roles.
- [x] **Admin Functions**: Admins can get all users, get single user details, and delete users securely.

---

## 🎮 Technology Used

- [x] **Node.js with Express.js**: Used to build the server-side of the application.
- [x] **Typescript**: Adds type annotations and other features to improve code reliability and maintainability.
- [x] **MongoDB with Mongoose**: NoSQL database used for storing user data.
- [x] **Nodemon**: Monitors for changes in code and automatically restarts the server.
- [x] **Passport.js**: Used for authentication middleware.
- [x] **Jsonwebtoken**: Used to generate and verify JWT tokens for secure user authentication.
- [x] **bcrypt**: Used for password hashing.
- [x] **Joi**: Used for data validation.
- [x] **Nodemailer**: Used for email verification and password reset requests.
- [x] **Google API**: Used to send emails through Gmail for features such as email verification and password reset requests

---

## ⚙️ Getting Started

## Prerequisites

Before you begin, ensure that you have the following installed on your machine:

- Node.js (version 12 or higher)
- MongoDB (version 4.0 or higher)

## Installation and Setup

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

## Usage

- [x] Register a new user by making a POST request to /api/auth/register with a JSON body containing the user's email and password.

- [x] Log in with an existing user by making a POST request to /api/auth/login with a JSON body containing the user's email and password. This will return an access token and a refresh token.

- [x] Use the access token to make authenticated requests to protected endpoints. Include the token in the Authorization header of the request, like this:

```
Authorization: Bearer <access_token>
```

If the token is valid, the request will be allowed to proceed.

- [x] To refresh the access token, make a GET request to /api/auth/token with a JSON body containing the refresh token. This will return a new access token and a new refresh token.

- [x] To log out, make a POST request to /api/auth/logout with the refresh token. This will invalidate both the access and refresh tokens.

- [x] If a user forgets their password, they can make a POST request to /api/auth/forgot-password with their email address. This will send an email with a link to a password reset page.

- [x] The user can then navigate to the password reset page and enter a new password.

- [x] The API also includes endpoints for email verification, two-factor authentication, and administrative functions for managing user accounts.

To see the complete API documentation and test the endpoints, you can use the Swagger UI provided with the project.

You can access the Swagger documentation for this project by clicking on the button below. It will provide you with a detailed overview of the API endpoints and how to use them.

<div style="text-align:center;"><button style="background-color:green;color:white;cursor:pointer;padding:4px 4px 4px 4px">Click Here</button></div>

