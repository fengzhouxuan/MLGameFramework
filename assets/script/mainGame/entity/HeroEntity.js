let Entity = require('Entity');

cc.Class({
    extends: Entity,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.speed = 1000;
    },

    onUpdate (dt) {
        if(this.node.y>=1000){
            ML.entity.hideEntity(this);
            // this.speed = 0;
        }
        this.node.y+=1000*dt;
    },
});
