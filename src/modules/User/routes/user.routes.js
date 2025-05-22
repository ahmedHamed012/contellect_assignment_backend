const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");

router.post("/", UserController.createUser);
router.get("/all", UserController.getAllUsers);
router.get("/:id", UserController.getUser);
router.patch("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
