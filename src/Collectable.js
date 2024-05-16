import Enemy from "./Enemy"

export default class Collectable extends Enemy{
    constructor(game, x, y, width, height){
        super(game)
        this.isCollectable = true;
        this.hp = 3;
        this.score = 0;
        this.positionX = x;
        this.positionY = y;
        this.width = width;
        this.height = height;


    }
    update(){
        this.hitboxX = this.positionX + this.hitboxXMagicNumber;
        this.hitboxY = this.positionY + this.hitboxYMagicNumber;
    }

    pickup(id){
        //this.game.socket.emit('collectedCollectable', {index: i})
        this.markedForDeletion = true;
    }

    knockback(){}
}