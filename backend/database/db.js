const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Room = require("../models/Room");
const User = require("../models/User");

const DB_URL =
  process.env.DB_URL ||
  process.env.MONGO_URI ||
  "mongodb+srv://<db_username>:dGdVi5RK6ltH5S6N@cluster0.hvuqiuw.mongodb.net/smart_hotel?retryWrites=true&w=majority";

if (DB_URL.includes("<db_username>")) {
  console.warn(
    "\n⚠️  [MongoDB Setup Notice]: Found '<db_username>' placeholder in DB_URL.\n" +
    "👉 Please open 'backend/.env' and replace '<db_username>' with your MongoDB Atlas database username.\n"
  );
}

mongoose
  .connect(DB_URL, {
    serverSelectionTimeoutMS: 5000
  })
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully to:", DB_URL.split("@")[1] || "MongoDB");
    await seedInitialData();
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    if (err.message.includes("bad auth") || DB_URL.includes("<db_username>")) {
      console.error(
        "💡 Tip: Ensure your MongoDB Atlas user exists in 'Database Access' and has read/write permissions."
      );
    }
  });

// Seed default rooms and admin if database is empty
async function seedInitialData() {
  try {
    const roomCount = await Room.countDocuments();
    if (roomCount === 0) {
      console.log("🌱 Seeding initial rooms into MongoDB...");
      const initialRooms = [
        {
          room_number: 101,
          room_type: "Deluxe",
          price: 3000,
          status: "Available",
          image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
          description: "Elegant contemporary space featuring premium Egyptian cotton bedding, marble bathroom, and panoramic city views.",
          capacity: "2 Guests",
          bed_type: "1 King Bed",
          room_size: "380 sq ft",
          view_type: "City Skyline",
          amenities: "High-speed Wi-Fi, Smart 4K TV, Espresso Machine, Rain Shower, Work Desk"
        },
        {
          room_number: 102,
          room_type: "Suite",
          price: 5000,
          status: "Available",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
          description: "Spacious master suite featuring a private lounge, luxury jacuzzi tub, and floor-to-ceiling glass balconies.",
          capacity: "3 Guests",
          bed_type: "1 King + 1 Sofa Bed",
          room_size: "560 sq ft",
          view_type: "Ocean & Garden",
          amenities: "Private Balcony, Jacuzzi Tub, Living Lounge, High-speed Wi-Fi, Complimentary Breakfast"
        },
        {
          room_number: 103,
          room_type: "Single",
          price: 2000,
          status: "Available",
          image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
          description: "Optimized for solo travelers and business professionals, offering serene soundproofing and ergonomic comfort.",
          capacity: "1 Guest",
          bed_type: "1 Queen Bed",
          room_size: "260 sq ft",
          view_type: "Courtyard View",
          amenities: "High-speed Wi-Fi, Ergonomic Desk, Smart TV, Mini Fridge, En-suite Bath"
        },
        {
          room_number: 104,
          room_type: "Double",
          price: 3500,
          status: "Available",
          image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
          description: "Generous twin or double configuration ideal for partners or friends seeking premium comfort and relaxation.",
          capacity: "2-3 Guests",
          bed_type: "2 Queen Beds",
          room_size: "420 sq ft",
          view_type: "Poolside View",
          amenities: "Twin Queen Beds, Pool View, High-speed Wi-Fi, Bathtub, Coffee Maker"
        },
        {
          room_number: 105,
          room_type: "Luxury",
          price: 7000,
          status: "Available",
          image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
          description: "The ultimate in five-star opulence with private butler service, infinity plunge tub, and custom designer furnishings.",
          capacity: "4 Guests",
          bed_type: "2 King Beds",
          room_size: "850 sq ft",
          view_type: "Panoramic Penthouse",
          amenities: "Butler Service, Penthouse View, Walk-in Wardrobe, Cocktail Bar, Sound System"
        }
      ];

      await Room.insertMany(initialRooms);
      console.log("✅ Initial 5 rooms seeded successfully into MongoDB.");
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("🌱 Creating initial admin and guest accounts...");
      const hashedAdminPassword = await bcrypt.hash("admin", 10);
      const hashedGuestPassword = await bcrypt.hash("password123", 10);

      await User.create([
        {
          name: "Admin Manager",
          email: "admin@smarthotel.com",
          password: hashedAdminPassword,
          role: "admin"
        },
        {
          name: "Rahul Sharma",
          email: "guest@example.com",
          password: hashedGuestPassword,
          role: "guest"
        }
      ]);
      console.log("✅ Initial users created: admin@smarthotel.com / admin");
    }
  } catch (seedErr) {
    console.error("Error seeding initial data:", seedErr.message);
  }
}

module.exports = mongoose.connection;