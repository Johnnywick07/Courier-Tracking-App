# Courier Tracking App

A full-stack MERN application for creating deliveries, assigning riders, and tracking
parcels through their delivery stages in real time.

**Live demo:** _add your Render URL here once deployed_

## Features

- **Authentication** — sign up, login, JWT-based sessions, and password reset via email (Gmail SMTP)
- **Role-based access** — `admin`, `rider`, and `customer` roles with different permissions
- **Delivery management** — admins create deliveries with sender, receiver, and parcel details
- **Rider assignment** — admins assign an available rider to any delivery
- **Status tracking** — deliveries move through stages: `created → picked_up → in_transit → out_for_delivery → delivered` (or `failed`), with a timestamped history log
- **Live updates** — Socket.IO pushes status changes to anyone viewing a delivery's tracking page, no refresh needed
- **Public tracking** — anyone can look up a parcel's status with just its tracking number, no login required
- **Rider location sharing** — riders can share their current location for a delivery

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |
| Realtime | Socket.IO |
| Email | Nodemailer (Gmail SMTP) |

## Project structure

```
courier-tracking-app/
├── client/                 React frontend (Vite)
│   └── src/
│       ├── api/            Axios instance (attaches JWT to requests)
│       ├── components/     Navbar, DeliveryCard, StatusTimeline, RiderAssignForm
│       ├── context/        AuthContext (login/register/logout, session state)
│       ├── hooks/          useSocket (Socket.IO tracking subscription)
│       └── pages/          Landing, Login, SignUp, ForgotPassword, ResetPassword,
│                           Dashboard, CreateDelivery, DeliveryDetails, TrackSearch, RiderPanel
└── server/                 Express backend
    └── src/
        ├── config/         MongoDB connection
        ├── controllers/    Auth, delivery, and rider request handlers
        ├── middleware/     JWT auth guard, role guard, error handler
        ├── models/         User, Delivery (Mongoose schemas)
        ├── routes/         /api/auth, /api/deliveries, /api/riders
        └── sockets/        Socket.IO room handling for live tracking
```

## Getting started

### Prerequisites
- Node.js 18+
- MongoDB (local install, or a free MongoDB Atlas cluster)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) (for password-reset emails — optional, falls back to a dev-mode link if not configured)

### 1. Clone the repo

```bash
git clone https://github.com/Johnnywick07/Courier-Tracking-App.git
cd Courier-Tracking-App
```

### 2. Backend setup

```bash
cd server
cp .env.example .env
```

Fill in `server/.env`:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/courier-tracking
JWT_SECRET=some-long-random-string
CLIENT_URL=http://localhost:5173

# Optional — for real password-reset emails. Leave blank to use dev-mode
# (the reset link is shown on-screen instead of emailed).
EMAIL_USER=
EMAIL_PASS=
```

Install and run:

```bash
npm install
npm run dev
```

Optional — seed a demo admin and rider account:

```bash
node seed.js
# admin@courier.com / admin123
# rider@courier.com / rider123
```

### 3. Frontend setup

In a separate terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173**.

## Usage walkthrough

1. **Sign up** or log in as the seeded admin (`admin@courier.com` / `admin123`)
2. From the dashboard, click **Create delivery** and fill in sender, receiver, and parcel details — this generates a tracking number like `TRK-2026-12345`
3. Open the new delivery and **assign a rider**
4. Log in as the rider (`rider@courier.com` / `rider123`), open **Rider panel**, find the assigned delivery, and **advance its status**
5. Anyone can check **Track a parcel** with the tracking number to see live status — no login required
6. Try **Forgot password** from the login page to test the email-based reset flow

## API reference

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create an account |
| POST | `/api/auth/login` | Public | Log in, returns JWT |
| POST | `/api/auth/forgot-password` | Public | Request a password reset link |
| POST | `/api/auth/reset-password/:token` | Public | Set a new password |
| GET | `/api/auth/me` | Authenticated | Get current user |
| POST | `/api/deliveries` | Admin | Create a delivery |
| GET | `/api/deliveries` | Admin / Rider | List deliveries (riders see only their own) |
| GET | `/api/deliveries/track/:trackingId` | Public | Look up a delivery by tracking number |
| PATCH | `/api/deliveries/:id/assign` | Admin | Assign a rider to a delivery |
| PATCH | `/api/deliveries/:id/status` | Admin / assigned Rider | Advance a delivery's status |
| GET | `/api/riders` | Admin | List all riders |
| PATCH | `/api/riders/:id/location` | Rider / Admin | Update a rider's current location |

## Deployment

This app is set up to deploy as a **single Render web service** — Express serves the API and the built React frontend from one URL.

- **Build command:** `npm run build` (installs both apps, builds the React frontend)
- **Start command:** `npm start`
- **Environment variables to set on Render:**
  ```
  NODE_ENV=production
  MONGO_URI=<your MongoDB Atlas connection string>
  JWT_SECRET=<a long random string>
  EMAIL_USER=<your Gmail address>       (optional)
  EMAIL_PASS=<your Gmail app password>  (optional)
  ```

> **Note:** Render can't reach a MongoDB instance running on your own PC — you'll need a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster for the deployed version.

## Roadmap / ideas

- Live rider location on a map (OpenStreetMap/Leaflet)
- Customer-facing order history
- Email notifications on every status change
- Proof-of-delivery photo or signature upload
- Pagination and search on the dashboard

## License

This project was built as a group/school project. Add a license here if you plan to share it publicly.
