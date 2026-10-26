/**
 * controllers/roomController.js  –  DynamoDB version
 * All Mongoose queries replaced with DynamoDB Room model helpers.
 * API routes and response shapes are unchanged.
 */

const RoomModel = require("../models/Room");

// ─── CREATE ROOM ───────────────────────────────────────────────────────────
exports.createRoom = async (req, res) => {
  try {
    const {
      room_number, room_type, price,
      status = "Available", image = "", description = "",
      capacity = "2 Guests", bed_type = "1 King Bed",
      room_size = "380 sq ft", view_type = "City Skyline", amenities = ""
    } = req.body;

    if (!room_number || !room_type || !price) {
      return res.status(400).json({ message: "room_number, room_type, and price are required." });
    }

    // Check if room number already exists
    const existing = await RoomModel.findByRoomNumber(room_number);
    if (existing) {
      return res.status(400).json({ message: `Room #${room_number} already exists in database.` });
    }

    let newRoom;
    try {
      newRoom = await RoomModel.createRoom({
        room_number, room_type, price, status,
        image, description, capacity, bed_type,
        room_size, view_type, amenities
      });
    } catch (condErr) {
      if (condErr.name === "ConditionalCheckFailedException") {
        return res.status(400).json({ message: `Room #${room_number} already exists in database.` });
      }
      throw condErr;
    }

    res.status(201).json({
      message: "Room created successfully in DynamoDB",
      room_id: newRoom.roomId,
      room: newRoom
    });
  } catch (error) {
    console.error("Error in createRoom:", error);
    res.status(500).json({ message: "Failed to create room", error: error.message });
  }
};

// ─── GET ALL ROOMS ─────────────────────────────────────────────────────────
exports.getRooms = async (req, res) => {
  try {
    const rooms = await RoomModel.findAll();
    res.json(rooms);
  } catch (error) {
    console.error("Error in getRooms:", error);
    res.status(500).json({ message: "Failed to fetch rooms", error: error.message });
  }
};

// ─── GET SINGLE ROOM ───────────────────────────────────────────────────────
exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomModel.findById(id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    console.error("Error in getRoomById:", error);
    res.status(500).json({ message: "Failed to fetch room", error: error.message });
  }
};

// ─── UPDATE ROOM ───────────────────────────────────────────────────────────
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    let updatedRoom;
    try {
      updatedRoom = await RoomModel.updateRoom(id, updateData);
    } catch (condErr) {
      if (condErr.name === "ConditionalCheckFailedException") {
        return res.status(404).json({ message: "Room not found to update" });
      }
      throw condErr;
    }

    res.json({ message: "Room updated successfully in DynamoDB", room: updatedRoom });
  } catch (error) {
    console.error("Error in updateRoom:", error);
    res.status(500).json({ message: "Failed to update room", error: error.message });
  }
};

// ─── DELETE ROOM ───────────────────────────────────────────────────────────
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure room exists before deleting
    const room = await RoomModel.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found to delete" });
    }

    await RoomModel.deleteRoom(room.roomId);
    res.json({ message: "Room deleted successfully from DynamoDB" });
  } catch (error) {
    console.error("Error in deleteRoom:", error);
    res.status(500).json({ message: "Failed to delete room", error: error.message });
  }
};
