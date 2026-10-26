/**
 * models/Room.js  –  DynamoDB Room helpers
 * Replaces the old Mongoose Room schema.
 *
 * Primary key: roomId  (String)  — set to String(room_number), e.g. "101"
 * This keeps booking → room relationships simple and human-readable.
 */

const {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");
const { dynamo, TABLES } = require("../database/dynamo");

const TABLE = TABLES.ROOMS;

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatRoom(item) {
  if (!item) return null;
  return {
    id: item.roomId,
    _id: item.roomId,
    roomId: item.roomId,
    room_number: item.room_number,
    room_type: item.room_type,
    price: item.price,
    status: item.status,
    image: item.image || "",
    description: item.description || "",
    capacity: item.capacity || "2 Guests",
    bed_type: item.bed_type || "1 King Bed",
    room_size: item.room_size || "380 sq ft",
    view_type: item.view_type || "City Skyline",
    amenities: item.amenities || "",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

// ─── CRUD ──────────────────────────────────────────────────────────────────

/** Get all rooms sorted by room_number ascending */
async function findAll() {
  const res = await dynamo.send(new ScanCommand({ TableName: TABLE }));
  return (res.Items || [])
    .map(formatRoom)
    .sort((a, b) => a.room_number - b.room_number);
}

/**
 * Find by roomId (primary key) OR by numeric room_number.
 * id can be "101" (room_number string) or a UUID.
 */
async function findById(id) {
  // Try primary key first
  const res = await dynamo.send(new GetCommand({
    TableName: TABLE,
    Key: { roomId: String(id) }
  }));
  if (res.Item) return formatRoom(res.Item);

  // Fallback: scan for room_number match (handles legacy numeric ids)
  const numId = Number(id);
  if (!isNaN(numId)) {
    const scan = await dynamo.send(new ScanCommand({
      TableName: TABLE,
      FilterExpression: "room_number = :n",
      ExpressionAttributeValues: { ":n": numId }
    }));
    return formatRoom(scan.Items?.[0] || null);
  }
  return null;
}

/** Find by room_number (unique) */
async function findByRoomNumber(roomNumber) {
  const num = Number(roomNumber);
  // roomId is String(room_number) so try direct key lookup first
  const res = await dynamo.send(new GetCommand({
    TableName: TABLE,
    Key: { roomId: String(num) }
  }));
  if (res.Item) return formatRoom(res.Item);

  // Fallback scan
  const scan = await dynamo.send(new ScanCommand({
    TableName: TABLE,
    FilterExpression: "room_number = :n",
    ExpressionAttributeValues: { ":n": num }
  }));
  return formatRoom(scan.Items?.[0] || null);
}

/** Create a room. roomId = String(room_number) for easy relationships. */
async function createRoom({
  room_number, room_type, price,
  status = "Available", image = "", description = "",
  capacity = "2 Guests", bed_type = "1 King Bed",
  room_size = "380 sq ft", view_type = "City Skyline", amenities = ""
}) {
  const now = new Date().toISOString();
  const item = {
    roomId: String(room_number),
    room_number: Number(room_number),
    room_type,
    price: Number(price),
    status,
    image,
    description,
    capacity,
    bed_type,
    room_size,
    view_type,
    amenities: Array.isArray(amenities) ? amenities.join(", ") : amenities,
    createdAt: now,
    updatedAt: now
  };
  await dynamo.send(new PutCommand({
    TableName: TABLE,
    Item: item,
    ConditionExpression: "attribute_not_exists(roomId)" // prevent duplicate room_number
  }));
  return formatRoom(item);
}

/** Update arbitrary fields on a room */
async function updateRoom(roomId, updateData) {
  const now = new Date().toISOString();
  const parts = ["updatedAt = :u"];
  const eav = { ":u": now };
  const ean = {};

  const ALLOWED = [
    "room_type", "price", "status", "image", "description",
    "capacity", "bed_type", "room_size", "view_type", "amenities"
  ];

  for (const key of ALLOWED) {
    if (updateData[key] !== undefined) {
      const placeholder = `:${key}`;
      const namePlaceholder = `#${key}`;
      let val = updateData[key];
      if (key === "amenities" && Array.isArray(val)) val = val.join(", ");
      if (key === "price") val = Number(val);
      parts.push(`${namePlaceholder} = ${placeholder}`);
      eav[placeholder] = val;
      ean[namePlaceholder] = key;
    }
  }

  const res = await dynamo.send(new UpdateCommand({
    TableName: TABLE,
    Key: { roomId: String(roomId) },
    UpdateExpression: "SET " + parts.join(", "),
    ExpressionAttributeValues: eav,
    ExpressionAttributeNames: Object.keys(ean).length ? ean : undefined,
    ConditionExpression: "attribute_exists(roomId)",
    ReturnValues: "ALL_NEW"
  }));
  return formatRoom(res.Attributes);
}

/** Update only the status field (used by booking controller) */
async function updateRoomStatus(roomId, status) {
  const now = new Date().toISOString();
  await dynamo.send(new UpdateCommand({
    TableName: TABLE,
    Key: { roomId: String(roomId) },
    UpdateExpression: "SET #s = :s, updatedAt = :u",
    ExpressionAttributeNames: { "#s": "status" },
    ExpressionAttributeValues: { ":s": status, ":u": now }
  }));
}

/** Delete a room */
async function deleteRoom(roomId) {
  await dynamo.send(new DeleteCommand({
    TableName: TABLE,
    Key: { roomId: String(roomId) },
    ConditionExpression: "attribute_exists(roomId)"
  }));
}

module.exports = { findAll, findById, findByRoomNumber, createRoom, updateRoom, updateRoomStatus, deleteRoom };
