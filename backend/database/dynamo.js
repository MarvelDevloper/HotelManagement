// /**
//  * dynamo.js
//  * DynamoDB client singleton + table name constants.
//  * All credentials come from environment variables — never hardcoded.
//  */

// require("dotenv").config();
// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
// const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// // ─── Client ────────────────────────────────────────────────────────────────
// const rawClient = new DynamoDBClient({
//   region: process.env.AWS_REGION || "us-east-1",
//   // Credentials are picked up automatically from env vars:
//   //   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY (set in .env / EC2 IAM role)
//   credentials: process.env.AWS_ACCESS_KEY_ID
//     ? {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//       }
//     : undefined // falls back to EC2 instance profile / ECS task role
// });

// const dynamo = DynamoDBDocumentClient.from(rawClient, {
//   marshallOptions: {
//     removeUndefinedValues: true,
//     convertClassInstanceToMap: true
//   }
// });

// // ─── Table Names ───────────────────────────────────────────────────────────
// const TABLES = {
//   USERS:    process.env.DYNAMO_TABLE_USERS    || "SmartHotel_Users",
//   ROOMS:    process.env.DYNAMO_TABLE_ROOMS    || "SmartHotel_Rooms",
//   BOOKINGS: process.env.DYNAMO_TABLE_BOOKINGS || "SmartHotel_Bookings"
// };

// module.exports = { dynamo, rawClient, TABLES };


require("dotenv").config();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();
const sessionToken = process.env.AWS_SESSION_TOKEN?.trim();

const credentials =
  accessKeyId && secretAccessKey
    ? {
        accessKeyId,
        secretAccessKey,
        ...(sessionToken ? { sessionToken } : {})
      }
    : undefined;

const rawClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  ...(credentials ? { credentials } : {})
});

const dynamo = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true
  }
});

const TABLES = {
  USERS: process.env.DYNAMO_TABLE_USERS || "Users",
  ROOMS: process.env.DYNAMO_TABLE_ROOMS || "Rooms",
  BOOKINGS: process.env.DYNAMO_TABLE_BOOKINGS || "Bookings"
};

module.exports = { dynamo, rawClient, TABLES };
