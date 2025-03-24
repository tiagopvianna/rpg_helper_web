export default class Animator {
    constructor(target, animations, color) {
        this.target = target;
        for (let key in animations) {
            if (animations.hasOwnProperty(key)) {
                animations[key].setTarget(target);
                animations[key].setColor(color);
            }
        }
        this.animations = animations;
        this.currentAnimation = animations['idle_south'];
        this.currentAnimation.play();
    }

    play(animationIdentifier)
    {
        var animation = this.animations[animationIdentifier];
        if (animation == this.currentAnimation)
            return;
        this.currentAnimation.stop();
        this.currentAnimation = animation;
        this.currentAnimation.play();
    }
}
