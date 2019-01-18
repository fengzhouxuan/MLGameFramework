const BaseModule = require('BaseModule');
let EntityGroup = require('EntityGroup');
cc.Class({
    extends: BaseModule,

    properties: {
        entityGroupNames: [cc.String],
    },

    onLoad() {
        this.moduleName = 'entity';
        this._super();
        // this.entityPools = [];
        this.entityGroups = [];
        this._serializeId = 0;

        //创建实体组
        this.initEntityGroups();
    },

    update(dt) {
        if (this.paused) return;
        for (let i = 0; i < this.entityGroups.length; i++) {
            let entityGroup = this.entityGroups[i];
            entityGroup.onUpdate(dt);
        }
    },

    pause() {
        this.paused = true;
    },

    resume() {
        this.paused = false;
    },

    initEntityGroups() {
        //创建默认实体组
        this.createEntityGroup('default');
        for (let i = 0; i < this.entityGroupNames.length; i++) {
            let entityGroupName = this.entityGroupNames[i];
            if (entityGroupName === 'default') {
                continue;
            }
            this.createEntityGroup(entityGroupName);
        }
    },

    createEntityGroup(name) {
        let group = new EntityGroup(name);
        this.entityGroups.push(group);
    },

    gerEntityGroup(name) {
        for (let index = 0; index < this.entityGroups.length; index++) {
            let entityGroup = this.entityGroups[index];
            if (entityGroup.groupName === name) {
                return entityGroup;
            }
        }
        cc.error('不存在该实体组：', name);
    },

    showEntity(prefab, parentNode, data, groupName = 'default') {
        let entity = this._showEntity(prefab);
        entity.entityId = this._serializeId--;
        entity.node.parent = parentNode;
        entity.willShow(data);
        entity.node.active = true;
        entity.onShow(data);
        //放入实体组
        let cachedEntityGroup = entity.entityGroup;
        if (cachedEntityGroup) {
            if (cachedEntityGroup.groupName !== groupName) {
                cachedEntityGroup = this.gerEntityGroup(groupName);
            } 
        } else {
            cachedEntityGroup = this.gerEntityGroup(groupName);
        }
        cachedEntityGroup.addEntityLogic(entity);
        return entity;
    },

    hideEntity(entity, data) {
        this._hideEntity(entity, data);
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

    _hideEntity(entity, data) {
        let pool = this._getOrNewEntityPool(entity.poolName);
        entity.willHide(data);
        entity.node.active = false;
        entity.entityGroup.removeEntityLogic(entity);
        entity.onHide(data);
        pool.put(entity);
    },

    _createEntity(prefab) {
        let entityNode = cc.instantiate(prefab); 
        let entity = entityNode.getComponent('Entity');
        entityNode.entity = entity;
        return entity;
    },

    _getOrNewEntityPool(name) {
        return ML.entityPool.getOrCreatePool(name);
    },

});
