const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

// REGISTER USER IN MONGODB
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "guest" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    // Check if email already registered
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User registered successfully in MongoDB",
      user_id: newUser._id
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// LOGIN USER IN MONGODB
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const secretKey = process.env.JWT_SECRET || "smart_hotel_default_secret_key";
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      secretKey,
      {
        expiresIn: "24h"
      }
    );

    res.json({
      message: "Login successful",
      token
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// GET ALL USERS FROM MONGODB
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    const formattedUsers = users.map((u) => ({
      id: u._id.toString(),
      _id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { name, role },
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found to update" });
    }

    res.json({
      message: "User updated successfully in MongoDB",
      user: updated
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found to delete" });
    }

    res.json({
      message: "User deleted successfully from MongoDB"
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};