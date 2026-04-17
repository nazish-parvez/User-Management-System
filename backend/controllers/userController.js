import User from "../models/User.js";
import bcrypt from "bcryptjs";


export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      createdBy: req.user._id,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET ALL USERS (Admin/Manager + Pagination + Search)
export const getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const search = req.query.search || "";

    const query = {
      name: { $regex: search, $options: "i" }, // case-insensitive search
    };

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET SINGLE USER
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;
    user.updatedBy = req.user._id;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 DELETE (Deactivate User)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = "inactive"; // soft delete
    await user.save();

    res.json({ message: "User deactivated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 GET MY PROFILE
export const getMyProfile = async (req, res) => {
  try {
    // req.user comes from auth middleware
    const user = await User.findById(req.user._id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 UPDATE MY PROFILE
export const updateMyProfile = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update name
    user.name = name || user.name;

    // Update password (if provided)
    if (password) {
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.default.genSalt(10);
      user.password = await bcrypt.default.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};