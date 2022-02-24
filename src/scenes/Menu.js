import Phaser from '../lib/phaser.js'



export default class GameOver extends Phaser.Scene{

    /** @type {Phaser.GameObjects.Image}  */
    start

    /** @type {Phaser.GameObjects.Image}  */
    exit

    /** @type {Phaser.GameObjects.Image}  */
    cursor

    constructor(){
        super('menu')
    }

    preload(){
        this.load.image('bg','assets/Background/bg_menu.png')
        this.load.image('cursor','assets/UI/cursor.png')
        this.load.image('select-01','assets/UI/select01.png')
        this.load.image('select-02','assets/UI/select02.png')
        this.load.image('select-03','assets/UI/select03.png')
        this.load.audio('sfx-select','assets/sfx/select.ogg')
        this.load.audio('sfx-confirm','assets/sfx/confirmation.ogg')
    }
    create(){
        const width = this.scale.width
        const height = this.scale.height
        this.add.image(width*0.5,height*0.5,'bg')

        this.start = this.add.image(width*0.5,height*2/3,'select-02')
        this.add.text(width*0.5,height*2/3,'Start',{fontSize:36,color: '#000'})
            .setOrigin(0.5)

        this.exit = this.add.image(width*0.5,height*5/6,'select-01')
        this.add.text(width*0.5,height*5/6,'Exit',{fontSize:36,color: '#000'})
            .setOrigin(0.5)

        this.cursor = this.add.image(width*0.5 -150, this.start.y,'cursor')
            .setScale(0.5)

        this.input.keyboard.on('keydown_DOWN',()=>{
            this.sound.play('sfx-select')
            if(this.cursor.y === this.start.y){
                this.cursor.y = this.exit.y
                this.start.setTexture('select-01')
                this.exit.setTexture('select-02')
            }
            else{
                this.cursor.y = this.start.y
                this.start.setTexture('select-02')
                this.exit.setTexture('select-01')
            }
        })
        this.input.keyboard.on('keydown_UP',()=>{
            this.sound.play('sfx-select')
            if(this.cursor.y === this.start.y){
                this.cursor.y = this.exit.y
                this.start.setTexture('select-01')
                this.exit.setTexture('select-02')
            }
            else{
                this.cursor.y = this.start.y
                this.start.setTexture('select-02')
                this.exit.setTexture('select-01')
            }
        })
        this.input.keyboard.on('keydown_SPACE',()=>{
            this.sound.play('sfx-confirm')
            if(this.cursor.y === this.start.y){
                this.start.setTexture('select-03')
                this.time.delayedCall(120,()=>{
                    this.scene.start('pre-game')
                })
            }
            else{
                this.exit.setTexture('select-03')
                this.time.delayedCall(120,()=>{
                    this.scene.stop()
                })
            }
        })
        
    }
}