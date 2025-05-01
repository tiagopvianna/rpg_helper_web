import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";

import { GameState, StateMachine, GameEvent, EVENTS } from "@rpg_helper_web/shared_core";

// ─── Setup ───────────────────────────────────────────
const app = express();
app.use(cors());
app.use(bodyParser.json()); // <-- parse JSON bodies for API
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const gameState = new GameState({});
const stateMachine = new StateMachine(gameState);

// ─── On Connect ──────────────────────────────────────
io.on("connection", (socket: Socket) => {
  console.log(`🔵 ${socket.id} connected`);

  // Client sends GameEvents
  socket.on("message", (msg) => {
    console.log("has received message!");
    const event: GameEvent = JSON.parse(msg);

    const { state, changes } = stateMachine.apply(event);

    // Broadcast full update (or just the changes if you prefer)
    const update = JSON.stringify({ state, changes });
    io.emit("message", update);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 ${socket.id} disconnected`);

    const event: GameEvent = {
      type: EVENTS.PLAYER_LEFT,
      // id no cliente está hardcoded como "local"
      playerId: socket.id,
    };

    const { state, changes } = stateMachine.apply(event);

    const update = JSON.stringify({ state, changes });
    io.emit("message", update);
  });
});


// ─── Test API Routes ──────────────────────────────────────
app.post("/api/event", (req, res) => {
  const event: GameEvent = req.body;
  console.log("🎯 Received API Event:", event);

  const { state, changes } = stateMachine.apply(event);

  // Broadcast the new state to all clients
  const update = JSON.stringify({ state, changes });
  io.emit("message", update);

  res.send({ success: true, changes });
});

app.get("/api/state", (req, res) => {
  res.send({...stateMachine});
});

// ─── Start ───────────────────────────────────────────
const PORT = process.env.PORT ?? 3000;
server.listen(PORT, () => console.log(`🚀 WebSocket server on :${PORT}`));
