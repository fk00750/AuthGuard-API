// Authentication routes

export { default as registerUser } from "./auth/register.Auth.route";
export { default as loginUser } from "./auth/login.Auth.route";
export { default as logoutUser } from "./auth/logout.Auth.route";
export { default as RefreshTokenHandler } from "./auth/refresh.Auth.route";
export { default as verifyUserEmail } from "./auth/verify.User.Auth.route";
export { default as verifyResetPasswordUrl } from "./auth/verify.Reset.Password.Url.Auth";
export { default as forgotPassword } from "./auth/forgot.Password.Auth.route";
export { default as updatePassword } from "./auth/update.Password.Auth.route";
export { default as resetPassword } from "./auth/reset.Password.Auth.route";
export { default as EnableTwoFactorAuthentication } from "./auth/enable.TwoFactor.Auth.route";
export { default as VerifyTwoFactorAuthentication_OTP } from "./auth/Verify.TwoFactor.OTP.Auth.route";

// Admin routes

export { getAllUsers, deleteUser, getUser } from "./admin/admin.Role";
