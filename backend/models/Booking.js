/**
 * models/Booking.js  –  DynamoDB Booking helpers
 * Replaces the old Mongoose Booking schema.
 *
 * Primary key: bookingId  (UUID string)
 * roomId stored as String(room_number) so JOIN-style enrichment is trivial.
 */

const { v4: uuidv4 } = require("uuid");
const {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");
const { dynamo, TABLES } = require("../database/dynamo");

const TABLE = TABLES.BOOKINGS;

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatBooking(item, room = null) {
  if (!item) return null;
  return {
    id: item.bookingId,
    _id: item.bookingId,
    bookingId: item.bookingId,
    guest_name: item.guest_name,
    email: item.email,
    room_id: item.roomId,
    room_number: room?.room_number ?? item.room_number ?? "N/A",
    room_type: room?.room_type ?? item.room_type ?? "Deluxe",
    price: room?.price ?? item.price ?? 0,
    check_in: item.check_in,
    check_out: item.check_out,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

// ─── CRUD ──────────────────────────────────────────────────────────────────

/** Create a booking */
async function createBooking({ guest_name, email, roomId, room_number, room_type, price, check_in, check_out }) {
  const now = new Date().toISOString();
  const item = {
    bookingId: uuidv4(),
    guest_name,
    email: email.toLowerCase().trim(),
    roomId: String(roomId),        // links to Rooms table via roomId = String(room_number)
    room_number,
    room_type,
    price: Number(price),
    check_in,
    check_out,
    status: "Confirmed",
    createdAt: now,
    updatedAt: now
  };
  await dynamo.send(new PutCommand({ TableName: TABLE, Item: item }));
  return item;
}

/** Get all bookings sorted by createdAt descending */
async function findAll() {
  const res = await dynamo.send(new ScanCommand({ TableName: TABLE }));
  return (res.Items || [])
    .map((b) => formatBooking(b))
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

/** Get single booking by bookingId */
async function findById(bookingId) {
  const res = await dynamo.send(new GetCommand({
    TableName: TABLE,
    Key: { bookingId }
  }));
  return res.Item ? formatBooking(res.Item) : null;
}

/** Update booking status */
async function updateBookingStatus(bookingId, status) {
  const now = new Date().toISOString();
  const res = await dynamo.send(new UpdateCommand({
    TableName: TABLE,
    Key: { bookingId },
    UpdateExpression: "SET #s = :s, updatedAt = :u",
    ExpressionAttributeNames: { "#s": "status" },
    ExpressionAttributeValues: { ":s": status, ":u": now },
    ConditionExpression: "attribute_exists(bookingId)",
    ReturnValues: "ALL_NEW"
  }));
  return formatBooking(res.Attributes);
}

/** Delete a booking, returns the deleted item's roomId */
async function deleteBooking(bookingId) {
  const res = await dynamo.send(new DeleteCommand({
    TableName: TABLE,
    Key: { bookingId },
    ConditionExpression: "attribute_exists(bookingId)",
    ReturnValues: "ALL_OLD"
  }));
  return res.Attributes || null;
}

module.exports = { createBooking, findAll, findById, updateBookingStatus, deleteBooking };
