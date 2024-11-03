import logger from "./utils/logger";

const { MongoClient, ServerApiVersion } = require("mongodb");
var {
  username,
  password,
  database: dbName,
  collection: collectionName,
  server,
} = require("./mongo.configs.json");
//  When testing use ./mongo.test.configs.json

const uri = `mongodb://${username}:${encodeURIComponent(
  password
)}@${server}/${dbName}?directConnection=true`;

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

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const collection = await database.collection(collectionName);
    try {
      const insertManyResult = await collection.insertOne({ wola: "testing" });
      debugger;
      console.log(
        `${insertManyResult.insertedCount} documents successfully inserted.\n`
      );
    } catch (err) {
      console.error(
        `Something went wrong trying to insert the new documents: ${err}\n`
      );
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

export async function initMongo() {
  const client = new MongoClient(uri);
  let database;
  // Connect the client to the server	(optional starting in v4.7)
  await client.connect();
  // Send a ping to confirm a successful connection

  database = await client.db(dbName);
  database.command({ ping: 1 });

  logger.info("Pinged your deployment. You successfully connected to MongoDB!");
  return {
    collection: await database.collection(collectionName),
    close: async () => {
      await client.close();
    },
  };
}

module.exports = initMongo;
