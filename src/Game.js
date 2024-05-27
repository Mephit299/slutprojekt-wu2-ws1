import Player from "./player"
import InputHandler from "./InputHandeler"
import UserInterface from "./UserInterface"
import Platform from "./Platform"
import Camera from "./Camera"
import levelOne from "./levels/LevelOne"
import { io } from "socket.io-client"
import { getQueryParameter, updateQueryParameter, getRandomString } from '../utils';
import Projectile from "./Projectile"
import sendEnemy from "./sendEnemy"
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
    this.player = new Player(this, 0)
    this.gameTime = 0;
    this.scoreCounter = 0;
    this.projectiles = []

    this.camera = new Camera(this, 0, 0, 0, 100)
    this.ground = this.height - 70;
    this.platforms = [
      new Platform(this, 0, this.ground, this.width, 100, true),
      new Platform(this, this.width - 200, 280, 200, 20, true),
      new Platform(this, 200, 200, 300, 20, true)
    ]

    this.level = [new levelOne(this)]
    this.currentLevel = 0;
    // this.background = new Background(this);
    this.player2 = new Player(this, 1);

    this.enemies = this.level[this.currentLevel].generateEnemies(this.enemies);
    this.enemyTimer = 0;
    this.enemyInterval = 1000;
    this.pause = true;

    this.level[this.currentLevel].setup();


  
    this.room = getQueryParameter('room') || getRandomString(8);
    window.history.replaceState(
      {},
      document.title,
      updateQueryParameter('room', this.room)
    );
    this.socket = io(`https://branched-amused-headstand.glitch.me/?room=${this.room}`);
    this.singlePlayer = true;
    this.canControlPlayer2 = true;



    //Socket.io
    window.addEventListener("focus", (event) =>{ 
      console.log(':)')
      console.log(this.player.id)
      this.socket.emit('syncRequest')
    })

    this.socket.on('playerJoined', () => {  // allt är endast funktionelt om max 2 klienter existerar.
      console.log('player joined');
      this.socket.emit('existingPlayer', { x1: this.player.positionX, y1: this.player.positionY, x2: this.player2.positionX, y2: this.player2.positionY, level: this.currentLevel });
      let simpleEnemies = [];
      this.enemies.forEach((enemy, i) => {
        simpleEnemies.push(new sendEnemy(enemy))
      });
      this.socket.emit('enemies', { enemies: simpleEnemies })
    });

    this.socket.on('existingPlayer', (x1, y1, x2, y2, level) => { 
      if (this.player.positionY === new Player(this, 3).positionY) {
        if (this.currentLevel != level){
          this.currentLevel = level -1;
          this.nextLevel();
        }
        this.updatePlayers(x1, y1, x2, y2);
        this.socket.emit('2Players')
      }
      this.canControlPlayer2 = false;
      this.singlePlayer = false;
      this.player.id = 1;
      this.player2.id = 0;
      this.socket.emit('syncRequest')
    });

    this.socket.on('2Players', () => {
      this.canControlPlayer2 = false;
      this.singlePlayer = false;
    });

    this.socket.on('move', (x, y) => { // should broadcast keys insted
      if (this.player2) {
        if (this.player2.positionX > x) {
          this.player2.flip = true;
        } else if (this.player2.positionX < x) {
          this.player2.flip = false;
        }
        this.player2.positionX = x;
        this.player2.positionY = y;
        this.player2.maxFrame = this.player2.runningMaxFrame;
        this.player2.frameY = this.player2.runningFrameY;
        this.player2.updateHtibox();

      }
    });

    this.socket.on('moveEnd', () => { 
        this.player2.maxFrame = this.player2.idelmaxFrame;
        this.player2.frameY = this.player2.idelFrameY;
    });

    this.socket.on('playerDisconnected', () => {
      //look for other players.
      //om det finns en annan spelara ge den player2
      //om det inte finns en annan spelara ge player 1 player 2
      this.canControlPlayer2 = true;
      this.singlePlayer = true;
    });

    this.socket.on('enemies', (enemies) => {
      // recreate enemies
      let newEnemies = []
      try {
       let placeholder = new sendEnemy(enemies[0])
      
      enemies.forEach((enemy) =>{
        newEnemies.push(placeholder.createEnemy(enemy, this))
      });
      } catch{}
      // update enemies
      this.enemies = newEnemies;
      /*this.enemies.forEach((enemy, i) => {
        enemy.setEnemy(enemies[i])
      }); */
    });

    this.socket.on('enemyChange', (enemy, i) => {
      this.enemies[i].setEnemy(enemy)
    });

    this.socket.on('shoot', (x, y, direction) =>{
      this.projectiles.push(new Projectile(this, x, y, direction))
    });

    this.socket.on('projectiles', (projectiles) =>{
      let newProjectiles = []
      projectiles.forEach((projectile) => {
        newProjectiles.push(new Projectile(this, projectile.positionX, projectile.positionY, projectile.direction))
      });
      this.projectiles = newProjectiles;
    })

    this.socket.on('disconnect', () =>{
      console.log('disconnect')
      TouchList.canControlPlayer2 = true;
      this.singlePlayer = true;
    });

    this.socket.on('syncRequest', () =>{
      /* vad ska skickas
      båda spelarnas x och y kordinater
      enemies
      projectiles
      tror inte level behövs
      */
      this.socket.emit('syncEvent', {x1: this.player.positionX, y1: this.player.positionY, x2: this.player2.positionX, y2: this.player2.positionY})
      let simpleEnemies = [];
      this.enemies.forEach((enemy, i) => {
        simpleEnemies.push(new sendEnemy(enemy))
      });
      this.socket.emit('enemies', {enemies: simpleEnemies})
      let simpleProjectiles = []
      this.projectiles.forEach((projectile) => {
        simpleProjectiles.push(projectile.sendProjectile())
      });
      this.socket.emit('projectiles', {projectiles: simpleProjectiles})
    });

    this.socket.on('syncEvent', (x1, y1, x2, y2) =>{
      this.updatePlayers(x1, y1, x2, y2);
      //this.projectiles = projectiles;
    });

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

      if (!this.canControlPlayer2) {
        this.player2.updateAnimation(deltaTime, true)
      }
      if (this, this.singlePlayer && this.pause) { // on det ändast är 1 spelara går spellet att pausa helt

        return
      }

        const playerMoved = this.player.update(deltaTime) //flytta spelare

        if (playerMoved) {
          this.socket.emit('move', { x: this.player.positionX, y: this.player.positionY });
          this.player.movedLastFrame = true;
        } else {
          if (this.player.movedLastFrame) {
            this.socket.emit('moveEnd');
          }
          this.player.movedLastFrame = false;
        }
      

      if (this.canControlPlayer2) {
        this.player2.update(deltaTime)
        this.camera.update((this.player.positionX + this.player2.positionX + this.player.width) / 2, (this.player.positionY + this.player2.positionY + this.player.height) / 2) // centrera kameran på spelere 1
      } else {
        this.player2.updateMovementLock();
        this.player2.updatePosition(deltaTime)
        this.camera.update(this.player.positionX, this.player.positionY + this.player.height)
      }

      //if(this.enemyTimer > this.enemyInterval && !this.gameOver){
      //  this.addEnemySlime();
      //  this.enemyTimer = 0;
      //} else this.enemyTimer += deltaTime;

      this.enemies.forEach((enemy, i) => { //Uppdatera fiender

        enemy.update(deltaTime)
        this.playerEnemyCollision(this.player, enemy)
        //if (this.canControlPlayer2) {
          this.playerEnemyCollision(this.player2, enemy)
        //}

        this.projectiles.forEach((projectile) => { // To do: Brodcast new projectiles to server
          projectile.update(deltaTime);
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
        enemy.isDead() // broadcast change

      })
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion)


      this.level[this.currentLevel].platforms.forEach((platform) => { //kolission med platformar
        this.playerPlatformCollision(this.player, platform)
        this.playerPlatformCollision(this.player2, platform)

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



  draw(context) {
    //  this.platforms.forEach((platform) => platform.draw(context))
    // this.background.drawBackground(context)
    this.camera.apply(context);
    //this.background.draw(context)
    this.level[this.currentLevel].draw(context)
    this.player.draw(context)
    this.player2.draw(context)
    this.enemies.forEach((enemy) => enemy.draw(context))
    this.projectiles.forEach((projectile) => projectile.draw(context));
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
       // object.positionY = platform.positionY - object.height
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

  playerEnemyCollision(player, enemy) {
    if (this.checkCollision(player, enemy)) {
      if (enemy.isCollectable) { enemy.pickup(player.id) }
      else {
        if (player.iFrames <= 0)
          player.hp--
        enemy.playerKnockback(player)
        player.iFrames = 300;
        player.knockback(enemy.flip)
      }
    }
  }

  updateprojectiles() {
    this.projectiles.forEach((projectile) => {
      projectile.update(deltaTime)
      /*if (projectile.meleeAttack) {
          this.maxFrame = this.attackMaxFrame;
          this.frameY = this.attackFrameY;
      } */
    })
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.markedForDeletion
    )
  }

  playerPlatformCollision(player, platform) {
    if (this.checkPlatformCollision(player, platform)) {
      if (player.hitboxY > platform.positionY + 10 && player.positionY + player.height < platform.positionY + platform.height - 10) {
        if (!player.flip){
          player.positionX = platform.positionX - player.hitboxWidth - player.hitboxXMagicNumber;
        } else {
          player.positionX = platform.positionX + platform.width - player.hitboxXMagicNumber;
        }
      } else if (player.speedY <= 0 && player.hitboxHeight / 3 + player.hitboxY > platform.positionY && platform.isSolid) {
        player.positionY = platform.positionY + platform.height

      }  else {
        player.positionY = platform.positionY - player.height
        player.grounded = true
      }
    }

  }

  nextLevel() {
    this.currentLevel++
    if (this.currentLevel >= this.level.length)
      this.currentLevel = 0;
    this.enemies = [];
    this.enemies = this.level[this.currentLevel].generateEnemies(this.enemies)
    console.log(this.enemies);

    this.level[this.currentLevel].setup();
    if (this.player.ammo < 5)
      this.player.ammo++
    this.player.direction = 1;
    // if (this.player.hp < 5 && !this.gameOver)
    //   this.player.hp++
    this.player.flip = false

  }

  resetGame() {
    this.deltaTime = 0;
    this.currentLevel = 30
    this.nextLevel()
    this.player.hp = 5;
    this.player.ammo = 3;
    this.gameOver = false;
    this.pause = true;
    this.camera.x = 0;
    this.camera.y = 0;
    this.scoreCounter = 0;
    this.gameTime = 0;
    this.input.secret = '';
    this.player.hasGun = false;
    this.player.speedX = 0;
    this.player.speedY = 0;

  }
  updatePlayers(x1, y1, x2, y2){
    this.player.positionX = x2;
    this.player.positionY = y2
    this.player2.positionX = x1;
    this.player2.positionY = y1;
    this.player.updateHtibox;
    this.player2.updateHtibox;
  }
}
