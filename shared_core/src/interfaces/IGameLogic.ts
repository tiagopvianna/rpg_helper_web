import { GameEvent } from '../events/GameEvent';
import { StateUpdate } from '../entities/StateUpdate';

export interface IGameLogic {
  getState(): StateUpdate;
  sendEvent(event: GameEvent): void;
  onStateChange(callback: (update: StateUpdate) => void): void;
}
