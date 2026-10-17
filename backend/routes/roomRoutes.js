const express = require("express");

const router = express.Router();

const {
    createRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom
} = require("../controllers/roomController");


// CREATE ROOM
router.post("/", createRoom);


// GET ALL ROOMS
router.get("/", getRooms);


// GET SINGLE ROOM
router.get("/:id", getRoomById);


// UPDATE ROOM
router.put("/:id", updateRoom);


// DELETE ROOM
router.delete("/:id", deleteRoom);


module.exports = router;