import User from "../../models/user.Model";
import RouteParamsHandler from "../../types/RouteParams.type";

enum ROLE {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

const getAllUsers: RouteParamsHandler = async (req, res, next) => {
  try {
    // check for admin

    const user = <any>req.user;

    if (user.role !== ROLE.ADMIN)
      return next(new Error("You are not authorized"));

    // find all users
    const users = await User.find();

    res.status(200).json({ users });
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

    if (!user) return next(new Error("User does not exists"));

    res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};

const deleteUser: RouteParamsHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndDelete({ _id: id });

    if (!user) return next(new Error("User does not exists"));

    res.status(204).json({ message: "User deleted Successfully" });
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
