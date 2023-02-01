/**
 * @class
 * @classdesc Handle Custom Errors Responses to prevent app from crash
 */
class CustomErrorHandler extends Error {
  status: number;
  message: string;

  /**
   * @constructor
   * @param {number} status - status of the error
   * @param {message} message - message of the error
   */
  constructor(status: number, message: string) {
    super();
    (this.status = status), (this.message = message);
  }

  /**
   * @param {string} message - user or object already exists
   * @returns {Error} - returns new error response if an object already exists in database
   */
  static alreadyExist(message: string): Error {
    return new CustomErrorHandler(409, message);
  }

  /**
   * @param {string} message - wrong credentials
   * @returns {Error} - return error if the user entered wrong credentials
   */
  static wrongCredentials(
    message: string = "username and password are wrong"
  ): Error {
    return new CustomErrorHandler(401, message);
  }

  /**
   * @param {string} message - Not found
   * @returns {Error} - returns error if the route or an object is not found
   */
  static notFound(message: string = "404 User Not Found"): Error {
    return new CustomErrorHandler(404, message);
  }

  /**
   * @param {string} message - accessing un-authorized route
   * @returns {Error} - returns error when trying to access authorized route without token
   */
  static unAuthorized(message: string = "unAuthorized"): Error {
    return new CustomErrorHandler(401, message);
  }

  /**
   * @param {string} message - Not found
   * @returns {Error} - returns error if any problem occurs in server or network
   */
  static serverError(message: string = "Internal Server Error"): Error {
    return new CustomErrorHandler(505, message);
  }
}

export default CustomErrorHandler;
