import Phaser from "phaser";
import io from "socket.io-client";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.players = {};
  }

  preload() {
    this.load.image("board", "assets/board.png");
    this.load.image("piece", "assets/player.png");
    this.load.image("piece_selected", "assets/player_selected.png");
  }

  create() {
    this.socket = io("http://localhost:3000");

    this.add.image(this.scale.width / 2, this.scale.height / 2, "board")
      .setDisplaySize(this.scale.width, this.scale.height);

    this.player = this.add.sprite(150, 100, "piece").setInteractive();
    
   this.setListeners();
  }

  setListeners() {
    this.socket.on("currentPlayers", (players) => {
      Object.keys(players).forEach((id) => {
        if (id !== this.socket.id) {
          this.addNewPlayer(id, players[id].x, players[id].y);
        }
      });
    });

    this.socket.on("newPlayer", (playerData) => {
      this.addNewPlayer(playerData.id, playerData.x, playerData.y);
    });

    this.socket.on("playerLeft", (playerId) => {
      if (this.players[playerId]) {
        this.players[playerId].destroy();
        delete this.players[playerId];
      }
    });

    this.socket.on("updatePlayers", (players) => {
      Object.keys(players).forEach((id) => {
        if (id !== this.socket.id && this.players[id]) {
          this.players[id].x = players[id].x;
          this.players[id].y = players[id].y;
        }
      });
    });

    this.input.on("pointerdown", (pointer) => {
      this.player.x = pointer.x;
      this.player.y = pointer.y;

      this.socket.emit("playerMove", { x: this.player.x, y: this.player.y });
    });
  }

  addNewPlayer(id, x, y) {
    this.players[id] = this.add.sprite(x, y, "piece");
  }
}
