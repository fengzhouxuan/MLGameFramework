

cc.Class({
    extends: cc.Component,

    properties: {
        tagName:'',
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.background = this.node.getChildByName('background');
        this.dot = this.node.getChildByName('dot');
        this.node.height = this.background.height;
        this.node.width = this.background.width;
        this.radius = this.node.height/2;
    },

    onEnable(){
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancle,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
    },

    onDisable(){
        this.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancle,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
    },

    start () {

    },

    onTouchStart(event){
        let touchpoint = event.touch.getStartLocation();
        let currentTouchPoint = this.node.convertToNodeSpaceAR(touchpoint);
        let length = cc.pLength(currentTouchPoint);
        let pi = cc.pAngleSigned(cc.Vec2.RIGHT,currentTouchPoint);
        if(length>this.radius){
            currentTouchPoint.x = Math.cos(pi)*this.radius;
            currentTouchPoint.y = Math.sin(pi)*this.radius;
        }
        this.dot.position = currentTouchPoint;
    },
    onTouchMove(event){
        let currentTouchPoint = event.touch.getLocation();
        currentTouchPoint = this.node.convertToNodeSpaceAR(currentTouchPoint);
        let length = cc.pLength(currentTouchPoint);
        let pi = cc.pAngleSigned(cc.Vec2.RIGHT,currentTouchPoint);
        if(length>this.radius){
            currentTouchPoint.x = Math.cos(pi)*this.radius;
            currentTouchPoint.y = Math.sin(pi)*this.radius;
            length = 1;
        }
        this.dot.position = currentTouchPoint;

        let normalizeDir = cc.v2.ZERO;
        if(!cc.pointEqualToPoint(cc.Vec2.ZERO,currentTouchPoint)){
            normalizeDir = cc.pNormalize(currentTouchPoint);
        }
        let data = {
            dir:normalizeDir,
            moveLength:length,
            joystick:this,
        };
        ML.event.sendEventImmediately('onJoystickUpdate',data);
    },
    onTouchCancle(event){
        this.dot.position = cc.Vec2.ZERO;
        let data = {
            dir:cc.Vec2.ZERO,
            moveLength:0,
            joystick:this,
        };
        ML.event.sendEventImmediately('onJoystickStop',data);
    },
    onTouchEnd(event){ 
        this.dot.position = cc.Vec2.ZERO;
        let data = {
            dir:cc.Vec2.ZERO,
            moveLength:0,
            joystick:this,
        };
        ML.event.sendEventImmediately('onJoystickStop',data);
    },

    // update (dt) {},
});
