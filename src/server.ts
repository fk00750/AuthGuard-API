/**
 * @file server.js
 * @fileoverview - The server.js file is the main implementation of the server logic for an application. 
 * It sets up the environment variables from the .env file, imports the main application module from ./app, and 
 * the custom error handler from ./utils/CustomError.Handler. 
 * It also connects to the database using the Connect__Database function. 
 * The server listens to the specified port, which is either defined in the environment variables 
 * or set to 5000 as a default. If there is an error starting the server, the custom error handler will catch the exception and log the error message.
 * @author Faiz Ali Khan
 */

import { config } from "dotenv";
config({ path: ".env" });
import app from "./app";
import CustomErrorHandler from "./utils/CustomError.Handler";
import Connect__Database from "./DB/config.Database";

const PORT: any = process.env.PORT || 5000;

/**
 * @async
 * @function startServer - This function starts the server and listens to the specified port and also connects to the database
 * @throws {CustomErrorHandler} If there is an error starting the server.
 */
async function startServer() {
  try {
     // Start the server and connects to server
    app.listen(PORT, async () => {
      await Connect__Database(PORT);
    });
  } catch (error) {
    CustomErrorHandler.serverError(error.message);
  }
}

startServer();
