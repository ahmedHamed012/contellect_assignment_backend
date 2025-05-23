const bcrypt = require("bcrypt");
const AppError = require("../../../utils/appError");
const jwt = require("jsonwebtoken");
class AuthModule {
  constructor() {}

  async verifyUserPassword(dbPassword, userPassword) {
    try {
      return await bcrypt.compare(userPassword, dbPassword);
    } catch (error) {
      throw new AppError("Something went wrong", 500);
    }
  }
  //-----------------------------------------------------------------------------------------------------
  generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };
}

module.exports = new AuthModule();
