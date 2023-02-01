import nodemailer, { TransportOptions } from "nodemailer";
import { google } from "googleapis";
import { sign } from "jsonwebtoken";
import emailVerificationSecretModel from "../models/email.Secret.model";
import { randomFillSync, randomBytes } from "crypto";

const CLIENT_ID: string =
  "421790989978-5skiqkdong3fp3p9a5h35fb0n59jgkqk.apps.googleusercontent.com";
const CLIENT_SECRET: string = "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";
const REDIRECT_URL: string = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN: string =
  "1//04ve4HNnyS5ASCgYIARAAGAQSNwF-L9Irqr2bjLyBVUsY0IKkAPtnqwtFNWrDBxkD3xR3AmBeHsZtLUGaoJZuxDtErMPOUyUYhMM";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

/**
 * @async
 * @function sendVerificationMail - sendVerificationMail is an asynchronous function for sending a verification email to the provided email address
 * @param {string} receiver - The email address of the recipient
 * @param {string} verificationUrl - The URL for the recipient to verify their email
 * @param {string} message - The subject line for the email
 * @param {string} heading - The heading for the email body
 * @param {string} description - A description to include in the email body
 * @returns {Promise<any>} Returns a promise resolving to the result of sending the email
 * @throws {Error} Throws an error if there is an issue with sending the email
 */

async function sendVerificationMail(
  receiver: string,
  verificationUrl: string,
  message: string,
  heading: string,
  description: string
): Promise<any> {
  try {
    const access_token = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "fk7384329@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: access_token,
      },
    } as TransportOptions);

    const mailOptions = {
      from: "<fk7384329@gmail.com>",
      to: receiver,
      subject: `${message}`,
      text: `${message}`,
      html: `<h1>${heading}</h1><p>${description}:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * @async
 * @function generateEmailVerificationToken - generateEmailVerificationToken is a function that generates and stores a token for email verification.
 * @param {string} userId - The id of the user for the payload.
 * @param {string} email - The email of the user for the payload.
 * @returns - A string of hashed token with an expiration limit of 15 minutes.
 */

const generateEmailVerificationToken = async function (
  userId: string,
  email: string
) {
  try {
    const payload = {
      userId,
      email,
    };

    // check if a secret exists with the user id
    const secretExist = await emailVerificationSecretModel.findOne({ userId });

    const verificationSecret = randomBytes(32).toString("hex");

    if (!secretExist)
      await new emailVerificationSecretModel({
        userId,
        secret: verificationSecret,
      }).save();
    else
      await emailVerificationSecretModel.findOneAndUpdate(
        { secret: secretExist.secret },
        { secret: verificationSecret }
      );

    const verificationToken = sign(payload, verificationSecret, {
      expiresIn: "15m",
    });
    return verificationToken;
  } catch (error) {
    return error;
  }
};

export { sendVerificationMail, generateEmailVerificationToken };
