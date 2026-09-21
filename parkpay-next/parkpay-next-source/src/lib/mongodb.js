/**
 * MongoDB connection helper.
 *
 * Reuses a single client/connection across hot-reloads in dev and across
 * warm serverless invocations in production, per the standard Next.js +
 * MongoDB pattern (avoids exhausting connections).
 *
 * Requires MONGODB_URI and MONGODB_DB in the environment — see .env.example.
 * There is no zero-setup in-memory fallback for MongoDB (unlike the earlier
 * SQLite default) because a real Firebase project is already required for
 * auth, so local dev assumes a real MongoDB instance (local `mongod`,
 * Docker, or a free MongoDB Atlas cluster) is available too.
 *
 * The connection is established lazily (only when getDb() is first called,
 * not at module import time) so the app can still build without real
 * credentials present.
 */
import { MongoClient } from "mongodb";

let clientPromise;

function getClientPromise() {
  if (clientPromise) return clientPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable — see .env.example");
  }

  if (process.env.NODE_ENV === "development") {
    // Preserve the client across module reloads caused by HMR in dev.
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = new MongoClient(uri).connect();
  }
  return clientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB || "parkpay");
}
