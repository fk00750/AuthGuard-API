import Joi from "joi";
import RouteParamsHandler from "../../types/RouteParams.type";
import User from "../../models/user.Model";
import CustomErrorHandler from "../../utils/CustomError.Handler";
import {
  generateEmailVerificationToken,
  sendVerificationMail,
} from "../../utils/email.Helper";

/**
 * @async
 * @function registerUser - Function to handle user registration process.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @throws Will throw an error if validation of the user credentials fails.
 * @throws Will throw an error if email already exists in the database.
 *
 * @returns {Response} Returns a JSON response indicating success or failure of the registration.
 *
 * @route {POST} /auth/register
 *  
 * Steps
 * @step1 Validate User Credentials
 * The user's credentials are first validated using Joi. The required fields are username, email, password, and repeatPassword.
 *
 * @step2 Check for Existing User
 * Next, the function checks if the email provided by the user exists in the database.
 *
 * @step3 Save User Credentials
 * If the email provided by the user is not in the database, the user's credentials are saved in the database.
 *
 * @step4 Generate Verification Token
 * After saving the user's credentials in the database, a verification token is generated using the user's email and user ID.
 *
 * @step5 Send Verification Email
 * The verification token is sent to the user's email along with a verification link. The link consists of the user's ID and the verification token.
 *
 * @step6 Return Response
 * If all steps are successful, the function returns a 201 status code along with a message saying "User Registered Successfully. Please Verify Your email.
 */

const registerUser: RouteParamsHandler = async (req, res, next) => {
  try {
    // user register credentials validation
    const registerValidationSchema = Joi.object({
      username: Joi.string().min(3).required(),
      email: Joi.string().email(),
      password: Joi.string().required(),
      repeatPassword: Joi.ref("password"),
    });

    const { error } = registerValidationSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // check email exists in database
    try {
      const { email } = req.body;
      const CheckUserExist = await User.exists({ email });
      if (CheckUserExist) {
        return next(
          CustomErrorHandler.alreadyExist("This email is not available")
        );
      }
    } catch (error) {
      return next(error);
    }

    // save user credentials in database
    try {
      const { username, email, password } = req.body;
      const newUser = new User({
        username,
        email,
        password,
      });

      // Verify user email
      const userId = newUser.id;
      const verificationToken = await generateEmailVerificationToken(
        userId,
        email
      );

      const verificationUrl = `${
        req.protocol + "://" + req.headers.host
      }/auth/verify-email/${userId}/${verificationToken}`;

      await sendVerificationMail(
        email,
        verificationUrl,
        "Verify Email",
        "Verify Your Email",
        "Please click the following link to verify your email"
      );

      await newUser.save();

      res.status(201).json({
        message: "User Registered Successfully.Please Verify Your email",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  } catch (error) {
    return next(error);
  }
};

export default registerUser;
