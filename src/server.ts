/**
 * @file server.js
 * Contains the implementation of the server logic
 * It sets up the various middlewares, routes and configurations needed for the server.
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
