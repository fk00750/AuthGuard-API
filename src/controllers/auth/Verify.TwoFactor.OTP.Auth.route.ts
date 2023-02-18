import RouteParamsHandler from "../../types/RouteParams.type";
import CustomErrorHandler from "../../utils/CustomError.Handler";
import { verifyOtpAndIssueAccessAndRefreshTokens } from "../../utils/helpers";

/**
 * @async
 * @function VerifyTwoFactorAuthentication_OTP - verify the two-factor authentication code (OTP) submitted by the user during login.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @throws {CustomError} When there is an error in finding the OTP in the database or decoding the access or refresh token
 * @returns {void} - Sends the JSON response to the client containing the access and refresh tokens.
 */

const VerifyTwoFactorAuthentication_OTP: RouteParamsHandler = async (
  req,
  res,
  next
) => {
  try {
    // get otp from req.body
    const { otp } = req.body;

    const { accessToken, refreshToken } =
      await verifyOtpAndIssueAccessAndRefreshTokens(otp);

    res.status(200).json({
      message: "User Login Successfully",
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    next(CustomErrorHandler.serverError(error.message));
  }
};

export default VerifyTwoFactorAuthentication_OTP;
