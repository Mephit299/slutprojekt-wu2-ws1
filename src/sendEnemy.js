import Collectable from "./Collectable";
import Enemy from "./Enemy";
import Gem from "./Gem";
import Zombie from "./zombie";

export default class sendEnemy{
    constructor(enemy){
        this.positionX = enemy.positionX;
        this.positionY = enemy.positionY;
        this.hp = enemy.hp;
        this.speedX = enemy.speedX;
        this.speedY = enemy.speedY;
        this.id = enemy.id;
        this.isCollectable = enemy.isCollectable;
    }

    createEnemy(enemy, game){
        if (enemy.isCollectable){
            if (enemy.id === 0){
                return(new Collectable(game, enemy.positionX, enemy.positionY, 20, 20))
            } else if (enemy.id === 1){
                return(new Gem(game, enemy.positionX, enemy.positionY, enemy.id))
            } else if (enemy.id === 2) {
                return(new Gem(game, enemy.positionX, enemy.positionY, enemy.id))
            }
        } else {
            if (enemy.id === 0){
                return(new Enemy(game))
            } else if (enemy.id === 1){
                return(new Zombie(game, enemy.positionX, enemy.positionY))
            }

        }
    }
}