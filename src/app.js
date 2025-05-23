const express = require("express");
const cors = require("cors");
const app = express();
// Routes
const userRoutes = require("./modules/User/routes/user.routes");
const contactRoutes = require("./modules/Contact/routes/contact.routes");
const authRoutes = require("./modules/Auth/routes/auth.routes");

const errorController = require("./modules/Error/error.controller");
// Middlewares
app.use(express.json());
app.use(cors());

// Routes Middlewares
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/contacts", contactRoutes);

app.use(errorController);
module.exports = app;
