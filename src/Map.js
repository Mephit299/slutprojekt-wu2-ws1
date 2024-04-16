import Platform from './Platform'

export default class Map {
  constructor(game, width, height) {
    this.game = game
    this.width = width
    this.height = height
    this.platforms = []
  }

  draw(context) {
    this.platforms.forEach((platform) =>
      platform.draw(context, this.game.camera.x, this.game.camera.y)
    )
  }

  addPlatform(platform) {
    this.platforms.push(platform)
  }
}