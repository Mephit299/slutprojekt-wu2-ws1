import Map from "../Map";
import Platform from "../Platform";
import Gem from "../Gem";


export default class levelOne extends Map {
    constructor(game){
        super(game, 1080, 500)    

        // box
        this.addPlatform(new Platform(game, -100, 690, 4000, 50, true, false))
        this.addPlatform(new Platform(game, 0, 0, 1080, 30, true, false))
        this.addPlatform(new Platform(game, 0, 0, 30, 720, true, false))
        this.addPlatform(new Platform(game, 1050, 0, 30, 720, true, false)) 




    }
    generateEnemies(enemies){
        enemies = [new Gem(this.game, 400, 600, 1)];
        
            return(enemies);
    }
    setup(){
        this.game.player.positionX = 50;
        this.game.player.positionY = 120; 

        this.game.player2.positionX = 1030 - this.game.player2.width;
        this.game.player2.positionY = 120;
    }

}