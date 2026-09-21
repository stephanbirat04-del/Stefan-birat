/**
 * One-time setup script: creates (or reuses) a Firebase Auth user, provisions
 * a matching "staff_profiles" document in MongoDB with role=admin, and seeds
 * the default "settings" document if one doesn't exist yet.
 *
 * Unlike the previous FastAPI version, Next.js has no server-startup hook to
 * auto-seed an admin account on first run (API routes are stateless request
 * handlers, not a long-lived process) — so this script is run manually once
 * after you've created your Firebase and MongoDB projects:
 *
 *   node scripts/seed-admin.js [email] [password]
 *
 * Defaults to admin@parkpay.com / Admin@123 if no arguments are given.
 * Requires the same env vars as the app — see .env.example.
 */
require("dotenv").config({ path: ".env.local" });
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { MongoClient } = require("mongodb");

async function main() {
  const email = process.argv[2] || "admin@parkpay.com";
  const password = process.argv[3] || "Admin@123";

  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
    console.error("Missing Firebase Admin credentials in .env.local — see .env.example");
    process.exit(1);
  }
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env.local — see .env.example");
    process.exit(1);
  }

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
  const auth = getAuth();

  let user;
  try {
    user = await auth.getUserByEmail(email);
    console.log(`Firebase user already exists: ${email} (${user.uid})`);
  } catch {
    user = await auth.createUser({ email, password, emailVerified: true });
    console.log(`Created Firebase user: ${email} (${user.uid})`);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "parkpay");

  await db.collection("staff_profiles").updateOne(
    { firebase_uid: user.uid },
    { $set: { firebase_uid: user.uid, email, role: "admin", name: "Admin", created_at: new Date() } },
    { upsert: true }
  );
  console.log("Provisioned staff_profiles document with role=admin");

  const existingSettings = await db.collection("settings").findOne({ _id: "config" });
  if (!existingSettings) {
    await db.collection("settings").insertOne({
      _id: "config",
      lot_name: "ParkPay Lot #1",
      hourly_rate: 30.0,
      minimum_charge: 20.0,
      grace_minutes: 10,
    });
    console.log("Seeded default settings document");
  } else {
    console.log("Settings document already exists, left unchanged");
  }

  await client.close();
  console.log("\nDone. Sign in with:");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
