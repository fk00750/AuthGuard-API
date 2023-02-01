import Joi from "joi";
import User from "../../models/user.Model";
import RouteParamsHandler from "../../types/RouteParams.type";
import CustomErrorHandler from "../../utils/CustomError.Handler";
import {
  generateEmailVerificationToken,
  sendVerificationMail,
} from "../../utils/email.Helper";
import { StoreResetPasswordKeyHelper } from "../../utils/helpers";

/**
 * @function forgotPassword - Function to handle forgot password process.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws Will throw an error if validation of the email fails.
 * @throws Will throw an error if user is not found in the database.
 * @throws Will throw an error if user is not verified.
 * @returns {Response} Returns a JSON response indicating success or failure of the forgot password process.
 * @route {POST} /auth/forgot-password
 *
 * Steps
 * @step 1 - Validate the email present in the request body using Joi.
 * @step 2 - Check if user exists in the database based on the email.
 * @step 3 - Check if the user is verified.
 * @step 4 - Generate a password reset token using the generateEmailVerificationToken function.
 * @step 5 - Construct the password reset URL using the generated token, user ID, and the host information.
 * @step 6 - Send an email to the user's email with the password reset link.
 * @step 7 - Store the password reset key in the database using the StoreResetPasswordKeyHelper function.
 * @step 8 - Return a success message indicating that the password reset link has been sent to the user's email.
 */

const forgotPassword: RouteParamsHandler = async (req, res, next) => {
  try {
    const EmailValidationSchema = Joi.object({
      email: Joi.string().email(),
    });

    const { error } = EmailValidationSchema.validate(req.body);

    if (error) return next(CustomErrorHandler.serverError(error.message));

    const { email } = req.body;

    try {
      // find email in database
      const user = await User.findOne({ email });

      if (!user) return next(new Error("User not found"));

      if (!user.verified)
        return next(CustomErrorHandler.unAuthorized("User is not verified"));

      const verificationToken = await generateEmailVerificationToken(
        user.id,
        email
      );

      const verificationUrl = `${
        req.protocol + "://" + req.headers.host
      }/auth/verify-email-reset-password/${user.id}/${verificationToken}`;

      await sendVerificationMail(
        email,
        verificationUrl,
        "Password Reset",
        "Reset your password",
        "Please click on the following link to reset your password"
      );

      await StoreResetPasswordKeyHelper(user.id);

      res.status(200).json({
        message: "Reset Password link sent to email",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  } catch (error) {
    return next(error);
  }
};

export default forgotPassword;
