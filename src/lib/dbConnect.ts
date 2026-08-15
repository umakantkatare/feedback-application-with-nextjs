import mongoose from "mongoose";
import dbConnect from "./dbConnect";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("db already connected!");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL || "");
    console.log("db conntected successfully!");
    console.log("db:", db);
    console.log("db connections:", db.connections);
    console.log("db state:", db.connections[0].readyState);
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log("db connection failed");
    process.exit(1);
  }
}

dbConnect();

export default dbConnect;
