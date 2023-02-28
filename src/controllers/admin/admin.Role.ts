import User from "../../models/user.Model";
import RouteParamsHandler from "../../types/RouteParams.type";
import UserQuery from "../../utils/Admin.Users.Query";
import CustomErrorHandler from "../../utils/CustomError.Handler";

enum ROLE {
  ADMIN = "Admin",
  CUSTOMER = "customer",
}

/**
 * @description The <b>getAllUsers</b> function retrieves a list of all users from the database, given that the requester is authorized as an admin. It uses a UserQuery object to parse and validate the query parameters and then retrieves the users matching the specified query.<br/> The retrieved users are mapped to a new array with only the desired properties and sent in the response body. If no users are found or an error occurs, an appropriate error is thrown.
 * @async
 * @function getAllUsers - Retrieves a list of all users from the database.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Response} Returns a JSON response with all users details
 * @throws {CustomErrorHandler.unAuthorized} If the user is not authorized
 * @throws {CustomErrorHandler.notFound} If the user is not found
 */

const getAllUsers: RouteParamsHandler = async (req, res, next) => {
  try {
    // check for admin
    const user = <any>req.user;

    if (user.role !== ROLE.ADMIN)
      return next(CustomErrorHandler.unAuthorized("You are not authorized"));

    // Create a UserQuery object to parse and validate the query parameters
    const userQuery = new UserQuery(req.query);

    // Find all users matching the specified query
    const users = await User.find(userQuery.getQuery())
      .sort(userQuery.getSort())
      .limit(userQuery.getLimit());

    if (!users) return next(CustomErrorHandler.notFound("Users not found"));

    // Map the retrieved users to a new array with only the desired properties
    const Users = users.map((user) => {
      const { _id, username, email, role, twoFactorEnabled, verified } = user;
      return { _id, username, email, role, twoFactorEnabled, verified };
    });

    // Send the retrieved users in the response body
    res.status(200).json({ Users });
  } catch (error) {
    return next(error);
  }
};

/**
 * @description The <b>getUser</b> function retrives the single user from the database, with given user id.
 * @async
 * @function getUser - Retrieves a single user.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Response} Returns a JSON response with user details such as _id, username, email, role, twoFactorEnabled, verified
 * @throws {CustomErrorHandler.notFound} If the user is not found
 */

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

/**
 * @description The <b>deleteUser</b> function deletes the single user from the database, with given user id.
 * @async
 * @function deleteUser - Retrieves and delete a single user.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Response} Returns a success message that user deleted successfully
 * @throws {CustomErrorHandler.notFound} If the user is not found
 */

const deleteUser: RouteParamsHandler = async (req, res, next) => {
  try {
    // id in parameter
    const { id } = req.params;

    // find and deletes user
    const user = await User.findOneAndDelete({ _id: id });

    if (!user) return next(CustomErrorHandler.notFound("User not found"));

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
