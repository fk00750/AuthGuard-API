import Joi from "joi";
import RouteParamsHandler from "../../types/RouteParams.type";
import RefreshToken from "../../models/refresh_token.model";
import { decode, Jwt, JwtPayload } from "jsonwebtoken";
import IssueAccessAndRefreshToken from "../../utils/issue.JWT.tokens";

const RefreshTokenHandler: RouteParamsHandler = async (req, res, next) => {
  try {
    // extract token from header
    const token = req.headers.authorization
      ?.split(" ")[1]
      ?.toString() as string;

    // validate token
    const refreshTokenValidationSchema = Joi.string().required();

    const { error } = refreshTokenValidationSchema.validate(token);

    if (error) {
      return next(error);
    }

    //! Implementing refresh token cycle
    // finding refresh token in database
    try {
      const Oldrefreshtoken = await RefreshToken.findOne({
        refreshToken: token,
      });

      // if refresh token does not exists OR is not valid
      if (!Oldrefreshtoken || Oldrefreshtoken.status !== "valid") {
        throw new Error("Invalid refresh token");
      }

      // if refreshToken has been expired
      // Math.floor(Date.now() / 1000) taki date convert kar ske
      if (Oldrefreshtoken.expiresAt < Math.floor(Date.now() / 1000)) {
        throw new Error("Refresh token has been expired");
      }

      const { _id } = (<any>req).user;

      // making old refresh token as invalid
      Oldrefreshtoken.status = "invalid";
      await Oldrefreshtoken.save();

      const access_token = await IssueAccessAndRefreshToken.issueAccessToken(
        _id
      );
      const refresh_token = await IssueAccessAndRefreshToken.issueRefreshToken(
        _id
      );

      const decoded = decode(refresh_token as string, { complete: true });

      if (!decoded) {
        throw new Error("Invalid refresh token");
      }

      const { payload } = decoded as { payload: JwtPayload };

      const expiresAt = payload.exp;

      await RefreshToken.create({
        refreshToken: refresh_token,
        expiresAt: expiresAt,
        status: "valid",
        userId: _id,
      });

      res.status(201).json({ access_token, refresh_token });
    } catch (error) {
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export default RefreshTokenHandler;
