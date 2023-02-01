import express from "express";
import passport from "passport";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  RefreshTokenHandler,
  registerUser,
  resetPassword,
  updatePassword,
  verifyResetPasswordUrl,
  verifyUserEmail,
} from "../../controllers";
import dashboard from "../../controllers/auth/dashboard";
import rateLimit from "express-rate-limit";

const AuthRouter = express.Router();

const RateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 50, // 50 request in 15 min
  message: "Too many requests. Please try again later",
});

AuthRouter.post("/register", RateLimiter, registerUser)
  .post("/login", loginUser)
  .post(
    "/logout",
    passport.authenticate("jwt-refresh", { session: false }),
    logoutUser
  )
  .get(
    "/refresh",
    [passport.authenticate("jwt-refresh", { session: false }), RateLimiter],
    RefreshTokenHandler
  )
  .get(
    "/dashboard",
    passport.authenticate("jwt-access", { session: false }),
    dashboard
  )
  .get("/verify-email/:id/:token", verifyUserEmail)
  .get("/verify-email-reset-password/:id/:token", verifyResetPasswordUrl)
  .post("/reset-password", RateLimiter, resetPassword)
  .post("/forgot-password", RateLimiter, forgotPassword)
  .patch(
    "/update-password",
    passport.authenticate("jwt-access"),
    [RateLimiter],
    updatePassword
  );

export default AuthRouter;
