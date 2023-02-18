import User from "../../models/user.Model";
import RouteParamsHandler from "../../types/RouteParams.type";
import UserQuery from "../../utils/Admin.Users.Query";
import CustomErrorHandler from "../../utils/CustomError.Handler";

enum ROLE {
  ADMIN = "Admin",
  CUSTOMER = "customer",
}

const getAllUsers: RouteParamsHandler = async (req, res, next) => {
  try {
    // check for admin
    const user = <any>req.user;

    if (user.role !== ROLE.ADMIN)
      return next(CustomErrorHandler.unAuthorized("You are not authorized"));

    const userQuery = new UserQuery(req.query);
    const users = await User.find(userQuery.getQuery())
      .sort(userQuery.getSort())
      .limit(userQuery.getLimit());

    if (!users) return next(CustomErrorHandler.notFound("Users not found"));

    const Users = users.map((user) => {
      const { _id, username, email, role, twoFactorEnabled, verified } = user;
      return { _id, username, email, role, twoFactorEnabled, verified };
    });

    res.status(200).json({ Users });
  } catch (error) {
    return next(error);
  }
};

const getUser: RouteParamsHandler = async (req, res, next) => {
  try {
    // id
    const { id } = req.params;

    // find user
    const user = await User.findOne({ _id: id });

    if (!user) return next(CustomErrorHandler.notFound("User not found"));

    const { _id, username, email, role, twoFactorEnabled, verified } = user;

    res
      .status(200)
      .json({ _id, username, email, role, twoFactorEnabled, verified });
  } catch (error) {
    return next(error);
  }
};

const deleteUser: RouteParamsHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndDelete({ _id: id });

    if (!user) return next(new Error("User does not exists"));

    res.status(200).json({ message: "User deleted Successfully" });
  } catch (error) {
    return next(error);
  }
};

const updateUser: RouteParamsHandler = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

export { getAllUsers, getUser, deleteUser };
