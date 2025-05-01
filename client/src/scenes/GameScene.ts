import Phaser from "phaser";
import PlayerManager from "../PlayerManager";
import PlayerController from "../presenter/PlayerController";
import LocalGameLogic from "../../test/LocalGameLogic";
import { EVENTS } from "../../../shared_core/src/events/EventTypes";
import { RemoteGameLogic } from "../../test/RemoteGameLogic";

export default class GameScene extends Phaser.Scene {
    private playerManager!: PlayerManager;

    constructor() {
        super({ key: "GameScene" });
    }

    preload(): void {
        this.load.image("board", "assets/board.png");
        this.load.image("piece", "assets/player.png");
        this.load.image("piece_selected", "assets/player_selected.png");
        this.load.image("enemy_damaged", "assets/enemy_damaged.png");
        this.load.image("enemy", "assets/enemy.png");
        this.load.spritesheet("knight", "assets/2.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("s_idle", "assets/S_Idle.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("s_walk", "assets/S_Walk.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("player_idle", "assets/player_idle.png", { frameWidth: 96, frameHeight: 96 }); // Load the spritesheet
        this.load.spritesheet("player_walking", "assets/player_walking.png", { frameWidth: 96, frameHeight: 96 }); // Load the spritesheet
    }

    create(): void {
        this.setAnimations()

        const board = this.add.image(this.scale.width / 2, this.scale.height / 2, "board");
        board.setDisplaySize(this.scale.width, this.scale.height);

        const playerController = new PlayerController(this);

        // const gameLogic = new LocalGameLogic();
        const gameLogic = new RemoteGameLogic("http://localhost:3000");

        // waiting for remote implementation to be ready
        setTimeout(() => {
            gameLogic.sendEvent({
                type: EVENTS.PLAYER_JOINED,
                playerId: "local",
                position: { x: 300, y: 300 }
            });
        }, 1000);

        this.playerManager = new PlayerManager(playerController, gameLogic, gameLogic.getState().state);
    }

    setAnimations(): void {
        this.anims.create({
            key: "player_idle",
            frames: this.anims.generateFrameNumbers("knight", { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "player_walking",
            frames: this.anims.generateFrameNumbers("knight", { start: 48, end: 54 }),
            frameRate: 8,
            repeat: -1
        });
    }
}