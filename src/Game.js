import Player from "./player"
import InputHandler from "./InputHandeler"
import UserInterface from "./UserInterface"
import Platform from "./Platform"
import Camera from "./Camera"
import levelOne from "./levels/LevelOne"
//import Background from "./bakgrund"

export default class Game {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.input = new InputHandler(this)
    this.ui = new UserInterface(this)
    this.keys = []
    this.gameOver = false
    this.gravity = 0.5
    this.debug = false
    this.player = new Player(this)
    this.gameTime = 0;
    this.scoreCounter = 0;

    this.camera = new Camera(this, this.player.positionX, 0, 0, 100)
    this.ground = this.height - 70;
    this.platforms = [
      new Platform(this, 0, this.ground, this.width, 100, true),
      new Platform(this, this.width - 200, 280, 200, 20, true),
      new Platform(this, 200, 200, 300, 20, true)
    ]

    this.level = [new levelOne(this)]
    this.currentLevel = 0;
   // this.background = new Background(this);

    this.enemies = this.level[this.currentLevel].generateEnemies(this.enemies);
    this.enemyTimer = 0;
    this.enemyInterval = 1000;

    this.pause = true;

  }

  update(deltaTime) {
    if (this.player.hp < 1)
      this.gameOver = true;
    if (!this.pause) {
      if (!this.gameOver) {
        this.gameTime += deltaTime
      }
    }
    if (!this.gameOver) {
      if (!this.pause) {
        this.player.update(deltaTime)
        this.camera.update(this.player)

        //if(this.enemyTimer > this.enemyInterval && !this.gameOver){
        //  this.addEnemySlime();
        //  this.enemyTimer = 0;
        //} else this.enemyTimer += deltaTime;

        this.enemies.forEach((enemy) => {

          enemy.update(deltaTime)
          if (this.checkCollision(this.player, enemy)) {
            if (enemy.isCollectable) { enemy.pickUp() }
            else {
              if (this.player.iFrames <= 0)
                this.player.hp--
              enemy.playerKnockback()
              this.player.iFrames = 300;
              this.player.knockback(enemy.flip)
            }
          }
          this.player.projectiles.forEach((projectile) => {
            if (this.checkCollision(projectile, enemy)) {
              if (!enemy.attackId.includes(projectile.attackId)) {
                enemy.hp -= projectile.damage
                enemy.attackId += projectile.attackId;
                enemy.knockback(projectile.direction)

              }
              if (!projectile.timedAttack)
                projectile.markedForDeletion = true
            }
          })
          enemy.isDead()
        })
        this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion)

        this.level[this.currentLevel].platforms.forEach((platform) => {
          if (this.checkPlatformCollision(this.player, platform)) {
            if (this.player.speedY < 0 && this.player.height / 3 + this.player.positionY > platform.positionY && platform.isSolid) {
              this.player.positionY = platform.positionY + platform.height

            } else {
              this.player.positionY = platform.positionY - this.player.height
              this.player.grounded = true
            }
          }
          this.enemies.forEach((enemy) => {
            if (this.checkPlatformCollision(enemy, platform)) {
              enemy.speedY = 0
              enemy.frameY = enemy.runningFrameY;
              enemy.maxFrame = enemy.runningMaxFrame;
              if (enemy.speedX > Math.abs(enemy.defaultSpeedX))
                enemy.speedX = enemy.defaultSpeedX;
              if (enemy.speedX < Math.abs(enemy.defaultSpeedX) * -1)
                enemy.speedX = -enemy.defaultSpeedX;
              enemy.positionY = platform.positionY - enemy.height
              if (enemy.stayOnPlatform) {
                if (enemy.hitboxX < platform.positionX && enemy.speedX < 0 || enemy.hitboxX + enemy.hitboxWidth > platform.positionX + platform.width && enemy.speedX > 0)
                  enemy.speedX *= -1

              }
            }
          })
        })
      }
    }
  }

  draw(context) {
    //  this.platforms.forEach((platform) => platform.draw(context))
    // this.background.drawBackground(context)
    this.camera.apply(context);
    //this.background.draw(context)
    this.level[this.currentLevel].draw(context)
    this.player.draw(context)
    this.enemies.forEach((enemy) => enemy.draw(context))
    this.camera.reset(context);
    this.ui.draw(context)
  }

  addEnemySlime() {
    this.enemies.push(new Slime(this))
  }

  checkCollision(object1, object2) {
    return (
      object1.hitboxX < object2.hitboxX + object2.hitboxWidth &&
      object1.hitboxX + object1.hitboxWidth > object2.hitboxX &&
      object1.hitboxY < object2.hitboxY + object2.hitboxHeight &&
      object1.hitboxHeight + object1.hitboxY > object2.hitboxY
    )
  }

  checkPlatformCollision(object, platform) {
    if (
      object.hitboxY + object.hitboxHeight >= platform.positionY &&
      object.hitboxY < platform.positionY + platform.height &&
      object.hitboxX + object.hitboxWidth >= platform.positionX &&
      object.hitboxX <= platform.positionX + platform.width
    ) {
      if (object.grounded && object.positionY + object.height > platform.positionY) {
        object.speedY = 0
        object.positionY = platform.positionY - object.height
        object.grounded = true
      }
      return true
    } else {
      if (object.grounded && object.positionY + object.height < platform.positionY) {
        object.grounded = false
      }
      return false
    }
  }

  nextLevel() {
    this.currentLevel++
    if (this.currentLevel >= this.level.length)
      this.currentLevel = 0;
    this.enemies = [];
    this.enemies = this.level[this.currentLevel].generateEnemies(this.enemies)
    console.log(this.enemies);

    this.player.positionX = 0;
    this.player.positionY = 365;
    if (this.player.ammo < 5)
      this.player.ammo++
    this.player.direction = 1;
    // if (this.player.hp < 5 && !this.gameOver)
    //   this.player.hp++
    this.player.flip = false

  }
  resetGame(){
    this.deltaTime = 0;
    this.currentLevel = 30
    this.nextLevel()
    this.player.hp = 5;
    this.player.ammo = 3;
    this.gameOver  = false;
    this.pause = true;
    this.camera.x = 0;
    this.camera.y = 0;
    this.scoreCounter = 0;
    this.gameTime = 0;
    this.input.secret = '';
    this.player.hasGun  = false;
    this.player.speedX = 0;
    this.player.speedY = 0;

  }
}
