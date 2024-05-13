import Enemy from "./Enemy";

export default class Zombie extends Enemy{
    constructor(game,x,y,){
        super(game)
        this.positionX = x;
        this.positionY = y;
        this.stayOnPlatform = true;
        this.defaultSpeedX = -2;
        this.speedX = -2;
        this.score = 2;
        this.hp = 4;
        this.originClass = false;
        super.adjustHitbox(16,16)
        super.changeSprite(5, 4, 6, 3)

        
        
    }

    update(deltaTime) {
      super.update(deltaTime)
        if (this.grounded) {
          this.speedY = 0
          this.speedX = this.defaultSpeedX;
        } else {
          this.speedY += this.game.gravity
        }
        if (this.speedY > 10)
          this.speedY = 10;
        if (this.game.player.positionX + this.game.width/2 + 50 > this.positionX || this.game.width +50 > this.positionX){
        this.positionY += this.speedY
        this.positionX += this.speedX
        this.hitboxX = this.positionX + this.hitboxXMagicNumber;
        this.hitboxY = this.positionY + this.hitboxYMagicNumber;
        }
        if (this.positionX + this.width < 0) this.markedForDeletion = true
      }

}