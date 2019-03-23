
const mlRegister = require('MLRegister');
cc.Class({
    extends: cc.Component,
    properties: {
        moduleName: {
            default: '',
            visible: false,
        },
        //优先级，值越小优先级越低,优先级高的会先执行onStart等生命周期
        priority: {
            default: 1000000,
            visible: true,
            tooltip:'优先级,0~100框架保留',
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        mlRegister.regisiterModule(this);
    },

    onStart() {

    },

    lateStart(){

    },

    onUpdate(dt){

    },
});
