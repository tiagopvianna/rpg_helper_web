import Player from "./entities/Player.js";
import Vector from "./utils/Vector.js";
import InputManager from "./InputManager.js";

export default class PlayerManager {
    constructor(scene, socketService, gameLogic, players) {
        this.scene = scene;
        this.socketService = socketService;
        this.players = {};
        this.localPlayer = null;
        this.gameLogic = gameLogic;

        // this.initializeLocalPlayer();
        // write code to iterate 
        // Object.keys(players).forEach((id) => {
        //     this.addPlayer(id, players[id]);
        // });

        // lendo do estado da maquina de estados, fazer percorrer lista
        this.localPlayer = new Player(this.scene, "local", { ... players["local"].position}, true);
        this.players["local"] = this.localPlayer;


        this.inputManager = new InputManager(scene, this);
        this.setListeners();
    }

    initializeLocalPlayer() {
        this.socketService.on("connect", () => {
            const socketId = this.socketService.socket.id;
            this.localPlayer = new Player(this.scene, socketId, { x: 150, y: 100 }, true);

            this.players[socketId] = this.localPlayer;
        });
    }

    addPlayer(id, startingPosition) {
        if (!this.players[id]) {
            let player = new Player(this.scene, id, startingPosition);
            player.sprite.setInteractive({ useHandCursor: true, pixelPerfect: false });
            this.players[id] = player;
        }
    }

    attackPlayer(enemy, id) {
        const distance = Phaser.Math.Distance.Between(
            this.localPlayer.sprite.x, this.localPlayer.sprite.y, enemy.sprite.x, enemy.sprite.y
        );

        // By now checking by move range
        if (distance <= this.localPlayer.moveRange) {
            console.log(`⚔️ Attacking ${id}!`);

            enemy.applyDamageEffect();

            this.socketService.emit("playerAttack", id);

            this.localPlayer.toggleSelection();
        } else {
            console.log("❌ Target is out of range!");
        }
    }

    removePlayer(id) {
        if (this.players[id]) {
            this.players[id].destroy();
            delete this.players[id];
        }
    }

    updatePlayer(id, position, reachedDestination) {
        if (this.players[id]) {
            this.players[id].moveTo(position, reachedDestination);
        }
    }

    setListeners() {
        this.gameLogic.onStateChange(({ state, changes }) => {
            changes.forEach((event) => {
              switch (event.type) {
                case "PLAYER_JOINED":
                  console.log("PLAYER_JOINED, state: ", state);
                //   this.addPlayer(event.playerId, event.position);
                  break;
        
                case "PLAYER_MOVED":
                  console.log("PLAYER_MOVED, state: ", state);
                  // antes tem que fazer renderizar pelo estado
                  this.updatePlayer(event.playerId, event.position, true);
                  break;
              }
            });
          });

        this.socketService.on("playerHit", (targetId) => {
            if (this.players[targetId]) {
                console.log(`Player ${targetId} hit!`);
                this.players[targetId].applyDamageEffect();
            }
        });

        // Atualiza lista de jogadores ao entrar
        // this.socketService.on("currentPlayers", (players) => {
        //     Object.keys(players).forEach((id) => {
        //         if (id !== this.localPlayer.id) {
        //             this.addPlayer(id, players[id]);
        //         }
        //     });
        // });

        // Novo jogador entrando
        this.socketService.on("newPlayer", (playerData) => {
            this.addPlayer(playerData.id, playerData);
        });

        this.socketService.on("playerLeft", (playerId) => {
            this.removePlayer(playerId);
        });

        // Atualização de posição dos jogadores
        this.socketService.on("updatePlayer", (playerId, position, reachedDestination) => {
            this.updatePlayer(playerId, position, reachedDestination);
        });
    }
}
