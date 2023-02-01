import { compare } from "bcrypt";
import Pepper from "../models/pepper.Model";


/**
* @function CheckPasswordValidity - Function to check the validity of a password.
* @param {any} userId - The id of the user whose password is to be checked.
* @param {string} currentPassword - The password entered by the user.
* @param {string} hashedPassword - The hashed password stored in the database.
* @throws Will throw an error if the pepper value associated with the user is not found.
* @returns {Promise<boolean>} Returns a promise that resolves to a boolean indicating the validity of the password
*
* Steps
* @step 1 - Search for the pepper value associated with the user.
* @step 2 - Check if the pepper value is found.
* @step 3 - Concatenate the pepper value with the password entered by the user.
* @step 4 - Compare the resulting string with the hashed password stored in the database.
* @step 5 - Return a boolean indicating the validity of the password.
*/

const CheckPasswordValidity = async (
  userId: any,
  currentPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    // check pepper value of the user with user id
    const UserPepper = await Pepper.findOne({ userId });


    if (!UserPepper) {
      throw new Error("Pepper value is not valid");
    }

    // complete password
    const CompletePassword = currentPassword + UserPepper.pepperValue;

    // Comparing the password
    const PasswordMatched = await compare(CompletePassword, hashedPassword);

    return PasswordMatched;
  } catch (error) {
    throw error;
  }
};

export default CheckPasswordValidity;
