import RouteParamsHandler from "../../types/RouteParams.type";
import path from "path";

const dashboard: RouteParamsHandler = async (req, res, next) => {
  try {
    if (!req.user) return;

    const { username, role, email } = (<any>req).user;

    res.status(200).json({
      username,
      role,
      email,
    });
  } catch (error) {
    return next(error);
  }
};

export default dashboard;
