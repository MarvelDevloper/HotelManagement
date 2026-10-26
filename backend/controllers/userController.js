/**
 * controllers/userController.js  –  DynamoDB version
 * All Mongoose queries replaced with DynamoDB model helpers.
 * Authentication logic (bcrypt + JWT) is fully preserved.
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

// ─── REGISTER ──────────────────────────────────────────────────────────────
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "guest" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    // Check if email already registered
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.createUser({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User registered successfully in DynamoDB",
      user_id: newUser.userId
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// ─── LOGIN ─────────────────────────────────────────────────────────────────
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const secretKey = process.env.JWT_SECRET || "smart_hotel_default_secret_key";
    const token = jwt.sign(
      { id: user.userId, role: user.role },
      secretKey,
      { expiresIn: "24h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// ─── GET ALL USERS ─────────────────────────────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// ─── UPDATE USER ───────────────────────────────────────────────────────────
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;

    let updated;
    try {
      updated = await UserModel.updateUser(id, { name, role });
    } catch (condErr) {
      if (condErr.name === "ConditionalCheckFailedException") {
        return res.status(404).json({ message: "User not found to update" });
      }
      throw condErr;
    }

    res.json({ message: "User updated successfully in DynamoDB", user: updated });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};

// ─── DELETE USER ───────────────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      await UserModel.deleteUser(id);
    } catch (condErr) {
      if (condErr.name === "ConditionalCheckFailedException") {
        return res.status(404).json({ message: "User not found to delete" });
      }
      throw condErr;
    }

    res.json({ message: "User deleted successfully from DynamoDB" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};
