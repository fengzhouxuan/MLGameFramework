const BaseModule = require('BaseModule');
cc.Class({
    extends: BaseModule,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.moduleName = 'FSM';
        this._super();

        this.machines = [];
    },

    

    onUpdate (dt) {},
});
