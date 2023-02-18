import RefreshToken from "../models/refresh_token.model";
import RouteParamsHandler from "../types/RouteParams.type";
import CustomErrorHandler from "../utils/CustomError.Handler";

const verifyRefreshToken: RouteParamsHandler = async (req, res, next) => {
  try {
    const refreshToken = req.headers.authorization?.split(" ")[1];

    // find the refresh token and delete
    const existingToken = await RefreshToken.findOne({ refreshToken });

    if (!existingToken)
      return next(CustomErrorHandler.notFound("Refresh token not found"));

    // check for validity
    if (existingToken?.status === "invalid") {
      return next(CustomErrorHandler.unAuthorized("Invalid refresh token"));
    }

    req.body.refreshToken = existingToken.refreshToken;
    next();
  } catch (error) {
    next(error);
  }
};

export default verifyRefreshToken;
