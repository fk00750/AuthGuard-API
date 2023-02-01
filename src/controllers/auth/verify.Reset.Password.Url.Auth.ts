import emailVerificationSecretModel from "../../models/email.Secret.model";
import User from "../../models/user.Model";
import RouteParamsHandler from "../../types/RouteParams.type";
import { verify } from "jsonwebtoken";
import { config } from "dotenv";
import { verifyResetPasswordKeyHelper } from "../../utils/helpers";
config({ path: ".env" });
import cookie from "cookie";

const site = process.env.SITE;

/**
 * @function verifyResetPasswordUrl - Function to verify the reset password URL.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws Will throw an error if the user is not found.
 * @throws Will throw an error if the user is not verified.
 * @throws Will throw an error if the email secret is not found.
 * @throws Will throw an error if the secret is not found.
 * @throws Will throw an error if the URL verification failed.
 * @throws Will throw an error if the reset password key is invalid.
 * @returns {Response} Returns a redirect response to the reset password page with the reset password key.
 * @route {GET} /auth/verify-reset-password/:id/:token
 *
 * Steps
 * @step 1 - Extract the user ID and token from the URL parameters.
 * @step 2 - Search for the user in the database.
 * @step 3 - Check if the user is verified.
 * @step 4 - Search for the email secret in the database based on the user ID.
 * @step 5 - Verify the reset password token using the verify function.
 * @step 6 - Search for the reset password key in the database using the verifyResetPasswordKeyHelper function.
 * @step 7 - Remove the email secret from the database.
 * @step 8 - Redirect the user to the reset password page with the reset password key.
 */

const verifyResetPasswordUrl: RouteParamsHandler = async (req, res, next) => {
  try {
    const { id, token } = req.params;

    const user = await User.findOne({ _id: id });

    if (!user) return next(new Error("User is not found"));

    if (!user.verified) return next(new Error("User is not verified"));

    // get secret email by user id
    const emailSecret = await emailVerificationSecretModel.findOne({
      userId: user?.id,
    });

    if (!emailSecret) return next(new Error("Email secret is not found"));

    const secret = emailSecret.secret;

    if (!secret) throw new Error("Secret is not found");

    // verify token
    const verifyToken = verify(token, secret);

    if (!verifyToken) return next(new Error("URL verification failed"));

    // reset password key
    const resetKey = await verifyResetPasswordKeyHelper(user.id);

    if (!resetKey) return next(new Error("Invalid Key"));

    await emailVerificationSecretModel.deleteMany({ userId: id, secret });

    const key = resetKey.resetkey;

    // res.redirect(`${site}/reset-password/${key}`);
    // const URL = `http://localhost:3000/auth/reset-password/${key}`;
    res.status(200).json({
      message: "Request password verification is successful.Below is your reset key",
      resetkey: key,
    });
  } catch (error) {
    next(error.message);
  }
};

export default verifyResetPasswordUrl;
