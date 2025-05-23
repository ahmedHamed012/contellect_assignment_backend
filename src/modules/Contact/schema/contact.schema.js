const { default: mongoose } = require("mongoose");

const contactModel = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: false },
  notes: { type: String, required: false },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", contactModel);
