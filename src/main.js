import Phaser from './lib/phaser.js'

import Menu from './scenes/Menu.js'
import PreGame from './scenes/PreGame.js'
import Game from './scenes/Game.js'
import GameOver from './scenes/GameOver.js'


export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    scene: [Menu,PreGame,Game,GameOver],
    physics:{
        default: 'arcade',
        arcade:{
            gravity:{
                y: 2000
            },
            debug: false
        }
    }
    
})
  
