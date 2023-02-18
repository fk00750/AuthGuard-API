import crypto from "crypto";
import Resetkey from "../models/reset.key.Model";
import IssueAccessAndRefreshToken from "./issue.JWT.tokens";
import { decode, JwtPayload } from "jsonwebtoken";
import OTP from "../models/OTP.model";
import User from "../models/user.Model";
import RefreshToken from "../models/refresh_token.model";
import moment from "moment";

enum ROLE {
  ADMIN = "Admin",
  CUSTOMER = "User",
}

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

    return resetKey;
    // const
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @function verifyOtpAndIssueAccessAndRefreshTokens
 * @description This function is used to verify the provided OTP and issue access and refresh tokens to the user.
 *
 * @param {string} UserOTP - The OTP entered by the user.
 *
 * @throws {Error} "Invalid OTP" - If the provided OTP does not match any record in the database.
 * @throws {Error} "OTP expired" - If the OTP has already expired.
 * @throws {Error} "User not found" - If the user associated with the OTP does not exist in the database.
 * @throws {Error} "Invalid refresh token" - If the generated refresh token is not valid.
 *
 * @returns {object} An object containing access token and refresh token.
 *
 * Steps
 * @step 1 Find the OTP in the database and verify it.
 * @step 2 Check if the current time is greater than the expiry time of the OTP.
 * @step 3 Find the user in the database using the user ID associated with the OTP.
 * @step 4 Issue access and refresh tokens to the user.
 * @step 5 Decode the refresh token to check its validity.
 * @step 6 Save the refresh token in the database.
 * @step 7 Delete the OTP from the database.
 * @step 8 Return an object containing access token and refresh token.
 */

const verifyOtpAndIssueAccessAndRefreshTokens = async (
  UserOTP: string
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  try {
    // find the otp in database and verify it
    const otp = await OTP.findOne({ OTP: UserOTP });

    // if otp not found
    if (!otp) {
      throw new Error("Invalid OTP");
    }

    if (moment().isAfter(otp.expiresIn?.getTime())) {
      throw new Error("OTP expired");
    }

    const userId = otp.userId;

    // find the user in database with userid associated to otp
    const user = await User.findById(userId);

    // if user not exists
    if (!user) {
      throw new Error("User not found");
    }

    // find the refresh token with the specific user id
    const ExistingRefreshToken = await RefreshToken.findOne({
      userId: user.id,
    });

    if (ExistingRefreshToken) {
      //  Delete all previous refresh token of the user
      await RefreshToken.deleteMany({ userId: ExistingRefreshToken.userId });
    }

    // access and refresh token
    let accessToken, refreshToken;

    if (user.role === ROLE.ADMIN) {
      accessToken = await IssueAccessAndRefreshToken.issueAdminAccessToken(
        user._id
      );
      refreshToken = await IssueAccessAndRefreshToken.issueAdminRefreshToken(
        user._id
      );
    } else {
      accessToken = await IssueAccessAndRefreshToken.issueAccessToken(user._id);
      refreshToken = await IssueAccessAndRefreshToken.issueRefreshToken(
        user._id
      );
    }

    // decoding refresh token to check validity
    const decoded = decode(refreshToken as string, { complete: true });

    // if decoded token is not valid
    if (!decoded) {
      throw new Error("Invalid refresh token");
    }

    const { payload } = decoded as { payload: JwtPayload };

    const expiresAt = payload.exp;

    // save refresh token
    await new RefreshToken({
      refreshToken,
      expiresAt,
      status: "valid",
      userId: user._id,
    }).save();

    // delete the otp
    await OTP.deleteOne({ userId });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

export {
  StoreResetPasswordKeyHelper,
  verifyResetPasswordKeyHelper,
  verifyOtpAndIssueAccessAndRefreshTokens,
};
