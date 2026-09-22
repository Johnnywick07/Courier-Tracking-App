const trackingSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinTracking", (trackingId) => {
      if (trackingId) socket.join(trackingId);
    });

    socket.on("leaveTracking", (trackingId) => {
      if (trackingId) socket.leave(trackingId);
    });

    socket.on("disconnect", () => {});
  });
};

export default trackingSocket;