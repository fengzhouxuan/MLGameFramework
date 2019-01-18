
const BaseModule = require('BaseModule');
cc.Class({
    extends: BaseModule,

    properties: {
        open: {
            default: true,
            displayName: '(open)日志开关'
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.moduleName = 'log';
        this._super();
    },

    log(msg) {
        if (!this.open) return;
        console.log(msg);
    },
    i(msg, obj) {
        if (!this.open) return;
        console.log(msg, obj);
    },
    w(msg,obj){
        if(!this.open) return;
        console.warn(msg,obj);
    },

});

var callFuncs = cc.Class({
    properties: {
        callback: null,
    }
});
