/**
 * @file app.js
 * @fileoverview - <ul><li>The app.js file in an Express application is responsible for setting up various middlewares, routes, and configurations needed to run the application.</li>
 * <li>It imports necessary modules, initializes passport configuration, manages user sessions, logs HTTP requests, implements security measures, parses JSON and urlencoded bodies,
 * defines routes for authentication and user management, provides a home route, and handles errors.</li><li> The file acts as the central point of control for
 * the Express application and provides a convenient way to manage all the necessary components of the application in one place.</li></ul>
 * @author Faiz Ali Khan
 */

// Importing necessary modules.
import express, { Application, Request, Response, NextFunction } from "express";
import errorHandler from "./middleware/error.Handler";
import AuthRouter from "./routes/auth/auth.Routes";
import cookieParser from "cookie-parser";
import passportConfig from "./config/passport";
import passport from "passport";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import session from "express-session";
import UserManagementRouterByAdmin from "./routes/admin/admin.User.Routes";

// express application
const app: Application = express();

/**
 * @function passportConfig - Initialize the passport configuration
 * @param {Object} passport - the passport object
 */
passportConfig(passport);

/**
 * @function session -  Manage user session
 * @description - It sets up express-session as a middleware in the Express application. The session method creates a new session middleware with the given options.
 * @param {Object} [options] - An options object that is passed to the session middleware.
 * @property {string} secret - A string used to sign the session ID cookie. This is required for the session to work.
 * @property {boolean} resave - Forces the session to be saved back to the session store, even if the session was never modified during the request. Defaults to false.
 * @property {boolean} saveUninitialized - Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified. Defaults to true.
 * @property {Object} cookie - An object that is passed to the cookie-parser middleware.
 * @property {boolean} cookie.secure - If true, the cookie will only be sent over HTTPS. Defaults to false.
 */
app.use(
  session({
    secret: "yoursecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, // for demo purpose only, set to true in a production environment
  })
);

// morgan middleware for logging HTTP requests
app.use(morgan("dev"));

// helmet middleware
app.use(helmet());

// cors middleware
app.use(cors());

/**
 * A middleware for rate limiting the number of requests made to the API.
 *
 * This middleware uses the `express-rate-limit` package to limit the number of requests
 * that a client can make to the API in a defined window of time. This helps to prevent
 * excessive and abusive use of the API resources.
 *
 * @constant {rateLimit} authLimiter
 * @method rateLimit - Create an instance of IP rate-limiting middleware for Express.
 *
 * @param {Object} options - options for the rate limiter.
 * @param {number} options.windowMs - The window of time in milliseconds during which the limit applies.
 * @param {number} options.max - The maximum number of requests allowed during the defined window of time.
 * @param {string} options.message - The error message to return if the limit is exceeded.
 *
 * @returns {function} A middleware function that enforces the rate limit.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP to 100 requests per window (100 req per 15 min)
  message: "Too many requests, please try again later.",
});

// Initialize passport
app.use(passport.initialize());

// cookie parser
app.use(cookieParser());

// express.json middleware for parsing json
app.use(express.json());

// express.urlencoded middleware for parsing urlencoded bodies
app.use(express.urlencoded({ extended: false }));

// Auth Routes
app.use("/auth", authLimiter, AuthRouter);

// Admin
app.use("/admin", authLimiter, UserManagementRouterByAdmin);

// user management route by admin
app.use("/admin", authLimiter, UserManagementRouterByAdmin);

// Home route
app.get("/", authLimiter, (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Welcome to AuthGuard API" });
});

// Error Handler Middleware
app.use(errorHandler);

export default app;
