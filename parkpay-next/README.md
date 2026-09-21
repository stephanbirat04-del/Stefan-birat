# ParkPay — Parking Lot Management System (Next.js / MongoDB / Firebase)

This is a full stack-migration of the original FastAPI + SQL prototype onto:
- **Framework:** Next.js 16 (App Router) — a single project serves both the UI and the REST API (via Route Handlers), replacing the separate FastAPI backend.
- **Database:** MongoDB — replacing SQLAlchemy/SQL.
- **Auth:** Firebase Authentication — replacing the hand-rolled JWT/bcrypt login. Firebase proves *identity* only; the app's own **staff_profiles** collection in MongoDB (keyed by Firebase UID) holds the **role** (admin/staff) and is what the API actually authorizes against.
- **UI/UX:** Tailwind CSS (same dark command-center visual design as before — carried over feature-for-feature, not just reskinned).

Feature set is unchanged from the previous version: staff auth, vehicle entry/exit, automatic ₹ fee calculation, a printed receipt on exit, a live dashboard, searchable history with CSV export, and admin-configurable pricing.

## Why setup isn't zero-config this time

The original SQL version defaulted to a local SQLite file so it would run with no external services at all. That's not possible here: Firebase Auth inherently requires a real Firebase project (there's no local/offline equivalent), and once a real backend service is required anyway, MongoDB is assumed to be a real instance too (local `mongod`, Docker, or a free MongoDB Atlas cluster) rather than an in-memory stand-in. Budget about 10 minutes for one-time setup of a free Firebase project before this runs end-to-end.

## Setup

### 1. Create a Firebase project
1. [Firebase Console](https://console.firebase.google.com) → Add project (free tier is enough).
2. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable.**
3. **Project settings → General → Your apps → Add app → Web.** Copy the config values into `NEXT_PUBLIC_FIREBASE_*` in `.env.local`.
4. **Project settings → Service accounts → Generate new private key.** Downloads a JSON file — copy `project_id`, `client_email`, and `private_key` into the `FIREBASE_*` (no `NEXT_PUBLIC_` prefix) vars in `.env.local`. Keep the `\n` sequences in the private key literally as `\n` text inside the quotes; the app converts them to real newlines at runtime.

### 2. Get a MongoDB connection string
Either run MongoDB locally (`mongodb://localhost:27017`) or create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and copy its connection string.

### 3. Configure and install
```bash
cp .env.example .env.local
# fill in every value in .env.local using steps 1–2 above
npm install
```

### 4. Seed the admin account
```bash
node scripts/seed-admin.js
```
Creates a Firebase user, a matching `staff_profiles` document with `role: "admin"`, and the default `settings` document — printed to the console when done (defaults to `admin@parkpay.com` / `Admin@123`; pass your own email/password as arguments to override).

### 5. Run it
```bash
npm run dev
```
Open `http://localhost:3000` and sign in with the credentials from step 4.

## Provisioning additional staff

There's no in-app "invite a teammate" flow yet (Phase 2 candidate). For now, provision new staff manually:
1. Create the Firebase user (Firebase Console → Authentication → Add user, or reuse `seed-admin.js` with different arguments and then edit its role in Mongo).
2. Insert/update a `staff_profiles` document: `{ firebase_uid, email, role: "staff" | "admin", name, created_at }`.

A Firebase account with no matching `staff_profiles` document can sign in to Firebase but every ParkPay API call will 403 — this is intentional (see SRS §3.2, Security Requirements).

## Testing

```bash
npm test    # fee-calculation and query-filter unit tests (no external services needed)
npm run lint
npm run build
```

The fee-calculation logic and Mongo filter-builder are pure functions and are unit tested directly (`tests/`). End-to-end testing of the auth flow and database operations requires your own Firebase + MongoDB credentials (see Setup) since there is no offline emulator bundled with this project — the code was verified to build cleanly and to correctly reject unauthenticated requests (401), but a full login → entry → exit → receipt walkthrough needs real credentials to exercise.

## Project structure
```
parkpay-next/
├── scripts/
│   └── seed-admin.js         # one-time admin + settings bootstrap
├── src/
│   ├── app/
│   │   ├── login/page.jsx
│   │   ├── (app)/             # auth-gated route group
│   │   │   ├── layout.jsx     # redirects to /login if not signed in
│   │   │   ├── dashboard/page.jsx
│   │   │   ├── active/page.jsx
│   │   │   ├── history/page.jsx
│   │   │   └── settings/page.jsx
│   │   └── api/                # REST API (Route Handlers) — replaces FastAPI
│   │       ├── auth/me/route.js
│   │       ├── settings/route.js
│   │       ├── vehicles/entry/route.js
│   │       ├── vehicles/active/route.js
│   │       ├── vehicles/route.js         # history + filters
│   │       ├── vehicles/export/csv/route.js
│   │       ├── vehicles/[id]/exit/route.js
│   │       ├── vehicles/[id]/receipt/route.js
│   │       ├── vehicles/[id]/mark-paid/route.js
│   │       └── dashboard/stats/route.js
│   ├── components/Sidebar.jsx
│   ├── context/AuthContext.jsx  # wraps Firebase auth state + staff profile
│   └── lib/
│       ├── mongodb.js           # lazy Mongo connection (dev-HMR-safe)
│       ├── firebaseAdmin.js     # server-side token verification
│       ├── firebaseClient.js    # browser-side sign-in
│       ├── auth.js              # requireUser()/requireAdmin() for routes
│       ├── fee.js               # pure fee-calc function (unit tested)
│       ├── vehicleFilter.js     # shared Mongo filter builder (unit tested)
│       ├── serialize.js
│       └── apiClient.js         # browser fetch wrapper, attaches ID token
└── tests/
    ├── fee.test.mjs
    └── vehicleFilter.test.mjs
```

## MongoDB collections

- **staff_profiles** — `{ firebase_uid, email, role, name, created_at }`
- **vehicles** — one document per parking session: `{ plate_number, owner_phone, vehicle_type, entry_time, exit_time, duration_min, fee, status, payment_status, logged_by, created_at }`
- **settings** — a single document, `_id: "config"`: `{ lot_name, hourly_rate, minimum_charge, grace_minutes }`

See the SRS and PRD documents for the full data model, API contract, and requirements this migration was built against.
