#!/usr/bin/env bash
# -------------------------------------------------
#  ParkPay Next.js – one‑click setup & run
# -------------------------------------------------
# Abort on any error
set -euo pipefail

# ---------- 0️⃣  Project root sanity ----------
if [[ ! -f package.json ]]; then
  echo "❌  This script must be run from the project root."
  exit 1
fi

# ---------- 1️⃣  Create .env.local ----------
# If a .env.local already exists we keep it (you may have edited it already)
if [[ ! -f .env.local ]]; then
  echo "🔧  Creating .env.local from example..."
  cp .env.example .env.local
else
  echo "✅  .env.local already present – leaving it unchanged"
fi

# ---------- 2️⃣  Fill mandatory env vars ----------
# The script will pause and let you edit the file in $EDITOR (or nano as fallback)
EDITOR="${EDITOR:-nano}"
echo "✏️  Please make sure the following keys are set in .env.local:"
echo "   NEXT_PUBLIC_FIREBASE_API_KEY"
echo "   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo "   NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "   NEXT_PUBLIC_FIREBASE_APP_ID"
echo "   FIREBASE_PROJECT_ID"
echo "   FIREBASE_CLIENT_EMAIL"
echo "   FIREBASE_PRIVATE_KEY"
echo "   MONGODB_URI"
echo "   MONGODB_DB (optional – defaults to \"parkpay\")"
echo ""
echo "The file will now open – fill the values, save, and quit."
$EDITOR .env.local

# ---------- 3️⃣  Install npm deps ----------
echo "📦  Installing npm dependencies..."
npm install

# ---------- 4️⃣  Seed the default admin ----------
# This script creates (or re‑uses) a Firebase Auth user and the matching
# staff_profiles + settings documents in MongoDB.
echo "🛠️  Seeding admin user (admin@parkpay.com / Admin@123)…"
node scripts/seed-admin.js

# ---------- 5️⃣  Run the dev server ----------
# We use port 4000 because the sandbox cannot bind to 3000.
# The `-- -p 4000` part is passed to Next.js after the script name.
echo "🚀  Starting Next.js dev server on http://localhost:4000"
npm run dev -- -p 4000
