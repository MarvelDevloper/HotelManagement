const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    room_number: {
      type: Number,
      required: true,
      unique: true
    },
    room_type: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["Available", "Booked"],
      default: "Available"
    },
    image: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    capacity: {
      type: String,
      default: "2 Guests"
    },
    bed_type: {
      type: String,
      default: "1 King Bed"
    },
    room_size: {
      type: String,
      default: "380 sq ft"
    },
    view_type: {
      type: String,
      default: "City Skyline"
    },
    amenities: {
      type: String,
      default: "High-speed Wi-Fi, Smart 4K TV, Espresso Machine"
    }
  },
  {
    timestamps: true
  }
);

roomSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  }
});

roomSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Room", roomSchema);
