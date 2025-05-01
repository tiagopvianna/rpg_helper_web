import { IPlayerController } from "../interfaces/IPlayerController";
import { StateUpdate } from "../../../shared_core/src/interfaces/StateUpdate";

import Phaser from "phaser";
import { PlayerSprite } from "./PlayerSprite"; // We will assume you have a Phaser wrapper class for player sprites

export default class PlayerController implements IPlayerController {
  private scene: Phaser.Scene;
  private playerSprites: Record<string, PlayerSprite>;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.playerSprites = {};
  }

  // esse metodo provavelmente vai crescer em complexidade
  updateState(update: StateUpdate): void {
    const { state } = update;
    const playerStates = state.players;

    // Sync all players
    for (const playerId in playerStates) {
      const playerState = playerStates[playerId];

      if (!this.playerSprites[playerId]) {
        // Create sprite if it doesn't exist
        this.playerSprites[playerId] = new PlayerSprite(this.scene, playerState.id, playerState.position);
      } else {
        // Move existing sprite to new position
        this.playerSprites[playerId].moveTo(playerState.position);
      }
    }

    // Remove sprites that no longer exist in state
    for (const id in this.playerSprites) {
      if (!playerStates[id]) {
        this.playerSprites[id].destroy();
        delete this.playerSprites[id];
      }
    }
  }
}
