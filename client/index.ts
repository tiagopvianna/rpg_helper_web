import Phaser from "phaser";
import GameScene from "./src/scenes/GameScene";

declare global {
  interface Window {
    game: Phaser.Game | null;
  }

  // support for hot module replacement in TS
  interface NodeModule {
    hot?: {
      accept: () => void;
    };
  }

  var module: NodeModule;
}

// Destroy previous instance if any
if (window.game) {
  window.game.destroy(true);
  window.game = null;
}

// Accepts hot reload
if (module.hot) {
  module.hot.accept();
}

// Game configuration with type annotation
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 400,
  height: 700,
  scene: GameScene,
};

// Instantiate Phaser game
window.game = new Phaser.Game(config);