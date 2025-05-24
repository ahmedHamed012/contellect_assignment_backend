const { omitProperties } = require("../../../utils/omitProperties");
const Contacts = require("../schema/contact.schema");
const mongoose = require("mongoose");
class ContactModel {
  constructor() {}

  /**
   * Creates a new contact with the provided contactRecord.
   *
   * @async
   * @param {Object} contactRecord - The contact object to create.
   * @throws {Error} If there is an error creating the contact.
   * @returns {Object} A user object with the created contact's data.
   */
  async createContact(contactRecord) {
    try {
      const contact = new Contacts(contactRecord);

      await contact.save();

      return omitProperties(contact.toObject(), ["password", "__v"]);
    } catch (error) {
      console.error("Error creating contact:", error);

      throw new Error("Error creating contact");
    }
  }
  //-----------------------------------------------------------------------------------------------------

  /**
   * Retrieves a list of all contacts that are not marked as deleted.
   *
   * @async
   * @throws {Error} If there is an error fetching all contacts.
   * @returns {Array} An array of contact objects.
   */

  async getAllContacts() {
    try {
      const contacts = await Contacts.find({ deleted: { $ne: true } });
      return contacts;
    } catch (error) {
      throw new Error("Error fetching all contacts");
    }
  }
  //-----------------------------------------------------------------------------------------------------

  /**
   * Retrieves a contact by their ID.
   *
   * @async
   * @param {string} id - The id of the contact to fetch.
   * @throws {Error} If the contact is not found.
   * @returns {Object} The contact object with the contact's data.
   */
  async getContactByCondition(condition) {
    try {
      const contact = await Contacts.findOne(condition);

      return contact;
    } catch (error) {
      throw new Error("Error fetching contact by id");
    }
  }
  //-----------------------------------------------------------------------------------------------------

  /**
   * Updates a contact with the provided id and updated contact fields.
   *
   * @async
   * @param {string} id - The id of the contact to update.
   * @param {Object} updatedContact - The contact object with the updated fields.
   * @throws {Error} If there is an error updating the contact.
   * @returns {Object} The contact object with the updated contact's data.
   */
  async updateContact(id, updatedContact) {
    try {
      const contact = await Contacts.findByIdAndUpdate(
        id,
        { $set: updatedContact },
        { new: true }
      );

      return contact;
    } catch (error) {
      throw new Error("Error updating contact");
    }
  }
  //-----------------------------------------------------------------------------------------------------

  /**
   * Soft deletes a contact by their ID.
   *
   * @async
   * @param {string} id - The id of the contact to soft delete.
   * @throws {Error} If there is an error soft deleting the contact.
   * @returns {Object} The contact object with the soft deleted contact's data.
   */
  async deleteContact(id) {
    try {
      console.log("Iam entered here", id);
      const contact = await Contacts.findByIdAndUpdate(
        id,
        { $set: { deleted: true, deletedAt: Date.now() } },
        { new: true }
      );
      return contact;
    } catch (error) {
      throw new Error("Error soft deleting contact");
    }
  }
}
//-----------------------------------------------------------------------------------------------------

module.exports = new ContactModel();
