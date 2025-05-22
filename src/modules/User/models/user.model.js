const { omitProperties } = require("../../../utils/omitProperties");
const Users = require("../schema/user.schema");
class UserModel {
  constructor() {
    this.users = [];
  }

  /**
   * Creates a new user with the provided userRecord.
   *
   * @async
   * @param {Object} userRecord - The user object to create.
   * @throws {Error} If there is an error creating the user.
   * @returns {Object} A user object with the created user's data.
   */
  async createUser(userRecord) {
    try {
      const users = new Users(userRecord);

      await users.save();

      return omitProperties(users.toObject(), ["password", "__v"]);
    } catch (error) {
      console.error("Error creating user:", error);

      throw new Error("Error creating user");
    }
  }
  //-----------------------------------------------------------------------------------------------------

  /**
   * Retrieves a list of all users that are not marked as deleted.
   *
   * @async
   * @throws {Error} If there is an error fetching all users.
   * @returns {Array} An array of user objects.
   */

  async getAllUsers() {
    try {
      const users = await Users.find(
        { deleted: { $ne: true } },
        { password: 0 }
      );
      return users;
    } catch (error) {
      throw new Error("Error fetching all users");
    }
  }
  //-----------------------------------------------------------------------------------------------------

  /**
   * Retrieves a user by their username.
   *
   * @async
   * @param {string} username - The username of the user to fetch.
   * @throws {Error} If the user is not found.
   * @returns {Object} The user object with the user's data.
   */
  async getUserByUsername(username) {
    try {
      const user = await Users.findOne({ username });

      return user;
    } catch (error) {
      throw new Error("Error fetching user by username");
    }
  }
  //-----------------------------------------------------------------------------------------------------

  /**
   * Retrieves a user by their ID.
   *
   * @async
   * @param {string} id - The id of the user to fetch.
   * @throws {Error} If the user is not found.
   * @returns {Object} The user object with the user's data.
   */
  async getUserById(id) {
    try {
      const user = await Users.findOne({ _id: id });

      return user;
    } catch (error) {
      throw new Error("Error fetching user by id");
    }
  }
  //-----------------------------------------------------------------------------------------------------

  /**
   * Updates a user with the provided id and updated user fields.
   *
   * @async
   * @param {string} id - The id of the user to update.
   * @param {Object} updatedUser - The user object with the updated fields.
   * @throws {Error} If there is an error updating the user.
   * @returns {Object} The user object with the updated user's data.
   */
  async updateUser(id, updatedUser) {
    try {
      const user = await Users.findByIdAndUpdate(
        id,
        { $set: updatedUser },
        { new: true }
      );

      return omitProperties(user.toObject(), ["password", "__v"]);
    } catch (error) {
      throw new Error("Error updating user");
    }
  }
  //-----------------------------------------------------------------------------------------------------

  /**
   * Soft deletes a user by their ID.
   *
   * @async
   * @param {string} id - The id of the user to soft delete.
   * @throws {Error} If there is an error soft deleting the user.
   * @returns {Object} The user object with the soft deleted user's data.
   */
  async deleteUser(id) {
    try {
      const user = await Users.findByIdAndUpdate(
        id,
        { $set: { deleted: true } },
        { new: true }
      );
      return user;
    } catch (error) {
      throw new Error("Error soft deleting user");
    }
  }
}
//-----------------------------------------------------------------------------------------------------

module.exports = new UserModel();
