var UIForm = require('UIForm');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._msgLabel = this.node.getChildByName('bg').getChildByName('_msg').getComponent(cc.Label);
        this.msgLabel = this.node.getChildByName('msg').getComponent(cc.Label);
    },

    show(data) {
        this.node.opacity = 255;
        this.node.stopAllActions();
        this._msgLabel.string = data;
        this.msgLabel.string = data;
        let delay = cc.delayTime(2);
        let fade = cc.fadeOut(0.5);
        this.node.runAction(cc.sequence(delay,fade));
    },

    onDestroy(){
        this.node.stopAllActions();
    },

    // update (dt) {},
});
