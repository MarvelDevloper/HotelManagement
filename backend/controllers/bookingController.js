/**
 * controllers/bookingController.js  –  DynamoDB version
 * All Mongoose queries replaced with DynamoDB Booking + Room model helpers.
 * API routes and response shapes are unchanged.
 */

const BookingModel = require("../models/Booking");
const RoomModel = require("../models/Room");

// ─── CREATE BOOKING ────────────────────────────────────────────────────────
exports.createBooking = async (req, res) => {
  try {
    const { guest_name, email, room_id, check_in, check_out } = req.body;

    if (!guest_name || !email || !room_id || !check_in || !check_out) {
      return res.status(400).json({ message: "All booking fields are required." });
    }

    if (check_in >= check_out) {
      return res.status(400).json({ message: "Check-out date must be strictly after check-in date" });
    }

    // Find room by roomId (= String(room_number)) or numeric room_number
    const room = await RoomModel.findById(room_id);
    if (!room) {
      return res.status(404).json({ message: "Room not found in database" });
    }

    if (room.status !== "Available") {
      return res.status(400).json({ message: "Room is not available for booking" });
    }

    // Create booking — store denormalized room fields so GET /bookings is fast
    const newBooking = await BookingModel.createBooking({
      guest_name,
      email,
      roomId: room.roomId,
      room_number: room.room_number,
      room_type: room.room_type,
      price: room.price,
      check_in,
      check_out
    });

    // Mark room as Booked
    await RoomModel.updateRoomStatus(room.roomId, "Booked");

    res.status(201).json({
      message: "Booking created successfully in DynamoDB",
      booking_id: newBooking.bookingId,
      booking: {
        id: newBooking.bookingId,
        _id: newBooking.bookingId,
        guest_name: newBooking.guest_name,
        email: newBooking.email,
        room_id: newBooking.roomId,
        room_number: newBooking.room_number,
        room_type: newBooking.room_type,
        price: newBooking.price,
        check_in: newBooking.check_in,
        check_out: newBooking.check_out,
        status: newBooking.status
      }
    });
  } catch (error) {
    console.error("Error in createBooking:", error);
    res.status(500).json({ message: "Booking creation failed", error: error.message });
  }
};

// ─── GET ALL BOOKINGS ──────────────────────────────────────────────────────
exports.getBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.findAll();
    res.json(bookings);
  } catch (error) {
    console.error("Error in getBookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// ─── GET SINGLE BOOKING ────────────────────────────────────────────────────
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error in getBookingById:", error);
    res.status(500).json({ message: "Failed to fetch booking", error: error.message });
  }
};

// ─── UPDATE BOOKING STATUS ─────────────────────────────────────────────────
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let updatedBooking;
    try {
      updatedBooking = await BookingModel.updateBookingStatus(id, status);
    } catch (condErr) {
      if (condErr.name === "ConditionalCheckFailedException") {
        return res.status(404).json({ message: "Booking not found" });
      }
      throw condErr;
    }

    // Keep room status in sync
    if (updatedBooking?.room_id) {
      if (status === "Cancelled" || status === "Completed") {
        await RoomModel.updateRoomStatus(updatedBooking.room_id, "Available");
      } else if (status === "Confirmed") {
        await RoomModel.updateRoomStatus(updatedBooking.room_id, "Booked");
      }
    }

    res.json({ message: "Booking updated successfully in DynamoDB", booking: updatedBooking });
  } catch (error) {
    console.error("Error in updateBooking:", error);
    res.status(500).json({ message: "Failed to update booking", error: error.message });
  }
};

// ─── DELETE BOOKING ────────────────────────────────────────────────────────
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    let deleted;
    try {
      deleted = await BookingModel.deleteBooking(id);
    } catch (condErr) {
      if (condErr.name === "ConditionalCheckFailedException") {
        return res.status(404).json({ message: "Booking not found to delete" });
      }
      throw condErr;
    }

    // Free up the room if booking was active
    if (deleted?.roomId && deleted?.status !== "Cancelled") {
      await RoomModel.updateRoomStatus(deleted.roomId, "Available");
    }

    res.json({ message: "Booking deleted successfully from DynamoDB" });
  } catch (error) {
    console.error("Error in deleteBooking:", error);
    res.status(500).json({ message: "Failed to delete booking", error: error.message });
  }
};
