import { IGameLogic } from '/shared_core/src/interfaces/IGameLogic';
import { StateMachine } from '/shared_core/src/usecases/StateMachine';
import { GameState } from '/shared_core/src/entities/GameState';
import { StateUpdate } from '/shared_core/src/interfaces/StateUpdate';
import { GameEvent } from '/shared_core/src/events/GameEvent';

export default class LocalGameLogic implements IGameLogic {
  public stateUpdate: StateUpdate;
  private stateMachine: StateMachine;
  private listeners: ((state: StateUpdate) => void)[] = [];

  constructor() {
    const initialState = new GameState({});
    this.stateUpdate = { state: initialState, changes: [] };
    this.stateMachine = new StateMachine(initialState);
  }

  sendEvent(event: GameEvent): void {
    this.stateUpdate = this.stateMachine.apply(event);
    this.listeners.forEach(callback => callback(this.stateUpdate));
  }

  onStateChange(callback: (state: StateUpdate) => void): void {
    this.listeners.push(callback);
  }
}
