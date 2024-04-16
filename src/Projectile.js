export default class Projectile{
    constructor(game, x, y, direction){
    this.game = game
    this.width = 8
    this.height = 6
    this.positionX = x
    this.positionY = y
    this.direction = direction

    this.hitboxYMagicNumber = 0;
    this.hitboxXMagicNumber = 0;
    this.hitboxX = this.positionX + this.hitboxXMagicNumber;
    this.hitboxY = this.positionY + this.hitboxYMagicNumber;
    this.hitboxWidth = this.width - this.hitboxXMagicNumber*2;
    this.hitboxHeight = this.height - this.hitboxYMagicNumber;

    this.speed = 5
    this.damage = 99
    this.markedForDeletion = false

    this.timedAttack = false
    this.attackTime = 0;
    this.attackId = 69420;
    }

    update(deltaTime){
        if (this.direction === 1)
            this.positionX += this.speed
        else this.positionX -= this.speed
        if (this.positionX > this.game.camera.x + this.game.width)
            this.markedForDeletion = true
            this.hitboxX = this.positionX + this.hitboxXMagicNumber;
            this.hitboxY = this.positionY + this.hitboxYMagicNumber;
            this.game.enemies.forEach(enemy => {
                enemy.attackId = enemy.attackId.replace(this.attackId,'');
            });
    }

    draw(context){
        context.fillStyle = "black"
        context.fillRect(this.positionX,this.positionY,this.width,this.height)
    }
}