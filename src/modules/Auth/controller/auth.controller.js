const catchAsync = require("../../../utils/catchAsync");
const Response = require("../../../utils/response");
const AppError = require("../../../utils/appError");
const { getUserByUsername } = require("../../User/models/user.model");
const { verifyUserPassword, generateToken } = require("../model/auth.model");

const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  //1) Check that the username and password is valid data
  if (!username || !password) {
    return next(
      new AppError("Please provide valid username and password", 400)
    );
  }

  //2) Check user exist with the same entered username and password
  const userExist = await getUserByUsername(username);
  if (!userExist) {
    return next(new AppError("User no longer exists", 404));
  }

  const passwordCorrect = await verifyUserPassword(
    userExist.password,
    password
  );

  if (!passwordCorrect)
    return next(new AppError("Wrong username or password", 404));

  const tokenPayload = {
    id: userExist._id,
    username: userExist.username,
  };
  const token = generateToken(tokenPayload);
  Response(res, "Login successfully", 200, {
    token: token,
  });
});

module.exports = {
  login,
};
