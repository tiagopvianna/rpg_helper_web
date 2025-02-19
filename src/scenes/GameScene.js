import Phaser from "phaser";
import WebSocketService from "../network/WebSocketService.js";
import PlayerManager from "../core/PlayerManager.js";

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
  }

  create() {
    this.socketService = new WebSocketService("http://localhost:3000");
    
    const board = this.add.image(this.scale.width / 2, this.scale.height / 2, "board");
    board.setDisplaySize(this.scale.width, this.scale.height);
    
    this.playerManager = new PlayerManager(this, this.socketService);
  }
}
