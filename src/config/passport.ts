import User from "../models/user.Model";
import fs from "fs";
import path from "path";
import passport, { PassportStatic } from "passport";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { Model, model } from "mongoose";

/**
 * JwtPayload is the interface for JSON Web Token payload
 * @interface
 */
interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

/**
 * IUser is the interface for User model
 * @interface
 */
interface IUser {
  Id?: string;
  username: string;
  email: string;
  password: string;
  role?: string;
}

// access token key
const pathToAccKey: string = path.join(__dirname, "../..", "access_public.pem");
const ACCESS_PUB_KEY: string = fs.readFileSync(pathToAccKey, "utf-8");

// access token key
const RpathToRefKey: string = path.join(
  __dirname,
  "../..",
  "refresh_public.pem"
);
const Refresh_PUB_KEY: string = fs.readFileSync(RpathToRefKey, "utf-8");

/**
 * @function passportStrategy - passportStrategy is a function for registering JWT authentication strategy using passport
 * @param {passport.PassportStatic} passport - The passport module
 * @param {string} usageName - The name to use for the JWT authentication strategy
 * @param {string} PUB_KEY - The public key to use for verifying the JWT token
 */
const passportStrategy = (
  passport: passport.PassportStatic,
  usageName: string,
  PUB_KEY: string
) => {
  /**
   * Register the JWT authentication strategy with the given name
   */
  passport.use(
    usageName,
    new Strategy(
      {
        /**
         * The function to extract the JWT token from the request header
         */
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        /**
         * The secret or public key to use for verifying the JWT token
         */
        secretOrKey: PUB_KEY,
        /**
         * The algorithms to use for verifying the JWT token
         */
        algorithms: ["RS256"],
      },
      /**
       * The callback function for the JWT authentication strategy
       * @callback JwtCallback
       * @param {JwtPayload} jwt_payload - The payload of the JWT token
       * @param {Function} done - The callback function to pass the authenticated user or error
       */
      async (jwt_payload: JwtPayload, done: Function) => {
        /**
         * Find the user with the given id from the JWT payload
         */
        User.findOne(
          { _id: jwt_payload.sub },
          /**
           * The callback function for the findOne method
           * @callback FindOneCallback
           * @param {Error} error - The error if any
           * @param {Model<IUser>} user - The user document found
           */
          (error: Error, user: Model<IUser>) => {
            // the error has occured while finding the user
            if (error) return done(error, false);

            // the user document is found
            if (user) done(null, user);
            else done(null, false); // the user is null
          }
        );
      }
    )
  );
};

/**
 * @function passportConfig - passportConfig is a configuration function for the Passport library.
 * @description - It registers two JWT authentication strategies using the given Passport instance.The two strategies are named "jwt-access" and "jwt-refresh" and use the ACCESS_PUB_KEY and Refresh_PUB_KEY respectively.It also sets up the serialization and deserialization of users.
 * @param {PassportStatic} passport - The Passport library instance.
 */
const passportConfig = (passport: PassportStatic) => {
  /**
   *This block of code tries to register the JWT authentication strategy for access tokens and refresh tokens using the passportStrategy function.
   *It passes the passport instance, the usageName string (either "jwt-access" or "jwt-refresh"), and the corresponding public key (either ACCESS_PUB_KEY or Refresh_PUB_KEY) as arguments to the passportStrategy function.
   *If an error occurs while registering the strategy, it is logged to the console.
   */
  try {
    passportStrategy(passport, "jwt-access", ACCESS_PUB_KEY);
  } catch (error) {
    console.error(error);
  }

  try {
    passportStrategy(passport, "jwt-refresh", Refresh_PUB_KEY);
  } catch (error) {
    console.error(error);
  }

  /**
   * Serialize the user object before storing it in the session.
   * @function
   * @param {User} user - The user object to be serialized.
   * @param {Function} done - The callback function to be called when serialization is completed.
   */
  passport.serializeUser((user, done) => {
    done(null, JSON.stringify(user));
  });

  /**
   * Deserialize the user object from the session.
   * @function
   * @param {unknown} user - The serialized user object.
   * @param {Function} done - The callback function to be called when deserialization is completed.
   */
  passport.deserializeUser((user: unknown, done) => {
    done(null, JSON.parse(user as string));
  });
};

export default passportConfig;
