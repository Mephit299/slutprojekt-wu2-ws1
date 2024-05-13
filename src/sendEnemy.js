import Enemy from "./Enemy";

export default class sendEnemy{
    constructor(enemy){
        this.positionX = enemy.positionX;
        this.positionY = enemy.positionY;
        this.hp = enemy.hp;
        this.speedX = enemy.speedX
        this.speedY = enemy.speedY;
    }
}