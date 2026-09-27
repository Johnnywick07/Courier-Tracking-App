import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false, // relaxed so the bundled React app's inline/script tags work
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/riders", riderRoutes);

// Serve the built React app (client/dist) in production, so a single
// Express service can host both the API and the frontend on Render.
if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientDist));

  // Any non-/api route falls through to the React app (client-side routing).
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;