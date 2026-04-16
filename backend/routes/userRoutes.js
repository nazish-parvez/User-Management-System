import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 👤 MY PROFILE (ALL LOGGED-IN USERS)
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

// 👑 ADMIN
router.post("/", protect, authorizeRoles("admin"), createUser);

// 👑 ADMIN + MANAGER
router.get("/", protect, authorizeRoles("admin", "manager"), getUsers);
router.get("/:id", protect, authorizeRoles("admin", "manager"), getUserById);
router.put("/:id", protect, authorizeRoles("admin", "manager"), updateUser);

// 👑 ADMIN ONLY
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;