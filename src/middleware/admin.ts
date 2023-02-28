import RefreshToken from "../models/refresh_token.model";
import User from "../models/user.Model";
import RouteParamsHandler from "../types/RouteParams.type";
import CustomErrorHandler from "../utils/CustomError.Handler";


const admin: RouteParamsHandler = async (req, res, next) => {
  try {
    // find the user in database
    const { _id } = (<any>req).user;

    // token
    const token = req.headers.authorization
      ?.split(" ")[1]
      ?.toString() as string;

    // find refresh token
    const refreshToken = await RefreshToken.findOne({ refreshToken: token });

    if (!refreshToken)
      return next(CustomErrorHandler.notFound("Refresh Token not found"));

    if (refreshToken.status !== "valid")
      return next(CustomErrorHandler.unAuthorized("You are unauthorized"));

    const user = await User.findOne({ _id: _id });

    if (!user || !user.verified) {
      throw new Error("User does not exists");
    }

    // verify user role is admin
    if (user.role !== "Admin") {
      res.status(401).json({
        message: "You are unauthorized",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

export default admin;
