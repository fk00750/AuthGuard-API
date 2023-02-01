import Resetkey from "../../models/reset.key.Model";
import User from "../../models/user.Model";
import RouteParamsHandler from "../../types/RouteParams.type";
import generatePassword from "../../utils/generate.Secure.Password";

/**
 * @function resetPassword - Function to handle reset password process.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws Will throw an error if the reset password key is not found in the database.
 * @throws Will throw an error if the reset password key is not verified.
 * @throws Will throw an error if the reset password key is expired.
 * @throws Will throw an error if the user associated with the reset password key is not found or not verified.
 * @returns {Response} Returns a JSON response indicating success or failure of the reset password process.
 * @route {POST} /auth/reset-password
 * 
 * Steps
 * @step 1 - Extract the password and key from the request body.
 * @step 2 - Search for the reset password key in the database.
 * @step 3 - Check if the reset password key is verified.
 * @step 4 - Check if the reset password key has not expired.
 * @step 5 - Search for the user associated with the reset password key.
 * @step 6 - Check if the user is verified.
 * @step 7 - Generate a new password hash using the generatePassword function.
 * @step 8 - Update the user's password in the database.
 * @step 9 - Remove the reset password key from the database.
 * @step 10 - Return a success message indicating that the password has been reset successfully.
 */

const resetPassword: RouteParamsHandler = async (req, res, next) => {
  try {
    const { password, key } = req.body;

    // find the key
    const resetKey = await Resetkey.findOne({ resetkey: key });

    if (!resetKey) return next(new Error("Invalid Key"));

    // check if key is verified
    if (!resetKey.verified) return next(new Error("Invalid Key"));

    // check if key is expired
    // if(Date.now() > resetKey.expiresAt) return next()

    /* --- reset password process --- */

    // find the user with user id in resetkey

    const user = await User.findById(resetKey.userId);

    // check if user if verified or not found
    if (!user || !user.verified) return next(new Error("Invalid User key"));

    const hashedPassword: string = await generatePassword(user.id, password);

    // update the user password
    await User.findOneAndUpdate(
      { email: user.email },
      { password: hashedPassword }
    );

    // remove the key
    await Resetkey.deleteOne({ userId: resetKey.userId });

    res.send("Reset Password Successfull");
  } catch (error) {
    next(error.message);
  }
};

export default resetPassword;
