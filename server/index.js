const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allows any origins
  },
});

const players = {};

io.on("connection", (socket) => {
  console.log(`🔵 Player connected: ${socket.id}`);

  players[socket.id] = { x: 150, y: 100 };

  // emite para o socket atual
  socket.emit("currentPlayers", players);
  // emite para os outros sockets que não este
  socket.broadcast.emit("newPlayer", { id: socket.id, ...players[socket.id] });

  socket.on("playerMove", (data) => {
    if (players[socket.id]) {
      players[socket.id] = data;
      io.emit("updatePlayers", players);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Player disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit("playerLeft", socket.id);
  });
});

server.listen(3000, () => {
  console.log("🚀 WebSocket server running on port 3000");
});
