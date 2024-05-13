import Map from "../Map";
import Platform from "../Platform";
import Collectable from "../Collectable";
import Zombie from "../zombie";


export default class levelOne extends Map {
    constructor(game){
        super(game, 2400, 500)
        this.game = game;

        this.addPlatform(new Platform(game, -100, 670, 4000, 50, true, false))
        this.addPlatform(new Platform(game, -100, 335, 4000, 35, true, false))

    }
    generateEnemies(enemies){
        enemies = [new Collectable(this.game, 400, 600, 20,20),
            new Zombie(this.game, 500, 200)];
        
            return(enemies);
    }

}