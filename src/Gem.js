import Collectable from "./Collectable"

export default class Gem extends Collectable{
    constructor(game, x, y, id){
        super(game, x, y, 30, 30)
        this.id = id;
        this.score = 2;
        
    }

    draw(context){
        if(this.id === 1){
        context.fillStyle = "blue"
        } else {context.fillStyle = "red"}
        context.fillRect(this.positionX, this.positionY, this.width, this.height);
    } 

    pickup(id){
        if (id === this.id-1){
            this.game.score += this.score;
            this.markedForDeletion = true;
        }
    }
}