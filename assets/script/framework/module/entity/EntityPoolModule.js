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

        this.entityPools = [];
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
        this.entityPools.push(entityPool);
        return entityPool;
    },

    getEntityPool(name) {
        return this._findEntityPool(name);
    },

    _findEntityPool(name) {
        for (let i = 0; i < this.entityPools.length; i++) {
            let entityPool = this.entityPools[i];
            if (entityPool.poolName === name) {
                return entityPool;
            }
        }
        return null;
    },

    update(dt) {
        for (let i = 0; i < this.entityPools.length; i++) {
            let entityPool = this.entityPools[i];
            entityPool.onUpdate(dt);
        }
    },
});
