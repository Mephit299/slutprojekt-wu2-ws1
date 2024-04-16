

export default class InputHandler {
    constructor(game) {
        this.shootTimer = 0;
        this.game = game
        this.secret = '';
        this.debugMenu = 'pp'
        this.awnser = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';
        window.addEventListener('keydown', (event) => {
            console.log(event.key)
            if (
              (event.key === 'ArrowUp' 
              || event.key === 'ArrowDown' 
              || event.key === 'ArrowLeft' 
              || event.key === 'ArrowRight'
              || event.key === 'w'
              || event.key === 'a'
              || event.key === 's'
              || event.key === 'd') &&
              this.game.keys.indexOf(event.key) === -1
            ) {
              this.game.keys.push(event.key)
            }
            this.secret += event.key
            if (this.secret.includes(this.awnser)){
              this.game.player.hasGun = true;
              this.debugMenu = 'p'
            }
            if (this.secret.length >1000)
              this.secret =''

              if (event.key === 'x') {
                this.game.player.shoot()
              }
              if (event.key === 'z')
              this.game.player.strike()

              if (event.key === 'Escape')
                this.game.pause = !this.game.pause

              if (event.key === 'r' && this.game.gameOver){
                this.game.resetGame();
              }


            if (event.key === this.debugMenu) {
              this.game.debug = !this.game.debug
            }
            if(this.game.debug && event.key === 'l')
                this.game.nextLevel();
      })
      window.addEventListener('keyup', (event) => {
        if (this.game.keys.indexOf(event.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(event.key), 1)
        }
      })
    }
  }