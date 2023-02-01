import express from "express";
import passport from "passport";
import {
  deleteUser,
  getAllUsers,
  getUser,
} from "../../controllers/admin/admin.Role";
import admin from "../../middleware/admin";

const UserManagementRouterByAdmin = express.Router();

UserManagementRouterByAdmin.get(
  "/get-all-users",
  [passport.authenticate("jwt-refresh"), admin],
  getAllUsers // get all users
)
  .get("/get-user/:id", [passport.authenticate("jwt-refresh"), admin], getUser) // get single user
  .delete(
    "/delete-user",
    [passport.authenticate("jwt-access"), admin],
    deleteUser
  ); // delete user

export default UserManagementRouterByAdmin;
