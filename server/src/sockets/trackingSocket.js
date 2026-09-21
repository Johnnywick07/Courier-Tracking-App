const socketIo = require('socket.io');

const initializeTrackingSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinDeliveryRoom', (deliveryId) => {
      socket.join(deliveryId);
      console.log(`Socket ${socket.id} joined room ${deliveryId}`);
    });

    socket.on('locationUpdate', ({ deliveryId, location }) => {
      io.to(deliveryId).emit('deliveryLocationUpdate', { deliveryId, location });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = initializeTrackingSocket;
