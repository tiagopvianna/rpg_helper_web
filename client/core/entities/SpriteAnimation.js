export default class SpriteAnimation {
    constructor(spriteSheet, framerate, firstFrameIndex, numberOfFrames = 0) {
        this.spriteSheet = spriteSheet;
        this.framerate = framerate;
        this.firstFrameIndex = firstFrameIndex;
        this.lastFrameIndex = firstFrameIndex + numberOfFrames;
        this.currentFrame = 0;
        this.animationInterval = null;
    }

    setTarget(target) {
        this.target = target;
    }

    play() {
        this.target.sprite.setTexture(this.spriteSheet);
        this.target.sprite.setFrame(this.firstFrameIndex);
        this.#startAnimation();
    }
    stop() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    #updateSprite() {
        this.currentFrame = (this.currentFrame + 1) % (this.lastFrameIndex - this.firstFrameIndex + 1);
        this.target.sprite.setFrame(this.firstFrameIndex + this.currentFrame);
    }

    #startAnimation() {
        const frameDuration = 1000 / this.framerate;
        this.animationInterval = setInterval(() => {
            this.#updateSprite();
        }, frameDuration);
    }
}
