import Phaser from '../lib/phaser.js'
import Carrot from '../game/Carrot.js'
import CarrotGold from '../game/CarrotGold.js'

export default class Game extends Phaser.Scene {

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors

    /** @type {Phaser.Physics.Arcade.Group} */
    carrots

    /** @type {Phaser.Physics.Arcade.Group} */
    carrotGlolds

    /** @type {Phaser.GameObjects.Text} */
    pause

    // carrotsCollected = 0
    score = 0
    scoreFromItem = 0

    // /** @type {Phaser.GameObjects.Text} */
    // carrotsCollectedText

    /** @type {Phaser.GameObjects.Text} */
    scoreText

    jumpPower = -900
    audioBoolean = true
    chIndex = 0
    isPasue = false
    // /** @type {Phaser.GameObjects.Particles. ParticleEmitter} */
    // particleFlame
////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor() {
        super('game')
    }
////////////////////////////////////////////////////////////////////////////////////////////////////
    /**   
    * @param {Object} passedData
    */
    init(passedData){
        this.chIndex = passedData['ch-index']
        this.audioBoolean = passedData['audio-boolean']
        // this.carrotsCollected = 0
        this.score = 0
        this.scoreFromItem = 0
        this.isPasue = false
    }
////////////////////////////////////////////////////////////////////////////////////////////////////
    preload() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.load.image('background','assets/Background/backgroundEmpty.png')
        this.load.image('platform', 'assets/Environment/ground_grass.png')
        this.load.image('platform-broken', 'assets/Environment/ground_grass_broken.png')
        this.load.image('carrot','assets/Items/carrot.png')
        this.load.image('carrot-gold','assets/Items/carrot_gold.png')
        this.load.image('ch0','assets/Players/frog.png')
        this.load.image('ch1','assets/Players/narwhal.png')
        this.load.image('ch2','assets/Players/penguin.png')
        this.load.image('ch3','assets/Players/whale.png')
        this.load.image('ch0-jump','assets/Players/frog_jump.png')
        this.load.image('ch1-jump','assets/Players/narwhal_jump.png')
        this.load.image('ch2-jump','assets/Players/penguin_jump.png')
        this.load.image('ch3-jump','assets/Players/whale_jump.png')
        this.load.image('particle-flame','assets/Particles/flame.png')
        this.load.audio('jump','assets/sfx/phaseJump1.ogg')
        this.load.audio('sfx-collect1','assets/sfx/collect_01.ogg')
        this.load.audio('sfx-collect2','assets/sfx/collect_02.ogg')
        this.load.audio('sfx-levelup','assets/sfx/levelUp.ogg')
    }
