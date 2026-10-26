/**
 * models/User.js  –  DynamoDB User helpers
 * Replaces the old Mongoose User schema.
 * Exports plain async functions used by userController.js.
 */

const { v4: uuidv4 } = require("uuid");
const {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand
} = require("@aws-sdk/lib-dynamodb");
const { dynamo, TABLES } = require("../database/dynamo");

const TABLE = TABLES.USERS;

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Strip password before sending to client */
function publicUser(item) {
  if (!item) return null;
  const { password, ...safe } = item;
  return {
    id: item.userId,
    _id: item.userId,
    userId: item.userId,
    name: item.name,
    email: item.email,
    role: item.role,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

// ─── CRUD ──────────────────────────────────────────────────────────────────

/** Find one user by email (full scan – Users table is small) */
async function findByEmail(email) {
  const res = await dynamo.send(new ScanCommand({
    TableName: TABLE,
    FilterExpression: "email = :e",
    ExpressionAttributeValues: { ":e": email.toLowerCase().trim() }
  }));
  return res.Items?.[0] || null;
}

/** Find user by userId (primary key lookup) */
async function findById(userId) {
  const res = await dynamo.send(new GetCommand({
    TableName: TABLE,
    Key: { userId }
  }));
  return res.Item || null;
}

/** Get all users (no passwords) */
async function findAll() {
  const res = await dynamo.send(new ScanCommand({ TableName: TABLE }));
  return (res.Items || [])
    .map(publicUser)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

/** Create a new user */
async function createUser({ name, email, password, role = "guest" }) {
  const now = new Date().toISOString();
  const item = {
    userId: uuidv4(),
    name,
    email: email.toLowerCase().trim(),
    password,
    role,
    createdAt: now,
    updatedAt: now
  };
  await dynamo.send(new PutCommand({ TableName: TABLE, Item: item }));
  return item;
}

/** Update name and/or role */
async function updateUser(userId, { name, role }) {
  const now = new Date().toISOString();
  const parts = [];
  const eav = { ":u": now };
  const ean = {};

  if (name !== undefined) { parts.push("#n = :name"); eav[":name"] = name; ean["#n"] = "name"; }
  if (role !== undefined) { parts.push("#r = :role"); eav[":role"] = role; ean["#r"] = "role"; }
  parts.push("updatedAt = :u");

  const res = await dynamo.send(new UpdateCommand({
    TableName: TABLE,
    Key: { userId },
    UpdateExpression: "SET " + parts.join(", "),
    ExpressionAttributeValues: eav,
    ExpressionAttributeNames: Object.keys(ean).length ? ean : undefined,
    ConditionExpression: "attribute_exists(userId)",
    ReturnValues: "ALL_NEW"
  }));
  return publicUser(res.Attributes);
}

/** Delete user by userId */
async function deleteUser(userId) {
  await dynamo.send(new DeleteCommand({
    TableName: TABLE,
    Key: { userId },
    ConditionExpression: "attribute_exists(userId)"
  }));
}

module.exports = { findByEmail, findById, findAll, createUser, updateUser, deleteUser, publicUser };
