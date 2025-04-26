import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

import { GameState } from "../shared_core/src/entities/GameState";
import { StateMachine } from "../shared_core/src/usecases/StateMachine";
import { GameEvent } from "../shared_core/src/events/GameEvent";

// ─── Setup ───────────────────────────────────────────
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const gameState = new GameState({});
const stateMachine = new StateMachine(gameState);

// ─── On Connect ──────────────────────────────────────
io.on("connection", (socket: Socket) => {
  console.log(`🔵 ${socket.id} connected`);

  // Client sends GameEvents
  socket.on("message", (msg) => {
    const event: GameEvent = JSON.parse(msg);

    const { state, changes } = stateMachine.apply(event);

    // Broadcast full update (or just the changes if you prefer)
    const update = JSON.stringify({ state, changes });
    io.emit("message", update);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 ${socket.id} disconnected`);
    // Optionally handle PLAYER_LEFT event
  });
});

// ─── Start ───────────────────────────────────────────
const PORT = process.env.PORT ?? 3000;
server.listen(PORT, () => console.log(`🚀 WebSocket server on :${PORT}`));
