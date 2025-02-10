import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 700,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let piece;
let enemy;
let isSelected = false;
const game = new Phaser.Game(config);

function preload() {
  console.log("Loading assets...");
  
  // Load board background
  this.load.image("board", "assets/board.png");

  // Load player pieces (normal & selected)
  this.load.image("piece", "assets/player.png");
  this.load.image("piece_selected", "assets/player_selected.png");

  // Load enemy states (normal & damaged)
  this.load.image("enemy", "assets/enemy.png");
  this.load.image("enemy_damaged", "assets/enemy_damaged.png");
}

function create() {
    // Add the board background and center it
    let background = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "board");
  
    // Scale the background to always fit the canvas
    background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
  
    // Add player piece at the center
    piece = this.add.sprite(150, 100, "piece").setInteractive();
    piece.setScale(0.6);
  
    // Add enemy piece at a fixed position
    enemy = this.add.sprite(150, 300, "enemy");
    enemy.setScale(0.6);
  
    // Enable input detection for player movement & attack
    this.input.on("pointerdown", onClick, this);
  }

function onClick(pointer) {
  const pointerRect = new Phaser.Geom.Rectangle(pointer.x, pointer.y, 1, 1);

  if (!isSelected) {
    // Check if the player clicked on the piece
    if (Phaser.Geom.Intersects.RectangleToRectangle(piece.getBounds(), pointerRect)) {
      isSelected = true;
      piece.setTexture("piece_selected"); // Change to selected version
    }
  } else {
    // Check if the player clicked on the enemy
    if (Phaser.Geom.Intersects.RectangleToRectangle(enemy.getBounds(), pointerRect)) {
      attackEnemy();
    } else {
      // Move piece to clicked position
      piece.x = pointer.x;
      piece.y = pointer.y;

      // Deselect the piece and return to normal appearance
      isSelected = false;
      piece.setTexture("piece");
    }
  }
}

function attackEnemy() {
  console.log("Enemy hit!");

  // Change enemy sprite to "damaged"
  enemy.setTexture("enemy_damaged");

  // Create floating "-1" text
  let damageText = game.scene.scenes[0].add.text(enemy.x, enemy.y - 50, "-1", {
    fontSize: "32px",
    fill: "#ff0000",
    fontWeight: "bold"
  });

  damageText.setOrigin(0.5);
  
  // Animate the text moving up and fading out
  game.scene.scenes[0].tweens.add({
    targets: damageText,
    y: enemy.y - 80,
    alpha: 0,
    duration: 500,
    onComplete: () => damageText.destroy()
  });

  // Restore enemy sprite after 0.5 seconds
  setTimeout(() => {
    enemy.setTexture("enemy");
  }, 500);

  // Deselect player
  isSelected = false;
  piece.setTexture("piece");
}

function update() {
  // No physics needed for now
}
