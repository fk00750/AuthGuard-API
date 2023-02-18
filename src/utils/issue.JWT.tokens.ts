import { sign } from "jsonwebtoken";
import { join } from "path";
import { readFileSync } from "fs";
import { Types } from "mongoose";

// access token key
const pathToKey = join(__dirname, "../..", "access_private.pem");
const ACCESS_PRIV_KEY = readFileSync(pathToKey, "utf8");
// refresh token key
const pathToRefreshKey = join(__dirname, "../..", "refresh_private.pem");
const REFRESH_PRIV_KEY = readFileSync(pathToRefreshKey, "utf-8");

/* --- Admin --- */

// Admin access token key
const pathToAdminAccessKey: string = join(
  __dirname,
  "../..",
  "AdminAccess_privateKey.pem"
);
const ADMIN_ACCESS_PRIVATE_KEY: string = readFileSync(
  pathToAdminAccessKey,
  "utf-8"
);

// Admin refresh token key
const pathToAdminRefreshKey: string = join(
  __dirname,
  "../..",
  "AdminRefresh_privateKey.pem"
);
const ADMIN_REFRESH_PRIVATE_KEY: string = readFileSync(
  pathToAdminRefreshKey,
  "utf-8"
);

/**
 * @class IssueAccessAndRefreshToken
 * @classdesc Class for issuing access and refresh tokens
 */

class IssueAccessAndRefreshToken {
  /**
   *@static
   *@property {string} ACCESS_PRIV_KEY - ACCESS_PRIV_KEY property - private key for access token
   */
  static ACCESS_PRIV_KEY = ACCESS_PRIV_KEY;
  /**
   *@static
   *@property {string} REFRESH_PRIV_KEY - REFRESH_PRIV_KEY property - private key for refresh token
   */
  static REFRESH_PRIV_KEY = REFRESH_PRIV_KEY;

  // Admin
  static ADMIN_ACCESS_PRIV_KEY = ADMIN_ACCESS_PRIVATE_KEY;
  static ADMIN_REFRESH_PRIV_KEY = ADMIN_REFRESH_PRIVATE_KEY;

  /**
   *@static
   *@method issueToken - issueToken method - method to generate token
   *@param {Types.ObjectId} userId - user id for payload
   *@param {string} privKey - private key to sign the token
   *@param {string} expiresIn - token expiration time
   *@returns {string} - signed token
   */
  static async issueToken(
    userId: Types.ObjectId,
    privKey: string,
    expiresIn: string
  ) {
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
    };

    return sign(payload, privKey, { expiresIn: expiresIn, algorithm: "RS256" });
  }

  /**
   *@static
   *@async
   *@method issueAccessToken - issueAccessToken method - method to generate access token
   *@param {Types.ObjectId} userId - user id for payload
   *@returns {string} - signed access token
   */
  static async issueAccessToken(userId: Types.ObjectId) {
    return this.issueToken(userId, this.ACCESS_PRIV_KEY, "50s");
  }

  /**
   *@static
   *@async
   *@method issueRefreshToken - issueRefreshToken method - method to generate refresh token
   *@param {Types.ObjectId} userId - user id for payload
   *@returns {string} - signed refresh token
   */
  static async issueRefreshToken(userId: Types.ObjectId) {
    return this.issueToken(userId, this.REFRESH_PRIV_KEY, "1y");
  }

  // Admin
  static async issueAdminAccessToken(userId: Types.ObjectId) {
    return this.issueToken(userId, this.ADMIN_ACCESS_PRIV_KEY, "50s");
  }

  static async issueAdminRefreshToken(userId: Types.ObjectId) {
    return this.issueToken(userId, this.ADMIN_REFRESH_PRIV_KEY, "1y");
  }
}

export default IssueAccessAndRefreshToken;
