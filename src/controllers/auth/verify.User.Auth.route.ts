import { config } from "dotenv";
config({ path: ".env" });
import { verify } from "jsonwebtoken";
import emailVerificationSecretModel from "../../models/email.Secret.model";
import User from "../../models/user.Model";
import RouteParamsHandler from "../../types/RouteParams.type";
import CustomErrorHandler from "../../utils/CustomError.Handler";

const site = process.env.SITE;

/**
 * @function verifyUserEmail - Function to handle user email verification.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws Will throw an error if the email is already verified.
 * @throws Will throw an error if the user email verification fails.
 * @returns {Response} Redirects the user to the log-in page if the email verification process is successful.
 * @route {GET} /auth/verify-email/:id/:token
 *
 * Steps
 * @step 1 - Extract the id and token from the request parameters.
 * @step 2 - Search for the user in the database.
 * @step 3 - Check if the email is already verified.
 * @step 4 - Search for the email verification secret in the database.
 * @step 5 - Verify the email using the secret and the token.
 * @step 6 - Update the user's email verification status in the database.
 * @step 7 - Remove the email verification secret from the database.
 * @step 8 - Redirect the user to the log-in page.
 */

const verifyUserEmail: RouteParamsHandler = async (req, res, next) => {
  try {
    const { id, token } = req.params;

    const user = await User.findOne({ _id: id });

    if (!user) return next(CustomErrorHandler.notFound("User not found"));

    const emailSecret = await emailVerificationSecretModel.findOne({
      userId: user?._id,
    });

    if (!emailSecret) return next(new Error("Unable to process the request"));

    if (user?.verified)
      return next(CustomErrorHandler.unAuthorized("Email is already verified"));

    if (user && emailSecret) {
      const secret = emailSecret.secret;
      const verifyEmail = verify(token, String(secret));

      if (!verifyEmail) throw new Error("User Email Verification Failed");

      user.verified = true;
      await user.save();

      await emailVerificationSecretModel.deleteMany({ userId: id, secret });

      // res.redirect(`${site}/log-in`);
      res.status(200).json({ message: "Email verification is successful" });
    }
  } catch (error) {
    return next(new Error("User Verification Failed"));
  }
};

export default verifyUserEmail;
