import express from "express";
import passport from "passport";
import {
  EnableTwoFactorAuthentication,
  forgotPassword,
  loginUser,
  logoutUser,
  RefreshTokenHandler,
  registerUser,
  resetPassword,
  updatePassword,
  verifyResetPasswordUrl,
  VerifyTwoFactorAuthentication_OTP,
  verifyUserEmail,
} from "../../controllers";
import dashboard from "../../controllers/auth/dashboard";
import rateLimit from "express-rate-limit";
import CheckTwoFactorAuth from "../../middleware/check.two.factor.enabled";
import verifyRefreshToken from "../../middleware/verify.refreshToken";

const AuthRouter = express.Router();

const RateLimiterFunction = (maxRequest: number = 50) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: maxRequest,
    message: "Too many requests. Please try again later",
  });
};

AuthRouter.post("/register", registerUser)
  .post("/login", CheckTwoFactorAuth, loginUser)
  .post(
    "/logout",
    [
      passport.authenticate("jwt-refresh", { session: false }),
      verifyRefreshToken,
    ],
    logoutUser
  )
  .get(
    "/refresh",
    [
      passport.authenticate("jwt-refresh", { session: false }),
      RateLimiterFunction(),
      verifyRefreshToken,
    ],
    RefreshTokenHandler
  )
  .get(
    "/dashboard",
    passport.authenticate("jwt-access", { session: false }),
    dashboard
  )
  .get("/verify-email/:id/:token", verifyUserEmail)
  .get("/verify-email-reset-password/:id/:token", verifyResetPasswordUrl)
  .post("/reset-password", RateLimiterFunction(), resetPassword)
  .post("/forgot-password", RateLimiterFunction(), forgotPassword)
  .patch(
    "/update-password",
    passport.authenticate("jwt-access"),
    RateLimiterFunction(),
    updatePassword
  )
  .get(
    "/enable-two-factor-authentication",
    [
      passport.authenticate("jwt-refresh"),
      RateLimiterFunction(100),
      verifyRefreshToken,
    ],
    EnableTwoFactorAuthentication
  )
  .post(
    "/verify-two-factor-authentication-OTP",
    RateLimiterFunction(100),
    VerifyTwoFactorAuthentication_OTP
  );

export default AuthRouter;
