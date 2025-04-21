import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

/* ─ Types ────────────────────────────────────────────── */
interface Vector2 { x: number; y: number; }
interface Player extends Vector2 {}

/* ─ Server setup ─────────────────────────────────────── */
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const players: Record<string, Player> = {};

/* ─ Helpers ──────────────────────────────────────────── */
function movePlayerSmoothly(id: string, player: Player, dest: Vector2) {
  const speed = 4;
  const tick = setInterval(() => {
    const dx = dest.x - player.x;
    const dy = dest.y - player.y;
    const dist = Math.hypot(dx, dy);

    let reached = false;
    if (dist < speed) {
      player.x = dest.x;
      player.y = dest.y;
      reached = true;
      clearInterval(tick);
    } else {
      player.x += (dx / dist) * speed;
      player.y += (dy / dist) * speed;
    }
    io.emit("updatePlayer", id, player, reached);
  }, 1000 / 60);           // 60 FPS
}

/* ─ Socket handlers ──────────────────────────────────── */
io.on("connection", (socket: Socket) => {
  console.log(`🔵  ${socket.id} connected`);

  players[socket.id] = { x: 150, y: 100 };

  socket.emit("currentPlayers", players);
  socket.broadcast.emit("newPlayer", { id: socket.id, ...players[socket.id] });

  socket.on("playerMove", (dest: Vector2) => {
    if (players[socket.id]) movePlayerSmoothly(socket.id, players[socket.id], dest);
  });

  socket.on("playerAttack", (targetId: string) => {
    if (players[targetId]) {
      console.log(`⚔️  ${socket.id} attacked ${targetId}`);
      io.emit("playerHit", targetId);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴  ${socket.id} disconnected`);
    delete players[socket.id];
    io.emit("playerLeft", socket.id);
  });
});

const PORT = process.env.PORT ?? 3000;
server.listen(PORT, () => console.log(`🚀  WebSocket server on :${PORT}`));
