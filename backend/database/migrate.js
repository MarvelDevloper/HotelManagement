
/**
 * MongoDB -> DynamoDB migration
 * Uses existing DynamoDB tables only.
 * MongoDB source data is never deleted.
 */

require("dotenv").config();

const mongoose = require("mongoose");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { DescribeTableCommand } = require("@aws-sdk/client-dynamodb");
const { dynamo, rawClient, TABLES } = require("./dynamo");

// MongoDB source schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
}, { timestamps: true });

const roomSchema = new mongoose.Schema({
  room_number: Number,
  room_type: String,
  price: Number,
  status: String,
  image: String,
  description: String,
  capacity: String,
  bed_type: String,
  room_size: String,
  view_type: String,
  amenities: String
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  guest_name: String,
  email: String,
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MigRoom"
  },
  check_in: String,
  check_out: String,
  status: String
}, { timestamps: true });

const MigUser = mongoose.model("MigUser", userSchema, "users");
const MigRoom = mongoose.model("MigRoom", roomSchema, "rooms");
const MigBooking = mongoose.model("MigBooking", bookingSchema, "bookings");

function isoDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime())
    ? new Date().toISOString()
    : date.toISOString();
}

// Confirm that the manually created tables exist.
async function ensureTables() {
  for (const tableName of Object.values(TABLES)) {
    const result = await rawClient.send(
      new DescribeTableCommand({ TableName: tableName })
    );

    if (result.Table?.TableStatus !== "ACTIVE") {
      throw new Error(`Table ${tableName} is not ACTIVE`);
    }

    console.log(`Verified table: ${tableName}`);
  }
}

// Insert only if the primary key doesn't already exist.
async function safePut(tableName, keyName, item) {
  try {
    await dynamo.send(new PutCommand({
      TableName: tableName,
      Item: item,
      ConditionExpression: "attribute_not_exists(#pk)",
      ExpressionAttributeNames: { "#pk": keyName }
    }));

    return true;
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      return false;
    }
    throw err;
  }
}

async function migrate() {
  const mongoUri = process.env.MONGO_URI || process.env.DB_URL;

  if (!mongoUri || mongoUri.includes("YOUR_MONGODB")) {
    throw new Error("Configure a valid MONGO_URI in backend/.env");
  }

  try {
    console.log("\n=== Smart Hotel Migration ===");
    console.log("Source: MongoDB");
    console.log("Destination region:", process.env.AWS_REGION || "us-east-1");
    console.log("Destination tables:", TABLES.USERS, TABLES.ROOMS, TABLES.BOOKINGS);

    console.log("\nConnecting to MongoDB...");
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log("MongoDB connected.");

    await ensureTables();

    const users = await MigUser.find().lean();
    const rooms = await MigRoom.find().lean();
    const bookings = await MigBooking.find()
      .populate("room_id")
      .lean();

    console.log(
      `\nMongoDB source records: ${users.length} users, ` +
      `${rooms.length} rooms, ${bookings.length} bookings`
    );

    // USERS
    let usersInserted = 0;
    let usersSkipped = 0;

    console.log("\nMigrating users...");

    for (const user of users) {
      const item = {
        userId: String(user._id),
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role || "guest",
        createdAt: isoDate(user.createdAt),
        updatedAt: isoDate(user.updatedAt)
      };

      if (await safePut(TABLES.USERS, "userId", item)) {
        usersInserted++;
      } else {
        usersSkipped++;
      }
    }

    // ROOMS
    let roomsInserted = 0;
    let roomsSkipped = 0;

    console.log("\nMigrating rooms...");

    // MongoDB ObjectId -> DynamoDB room information
    const roomMap = new Map();
    const roomNumbers = new Set();

    for (const room of rooms) {
      const roomNumber = Number(room.room_number);

      if (!Number.isFinite(roomNumber)) {
        throw new Error(`Invalid room_number in MongoDB room ${room._id}`);
      }

      if (roomNumbers.has(roomNumber)) {
        throw new Error(`Duplicate room number ${roomNumber}; migration stopped.`);
      }
      roomNumbers.add(roomNumber);

      const mappedRoom = {
        roomId: String(roomNumber),
        room_number: roomNumber,
        room_type: room.room_type,
        price: room.price,
        status: room.status || "Available",
        image: room.image || "",
        description: room.description || "",
        capacity: room.capacity || "2 Guests",
        bed_type: room.bed_type || "1 King Bed",
        room_size: room.room_size || "380 sq ft",
        view_type: room.view_type || "City Skyline",
        amenities: room.amenities || "",
        createdAt: isoDate(room.createdAt),
        updatedAt: isoDate(room.updatedAt)
      };

      roomMap.set(String(room._id), mappedRoom);

      if (await safePut(TABLES.ROOMS, "roomId", mappedRoom)) {
        roomsInserted++;
      } else {
        roomsSkipped++;
      }
    }

    // BOOKINGS
    let bookingsInserted = 0;
    let bookingsSkipped = 0;
    let bookingsUnresolved = 0;

    console.log("\nMigrating bookings...");

    for (const booking of bookings) {
      const roomRef = booking.room_id;

      const populatedRoom =
        roomRef &&
        typeof roomRef === "object" &&
        roomRef.room_number !== undefined
          ? roomRef
          : null;

      const originalRoomObjectId = populatedRoom
        ? String(populatedRoom._id)
        : roomRef
          ? String(roomRef)
          : null;

      const mappedRoom = originalRoomObjectId
        ? roomMap.get(originalRoomObjectId)
        : null;

      if (!mappedRoom) {
        console.warn(
          `Skipping booking ${booking._id}: its room reference could not be resolved.`
        );
        bookingsUnresolved++;
        continue;
      }

      const item = {
        bookingId: String(booking._id),
        guest_name: booking.guest_name,
        email: booking.email,
        roomId: mappedRoom.roomId,
        room_number: mappedRoom.room_number,
        room_type: mappedRoom.room_type || "Deluxe",
        price: Number(mappedRoom.price || 0),
        check_in: booking.check_in,
        check_out: booking.check_out,
        status: booking.status || "Confirmed",
        createdAt: isoDate(booking.createdAt),
        updatedAt: isoDate(booking.updatedAt)
      };

      if (await safePut(TABLES.BOOKINGS, "bookingId", item)) {
        bookingsInserted++;
      } else {
        bookingsSkipped++;
      }
    }

    console.log("\n=== Migration Summary ===");
    console.log(`Users:    ${usersInserted} inserted, ${usersSkipped} skipped`);
    console.log(`Rooms:    ${roomsInserted} inserted, ${roomsSkipped} skipped`);
    console.log(
      `Bookings: ${bookingsInserted} inserted, ${bookingsSkipped} skipped, ` +
      `${bookingsUnresolved} unresolved`
    );

    console.log("\nMigration process completed.");
    console.log("Original MongoDB data was not deleted.");

    if (bookingsUnresolved > 0) {
      console.warn("Some bookings need room-reference investigation.");
    }

  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

migrate().catch((err) => {
  console.error("\nMigration failed:", err.message);
  process.exitCode = 1;
});
