import { IGameLogic } from '../../shared_core/src/interfaces/IGameLogic';
import { GameEvent } from '../../shared_core/src/events/GameEvent';
import { StateUpdate } from '../../shared_core/src/entities/StateUpdate';

import { io, Socket } from "socket.io-client";  // 👈 using socket.io-client
import { GameState } from '../../shared_core/src/entities/GameState';

export class RemoteGameLogic implements IGameLogic {
  public stateUpdate: StateUpdate;
  private socket: Socket;
  private listeners: ((state: StateUpdate) => void)[] = [];

  constructor(url: string) {
    const initialState = new GameState({});
    this.stateUpdate = { state: initialState, changes: [] };
    this.socket = io(url);  // 👈 connect with socket.io-client

    this.socket.on("message", (data: string) => {
      console.log("📩 Received message with data:", data);
      const update: StateUpdate = JSON.parse(data);

      this.stateUpdate = update; // <-- ✅ update the local cached state
      this.listeners.forEach(callback => callback(update));
    });
  }

  getState(): StateUpdate {
    return this.stateUpdate;
  }

  sendEvent(event: GameEvent): void {
    console.log('🚀 Sending event to server:', event);
    this.socket.emit("message", JSON.stringify(event)); // 👈 match server-side
  }

  onStateChange(callback: (state: StateUpdate) => void): void {
    this.listeners.push(callback);
  }
}
