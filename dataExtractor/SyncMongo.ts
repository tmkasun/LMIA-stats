import logger from "./utils/logger";

const { MongoClient, ServerApiVersion } = require("mongodb");
var { password, database: dbName, collection: collectionName } = require("./mongo.configs.json");

const uri = `mongodb+srv://nodeuser:${password}@ircc.3wwmdgf.mongodb.net/?retryWrites=true&w=majority`;

const test = async () => {
  let database;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    database = await client.db(dbName);
    database.command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const collection = await database.collection(collectionName);
    try {
      const insertManyResult = await collection.insertOne({ wola: "testing" });
      debugger;
      console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
    } catch (err) {
      console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

export async function initMongo() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  let database;
  // Connect the client to the server	(optional starting in v4.7)
  await client.connect();
  // Send a ping to confirm a successful connection

  database = await client.db(dbName);
  database.command({ ping: 1 });

  logger.info("Pinged your deployment. You successfully connected to MongoDB!");

  return await database.collection(collectionName);
}

module.exports = initMongo;
