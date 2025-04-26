import { Player } from './Player';

export class GameState {
  public players: Record<string, Player>;

  constructor(players: Record<string, Player>) {
    this.players = players;
  }

  clone(): GameState {
    const clonedPlayers: Record<string, Player> = {};
    for (const id in this.players) {
      clonedPlayers[id] = this.players[id].clone();
    }

    return new GameState(clonedPlayers);
  }
}
