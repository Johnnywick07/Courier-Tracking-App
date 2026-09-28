import dotenv from "dotenv";
dotenv.config();

const { default: http } = await import("http");
const { Server } = await import("socket.io");
const { default: app } = await import("./src/app.js");
const { default: connectDB } = await import("./src/config/db.js");
const { default: trackingSocket } = await import("./src/sockets/trackingSocket.js");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  app.set("io", io);
  trackingSocket(io);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();