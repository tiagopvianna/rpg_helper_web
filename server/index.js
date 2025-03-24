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

function movePlayerSmoothly(id, player, targetPosition) {
  const speed = 1; // Adjust the speed as needed
  const interval = setInterval(() => {
    const dx = targetPosition.x - player.x;
    const dy = targetPosition.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    let reachedDestination = false;

    if (distance < speed) {
      player.x = targetPosition.x;
      player.y = targetPosition.y;
      reachedDestination = true;
      clearInterval(interval);
    } else {
      player.x += (dx / distance) * speed;
      player.y += (dy / distance) * speed;
    }

    io.emit("updatePlayer", id, player, reachedDestination);
  }, 1000 / 60); // 60 frames per second
}

io.on("connection", (socket) => {
  console.log(`🔵 Player connected: ${socket.id}`);

  players[socket.id] = { x: 150, y: 100 };

  // emite para o socket atual
  socket.emit("currentPlayers", players);
  // emite para os outros sockets que não este
  socket.broadcast.emit("newPlayer", { id: socket.id, ...players[socket.id] });

  socket.on("playerMove", (data) => {
    if (players[socket.id]) {
      movePlayerSmoothly(socket.id, players[socket.id], data);
    }
  });

  socket.on("playerAttack", (targetId) => {
    if (players[targetId]) {
      console.log(`⚔️ Player ${socket.id} attacked ${targetId}!`);
      io.emit("playerHit", targetId);
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
