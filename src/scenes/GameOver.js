import Phaser from '../lib/phaser.js'

export default class GameOver extends Phaser.Scene{

    score = 0

    constructor(){
        super('game-over')
    }

    init(passData){
        this.score = passData['score']
    }
    create(){
        const width = this.scale.width
        const height = this.scale.height
        this.add.text(width*0.5,height*0.5,'Game Over',{fontSize:48})
            .setOrigin(0.5)
        this.add.text(width*0.5,height*0.6,'score:'+this.score,{fontSize:32})
        .setOrigin(0.5)
        this.input.keyboard.once('keydown_SPACE',()=>{
            this.scene.start('game')
        })
    }
}