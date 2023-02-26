import Joi from "joi";
import OTP from "../models/OTP.model";
import User from "../models/user.Model";
import RouteParamsHandler from "../types/RouteParams.type";
import CheckPasswordValidity from "../utils/check.Password.validity";
import CustomErrorHandler from "../utils/CustomError.Handler";
import { sendVerificationMail } from "../utils/email.Helper";
import moment from "moment";

/**
 * CheckTwoFactorAuth Middleware
 * @async
 * @function CheckTwoFactorAuth - This middleware is used to verify the user's two-factor authentication status.
 *
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {NextFunction} next - Express next middleware function
 *
 * @throws Will throw an error if any of the following occurs:
 * - Login credentials (email and password) validation fails
 * - User with the provided email is not found in the database
 * - User's account is not verified
 * - OTP is already available for the user
 * - An error occurs while generating or sending OTP
 *
 * @returns {void} Sends a JSON response indicating the two-factor authentication status and OTP
 *
 * Steps
 * @step1 Validate the login credentials (email and password) using the Joi library
 * @step2 Find the user in the database and check if the user exists
 * @step3 If the user exists, check if the user's account is verified
 * @step4 If there is already an OTP available, return an error message indicating that an OTP already exists
 */

const CheckTwoFactorAuth: RouteParamsHandler = async (req, res, next) => {
  try {
    // Validate login credentials Joi
    const loginValidateSchema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string(),
    });

    const { error } = loginValidateSchema.validate(req.body);

    if (error) return next(CustomErrorHandler.serverError(error.message));

    // find user
    const user = await User.findOne({ email: req.body.email });

    // check if user exist in database
    if (!user) return next(CustomErrorHandler.notFound("User not found"));

    // Is user verified
    if (!user.verified)
      return next(CustomErrorHandler.nonVerified("Please verify user email to login"));

    const IsPasswordValid = await CheckPasswordValidity(
      user.id,
      req.body.password,
      user.password
    );

    if (!IsPasswordValid)
      return next(CustomErrorHandler.wrongCredentials("Password is wrong"));

    if (!user.twoFactorEnabled) {
      req.user = user;
      next();
    } else {
      // generate one time password
      const OTPvalue = Math.floor(100000 + Math.random() * 900000).toString();

      // store one time password
      const newOTP = new OTP({
        userId: user._id,
        OTP: OTPvalue,
        expiresIn: moment().add(15, "minutes").format("YYYY-MM-DD HH:mm:ss"),
      });

      // get user id and email
      const userId = user.id;
      const email = user.email;

      // send otp on user email address
      if (userId && email) {
        await sendVerificationMail(
          email,
          OTPvalue,
          "Verify OTP",
          "Verify your OTP",
          "Below is your one time password"
        );
      }

      // save one time password
      await newOTP.save();

      // send response to client
      res.status(200).json({
        message:
          "Two Factor Authentication Enabled. Please verify your account with OTP send to your email",
      });
    }
  } catch (error) {
    next(CustomErrorHandler.serverError(error.message));
  }
};

export default CheckTwoFactorAuth;