////////////////////////////////////////////////////////////////////////////////////////////////////
    create() {
        this.sound.mute = this.audioBoolean
        this.add.image(240,320,'background')
            .setScale(0.8)
            .setTint("0xBCD4D8")
            .setScrollFactor(1,0)
        // this.add.image(240, 320, 'platform')
        //     .setScale(0.5)
        // this.physics.add.image(240, 320, 'platform')
        //     .setScale(0.5)
        this.platforms = this.physics.add.staticGroup()

        for (let i = 0; i < 5; ++i){
            const x = Phaser.Math.Between(80,400)
            const y = 150 * i
            
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x,y,'platform')
            platform.scale = 0.5

            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject()
        }

        this.player = this.physics.add.sprite(240,320,'ch'+this.chIndex)
            .setScale(0.5)
        
        this.physics.add.collider(this.platforms,this.player,this.collidePlayerPlatform)
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
        

        this.cameras.main.startFollow(this.player)
        this.cameras.main.setDeadzone(this.scale.width * 1.5,this.scale.height*0.5)

        // const carrot = new Carrot(this,240,320,'carrot')
        // this.add.existing(carrot)
        this.carrots = this.physics.add.group({
            classType: Carrot
        })
        // this.carrots.get(240,320,'carrot')

        this.physics.add.collider(this.platforms, this.carrots)
        this.physics.add.overlap(this.player,this.carrots,this.handleCollectCarrot,undefined,this)
        
        this.carrotGlolds = this.physics.add.group({
            classType: CarrotGold
        })
        this.physics.add.collider(this.platforms, this.carrotGlolds)
        this.physics.add.overlap(this.player,this.carrotGlolds,this.handleCollectCarrotGold,undefined,this)
        // const style = { color: '#000',fontSize:24}
        // this.carrotsCollectedText = this.add.text(240,10,'Carrots:0',style)
        //     .setScrollFactor(0)
        //     .setOrigin(0.5,0)

        const style = { color: '#000',fontSize:24}
        this.scoreText = this.add.text(this.scale.width*0.5,10,'Height:'+this.score,style)
            .setScrollFactor(0)
            .setOrigin(0.5,0)

        // this.particleFlame = this.add.particles('particle-flame')
        //     .createEmitter({
        //         speed: 50,
        //         scale: { start: 1, end: 0 },
        //         blendMode: 'ADD'
        //     })
        // this.particleFlame.startFollow(this.player)

        this.pause = this.add.text(this.scale.width*0.5,320,'PAUSE',{fontSize:48})
            .setOrigin(0.5)
            .setVisible(false)
            .setScrollFactor(0)
        this.input.keyboard.on('keydown_ESC',()=>{
            if(this.isPasue){
                this.physics.resume()
                this.isPasue = false
                this.pause.setVisible(false)
            }
            else
            {
                this.physics.pause()
                this.isPasue = true
                this.pause.setVisible(true)
            }          
        })

        

    }
////////////////////////////////////////////////////////////////////////////////////////////////////
    update(){
        ///////////////////////////////////////////////////////
        //player control
        const tdb = this.player.body.blocked.down

        if (tdb){
            this.player.setVelocityY(this.jumpPower)
            this.player.setTexture('ch'+this.chIndex+'-jump')
            this.sound.play('jump')
        }

        const vy = this.player.body.velocity.y
        if(vy>0 && this.player.texture.key === 'ch'+this.chIndex+'-jump') {
            this.player.setTexture('ch'+this.chIndex)
        }

        if (this.cursors.left.isDown && !tdb){
            this.player.setVelocityX(-300)
        }
        else if (this.cursors.right.isDown && !tdb){
            this.player.setVelocityX(300)
        }
        else
        {
            this.player.setVelocityX(0)
        }
        ///////////////////////////////////////////////////////
        this.reusePlatforms()
        this.horizontalWrap(this.player)
        ///////////////////////////////////////////////////////
        //Score
        const newScore = (Math.floor(this.player.y*-1/100)+4)
        if (newScore > this.score)
            this.score = newScore
        this.scoreText.text = 'Height:'+(this.score+this.scoreFromItem)
        ///////////////////////////////////////////////////////
        //Speed controll
        if (this.score%100 === 10){
            this.score += 1
            console.log("levelup")
            this.sound.play('sfx-levelup')
            this.jumpPower -= 100
            this.player.setGravityY(Math.floor((Math.pow(this.jumpPower,2)/405)) -2000)
            
            const popup = this.add.text(this.player.x,this.player.y,'levelup++',{fontSize:36,color: '#314770'})
            this.tweens.add({
                targets:popup,
                alpha: 0,
                duration:1000 ,
                ease: 'Power2',
                onStop:(popup)=>{
                    popup.destroy()
                }
            })
        }
        ///////////////////////////////////////////////////////
        //Game Over
        const bottomPlatform = this.findBottomMostPlatform()
        if(this.player.y > bottomPlatform.y+25){
            this.time.delayedCall(120,()=>{
                this.scene.start('game-over',{'score':this.score+this.scoreFromItem})
            })
        }

    }
