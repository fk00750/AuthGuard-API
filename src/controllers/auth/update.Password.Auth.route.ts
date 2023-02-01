import User from "../../models/user.Model";
import RouteParamsHandler from "../../types/RouteParams.type";
import CheckPasswordValidity from "../../utils/check.Password.validity";
import generatePassword from "../../utils/generate.Secure.Password";

/**
* @function updatePassword - Function to handle password update process.
* @param {Request} req - Express request object
* @param {Response} res - Express response object
* @param {Function} next - Express next middleware function
* @throws Will throw an error if the user is not found.
* @throws Will throw an error if the entered current password is incorrect.
* @returns {Response} Returns a JSON response indicating success or failure of the password update process.
*
* Steps
* @step 1 - Check if the user is present in the request object.
* @step 2 - Extract the current password and new password from the request body.
* @step 3 - Check if the entered current password is correct by using the CheckPasswordValidity function.
* @step 4 - Generate a new password hash using the generatePassword function.
* @step 5 - Update the user's password in the database.
* @step 6 - Return a success message indicating that the password has been updated successfully.
*/

const updatePassword: RouteParamsHandler = async (req, res, next) => {
  try {
    if (!req.user) return next(new Error("User not found"));

    const { _id, email, password } = (<any>req).user;

    // CurrentPassword - is the password which user entered
    // password - password is the user password stored in database
    const { CurrentPassword, NewPassword } = req.body;

    // check if current password is correct
    const IsPasswordValid = await CheckPasswordValidity(
      _id,
      CurrentPassword,
      password
    );

    if (IsPasswordValid) {
      const hashedPassword: string = await generatePassword(_id, NewPassword);

      await User.findOneAndUpdate({ email }, { password: hashedPassword });

      res.status(200).send("Password Updated Successfully");
    } else {
      throw new Error("Password is wrong");
    }
  } catch (error) {
    return next(error);
  }
};

export default updatePassword;
