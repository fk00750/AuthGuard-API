import RouteParamsHandler from "../../types/RouteParams.type";
import Joi from "joi";
import CustomErrorHandler from "../../utils/CustomError.Handler";
import User from "../../models/user.Model";
import CheckPasswordValidity from "../../utils/check.Password.validity";
import IssueAccessAndRefreshToken from "../../utils/issue.JWT.tokens";
import { decode, JwtPayload } from "jsonwebtoken";
import RefreshToken from "../../models/refresh_token.model";

/**
 *@async
 *@function loginUser - Function to handle user login process.
 *@param {Request} req - Express request object
 *@param {Response} res - Express response object
 *@param {Function} next - Express next middleware function
 *@throws Will throw an error if validation of the login credentials fails.
 *@throws Will throw an error if user is not found in the database.
 *@throws Will throw an error if the user is not verified.
 *@throws Will throw an error if the entered password is incorrect.
 *@returns {Response} Returns a JSON response with access and refresh tokens if the login is successful.
 *@route {POST} /auth/login
 *
 * Steps
 * @step1 - Validate Login Credentials
 * The user's login credentials are first validated using Joi. The required fields are email and password.
 *
 * @step2 - Find User in Database
 * Next, the function checks if the email provided by the user exists in the database.
 *
 * @step3 - Check User Verification
 * The function then checks if the user with the given email is verified.
 *
 * @step4 - Check Password
 * The function then checks if the password entered by the user is correct.
 *
 * @step5 - Issue Access and Refresh Token
 * If the password entered by the user is correct, the function issues an access token and refresh token. The refresh token is stored in the database with a specific user ID.
 *
 * @step6 - Store Refresh Token
 * The refresh token is stored in the database with the specific user ID, with a valid status and an expiresAt value.
 *
 * @step7 - Return Response
 * If all steps are successful, the function returns a 200 status code along with a message "User Login Successfully" and the access and refresh tokens.
 */

const loginUser: RouteParamsHandler = async (req, res, next) => {
  // Validate login credentials
  try {
    const loginValidateSchema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string(),
    });

    const { error } = loginValidateSchema.validate(req.body);

    if (error) return next(CustomErrorHandler.serverError(error.message));

    // find user in database
    try {
      // find the user
      const user = await User.findOne({ email: req.body.email });

      if (!user) return next(new Error("User not found"));

      // is user verified
      if (!user.verified)
        return next(CustomErrorHandler.unAuthorized("User is not verified"));

      // check password entered by user
      const IsPasswordValid = await CheckPasswordValidity(
        user.id,
        req.body.password,
        user.password
      );

      // Issue Access and Refresh Token
      if (IsPasswordValid) {
        // find the refresh token with the specific user id
        const ExistingRefreshToken = await RefreshToken.findOne({
          userId: user.id,
        });

        // if the refresh token exists then make that refresh token invalid
        // in order to issue new refresh token
        if (ExistingRefreshToken?.status === "valid") {
          ExistingRefreshToken.status = "invalid";
          await ExistingRefreshToken.save();
        }

        // access and refresh token
        const accessToken = await IssueAccessAndRefreshToken.issueAccessToken(
          user._id
        );
        const refreshToken = await IssueAccessAndRefreshToken.issueRefreshToken(
          user._id
        );

        // ! Implementing Refresh token cycle
        // decoding refresh token to check validity
        const decoded = decode(refreshToken as string, { complete: true });

        if (!decoded) {
          throw new Error("Invalid refresh token");
        }

        const { payload } = decoded as { payload: JwtPayload };

        const expiresAt = payload.exp;

        const storedRefreshToken = await new RefreshToken({
          refreshToken: refreshToken,
          expiresAt: expiresAt,
          status: "valid",
          userId: user._id,
        }).save();

        // check if the promise is resolved
        if (storedRefreshToken) {
          res.status(200).json({
            message: "User Login Successfully",
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }
      } else {
        throw new Error("Password is wrong");
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  } catch (error) {
    return next(error);
  }
};

export default loginUser;
