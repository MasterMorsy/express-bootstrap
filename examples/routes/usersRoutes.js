const express = require("express");
const userRoutes = express();
const UserController = require("../modules/User/Features");

// Users Routes
userRoutes.post("/api/v1/users/register", UserController.register);
userRoutes.post("/api/v1/users", UserController.create);
userRoutes.post("/api/v1/users/login", UserController.login);
userRoutes.get("/api/v1/users", UserController.getAll);
userRoutes.put("/api/v1/users/:id", UserController.updateProfile);

module.exports = userRoutes;
