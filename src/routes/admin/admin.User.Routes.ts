import express from "express";
import { rateLimit } from "express-rate-limit";
import passport from "passport";
import dashboard from "../../controllers/auth/dashboard";
import {
  deleteUser,
  getAllUsers,
  getUser,
  logoutUser,
  RefreshTokenHandler,
} from "../../controllers/index";
import admin from "../../middleware/admin";
import verifyRefreshToken from "../../middleware/verify.refreshToken";

const UserManagementRouterByAdmin = express.Router();

const RateLimiterFunction = (maxRequest: number = 100) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: maxRequest,
    message: "Too many requests. Please try again later",
  });
};

UserManagementRouterByAdmin.get(
  "/dashboard",
  [
    passport.authenticate("jwt-access-admin", { session: false }),
    RateLimiterFunction(),
  ],
  dashboard // admin dashboard
)
  .post(
    "/logout",
    [
      passport.authenticate("jwt-refresh-admin", { session: false }),
      verifyRefreshToken,
    ],
    logoutUser
  ) // logout admin
  .get(
    "/refresh",
    [
      passport.authenticate("jwt-refresh-admin", { session: false }),
      admin,
      RateLimiterFunction(),
      verifyRefreshToken,
    ],
    RefreshTokenHandler
  ) // get new tokens
  .get(
    "/get-all-users",
    [
      passport.authenticate("jwt-refresh-admin", { session: false }),
      admin,
      RateLimiterFunction(),
      verifyRefreshToken,
    ],
    getAllUsers // get all users
  )
  .get(
    "/get-user/:id",
    [
      passport.authenticate("jwt-refresh-admin", { session: false }),
      admin,
      RateLimiterFunction(),
      verifyRefreshToken,
    ],
    getUser
  ) // get single user
  .delete(
    "/delete-user/:id",
    [
      passport.authenticate("jwt-refresh-admin", { session: false }),
      admin,
      RateLimiterFunction(),
      verifyRefreshToken,
    ],
    deleteUser
  ); // delete user

export default UserManagementRouterByAdmin;
