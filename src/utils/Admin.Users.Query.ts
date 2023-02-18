/**
 * @class UserQuery
 * @description - UserQuery is a class that helps with creating MongoDB queries for filtering, sorting and limiting user data
 * @summary - The UserQuery class is a class that helps with creating MongoDB queries for filtering, sorting and limiting user data. It has private properties query, sort and limit, which represent the MongoDB query object, sorting object and limit on the number of results, respectively. It also has private properties username and email, which are used for filtering the results of a User database query. The class has a constructor that accepts a reqQuery object and sets the values for the query, sort, limit, username, and email properties based on the values in the reqQuery object. The class has three public methods, getQuery, getSort, and getLimit, which return the query, sort, and limit properties, respectively.
 *
 * @property {Object} query - The MongoDB query object that represents the filter criteria.
 * @property {Object} sort - The MongoDB sort object that represents the sorting criteria.
 * @property {Number} limit - The limit on the number of results to return.
 *
 */

class UserQuery {
  /**
   * The query object to be executed.
   *
   * @property {Object} query
   * @private
   */
  private query: any = {};

  /**
   * The sorting object to be applied to the query.
   *
   * @property {Object} sort
   * @private
   */
  private sort: any = { createdAt: 1 };

  /**
   * The limit on the number of results returned by the query.
   *
   * @property {number} limit
   * @private
   */
  private limit = 100;

  /**
   * The username to be used for filtering the results of a User database query.
   *
   * @property {string} username
   * @private
   */
  private username: string | undefined;

  /**
   * The username to be used for filtering the results of a User database query.
   *
   * @property {string} email
   * @private
   */
  private email: string | undefined;

  /**
   * Creates an instance of UserQuery.
   *
   * @constructor
   * @param {Object} reqQuery - The query parameters to be used for filtering, sorting and limiting the results of a User database query.
   */
  constructor(reqQuery: any) {
    if (reqQuery.order === "latest") this.sort = { createdAt: -1 };
    if (reqQuery.limit) this.limit = Number(reqQuery.limit);
    if (reqQuery.username) this.username = reqQuery.username;
    if (reqQuery.email) this.email = reqQuery.email;

    switch (reqQuery.filter) {
      case "verified":
        this.query = { verified: true };
        break;
      case "non-verified":
        this.query = { verified: false };
        break;
      case "twoFactorEnabled":
        this.query = { twoFactorEnabled: true };
        break;
      case "twoFactorDisabled":
        this.query = { twoFactorEnabled: false };
        break;
    }

    /** This code is updating the query object to include filters for username and email if either of 
     *  them is specified in the reqQuery passed to the constructor. The spread operator (...) is used 
     *  to combine the existing query object with the new filters, ensuring that any existing filters are not lost. 
     *  The ...(this.username ? { username: this.username } : {}) syntax uses a ternary operator to only add the username filter 
     *  if this.username is truthy. The same logic applies to the email filter.
     *  This new query object will be used to filter the results of a User database query. */
    this.query = {
      ...this.query,
      ...(this.username ? { username: this.username } : {}),
      ...(this.email ? { email: this.email } : {}),
    };
  }

  /**
   * Gets the query object used for filtering the results of a User database query.
   *
   * @public
   * @method getQuery
   * @returns {Object} The query object used for filtering the results of a User database query.
   */
  getQuery(): any {
    return this.query;
  }

  /**
   * Gets the sort object used for sorting the results of a User database query.
   *
   * @public
   * @method getSort
   * @returns {Object} - The sort object used for sorting the results of a User database query.
   */
  getSort(): any {
    return this.sort;
  }

  /**
   * Gets the limit number used for limiting the number of results of a User database query.
   *
   * @public
   * @method getLimit
   * @returns {number} - The limit number used for limiting the number of results of a User database query.
   */
  getLimit(): number {
    return this.limit;
  }
}

export default UserQuery;
