import spriteImage from './assets/sprites/Sprites_botten_av_rutorna.png';

export default class Enemy{
    constructor(game){
        
        this.game = game;
        this.positionX = 0;
        this.positionY = 0;
        this.defaultSpeedX = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.markedForDeletion = false;
        this.width = 64;
        this.height = 64;
        this.hp = 1;
        this.score = 1;
        this.originClass = true

        this.hitboxYMagicNumber = 0;
        this.hitboxXMagicNumber = 0;
        this.hitboxX = this.positionX + this.hitboxXMagicNumber;
        this.hitboxY = this.positionY + this.hitboxYMagicNumber;
        this.hitboxWidth = this.width - this.hitboxXMagicNumber*2;
        this.hitboxHeight = this.height - this.hitboxYMagicNumber;

        this.stayOnPlatform = false;
        this.isCollectable = false;
        this.color = "yellow";
        this.attackId = '';

        this.knockbackSpeedY = 5;
        this.knockbackSpeedX = 5;

        const image = new Image();
        image.src = spriteImage;
        this.image = image;
        this.flip = false;

        this.frameX = 0
        this.frameY = 3
        this.maxFrame = 4
        this.fps = 12
        this.timer = 0
        this.interval = 1000 / this.fps

        this.runningMaxFrame = 4;
        this.runningFrameY = 3;

        this.takesDamageMaxFrame = 3;
        this.takesDamageFrameY = 4;

        
    }

    update(deltaTime){
        if (this.originClass){
            this.positionX += this.speedX;
            if (this.positionX + this.width < 0) this.markedForDeletion = true
        }
        
        if (this.speedX < 0) {
            this.flip = true
          } else if (this.speedX > 0) {
            this.flip = false
          }
        
          if (this.timer > this.interval) {
            this.frameX++
            this.timer = 0
          } else {
            this.timer += deltaTime
          }
        
          // reset frameX when it reaches maxFrame
          if (this.frameX >= this.maxFrame) {
            this.frameX = 0
          }
        this.hitboxX = this.positionX + this.hitboxXMagicNumber;
        this.hitboxY = this.positionY + this.hitboxYMagicNumber;
    }
    

    draw(context){
        //context.fillStyle = this.color;
        //context.fillRect(this.positionX,this.positionY,this.width,this.height)

        if (this.flip) {
            context.save()
            context.scale(-1, 1)
          }
      
          context.drawImage(
            this.image,
            this.frameX * this.width,
            this.frameY * this.height,
            this.width,
            this.height,
            this.flip ? this.positionX * -1 - this.width : this.positionX,
            this.positionY,
            this.width,
            this.height
          )
          if(this.flip)
            context.restore()
            if (this.game.debug){
                context.strokeRect(this.positionX, this.positionY, this.width, this.height)
                context.strokeRect(this.hitboxX,this.hitboxY,this.hitboxWidth,this.hitboxHeight)
            }
              

        if (this.game.debug) {
            context.strokeRect(this.positionX, this.positionY, this.width, this.height)
            context.fillStyle = 'black'
            context.font = '20px Arial'
            context.fillText(this.hp, this.positionX, this.positionY - 5)
            context.font = '12px Arial'
            context.fillText(`x: ${this.positionX.toFixed()}`, this.positionX + 20, this.positionY - 5)
            context.fillText(`y: ${this.positionY.toFixed()}`, this.positionX + 20, this.positionY - 20)
          }
    }
    isDead(){
        if (this.hp <= 0) {
            this.markedForDeletion = true;
        if (this.game.player.iFrames <= 0)
            this.game.scoreCounter += this.score
        }
    }
    knockback(direction){
        if (direction === 1)
            this.speedX = this.knockbackSpeedX
        else this.speedX = -this.knockbackSpeedX;
        this.speedY = -this.knockbackSpeedY;
        this.positionY -= 5;
        this.hitboxY -= 5;
        this.frameY = this.takesDamageFrameY;
        this.maxFrame = this.takesDamageMaxFrame;
        this.frameX = 0;
          
        
    }
    playerKnockback(){
        if (this.game.player.positionX + 5 < this.positionX){
            this.speedX = this.knockbackSpeedX -2
            this.positionX += 10
            this.hitboxX += 10
        }
        else{
            this.speedX = -this.knockbackSpeedX +2;
            this.positionX -= 10;
            this.hitboxX -= 10
        } 
        this.speedY = -this.knockbackSpeedY- +2;
        this.positionY -= 5;
        this.hitboxY -= 5;
    }

    adjustHitbox(x, y){
        this.hitboxYMagicNumber = y;
        this.hitboxXMagicNumber = x;
        this.hitboxX = this.positionX + this.hitboxXMagicNumber;
        this.hitboxY = this.positionY + this.hitboxYMagicNumber;
        this.hitboxWidth = this.width - this.hitboxXMagicNumber*2;
        this.hitboxHeight = this.height - this.hitboxYMagicNumber;
        
    }

    changeSprite(y, my, dy, dmy){
        this.frameY = y;
        this.maxFrame = my;
        this.runningFrameY = y;
        this.runningMaxFrame = my;
        this.takesDamageFrameY = dy
        this.takesDamageMaxFrame =dmy;
    }

}