////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
    *@param {Phaser.GameObjects.Sprite} sprite
    */
    horizontalWrap(sprite){
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        if(sprite.x < -halfWidth){
            sprite.x = gameWidth + halfWidth
        }
        else if (sprite.x > gameWidth + halfWidth){
            sprite.x = -halfWidth
        }
    }

    /**
    *@param {Phaser.GameObjects.Sprite} sprite
    */
    addCarrotAbove(sprite){
        const y = sprite.y -sprite.displayHeight

        /** @type {Phaser.Physics.Arcade.Sprite} */
        const carrot = this.carrots.get(sprite.x-Phaser.Math.Between(-1*sprite.displayWidth*0.5,sprite.displayWidth*0.5),y,'carrot')
        const body = carrot.body
        body.updateFromGameObject()
        return carrot
    }

    /**
    * @param {Phaser.Physics.Arcade.Sprite} player
    * @param {Carrot} carrot
    */
   handleCollectCarrot(player,carrot){
        this.sound.play('sfx-collect1')
        carrot.setPosition(-100,700)
        this.scoreFromItem += 10
        const popup = this.add.text(player.x,player.y,'+10',{fontSize:36,color: '#000'})
        this.tweens.add({
            targets:popup,
            alpha: 0,
            duration:1000 ,
            ease: 'Power2',
            onStop:(popup)=>{
                popup.destroy()
            }
        })
   }

   /**
    *@param {Phaser.GameObjects.Sprite} sprite
    */
   addCarrotGoldAbove(sprite){
    const y = sprite.y -sprite.displayHeight

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrotGold = this.carrotGlolds.get(sprite.x+Phaser.Math.Between(-1*sprite.displayWidth*0.5,sprite.displayWidth*0.5),y,'carrot-gold')
    const body = carrotGold.body
    body.updateFromGameObject()
    return carrotGold
}

   /**
    * @param {Phaser.Physics.Arcade.Sprite} player
    * @param {CarrotGold} carrotGlold
    */
   handleCollectCarrotGold(player,carrotGlold){
        this.sound.play('sfx-collect2')
        carrotGlold.setPosition(-100,700)
        this.scoreFromItem += 100
        const popup = this.add.text(player.x,player.y,'+100',{fontSize:36,color: '#000'})
        this.tweens.add({
            targets:popup,
            alpha: 0,
            duration:1000 ,
            ease: 'Power2',
            onStop:(popup)=>{
                popup.destroy()
            }
        })
    }

   reusePlatforms(){
    this.platforms.children.iterate(child => {
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const platform = child

        const scrollY = this.cameras.main.scrollY
        if (platform.y >= scrollY + 700){
            platform.y = scrollY 
            platform.x = Phaser.Math.Between(0,480)
            platform.setTexture('platform')
            platform.enableBody()
            platform.active = true
            platform.visible = true
            platform.body.updateFromGameObject()
            if(this.score%10 === 0){
                this.addCarrotAbove(platform)
            }
            if(this.score%20 === 0){
                this.addCarrotGoldAbove(platform)
            }
            
        }
    })
   }

   findBottomMostPlatform(){
       const platforms = this.platforms.getChildren()
       let bottomPlatform = platforms[0]
       for(let i=1;i<platforms.length;i++){
           const platform = platforms[i]
           if(platform.y<bottomPlatform.y){
               continue
           }
           bottomPlatform = platform
       }
       return bottomPlatform
   }

   /**
    * @param {Phaser.Physics.Arcade.Sprite} player
    * @param {Phaser.Physics.Arcade.Sprite} platform
    */
    collidePlayerPlatform(player,platform){
        if(!player.body.blocked.down || player.getBottomCenter().y > platform.getTopCenter().y)
            return
        
        if(platform.texture.key !== 'platform-broken'){
            platform.setTexture('platform-broken')
        }
        else{
            platform.disableBody()
            platform.active = false
            platform.visible = false
        }
            
        
    }

}