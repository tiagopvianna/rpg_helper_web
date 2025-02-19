import Phaser from "phaser";
import GameScene from "./scenes/GameScene";

// Destroys any previous instance
if (window.game) {
  window.game.destroy(true);
  window.game = null;
}

// Accepts hot reload
if (module.hot) {
  module.hot.accept();
}

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 700,
  scene: GameScene
};

window.game = new Phaser.Game(config);