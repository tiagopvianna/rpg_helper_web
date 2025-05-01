import { GameState } from '../entities/GameState';
import { GameEvent } from '../events/GameEvent';
import { EVENTS } from '../events/EventTypes';
import { StateUpdate } from '../interfaces/StateUpdate';
import { Player } from '../entities/Player';

export class StateMachine {
    constructor(private state: GameState) { }

    getState(): GameState {
        return this.state;
    }

    apply(event: GameEvent): StateUpdate {
        const newState = this.state.clone();
        const changes: GameEvent[] = [];
        console.log("🚀 State Machine - Applying event:", event);

        switch (event.type) {
            case EVENTS.PLAYER_JOINED:
                if (!newState.players[event.playerId]) {
                    const newPlayer = new Player(event.playerId, { ...event.position });
                    newState.players[event.playerId] = newPlayer;
                    changes.push(event);
                }
                break;
        }

        switch (event.type) {
            case EVENTS.PLAYER_MOVED:
                // trava pra caso nao tenha o player ainda
                newState.players[event.playerId].move(event.position);
                changes.push(event);
                break;
        }

        switch (event.type) {
            case EVENTS.PLAYER_LEFT:
                delete newState.players[event.playerId];
                changes.push(event);
                break;
        }

        this.state = newState;

        return {
            state: newState,
            changes,
        };
    }
}
