const express = require("express");
const cors = require("cors");
const app = express();
// Routes
const userRoutes = require("./modules/User/routes/user.routes");
const errorController = require("./modules/Error/error.controller");
// Middlewares
app.use(express.json());
app.use(cors());

// Routes Middlewares
app.use("/api/v1/users", userRoutes);

app.use(errorController);
module.exports = app;
