import { GameEvent } from '../events/GameEvent';
import { StateUpdate } from './StateUpdate';

export interface IGameLogic {
  sendEvent(event: GameEvent): void;
  onStateChange(callback: (update: StateUpdate) => void): void;
}
