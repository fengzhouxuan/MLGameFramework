const BaseModule = require('BaseModule');
let EntityGroup = require('EntityGroup');
let EntityGroupData = require("EntityGroupData");
cc.Class({
    extends: BaseModule,

    properties: {
        groups: [EntityGroupData],
    },

    onLoad() {
        this.moduleName = 'entity';
        this._super();
        this.entityGroups = new ML.MLDictionary();
        this._serializeId = 0;

        //创建实体组
        this.initEntityGroups();
    },

    update(dt) {
        if (this.paused) return;
        for (let key in this.entityGroups.data) {
            let entityGroup = this.entityGroups.data[key];
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
        if (this.groups.length == 0) {
            //创建默认实体组
            let entityGroupData = new EntityGroupData();
            entityGroupData.name = 'Default';
            this.createEntityGroup(entityGroupData);
        }
        for (let i = 0; i < this.groups.length; i++) {
            let entityGroupData = this.groups[i];
            this.createEntityGroup(entityGroupData);
        }
    },

    createEntityGroup(entityGroupData) {
        let group = new EntityGroup(entityGroupData);
        this.entityGroups.add(entityGroupData.name, group);
    },

    getEntityGroup(name) {
        let group = this.entityGroups.valueForKey(name);
        if (!group) {
            cc.error('不存在该实体组：', name);
        }
        return group;
    },

    showEntity(prefab, parentNode, data, groupName = 'Default') {
        let entityGroup = this.getEntityGroup(groupName);
        return entityGroup.showEntity(this._serializeId--, prefab, parentNode, data);
    },

    hideEntity(entityLogic, data) {
        let childrenEntityLogic = entityLogic.childrenEntityLogic;
        for (let i = 0; i < childrenEntityLogic.length; i++) {
            let logic = childrenEntityLogic[i];
            this.hideEntity(logic, data);
        }
        this.detachedEntity(entityLogic);
        entityLogic.entityGroup.hideEntity(entityLogic, data);
    },

    /**
     * 附加子物体
     * @param {*} entityLogic 子物体
     * @param {*} parentEntityLogic 父物体 
     * @param {*} targetNode 
     * @param {*} userData 
     */
    attachToEntity(entityLogic, parentEntityLogic, targetNode = null, userData = null) {
        if (targetNode == null) {
            targetNode = parentEntityLogic.node;
        }
        this.detachedEntity(entityLogic);
        //父
        parentEntityLogic.childrenEntityLogic.push(entityLogic);
        parentEntityLogic.onAttached(entityLogic, targetNode, userData);
        //子
        entityLogic.parentEntityLogic = parentEntityLogic;
        entityLogic.node.parent = targetNode;
        entityLogic.onAttachTo(parentEntityLogic, targetNode, userData);
    },

    /**
     * 从父物体上解除子物体
     * @param {*} entityLogic 子物体
     * @param {*} userData 
     */
    detachedEntity(entityLogic, userData = null) {
        let parentEntityLogic = entityLogic.parentEntityLogic;
        if (!parentEntityLogic) {
            return;
        }
        //父
        cc.js.array.remove(parentEntityLogic.childrenEntityLogic, entityLogic);
        parentEntityLogic.onDetached(entityLogic, userData);
        //子
        entityLogic.parentEntityLogic = null;
        entityLogic.node.parent = null;
        entityLogic.onDetachFrom(parentEntityLogic, userData);
    },
});
