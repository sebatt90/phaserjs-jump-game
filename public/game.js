const WIDTH = 800;
const HEIGHT = 600;

const SPAWN_DELAY = 2500;
const MOVE = .2;

const randomInRange = (min, max) => { return Math.floor(Math.random() * (max - min)); };

class Game extends Phaser.Scene {
  constructor() { super();  }
  
  // loading files
  preload() {
    this.load.image('sky', 'images/sky.png');
    this.load.image('player','images/player.png');
    this.load.image('platform', 'images/platform.png');
  }
  
  // initializing game
  create() {
    this.skyTexture = this.add.sprite(WIDTH/2, HEIGHT/2, 'sky');
    this.skyTexture.displayWidth = WIDTH;
    this.skyTexture.displayHeight = HEIGHT;
    

    // player code
    const PLAYER_WIDTH = 50;
    const PLAYER_HEIGHT = 50;
    
    this.player = this.physics.add.sprite(WIDTH/2, HEIGHT/2-100, 'player');
    this.player.displayWidth = PLAYER_WIDTH;
    this.player.displayHeight = PLAYER_HEIGHT;

    this.player.body.setAllowGravity(true);
    this.player.body.setGravityY(300);

    // platforms pool

    this.platforms = new Array();
    this.createPlatform(WIDTH/2, HEIGHT/2, 15);
    
    this.physics.add.collider(this.platforms, this.player, ()=> this.playerJump());

    // timer
    // setup timer
    this.timer = this.time.addEvent({
      delay: SPAWN_DELAY,
      callback: ()=> {
      this.createPlatform(randomInRange(50, HEIGHT-50), -100, 75);
      console.log("created");
      },
      callbackScope: this,
      loop: true
    });
    
    // input
    this.cursor = this.input.keyboard.createCursorKeys();
  }
  
  // update method
  update(time,delta){
    this.movePlayer(delta);

    // restart game when you loose
    if(this.player.y >= HEIGHT)
      this.scene.restart();
    
  }

  movePlayer(delta) {
    this.player.x += (this.cursor.right.isDown-this.cursor.left.isDown)*MOVE*delta;
  }

  playerJump(){
    if (this.cursor.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-300);
    }
  }

  createPlatform(x, y, speed){
    //var r = this.add.rectangle(x,y,148,48,0xFFFF64);
    var r = this.add.sprite(x,y, "platform");
    r.displayWidth = 148;
    r.displayHeight = 48;

    this.platforms.push(this.physics.add.existing(r));
    
    var last = this.platforms.length-1;

    this.platforms[last].body.setImmovable(true);
    this.platforms[last].body.setAllowGravity(false);
    this.platforms[last].body.setVelocityY(speed);
  }
}

//game's config
var config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0},
        /*debug: true*/
      }
  },
  canvas: document.getElementById("test"),
  scene: Game
};

var game = new Phaser.Game(config);

