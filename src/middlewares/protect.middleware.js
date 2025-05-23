const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const { getUserById } = require("../modules/User/models/user.model");

const protect = catchAsync(async (req, res, next) => {
  //1) Check the existence of token in the headers
  let token;
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(new AppError("Please login first", 401));
  }
  token = req.headers.authorization.split(" ")[1];

  //2) check the validation of token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("invalid token", 401));
  }
  //3) Check the user existence
  const existedUser = await getUserById(decoded.id);

  if (!existedUser) {
    return next(new AppError("User no longer exists", 404));
  }
  req.user = existedUser;
  next();
});

module.exports = {
  protect,
};
