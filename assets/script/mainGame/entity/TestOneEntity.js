let Entity = require('Entity');
cc.Class({
    extends: Entity,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

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
