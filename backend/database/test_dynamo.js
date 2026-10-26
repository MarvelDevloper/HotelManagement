
const {
  PutCommand,
  GetCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const { dynamo, TABLES } = require("./dynamo");

async function testDynamoDB() {
  const roomId = `__connection_test__${Date.now()}`;

  try {
    // 1. Test write permission
    await dynamo.send(new PutCommand({
      TableName: TABLES.ROOMS,
      Item: {
        roomId,
        room_number: 0,
        room_type: "ConnectionTest",
        price: 0,
        status: "TEST"
      },
      ConditionExpression: "attribute_not_exists(roomId)"
    }));

    console.log("✅ WRITE successful");

    // 2. Test read permission
    const result = await dynamo.send(new GetCommand({
      TableName: TABLES.ROOMS,
      Key: { roomId }
    }));

    if (!result.Item) {
      throw new Error("Test item was not found");
    }

    console.log("✅ READ successful");

    // 3. Clean up test item
    await dynamo.send(new DeleteCommand({
      TableName: TABLES.ROOMS,
      Key: { roomId }
    }));

    console.log("✅ DELETE successful");
    console.log("🎉 DynamoDB CRUD permissions verified!");
  } catch (err) {
    // Attempt cleanup if the test item was created.
    try {
      await dynamo.send(new DeleteCommand({
        TableName: TABLES.ROOMS,
        Key: { roomId }
      }));
    } catch (_) {}

    console.error("❌ DynamoDB test failed:", err.name, err.message);
    process.exitCode = 1;
  }
}

testDynamoDB();
