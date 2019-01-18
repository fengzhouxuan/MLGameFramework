const BaseModule = require('BaseModule');

cc.Class({
    extends: BaseModule,

    properties: {
        brickClip: {
            default: null,
            type: cc.AudioClip
        },
        roundEndClip: {
            default: null,
            type: cc.AudioClip
        },
        laserShootClip: {
            default: null,
            type: cc.AudioClip
        },
        laserLongClip: {
            default: null,
            type: cc.AudioClip
        },
        boomClip:{
            default: null,
            type: cc.AudioClip
        },
        doubleBallClip:{
            default: null,
            type: cc.AudioClip
        },
        // levelCompleteClip: {
        //     default: null,
        //     type: cc.AudioClip
        // },
        startBtn1Clip:{
            default: null,
            type: cc.AudioClip
        },
        btn2Clip:{
            default: null,
            type: cc.AudioClip
        },
        btn3Clip:{
            default: null,
            type: cc.AudioClip
        },
        star1Clip:{
            default: null,
            type: cc.AudioClip
        },
        star2Clip:{
            default: null,
            type: cc.AudioClip
        },
        star3Clip:{
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.moduleName = 'audio';
        this._super();
        cc.audioEngine.setMaxAudioInstance = 10;
        this.brickClipIds = [];
        this.brickCount = 0;
        this.playBrickDefaultInterval = 0.07;
        this.playBrickInterval = this.playBrickDefaultInterval;
        this.playBrickAdditive = this.playBrickInterval;
        this.lastPlayBrickTime = null;
        this.laserClipIds = [];
        this.boomCount = 0;
        this.playBoomDefaultInterval = 0.3;
        this.playBoomInterval = this.playBoomDefaultInterval;
        this.playBoomAdditive = this.playBoomInterval;
        this.lastPlayBoomTime = null;

    },

    onUpdate(dt) {
        this.playBrickAdditive+=dt;
        if(this.playBrickAdditive>=this.playBrickInterval){
            this._loopPlayBrick();
            this._loopPlayBoom();
            this.playBrickAdditive = 0;
        }
        if(this.playBoomAdditive>=this.playBoomInterval){
            this._loopPlayBoom();
            this.playBoomAdditive = 0;
        }
        if (this.brickClipIds.length != 0) {
            for (let i = 0; i < this.brickClipIds.length; i++) {
                let clipId = this.brickClipIds[i];
                var state = cc.audioEngine.getState(clipId);
                if (state < 0) {
                    this.brickClipIds.splice(i, 1);
                    i--;
                }
            }
        }
        if (this.laserClipIds.length != 0) {
            for (let i = 0; i < this.laserClipIds.length; i++) {
                let clipId = this.laserClipIds[i];
                var state = cc.audioEngine.getState(clipId);
                if (state < 0) {
                    this.laserClipIds.splice(i, 1);
                    i--;
                }
            }
        }
    },

    _loopPlayBrick(){
        if(this.brickCount==0){
            return;
        }
        if(this.brickCount>0){
            let id = this.playAudio(this.brickClip, false, 1);
            this.brickClipIds.push(id);
            this.brickCount--;
        }   
        let dis = Date.now() - this.lastPlayBrickTime;
        if(dis>120){
            //长时间没有触发
            this.brickCount = 0;
            this.lastPlayBrickTime = null;
            return;
        }
    },
    
    _loopPlayBoom(){
        if(this.boomCount==0){
            return;
        }
        if(this.boomCount>0){
            this.playAudio(this.boomClip, false, 0.5);
            this.boomCount=0;
        }
        let boomDis = Date.now() - this.lastPlayBoomTime;
        if(boomDis>100){
            this.boomCount==0;
            this.lastPlayBoomTime = null;
            return;
        }
    },

    playBrick(speed) {
        if(speed!==undefined || speed!==null){
            this.playBrickInterval = this.playBrickDefaultInterval-0.01*speed;
        }
        if(this.lastPlayBrickTime==null){
            this.brickCount++;
            this.lastPlayBrickTime = Date.now();
            return;
        }
        this.brickCount++;
        this.lastPlayBrickTime = Date.now();
    },

    playLaserShoot() {
        if (this.laserClipIds.length >= 5) {
            return;
        }
        let id = this.playAudio(this.laserShootClip, false, 1);
        this.laserClipIds.push(id);
    },
    playLaserLong(){
        this.playAudio(this.laserLongClip,false,1);
    },

    playBoom(){
        if(this.lastPlayBoomTime==null){
            this.boomCount++;
            this.lastPlayBoomTime = Date.now();
            return;
        }
        this.boomCount++;
        this.lastPlayBoomTime = Date.now();
        // this.playAudio(this.boomClip, false, 1);
    },

    playDoubleBall(){
        this.playAudio(this.doubleBallClip,false,1);
    },

    playRoundEnd() {
        this.playAudio(this.roundEndClip, false, 1);
    },

    // playLevelComplete(){
    //     this.playAudio(this.levelCompleteClip,false,1);
    // },

    //游戏开始、下一关、无尽模式
    playBtn1(){
        this.playAudio(this.startBtn1Clip,false,1);
    },

    //关卡模式，分享游戏
    playBtn2(){
        this.playAudio(this.btn2Clip,false,1);
    },
    //点击关卡，返回首页
    playBtn3(){
        this.playAudio(this.btn3Clip,false,1);
    },

    playStar1(){
        this.playAudio(this.star1Clip,false,1);
    },

    playStar2(){
        this.playAudio(this.star2Clip,false,1);
    },

    playStar3(){
        this.playAudio(this.star3Clip,false,1);
    },

    playAudio(clip, loop, volume) {
        return cc.audioEngine.play(clip, loop, volume);
    },
});
