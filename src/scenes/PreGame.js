import Phaser from '../lib/phaser.js'

export default class GameOver extends Phaser.Scene{

    /** @type {Phaser.GameObjects.Image}  */
    ch

    /** @type {Phaser.GameObjects.Image}  */
    left

    /** @type {Phaser.GameObjects.Image}  */
    right

    /** @type {Phaser.GameObjects.Image}  */
    start

    /** @type {Phaser.GameObjects.Image}  */
    audio

    // audioBoolean = true
    /** @type {Number}  */
    chIndex

////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(){
        super('pre-game')
    }
////////////////////////////////////////////////////////////////////////////////////////////////////
    init(){
        this.chIndex = 0
    }
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
    preload(){
        this.load.image('left','assets/UI/left.png')
        this.load.image('right','assets/UI/right.png')
        this.load.image('audio-off','assets/UI/audioOff.png')
        this.load.image('audio-on','assets/UI/audioOn.png')
        this.load.image('start','assets/UI/buttonStart.png')
        this.load.image('ch0','assets/Players/frog.png')
        this.load.image('ch1','assets/Players/narwhal.png')
        this.load.image('ch2','assets/Players/penguin.png')
        this.load.image('ch3','assets/Players/whale.png')
        this.load.audio('sfx-confirm','assets/sfx/confirmation.ogg')
        this.load.audio('sfx-slide','assets/sfx/chSlide.ogg')
        this.load.audio('sfx-select','assets/sfx/select.ogg')
    }
////////////////////////////////////////////////////////////////////////////////////////////////////
    create(){
        const width = this.scale.width
        const height = this.scale.height

        this.ch = this.add.image(width*0.5,height*0.5,'ch0')

        this.left = this.add.image(width/3,height*0.5,'left')
            .setOrigin(1,0.5)
        this.right = this.add.image(width/3*2,height*0.5,'right')
            .setOrigin(0,0.5)
        this.audio = this.add.image(width,height,'audio-on')
            .setOrigin(1,1)
            .setScale(0.5)
        this.start = this.add.image(width*0.5,height*4/5,'start')
            .setOrigin(0.5,1)
        
        this.add.text(width*0.5,height*4/5,'PRESS SPACEBAR',{fontSize:16})
            .setOrigin(0.5,0)

        this.input.keyboard.on('keydown_LEFT',()=>{
            this.sound.play('sfx-slide')
            this.left.setTint(0xFF7F00)
            this.chIndex = (this.chIndex + 1)%4 
            const key = 'ch'+Math.abs(this.chIndex)
            this.ch.setTexture(key)
            this.time.delayedCall(120,()=>{
                this.left.setTint()
            })
        })
        
        

        this.input.keyboard.on('keydown_RIGHT',()=>{
            this.sound.play('sfx-slide')
            this.right.setTint(0xFF7F00)
            this.chIndex = (this.chIndex - 1)%4 
            const key = 'ch'+Math.abs(this.chIndex)
            this.ch.setTexture(key)
            this.time.delayedCall(120,()=>{
                this.right.setTint()
            })
        })

        this.input.keyboard.on('keydown_M',()=>{
            this.sound.play('sfx-select')
            if(this.sound.mute === true){
                this.audio.setTexture('audio-on')
                this.sound.mute = false
            }
            else{
                this.audio.setTexture('audio-off')
                this.sound.mute = true
            }
        })

        this.input.keyboard.once('keydown_SPACE',()=>{
            this.sound.play('sfx-confirm')
            this.start.setTint(0xFF7F00)
            this.time.delayedCall(120,()=>{
                this.start.setTint()
                this.scene.start('game',{'ch-index':Math.abs(this.chIndex),'audio-boolean':this.sound.mute})
            })
            
        })
    }

}