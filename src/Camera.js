export default class Camera {
    constructor(game, x, y, minX = 0, minY = 0, lerpFactor = 0.1) {
      this.game = game
      this.x = x
      this.y = y
      this.width = this.game.width
      this.height = this.game.height
      this.minX = minX
      this.minY = minY
      this.lerpFactor = lerpFactor
    }
  
    update(positionX, positionY) {

        const halfWidth = this.width / 2
        const halfHeight = this.height / 2
        const maxX = this.game.level[this.game.currentLevel].width
        //const maxY = this.game.level[this.game.currentLevel].height
  
        let targetX = Math.min(Math.max(positionX - halfWidth, this.minX), maxX)
        //let targetY = Math.min(Math.max(player.y - halfHeight, this.minY), maxY)
  
        //let targetX = player.x - halfWidth
        let targetY = positionY - halfHeight
  
        this.x += (targetX - this.x) * this.lerpFactor
        //if (player.positionY <  this.game.height/2)
            this.y += (targetY - this.y) * this.lerpFactor
        //else this.y = 0;
        if (this.y > 0)
          this.y = 0;
        
    }
  
    apply(context) {
      context.save()
      context.translate(-this.x, -this.y)
    }
  
    reset(context) {
      context.restore()
    }
  }