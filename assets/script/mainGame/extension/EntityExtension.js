
cc.Class({
    extends: cc.Component,

    properties: {
        test:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ML.entityExtension = this;
    },

    start(){
        this.schedule(this.sssss,0.3,2,1);
    },

    sssss(){
        this.showTest();
    },

    showTest(){
        let entity = ML.entity.showEntity(this.test,cc.director.getScene(),null);
        entity.node.position = cc.v2(300,100);
    },

});
