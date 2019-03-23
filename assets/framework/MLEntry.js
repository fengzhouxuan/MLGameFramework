
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        this._resetML();
        this.modules = this.node.getComponentsInChildren('BaseModule');
        let compare = function (a1, a2) {
            let priority1 = a1.priority;
            let priority2 = a2.priority;
            if(priority1==-1 || priority2==-1){
                return 0;
            }
            return priority1 - priority2;
        }
        this.modules.sort(compare);
    },

    start () {
        for (let i = 0; i < this.modules.length; i++) {
            let module = this.modules[i];
            module.onStart();
        }

        for (let i = 0; i < this.modules.length; i++) {
            let module = this.modules[i];
            module.lateStart();
        }
    },

    update (dt) {
        ML.totalTime+=dt;
        for (let i = 0; i < this.modules.length; i++) {
            let module = this.modules[i];
            module.onUpdate(dt);
        }
    },

    _resetML(){
        ML.totalTime = 0;
    },
});
