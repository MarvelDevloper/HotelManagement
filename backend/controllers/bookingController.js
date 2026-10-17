const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Room = require("../models/Room");

// CREATE BOOKING IN MONGODB
exports.createBooking = async (req, res) => {
  try {
    const { guest_name, email, room_id, check_in, check_out } = req.body;

    if (!guest_name || !email || !room_id || !check_in || !check_out) {
      return res.status(400).json({ message: "All booking fields are required." });
    }

    // Check dates
    if (check_in >= check_out) {
      return res.status(400).json({
        message: "Check-out date must be strictly after check-in date"
      });
    }

    // Find room by ObjectId or room_number
    let room = null;
    if (mongoose.Types.ObjectId.isValid(room_id)) {
      room = await Room.findById(room_id);
    }
    if (!room && !isNaN(Number(room_id))) {
      room = await Room.findOne({ room_number: Number(room_id) });
    }

    if (!room) {
      return res.status(404).json({ message: "Room not found in database" });
    }

    if (room.status !== "Available") {
      return res.status(400).json({ message: "Room is not available for booking" });
    }

    // Create Booking
    const newBooking = await Booking.create({
      guest_name,
      email,
      room_id: room._id,
      check_in,
      check_out,
      status: "Confirmed"
    });

    // Update room status to Booked
    room.status = "Booked";
    await room.save();

    res.status(201).json({
      message: "Booking created successfully in MongoDB",
      booking_id: newBooking._id,
      booking: newBooking
    });
  } catch (error) {
    console.error("Error in createBooking:", error);
    res.status(500).json({ message: "Booking creation failed", error: error.message });
  }
};

// GET ALL BOOKINGS FROM MONGODB
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("room_id").sort({ createdAt: -1 });

    // Format for 100% frontend compatibility (flat fields like MySQL JOIN)
    const formattedBookings = bookings.map((b) => {
      const room = b.room_id || {};
      return {
        id: b._id.toString(),
        _id: b._id.toString(),
        guest_name: b.guest_name,
        email: b.email,
        room_id: room._id ? room._id.toString() : b.room_id?.toString(),
        room_number: room.room_number || "N/A",
        room_type: room.room_type || "Deluxe",
        price: room.price || 0,
        check_in: b.check_in,
        check_out: b.check_out,
        status: b.status
      };
    });

    res.json(formattedBookings);
  } catch (error) {
    console.error("Error in getBookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// GET SINGLE BOOKING
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id).populate("room_id");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const room = booking.room_id || {};
    res.json({
      id: booking._id.toString(),
      _id: booking._id.toString(),
      guest_name: booking.guest_name,
      email: booking.email,
      room_id: room._id ? room._id.toString() : booking.room_id?.toString(),
      room_number: room.room_number || "N/A",
      room_type: room.room_type || "Deluxe",
      price: room.price || 0,
      check_in: booking.check_in,
      check_out: booking.check_out,
      status: booking.status
    });
  } catch (error) {
    console.error("Error in getBookingById:", error);
    res.status(500).json({ message: "Failed to fetch booking", error: error.message });
  }
};

// UPDATE BOOKING STATUS
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    // If cancelled or completed, free up the room
    if ((status === "Cancelled" || status === "Completed") && booking.room_id) {
      await Room.findByIdAndUpdate(booking.room_id, { status: "Available" });
    } else if (status === "Confirmed" && booking.room_id) {
      await Room.findByIdAndUpdate(booking.room_id, { status: "Booked" });
    }

    res.json({
      message: "Booking updated successfully in MongoDB",
      booking
    });
  } catch (error) {
    console.error("Error in updateBooking:", error);
    res.status(500).json({ message: "Failed to update booking", error: error.message });
  }
};

// DELETE BOOKING
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found to delete" });
    }

    // Free up room if booking is deleted
    if (booking.room_id && booking.status !== "Cancelled") {
      await Room.findByIdAndUpdate(booking.room_id, { status: "Available" });
    }

    res.json({ message: "Booking deleted successfully from MongoDB" });
  } catch (error) {
    console.error("Error in deleteBooking:", error);
    res.status(500).json({ message: "Failed to delete booking", error: error.message });
  }
};