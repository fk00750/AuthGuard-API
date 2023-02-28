import { decode, JwtPayload } from "jsonwebtoken";
import RefreshToken from "../models/refresh_token.model";
import IssueAccessAndRefreshToken from "./issue.JWT.tokens";

enum ROLE {
  ADMIN = "Admin",
  User = "User",
}

/**
 * @class RefreshTokenRotation
 * @classdesc RefreshTokenRotation is a class that provides a method to refresh the access and refresh tokens.
 */
export class RefreshTokenRotation {
  /**
   * @static
   * @async
   * @description This method refreshes the access and refresh tokens.
   * @param {string} token - The refresh token that needs to be refreshed.
   * @param {any} user - The user object that includes the user ID.
   * @returns {Promise<{accessToken: string, refreshToken: string}>} - Returns the new access and refresh tokens.
   *
   * @throws {Error} - Throws an error if the refresh token is invalid or has been expired.
   */
  static async refresh(token: string, user: any) {
    try {
      // Step 1: Find the existing refresh token in the database
      const Oldrefreshtoken = await RefreshToken.findOne({
        refreshToken: token,
      });

      // Step 2: Check if the refresh token exists and its status is "valid"
      if (!Oldrefreshtoken || Oldrefreshtoken.status !== "valid") {
        throw new Error("Invalid refresh token");
      }

      // Step 3: Check if the refresh token has been expired
      if (Oldrefreshtoken.expiresAt < Math.floor(Date.now() / 1000)) {
        throw new Error("Refresh token has been expired");
      }

      // Step 4: Update the status of the existing refresh token to "invalid"
      Oldrefreshtoken.status = "invalid";
      await Oldrefreshtoken.save();

      //  Delete all previous refresh token of the user
      await RefreshToken.deleteMany({ userId: Oldrefreshtoken.userId });

      let accessToken, refreshToken;

      // Step 5: Issue new access and refresh tokens based on the user's role
      if (user.role === ROLE.ADMIN) {
        accessToken = await IssueAccessAndRefreshToken.issueAdminAccessToken(
          user._id
        );
        refreshToken = await IssueAccessAndRefreshToken.issueAdminRefreshToken(
          user._id
        );
      } else if (user.role === ROLE.User) {
        accessToken = await IssueAccessAndRefreshToken.issueAccessToken(
          user._id
        );
        refreshToken = await IssueAccessAndRefreshToken.issueRefreshToken(
          user._id
        );
      }

      // Step 6: Decode the new refresh token
      const decoded = decode(refreshToken as string, { complete: true });

      // Step 7: Check if the new refresh token is valid
      if (!decoded) {
        throw new Error("Invalid refresh token");
      }

      // Step 8: Extract the payload from the decoded refresh token
      const { payload } = decoded as { payload: JwtPayload };

      // Step 9: Get the expiration time of the refresh token from the payload
      const expiresAt = payload.exp;

      // Step 10: Create a new refresh token in the database
      await RefreshToken.create({
        refreshToken: refreshToken,
        expiresAt: expiresAt,
        status: "valid",
        userId: user._id,
      });

      // Step 11: Return the new access and refresh tokens
      return { accessToken, refreshToken };
    } catch (err) {
      // Step 12: Throw an error if any error occurs during the process
      throw err;
    }
  }
}
