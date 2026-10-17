const express = require("express");

const router = express.Router();

const {
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    deleteBooking
} = require("../controllers/bookingController");


// CREATE BOOKING
router.post("/", createBooking);


// GET ALL BOOKINGS
router.get("/", getBookings);


// GET SINGLE BOOKING
router.get("/:id", getBookingById);


// UPDATE BOOKING STATUS
router.put("/:id", updateBooking);


// DELETE BOOKING
router.delete("/:id", deleteBooking);


module.exports = router;