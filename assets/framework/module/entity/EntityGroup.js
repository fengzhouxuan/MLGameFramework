
cc.Class({
    name: 'EntityGroup',
    properties: {
        entityLogics: [],
    },

    ctor: function () {
        // this.groupName = arguments[0];
        this.groupData = arguments[0];
        this._paused = false;
    },

    addEntityLogic(entityLogic) {
        entityLogic.entityGroup = this;
        this.entityLogics.push(entityLogic);
    },

    removeEntityLogic(entityLogic) {
        cc.js.array.remove(this.entityLogics, entityLogic);
    },

    pause() {
        this._paused = true;
    },

    resume() {
        this._paused = false;
    },

    onUpdate(dt) {
        if (this._paused) { return; }
        if (this.entityLogics.length == 0) { return; }
        for (let i = 0; i < this.entityLogics.length; i++) {
            let entityLogic = this.entityLogics[i];
            if (!entityLogic.node.active) {
                continue;
            }
            entityLogic.onUpdate(dt);
        }
    },

    showEntity(id, prefab, parentNode, data) {
        let entityLogic = this._showEntity(prefab);
        entityLogic.entityId = id;
        entityLogic.node.parent = parentNode;
        entityLogic.willShow(data);
        entityLogic.node.active = true;
        entityLogic.onShow(data);
        //放入实体组
        this.addEntityLogic(entityLogic);
        return entityLogic;
    },

    hideEntity(entityLogic, data) {
        this._hideEntity(entityLogic, data);
    },

    _showEntity(prefab) {
        let name = prefab.name;
        let pool = this._getOrNewEntityPool(name);
        let entity = pool.get();
        if (entity == null) {
            entity = this._createEntity(prefab);
        }
        entity.poolName = pool.poolName;
        return entity;
    },

    _hideEntity(entityLogic, data) {
        let pool = this._getOrNewEntityPool(entityLogic.poolName);
        entityLogic.willHide(data);
        entityLogic.node.active = false;
        this.removeEntityLogic(entityLogic);
        entityLogic.onHide(data);
        pool.put(entityLogic);
    },

    _createEntity(prefab) {
        let entityNode = cc.instantiate(prefab);
        let entity = entityNode.getComponent('Entity');
        entityNode.entity = entity;
        return entity;
    },

    _getOrNewEntityPool(name) {
        return ML.entityPool.getOrCreatePool(name, this.groupData.poolSize, this.groupData.autoReleseInterval);
    },
});
