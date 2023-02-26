import RefreshToken from "../../models/refresh_token.model";
import RouteParamsHandler from "../../types/RouteParams.type";
import CustomErrorHandler from "../../utils/CustomError.Handler";

/**
 * @async
 * @function logoutUser - Function to handle logout process.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws Will throw an error if the refresh token is not found in the database.
 * @returns {Response} Returns a JSON response indicating success or failure of the logout process.
 * @route {POST} /auth/logout
 *
 * Steps:
 * * Extract the refresh token from the authorization header of the request object.
 * * Find the refresh token in the database and delete it.
 * * Return a JSON response indicating success of the logout process.
 */

// https://authguard-api.onrender.com

const logoutUser: RouteParamsHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // delete token
    const deleteToken = await RefreshToken.findOneAndDelete({
      refreshToken,
    });

    if (!deleteToken)
      return next(CustomErrorHandler.unAuthorized("Unable to logout"));

    res.status(200).json({ message: "User logout" });
  } catch (error) {
    return next(error);
  }
};

export default logoutUser;
