export default class UserInterface{
    constructor(game) {
        this.game = game
        this.fontSize = 25
        this.fontFamily = 'Arial'
        this.color = 'white'
      }


    

    draw(context) {
        context.save()
        context.fillStyle = this.color
        context.shadowOffsetX = 2
        context.shadowOffsetY = 2
        context.shadowColor = 'black'
        context.textAlign = 'left'
        context.font = `${this.fontSize}px ${this.fontFamily}`
       // context.fillText(`HP: ${this.game.player.hp}`, 20, 50)
        //context.fillText(`Time: ${(this.game.gameTime * 0.001).toFixed(1)}`, 20, 80)
        context.fillText(`Score: ${this.game.scoreCounter}`, 20, 50)
        

        if (this.game.gameOver) {
            context.textAlign = 'center'
            context.font = `50px ${this.fontFamily}`
            context.fillText('Game over', this.game.width / 2, this.game.height / 2 - 20)
            context.font = `30px ${this.fontFamily}`
            context.fillText('Press r to restart', this.game.width / 2, this.game.height / 2 +20)
          }

          if (this.game.pause && !this.game.gameOver){
            context.fillStyle = this.color;
            context.font = `70px ${this.fontFamily}`
            context.fillText('Pause', 320, 100)
            context.font = `30px ${this.fontFamily}`
            context.fillText('Move with arrow keys or wasd', 200, 150)
            context.fillText('Attack with z', 200, 190)
            context.fillText('Unpause with Escape', 200, 230)
        }

        if (this.game.debug) {
            context.font = `15px Arial`
            context.textAlign = 'right'
            context.fillText(`x: ${this.game.player.positionX}`, this.game.width - 20, 25)
            context.fillText(`y: ${this.game.player.positionY}`, this.game.width - 20, 50)
            context.fillText(
                `speedX: ${this.game.player.speedX}`,
                this.game.width - 20,
                75
             )
            context.fillText(
                `speedY: ${this.game.player.speedY}`,
                this.game.width - 20,
                100
            )
            context.fillText(
                `maxSpeed: ${this.game.player.maxSpeed}`,
                this.game.width - 20,
                125
            )
            context.fillText(`keys: ${this.game.keys}`, this.game.width - 20, 150)
        }
        if (this.game.player.hasGun){
            context.fillStyle = "brown"
            for (let i = 0; i < this.game.player.ammo; i++) {
                let curentBullet = 150 + i*10
                context.fillRect(curentBullet,30,5,15)
            }
        }

        

        context.restore()

    }

      

      

}