import Joi from "joi";
import RouteParamsHandler from "../../types/RouteParams.type";
import { RefreshTokenCycle } from "../../utils/Refresh.Token.Cycle";

enum ROLE {
  ADMIN = "Admin",
  CUSTOMER = "User",
}

/**
 *@async
 *@function RefreshTokenHandler - RefreshTokenHandler handles the refresh token process by validating the incoming refresh token, making the old refresh token invalid and generating new access token and refresh token
 *
 *@throws {Error} - If the incoming refresh token is not provided or invalid
 *@throws {Error} - If the refresh token does not exists in the database or is not valid
 *@throws {Error} - If the refresh token has been expired
 *
 *@returns {Object} - Returns an object with two keys "access_token" and "refresh_token"
 *
 *Steps
 *@step 1 - Extract the refresh token from the header of the request object
 *@step 2 - Validate the incoming refresh token
 *@step 3 - Check if the refresh token exists in the database and is valid
 *@step 4 - Check if the refresh token has been expired
 *@step 5 - Make the old refresh token invalid
 *@step 6 - Generate new access token and refresh token
 *@step 7 - Save the newly generated refresh token in the database
 *@step 8 - Return the newly generated access token and refresh token in the response object
 */

const RefreshTokenHandler: RouteParamsHandler = async (req, res, next) => {
  try {
    // extract token from header
    const { refreshToken } = req.body;

    const token = refreshToken;

    // validate token
    const refreshTokenValidationSchema = Joi.string().required();

    const { error } = refreshTokenValidationSchema.validate(token);

    if (error) {
      return next(error);
    }

    // user
    const user = (<any>req).user;

    //! Implementing refresh token cycle
    try {
      const { accessToken, refreshToken } = await RefreshTokenCycle.refresh(
        token,
        user
      );

      res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export default RefreshTokenHandler;
