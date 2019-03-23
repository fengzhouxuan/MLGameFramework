const BaseModule = require('BaseModule');
let EntityPool = require('EntityPool');
cc.Class({
    extends: BaseModule,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.moduleName = 'entityPool';
        this._super();

        this.entityPools = new ML.MLDictionary();
    },

    getOrCreatePool(name, size = 30, releaseInterval = 30) {
        let entityPool = this.getEntityPool(name);
        if (!entityPool) {
            entityPool = this.createEntityPool(name, size, releaseInterval);
        }
        return entityPool;
    },

    createEntityPool(name, size, releaseInterval) {
        let entityPool = new EntityPool();
        entityPool.init(name, size, releaseInterval);
        this.entityPools.add(name,entityPool);
        return entityPool;
    },

    getEntityPool(name) {
        return this._findEntityPool(name);
    },

    _findEntityPool(name) {
        return this.entityPools.valueForKey(name);
    },

    update(dt) {
        for (let key in this.entityPools.data) {
            let entityPool = this.entityPools.data[key];
            entityPool.onUpdate(dt);
        }
    },
});
