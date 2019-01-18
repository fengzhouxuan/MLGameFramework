
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    start() {
        this.loadScene();
    },

    loadScene() {
        cc.director.loadScene("main");
    },

    // update (dt) {},
});
