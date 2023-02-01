import Pepper from "../models/pepper.Model";
import crypto from "crypto";
import { genSalt, hash } from "bcrypt";

/**
* @function generatePassword - Function to generate a password hash by combining the password and a random pepper value.
* @param {string} userId - The user's unique identifier.
* @param {string} password - The password to be hashed.
* @throws Will throw an error if the pepper generation or password hashing process fails.
* @returns {string} Returns the generated password hash.
*
* Steps
* @step 1 - Create a random pepper value for the user.
* @step 2 - Check if there is already an existing pepper value for the user in the database.
* @step 3 - If there is no existing pepper value, save a new pepper value for the user in the database.
* @step 4 - Combine the password with the pepper value.
* @step 5 - Salt the combined password and pepper value using the genSalt function.
* @step 6 - Hash the salted password and pepper value using the hash function.
* @step 7 - Return the generated password hash.
*/

const generatePassword = async function (
  userId: string,
  password: string
): Promise<string> {
  try {
    // create a random pepper value for every user
    let pepperValue = crypto.randomBytes(32).toString("hex");

    const existingPepperValue = await Pepper.findOne({ userId });

    if (!existingPepperValue) await new Pepper({ userId, pepperValue }).save();
    else pepperValue = existingPepperValue.pepperValue;

    // user normal password + pepper value
    const saltedPassword = password + pepperValue;

    // Hashing the Password after it pepper and password is combined
    const salt = await genSalt(12);
    const HashedPassword = await hash(saltedPassword, salt);

    return HashedPassword;
  } catch (error) {
    throw error;
  }
};

export default generatePassword;
