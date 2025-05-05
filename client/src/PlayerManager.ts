import { IPlayerController } from "./interfaces/IPlayerController";
import { IGameLogic } from "../../shared_core/src/interfaces/IGameLogic";
import { StateUpdate } from "../../shared_core/src/entities/StateUpdate";
import { GameEvent } from "../../shared_core/src/events/GameEvent";
import { Player } from "../../shared_core/src/entities/Player";
import { GameState } from "../../shared_core/src/entities/GameState";
import { EVENTS } from "../../shared_core/src/events/EventTypes";

export default class PlayerManager {
  private controller: IPlayerController;
  private gameLogic: IGameLogic;
  private localPlayerId: string = "local"; // Or generate dynamically if needed

  constructor(
    controller: IPlayerController, 
    gameLogic: IGameLogic, 
    initialState: GameState,
) {
    this.controller = controller;
    this.gameLogic = gameLogic;

    this.controller.updateState({ state: initialState, changes: [] });

    this.setListeners();
  }

  private setListeners(): void {
    this.gameLogic.onStateChange((update: StateUpdate) => {
      update.changes.forEach((event: GameEvent) => {
        switch (event.type) {
          case "PLAYER_JOINED":
            console.log("PLAYER_JOINED", event.playerId);
            this.controller.updateState(update);
            break;

          case "PLAYER_MOVED":
            console.log("PLAYER_MOVED", event.playerId);
            this.controller.updateState(update);
            break;

            // case "PLAYER_LEFT":
            //   console.log("PLAYER_MOVED", event.playerId);
            //   this.controller.updateState(update);
            //   break;

          case EVENTS.PLAYER_ATTACKED:
            console.log("PLAYER_ATTACKED", event.playerId);
            this.controller.updateState(update);
            break;
        }
      });
    });
  }
}
