let UIForm = require('UIForm');
cc.Class({
    extends: UIForm,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.msgLabel = this.node.getComponentInChildren(cc.Label);
        this.canvas = cc.Canvas.instance.node;
    },

    start() {

    },

    willShow(data){
        this.msgLabel.string = data;
        this.node.x = this.canvas.width / 2 + 10;
    },

    show(data) {
        let y = this.node.y;
        let width = 50+data.length*40;
        
        this.node.stopAllActions();
        setTimeout(() => {
            let delay = cc.delayTime(2.5);
            let moveTo1 = cc.moveTo(0.2, cc.v2(this.canvas.width / 2 - width-10, y));
            let moveTo2 = cc.moveTo(0.2, cc.v2(this.canvas.width / 2 + 10, y));
            let seq = cc.sequence(moveTo1, delay, moveTo2);
            this.node.runAction(seq);
        }, 0);
        
    },

    onDestroy() {
        this.node.stopAllActions();
    },

    // update (dt) {},
});
