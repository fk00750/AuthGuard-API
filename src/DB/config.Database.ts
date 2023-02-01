import { config } from "dotenv";
config({ path: ".env" });
import { connection, connect, set, ConnectOptions } from "mongoose";

const MONGO_URI: any =
  process.env.STAGE === "PROD"
    ? process.env.MONGO_URI
    : "mongodb://localhost:27017";


const DB_NAME =
  process.env.STAGE === "PROD"
    ? "AuthGuard--API--Database"
    : "Authentication__API";



set("strictQuery", true);

const Connect__Database = async (port: number) => {
  try {
    const connectionOptions = {
      dbName: DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions;

    connect(MONGO_URI, connectionOptions);

    connection.on("connected", () => {
      console.log(
        `Server is running on PORT ${port} and connected to database`
      );
    });
    connection.on("error", (error) => {
      throw error;
    });
    connection.on("disconnected", () => {
      console.log("Disconnected from database");
    });
    process.on("SIGINT", async () => {
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.log(error.message);
  }
};

export default Connect__Database;
