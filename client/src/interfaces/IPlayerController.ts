
import { StateUpdate } from '../../../shared_core/src/interfaces/StateUpdate';
import Position from '../Position';

export interface IPlayerController {
  updateState(update: StateUpdate): void;
}
