// An error the business logic layer raises on purpose, carrying the HTTP
// status and message the route should send back.

class AppError extends Error {
  /**
   * @param {number} status - HTTP status code, e.g. 400 or 409.
   * @param {string} message - Safe to show to the user.
   * @param {string} [field] - The input field the error is about, if any.
   */
  constructor(status, message, field) {
    super(message);
    this.name = "AppError";
    this.status = status;
    if (field) this.field = field;
  }
}

module.exports = { AppError };
