// /**
//  * db.js  –  DynamoDB table bootstrap + initial data seed
//  *
//  * Replaces the old MongoDB/Mongoose connection file.
//  * Creates the three DynamoDB tables if they do not exist, then seeds
//  * default rooms and admin/guest accounts when the tables are empty.
//  */

// require("dotenv").config();
// const bcrypt = require("bcrypt");
// const { v4: uuidv4 } = require("uuid");

// const {
//   CreateTableCommand,
//   DescribeTableCommand,
//   ResourceInUseException
// } = require("@aws-sdk/client-dynamodb");

// const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
// const { dynamo, rawClient, TABLES } = require("./dynamo");

// // ─── Table Definitions ─────────────────────────────────────────────────────

// const TABLE_DEFINITIONS = [
//   {
//     TableName: TABLES.USERS,
//     KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
//     AttributeDefinitions: [{ AttributeName: "userId", AttributeType: "S" }],
//     BillingMode: "PAY_PER_REQUEST"
//   },
//   {
//     TableName: TABLES.ROOMS,
//     KeySchema: [{ AttributeName: "roomId", KeyType: "HASH" }],
//     AttributeDefinitions: [{ AttributeName: "roomId", AttributeType: "S" }],
//     BillingMode: "PAY_PER_REQUEST"
//   },
//   {
//     TableName: TABLES.BOOKINGS,
//     KeySchema: [{ AttributeName: "bookingId", KeyType: "HASH" }],
//     AttributeDefinitions: [{ AttributeName: "bookingId", AttributeType: "S" }],
//     BillingMode: "PAY_PER_REQUEST"
//   }
// ];

// // ─── Wait for table to become ACTIVE ───────────────────────────────────────
// async function waitForTable(tableName, retries = 12, delayMs = 5000) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       const res = await rawClient.send(new DescribeTableCommand({ TableName: tableName }));
//       if (res.Table.TableStatus === "ACTIVE") return;
//     } catch (_) {}
//     await new Promise((r) => setTimeout(r, delayMs));
//   }
//   throw new Error(`Table ${tableName} did not become ACTIVE in time`);
// }

// // ─── Ensure tables exist ───────────────────────────────────────────────────
// async function ensureTables() {
//   for (const def of TABLE_DEFINITIONS) {
//     try {
//       await rawClient.send(new CreateTableCommand(def));
//       console.log(`✅ DynamoDB table created: ${def.TableName}`);
//       await waitForTable(def.TableName);
//     } catch (err) {
//       if (err.name === "ResourceInUseException" || err.__type?.includes("ResourceInUseException")) {
//         console.log(`ℹ️  Table already exists: ${def.TableName}`);
//       } else {
//         console.error(`❌ Failed to create table ${def.TableName}:`, err.message);
//         throw err;
//       }
//     }
//   }
// }

// // ─── Seed initial rooms ────────────────────────────────────────────────────
// const INITIAL_ROOMS = [
//   {
//     roomId: "101",
//     room_number: 101,
//     room_type: "Deluxe",
//     price: 3000,
//     status: "Available",
//     image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
//     description: "Elegant contemporary space featuring premium Egyptian cotton bedding, marble bathroom, and panoramic city views.",
//     capacity: "2 Guests",
//     bed_type: "1 King Bed",
//     room_size: "380 sq ft",
//     view_type: "City Skyline",
//     amenities: "High-speed Wi-Fi, Smart 4K TV, Espresso Machine, Rain Shower, Work Desk"
//   },
//   {
//     roomId: "102",
//     room_number: 102,
//     room_type: "Suite",
//     price: 5000,
//     status: "Available",
//     image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
//     description: "Spacious master suite featuring a private lounge, luxury jacuzzi tub, and floor-to-ceiling glass balconies.",
//     capacity: "3 Guests",
//     bed_type: "1 King + 1 Sofa Bed",
//     room_size: "560 sq ft",
//     view_type: "Ocean & Garden",
//     amenities: "Private Balcony, Jacuzzi Tub, Living Lounge, High-speed Wi-Fi, Complimentary Breakfast"
//   },
//   {
//     roomId: "103",
//     room_number: 103,
//     room_type: "Single",
//     price: 2000,
//     status: "Available",
//     image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
//     description: "Optimized for solo travelers and business professionals, offering serene soundproofing and ergonomic comfort.",
//     capacity: "1 Guest",
//     bed_type: "1 Queen Bed",
//     room_size: "260 sq ft",
//     view_type: "Courtyard View",
//     amenities: "High-speed Wi-Fi, Ergonomic Desk, Smart TV, Mini Fridge, En-suite Bath"
//   },
//   {
//     roomId: "104",
//     room_number: 104,
//     room_type: "Double",
//     price: 3500,
//     status: "Available",
//     image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
//     description: "Generous twin or double configuration ideal for partners or friends seeking premium comfort and relaxation.",
//     capacity: "2-3 Guests",
//     bed_type: "2 Queen Beds",
//     room_size: "420 sq ft",
//     view_type: "Poolside View",
//     amenities: "Twin Queen Beds, Pool View, High-speed Wi-Fi, Bathtub, Coffee Maker"
//   },
//   {
//     roomId: "105",
//     room_number: 105,
//     room_type: "Luxury",
//     price: 7000,
//     status: "Available",
//     image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
//     description: "The ultimate in five-star opulence with private butler service, infinity plunge tub, and custom designer furnishings.",
//     capacity: "4 Guests",
//     bed_type: "2 King Beds",
//     room_size: "850 sq ft",
//     view_type: "Panoramic Penthouse",
//     amenities: "Butler Service, Penthouse View, Walk-in Wardrobe, Cocktail Bar, Sound System"
//   }
// ];

