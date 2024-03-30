import { MongoClient } from "mongodb";
require("dotenv").config();

let mongoClient: MongoClient;

const initializeMongo = async () => {
    try {
        console.log("Connecting to MongoDB...");
        mongoClient = new MongoClient(process.env.DATABASE_URI);
        await mongoClient.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Connecting to MongoDB failed: ", error);
    }
};

export { mongoClient, initializeMongo };
