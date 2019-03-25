
cc.Class({
    extends: cc.Component,

    properties: {
        test1:cc.Prefab,
        test2:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ML.entityExtension = this;
    },

    start(){
        this.schedule(this.sssss,0.3,100,1);
    },

    sssss(){
        this.showTest();
    },

    showTest(){
        let entity = ML.entity.showEntity(this.test1,cc.director.getScene(),null);
        entity.node.position = cc.v2(300,100);
        let entityTest2 = ML.entity.showEntity(this.test2,cc.director.getScene(),null);
        entityTest2.node.position = cc.v2(0,0);
        ML.entity.attachToEntity(entityTest2,entity,null,null);
    },

});
