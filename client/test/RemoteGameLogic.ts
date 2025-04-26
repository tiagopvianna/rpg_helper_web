import { IGameLogic } from '../../shared_core/src/interfaces/IGameLogic';
import { GameEvent } from '../../shared_core/src/events/GameEvent';
import { StateUpdate } from '../../shared_core/src/interfaces/StateUpdate';

export class RemoteGameLogic implements IGameLogic {
  private socket: WebSocket;
  private listeners: ((state: StateUpdate) => void)[] = [];

  constructor(url: string) {
    this.socket = new WebSocket(url);

    this.socket.addEventListener("message", (event) => {
      const update: StateUpdate = JSON.parse(event.data);
      this.listeners.forEach(cb => cb(update));
    });
  }

  sendEvent(event: GameEvent): void {
    this.socket.send(JSON.stringify(event));
  }

  onStateChange(callback: (state: StateUpdate) => void): void {
    this.listeners.push(callback);
  }
}
