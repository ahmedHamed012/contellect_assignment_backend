const express = require("express");
const { validateContact } = require("../../../middlewares/validate.middleware");
const {
  createContact,
  getContactsWithPaginationAndFilters,
  updateContactById,
  deleteContactById,
  getContactById,
} = require("../controller/contact.controller");
const { protect } = require("../../../middlewares/protect.middleware");
const router = express.Router();

// Protecting the routes
router.use(protect);

// Routes
router.post("/", validateContact, createContact);
router.get("/all", getContactsWithPaginationAndFilters);
router.get("/:id", getContactById);
router.patch("/:id", updateContactById);
router.delete("/:id", deleteContactById);

module.exports = router;
