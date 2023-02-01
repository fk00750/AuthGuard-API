import crypto from "crypto";
import Resetkey from "../models/reset.key.Model";

// store the reset password key
/**
 * @function StoreResetPasswordKeyHelper - Stores a new reset password key for a user
 * @param {string} userId - The id of the user to store the reset password key for
 * @returns {string} resetKeyValue - The newly generated reset password key
 */
const StoreResetPasswordKeyHelper = async (userId: string) => {
  try {
    // create a random reset key for every user
    let resetKeyValue = crypto.randomBytes(32).toString("hex");

    // check if key already exists
    let existingResetKeyValue = await Resetkey.findOne({ userId });

    // if user does not exists
    if (!existingResetKeyValue)
      await new Resetkey({ userId, resetkey: resetKeyValue }).save();
    // if user does exists, update the old key with new key
    else if (existingResetKeyValue) {
      existingResetKeyValue.resetkey = resetKeyValue;
      await existingResetKeyValue.save();
    }

    // returns resetkeyValue
    return resetKeyValue;
  } catch (error) {
    throw new Error(error);
  }
};

// verify reset password key 
/**
 * @function verifyResetPasswordKeyHelper - Verifies the reset password key
 * @param {string} userId - User id for which the reset password key needs to be verified
 * @returns {object} - Returns an object with verified key information
 * @throws {Error} - Throws error if the provided key is invalid
 */
const verifyResetPasswordKeyHelper = async (userId: string) => {
  try {
    // find user id reset key in DB
    const resetKey = await Resetkey.findOne({ userId });

    if (!resetKey) throw new Error("Invalid Key");

    resetKey.verified = true;
    await resetKey.save();

    console.log(resetKey);

    return resetKey;
    // const
  } catch (error) {
    throw new Error(error);
  }
};

export { StoreResetPasswordKeyHelper, verifyResetPasswordKeyHelper };
