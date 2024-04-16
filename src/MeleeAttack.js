import Projectile from "./Projectile";


export default class MeleeAttack extends Projectile {
    constructor(game, direction) {
        super(game, 0, 0, direction);
        this.width = 20;
        this.height = 40;
        this.timedAttack = true;
        this.attackTime = 400;
        this.damage = 1;
        this.attackId = 'pogAttack420';
        this.meleeAttack = true;

        this.hitboxYMagicNumber = 0;
        this.hitboxXMagicNumber = 0;
        this.hitboxX = this.positionX + this.hitboxXMagicNumber;
        this.hitboxY = this.positionY + this.hitboxYMagicNumber;
        this.hitboxWidth = this.width - this.hitboxXMagicNumber*2;
        this.hitboxHeight = this.height - this.hitboxYMagicNumber;


    }

    update(deltaTime) {
        if (this.direction === 1){
            this.positionX = this.game.player.hitboxWidth + this.game.player.hitboxX;
            this.positionY = this.game.player.hitboxHeight / 2 - this.height / 2 + this.game.player.hitboxY;
        }else{
            this.positionX = this.game.player.hitboxX - this.width;
            this.positionY = this.game.player.hitboxHeight / 2 - this.height / 2 + this.game.player.hitboxY;
        }
        this.hitboxX = this.positionX + this.hitboxXMagicNumber;
        this.hitboxY = this.positionY + this.hitboxYMagicNumber;
        this.attackTime -= deltaTime;
        if (this.attackTime <= 0){
            this.markedForDeletion = true;
            this.game.enemies.forEach(enemy => {
                enemy.attackId = enemy.attackId.replace(this.attackId,'');
            });
        }
    }

    draw(context) {
        context.fillStyle = "red"
        if (this.game.debug)
        context.fillRect(this.positionX, this.positionY, this.width, this.height)
    }
}