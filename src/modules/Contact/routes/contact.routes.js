const express = require("express");
const { validateContact } = require("../../../middlewares/validate.middleware");
const {
  createContact,
  getContactsWithPaginationAndFilters,
  updateContactById,
  deleteContactById,
  getContactById,
} = require("../controller/contact.controller");
const router = express.Router();

router.post("/", validateContact, createContact);
router.get("/all", getContactsWithPaginationAndFilters);
router.get("/:id", getContactById);
router.patch("/:id", updateContactById);
router.delete("/:id", deleteContactById);

module.exports = router;
