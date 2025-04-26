import { GameState } from '../entities/GameState';
import { GameEvent } from '../events/GameEvent';

export type StateUpdate = {
  state: GameState;
  changes: GameEvent[];
};
