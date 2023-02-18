import User from "../../models/user.Model";
import RouteParamsHandler from "../../types/RouteParams.type";
import CustomErrorHandler from "../../utils/CustomError.Handler";

/**
 * async
 * @function EnableTwoFactorAuthentication - Auth Controller function that enables or disables two-factor authentication for a user
 *
 * @param {Request} req - The express request object
 * @param {Response} res - The express response object
 * @param {NextFunction} next - The next function in the middleware chain
 *
 * @throws {NotFoundError} If user is not found or email is not found
 * @throws {UnAuthorizedError} If user is not verified
 * @throws {ServerError} If there is any error while processing the request
 *
 * @returns {Object} Object with a message indicating if two-factor authentication has been enabled or disabled
 */

const EnableTwoFactorAuthentication: RouteParamsHandler = async (
  req,
  res,
  next
) => {
  try {
    // if request does not contain user object
    if (!req.user) return next(CustomErrorHandler.notFound("User not found"));

    const { email } = (<any>req).user;

    // if email is null
    if (!email) return next(CustomErrorHandler.notFound("Email not found"));

    // find the user
    const user = await User.findOne({ email: email });

    // if user does not exists
    if (!user) return next(CustomErrorHandler.notFound("User not found"));

    // if user is not verified
    if (!user.verified)
      return next(CustomErrorHandler.unAuthorized("User not verified"));

    // two factor authentication check
    if (user.twoFactorEnabled) {
      user.twoFactorEnabled = false; // if two factor authentication is true, set it to true false
    } else if (!user.twoFactorEnabled) {
      user.twoFactorEnabled = true; // if two factor authentication is false, set it to true true
    }

    // save user
    await user.save();

    res
      .status(200)
      .json({
        message: `Two Factor Authentication is set to ${user.twoFactorEnabled}`,
      });
  } catch (error) {
    next(CustomErrorHandler.serverError(error.message));
  }
};

export default EnableTwoFactorAuthentication;