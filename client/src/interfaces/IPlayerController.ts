
import { StateUpdate } from '../../../shared_core/src/entities/StateUpdate';
import Position from '../Position';

export interface IPlayerController {
  updateState(update: StateUpdate): void;
}
