const catchAsync = require("../../../utils/catchAsync");
const contactModel = require("../model/contact.model");
const Response = require("../../../utils/response");
const AppError = require("../../../utils/appError");
const paginate = require("../../../utils/paginate");
const Contact = require("../schema/contact.schema");
/**
 * Creates a new contact using the provided request body data.
 *
 * @function
 * @async
 * @param {import('express').Request} req - Express request object containing contact details in the body.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with the created contact data and a success message.
 */
const createContact = catchAsync(async (req, res, next) => {
  const { name, phone, address, notes } = req.body;

  // Check if the contact with the phone number already exists
  const existingContact = await contactModel.getContactByCondition({ phone });
  if (existingContact) {
    return next(
      new AppError("Contact with this phone number already exists", 400)
    );
  }

  const newContact = await contactModel.createContact({
    name,
    phone,
    address,
    notes,
  });

  Response(res, "Contact created successfully", 201, newContact);
});
//-----------------------------------------------------------------------------------------------------
/**
 * Controller to fetch all contacts.
 *
 * @function
 * @async
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
const getContactsWithPaginationAndFilters = catchAsync(
  async (req, res, next) => {
    const { page, limit, name, phone, address } = req.query;

    const filters = { deleted: { $ne: true } };
    if (name) filters.name = { $regex: name, $options: "i" };
    if (phone) filters.phone = { $regex: phone, $options: "i" };
    if (address) filters.address = { $regex: address, $options: "i" };

    const paginatedContacts = await paginate(Contact, filters, {
      page,
      limit,
      sort: { createdAt: -1 },
    });

    res.status(200).json(paginatedContacts);
  }
);
//-----------------------------------------------------------------------------------------------------
/**
 * Retrieves a contact by its ID from the request parameters.
 * Sends a response with the contact data if found.
 *
 * @function
 * @async
 * @param {import('express').Request} req - Express request object containing the contact ID in params.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with the contact data.
 */
const getContactById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const contact = await checkContactExistenceById(id);

  Response(res, "Contact fetched successfully", 200, contact);
});
//-----------------------------------------------------------------------------------------------------
/**
 * Updates an existing contact with the provided fields.
 *
 * @async
 * @function updateContact
 * @param {import('express').Request} req - Express request object containing contact ID in params and updated fields in body.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with the updated contact data.
 */
const updateContactById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, phone, address, notes } = req.body;

  let updatedFields = {};
  if (name) updatedFields.name = name;
  if (phone) updatedFields.phone = phone;
  if (address) updatedFields.address = address;
  if (notes) updatedFields.notes = notes;

  await checkContactExistenceById(id);

  const updatedContact = await contactModel.updateContact(id, updatedFields);

  Response(res, "Contact updated successfully", 200, updatedContact);
});
//-----------------------------------------------------------------------------------------------------
/**
 * Deletes a contact by its ID.
 *
 * @async
 * @function deleteContact
 * @param {import('express').Request} req - Express request object, expects `id` parameter in `req.params`.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Sends a 200 response with a success message upon successful deletion.
 */
const deleteContactById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await checkContactExistenceById(id);

  await contactModel.deleteContact(id);

  Response(res, "Contact deleted successfully", 200);
});
//-----------------------------------------------------------------------------------------------------
/**
 * A helper method to check the contact existence.
 *
 * @async
 * @param {string} id - The id of the contact to check.
 * @throws {AppError} If the contact is not found.
 */
const checkContactExistenceById = async (id) => {
  const contact = await contactModel.getContactByCondition({ _id: id });

  if (!contact) {
    throw new AppError("contact not found", 404);
  }

  return contact;
};
//-----------------------------------------------------------------------------------------------------
module.exports = {
  createContact,
  getContactsWithPaginationAndFilters,
  getContactById,
  updateContactById,
  deleteContactById,
};
