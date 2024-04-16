import Map from "../Map";
import Platform from "../Platform";


export default class levelOne extends Map {
    constructor(game){
        super(game, 2400, 500)
        this.game = game;

        this.addPlatform(new Platform(game, -100, 430, 4000, 70, true, true))
        this.addPlatform(new Platform(game, 1240, 300, 200, 20, true, false))
        this.addPlatform(new Platform(game, 750, 300, 200, 20, true, false))
        this.addPlatform(new Platform(game, 2490, 270, 180, 20, true, true))
        this.addPlatform(new Platform(game, 2855, 270, 180, 20, true, true))
        this.addPlatform(new Platform(game, 1000, 180, 200, 20, true , false))
    }
    generateEnemies(enemies){
        enemies = [];
        
            return(enemies);
    }

}