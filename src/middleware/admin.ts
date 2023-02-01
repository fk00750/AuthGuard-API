import User from "../models/user.Model";
import RouteParamsHandler from "../types/RouteParams.type";

const admin: RouteParamsHandler = async (req, res, next) => {
  try {
    // find the user in database
    const { _id } = (<any>req).user;

    const user = await User.findOne({ _id: _id });

    if (!user || !user.verified) {
      throw new Error("User does not exists");
    }

    // verify user role is admin
    if (user.role !== "admin") {
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
