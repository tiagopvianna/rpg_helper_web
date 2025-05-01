import Phaser from "phaser";
import WebSocketService from "../../network/WebSocketService.js";
import PlayerManager from "../core/PlayerManager.js";
import LocalGameLogic from "../../test/LocalGameLogic.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.playerManager = null;
    this.socketService = null;
  }

  preload() {
    this.load.image("board", "assets/board.png");
    this.load.image("piece", "assets/player.png");
    this.load.image("piece_selected", "assets/player_selected.png");
    this.load.image("enemy_damaged", "assets/enemy_damaged.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.spritesheet("player_idle", "assets/player_idle.png", { frameWidth: 96, frameHeight: 96 }); // Load the spritesheet
    this.load.spritesheet("player_walking", "assets/player_walking.png", { frameWidth: 96, frameHeight: 96 }); // Load the spritesheet
  }

  create() {
    this.socketService = new WebSocketService("http://localhost:3000");
    
    const board = this.add.image(this.scale.width / 2, this.scale.height / 2, "board");
    board.setDisplaySize(this.scale.width, this.scale.height);

    const gameLogic = new LocalGameLogic();
    
    gameLogic.sendEvent({
      type: "PLAYER_JOINED",
      playerId: "local", // Use a constant or UUID if needed
      position: { x: 150, y: 100 }
    });
    this.playerManager = new PlayerManager(this, this.socketService, gameLogic, gameLogic.stateUpdate.state.players);
    console.log("state is ", gameLogic.stateUpdate);
  }
}