
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.parentEntityLogic = null;
        this.childrenEntityLogic = [];
    },

    start() {},
    willShow(data) { },
    onShow(data) { },
    onUpdate(dt) { },
    /**
     * 当有子实体附加时调用，父实体触发
     * @param {*} childEntity 子实体
     * @param {*} nodeAttached 子实体附加的节点
     * @param {*} userData 
     */
    onAttached(childEntity,nodeAttached,userData){},
    /**
     * 当附加到父实体时调用，子实体触发
     * @param {*} parentEntityLogic 父实体
     * @param {*} nodeAttachTo 父实体的节点
     * @param {*} userData 
     */
    onAttachTo(parentEntityLogic,nodeAttachTo,userData){},
    /**
     * 子实体分开时调用，父实体触发
     * @param {} childEntity 
     * @param {*} userData 
     */
    onDetached(childEntity,userData){},
    /**
     * 子实体从父实体离开时调用，子实体触发
     * @param {} parentEntity 
     * @param {*} userData 
     */
    onDetachFrom(parentEntity, userData){},
    willHide(data) { },
    onHide(data) { },

    unuse() {
    },
    reuse() {
    },
});
