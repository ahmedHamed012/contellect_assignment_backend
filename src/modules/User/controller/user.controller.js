const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const hashString = require("../../../utils/hashString");
const { omitProperties } = require("../../../utils/omitProperties");
const Response = require("../../../utils/response");
const userModel = require("../models/user.model");

//-----------------------------------------------------------------------------------------------------
/**
 * Creates a new user with the provided username and password.
 *
 * @async
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The outgoing response object.
 * @param {Function} next - The next middleware function in the stack.
 * @throws {AppError} If a user with the same username already exists.
 * @returns {Object} A JSON response with the created user's data and a 201 status code.
 */
const createUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const hashedPassword = await hashString(password);

  // Check if the user already exists
  const existingUser = await userModel.getUserByUsername(username);

  if (existingUser) {
    return next(new AppError("User with this username already exists", 400));
  }

  const userRecord = await userModel.createUser({
    username,
    password: hashedPassword,
  });

  Response(res, "User created successfully", 201, userRecord);
});
//-----------------------------------------------------------------------------------------------------
/**
 * Retrieves a user by their ID.
 *
 * @async
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The outgoing response object.
 * @param {Function} next - The next middleware function in the stack.
 * @throws {AppError} If the user is not found.
 * @returns {Object} A JSON response with the user's data and a 200 status code.
 */
const getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await checkUserExistenceById(id);

  Response(
    res,
    "User fetched successfully",
    200,
    omitProperties(user.toObject(), ["password", "__v"])
  );
});
//-----------------------------------------------------------------------------------------------------
/**
 * Retrieves a list of all users.
 *
 * @async
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The outgoing response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} A JSON response with the list of users and a 200 status code.
 */
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userModel.getAllUsers();
  Response(res, "Users fetched successfully", 200, users);
});
//-----------------------------------------------------------------------------------------------------
/**
 * Updates a user's data with the provided username and/or password.
 *
 * @async
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The outgoing response object.
 * @param {Function} next - The next middleware function in the stack.
 * @throws {AppError} If the user is not found.
 * @returns {Object} A JSON response with the updated user's data and a 200 status code.
 */
const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { username, password } = req.body;

  const user = await checkUserExistenceById(id);

  let updatedFields = {};
  if (username) updatedFields.username = username;
  if (password) updatedFields.password = await hashString(password);

  const updatedUser = await userModel.updateUser(id, updatedFields);

  Response(res, "User updated successfully", 200, updatedUser);
});
//-----------------------------------------------------------------------------------------------------
/**
 * Deletes a user by their ID.
 *
 * @async
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The outgoing response object.
 * @param {Function} next - The next middleware function in the stack.
 * @throws {AppError} If the user is not found.
 * @returns {Object} A JSON response with a success message and a 200 status code.
 */
const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await checkUserExistenceById(id);

  await userModel.deleteUser(id);

  Response(res, "User deleted successfully", 200, null);
});
//-----------------------------------------------------------------------------------------------------
/**
 * A helper method to check the user existence.
 *
 * @async
 * @param {string} id - The id of the user to check.
 * @throws {AppError} If the user is not found.
 */
const checkUserExistenceById = async (id) => {
  const user = await userModel.getUserById(id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  return user;
};
//-----------------------------------------------------------------------------------------------------

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
