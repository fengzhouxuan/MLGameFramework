
cc.Class({
    name: 'EntityGroup',
    properties: {
        groupName: 'default',
        entityLogics: [],
    },

    ctor: function () {
        this.groupName = arguments[0];

        this._paused = false;
    },

    addEntityLogic(entityLogic){
        entityLogic.entityGroup = this;
        this.entityLogics.push(entityLogic);
    },

    removeEntityLogic(entityLogic){
        cc.js.array.remove(this.entityLogics,entityLogic);
    },

    pause(){
        this._paused = true;
    },

    resume(){
        this,_paused = false;
    },

    onUpdate(dt) {
        if (this._paused) { return; }
        if (this.entityLogics.length == 0) { return; }
        for (let i = 0; i < this.entityLogics.length; i++) {
            let entityLogic = this.entityLogics[i];
            if(!entityLogic.node.active){
                continue;
            }
            entityLogic.onUpdate(dt);
        }
    },
});
