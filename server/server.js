const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const initializeTrackingSocket = require('./src/sockets/trackingSocket');

connectDB();

const server = http.createServer(app);
initializeTrackingSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
