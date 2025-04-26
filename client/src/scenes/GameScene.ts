import Phaser from "phaser";
import PlayerManager from "../PlayerManager";
import PlayerController  from "../presenter/PlayerController";
import LocalGameLogic from "../../test/LocalGameLogic";
import { EVENTS } from "../../../shared_core/src/events/EventTypes";

type GameSceneData = {
    socketService: any;
    serverBall: any;
    players: any;
};

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
        this.load.spritesheet("player_idle", "assets/player_idle.png", { frameWidth: 96, frameHeight: 96 }); // Load the spritesheet
        this.load.spritesheet("player_walking", "assets/player_walking.png", { frameWidth: 96, frameHeight: 96 }); // Load the spritesheet
    }

    create(data: GameSceneData): void {
        const board = this.add.image(this.scale.width / 2, this.scale.height / 2, "board");
        board.setDisplaySize(this.scale.width, this.scale.height);

        const gameLogic = new LocalGameLogic();
        const playerController = new PlayerController(this);

        gameLogic.sendEvent({
            type: EVENTS.PLAYER_JOINED,
            playerId: "local", // Use a constant or UUID if needed
            position: { x: 200, y: 600 }
        });

        this.playerManager = new PlayerManager(playerController, gameLogic, gameLogic.stateUpdate.state);
    }
}