// async function seedInitialData() {
//   try {
//     // ── Rooms ──────────────────────────────────────────────────────────────
//     const roomScan = await dynamo.send(new ScanCommand({
//       TableName: TABLES.ROOMS,
//       Select: "COUNT"
//     }));

//     if (roomScan.Count === 0) {
//       console.log("🌱 Seeding initial rooms into DynamoDB...");
//       const now = new Date().toISOString();
//       for (const room of INITIAL_ROOMS) {
//         await dynamo.send(new PutCommand({
//           TableName: TABLES.ROOMS,
//           Item: { ...room, createdAt: now, updatedAt: now }
//         }));
//       }
//       console.log("✅ Initial 5 rooms seeded successfully into DynamoDB.");
//     }

//     // ── Users ──────────────────────────────────────────────────────────────
//     const userScan = await dynamo.send(new ScanCommand({
//       TableName: TABLES.USERS,
//       Select: "COUNT"
//     }));

//     if (userScan.Count === 0) {
//       console.log("🌱 Creating initial admin and guest accounts in DynamoDB...");
//       const now = new Date().toISOString();
//       const hashedAdminPwd = await bcrypt.hash("admin", 10);
//       const hashedGuestPwd = await bcrypt.hash("password123", 10);

//       const seedUsers = [
//         {
//           userId: uuidv4(),
//           name: "Admin Manager",
//           email: "admin@smarthotel.com",
//           password: hashedAdminPwd,
//           role: "admin",
//           createdAt: now,
//           updatedAt: now
//         },
//         {
//           userId: uuidv4(),
//           name: "Rahul Sharma",
//           email: "guest@example.com",
//           password: hashedGuestPwd,
//           role: "guest",
//           createdAt: now,
//           updatedAt: now
//         }
//       ];

//       for (const u of seedUsers) {
//         await dynamo.send(new PutCommand({ TableName: TABLES.USERS, Item: u }));
//       }
//       console.log("✅ Initial users created: admin@smarthotel.com / admin");
//     }
//   } catch (seedErr) {
//     console.error("Error seeding initial data:", seedErr.message);
//   }
// }

// // ─── Main bootstrap ────────────────────────────────────────────────────────
// async function connectDB() {
//   try {
//     console.log("🔗 Connecting to AWS DynamoDB in region:", process.env.AWS_REGION || "us-east-1");
//     await ensureTables();
//     await seedInitialData();
//     console.log("✅ DynamoDB ready.");
//   } catch (err) {
//     console.error("❌ DynamoDB bootstrap error:", err.message);
//     process.exit(1);
//   }
// }

// connectDB();

// module.exports = { dynamo, TABLES };




/**
 * database/db.js
 * Verifies that the existing DynamoDB tables are accessible.
 * Does not create tables or seed dummy data.
 */

require("dotenv").config();

const { DescribeTableCommand } = require("@aws-sdk/client-dynamodb");
const { dynamo, rawClient, TABLES } = require("./dynamo");

async function connectDB() {
  console.log(
    "Checking DynamoDB in region:",
    process.env.AWS_REGION || "us-east-1"
  );

  for (const tableName of Object.values(TABLES)) {
    const result = await rawClient.send(
      new DescribeTableCommand({ TableName: tableName })
    );

    if (result.Table?.TableStatus !== "ACTIVE") {
      throw new Error(`DynamoDB table ${tableName} is not ACTIVE`);
    }

    console.log(`Verified DynamoDB table: ${tableName}`);
  }

  console.log("DynamoDB tables verified successfully.");
}

connectDB().catch((err) => {
  console.error("DynamoDB verification failed:", err.message);
  process.exit(1);
});

module.exports = { dynamo, TABLES };
