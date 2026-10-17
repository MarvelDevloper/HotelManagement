const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    guest_name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    check_in: {
      type: String,
      required: true
    },
    check_out: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Confirmed", "Completed", "Cancelled"],
      default: "Confirmed"
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  }
});

bookingSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Booking", bookingSchema);
