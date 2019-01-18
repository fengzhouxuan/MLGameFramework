
cc.Class({
    properties: {
        entitys: [],
    },

    /**
     * 初始化对象池
     * @param {String} name 对象池名 
     * @param {Number} size 对象池大小，默认60
     * @param {Number} releaseInterval 对象池内对象释放的时间，默认30秒
     */
    init(name, size = 60, releaseInterval = 30) {
        this.poolName = name;
        this.size = size;
        this.releaseInterval = releaseInterval;

        this.loopInterval = 2;
        this.loopIntervalAdditive = 0;
    },

    /**
     * 对象池大小
     */
    size: function () {
        return this.entitys.length;
    },

    /**
     * 清空对象池
     */
    clear: function () {
        var count = this.entitys.length;
        for (var i = 0; i < count; ++i) {
            this.entitys[i].node.destroy();
        }
        this.entitys.length = 0;
    },

    /**
     * 放入对象池
     * @param {} entity 实体对象
     */
    put(entity) {
        if (this.entitys.length >= this.size) {
            return;
        }
        if (entity && this.entitys.indexOf(entity) === -1) {
            entity._MLPool_putDate = Date.now();
            this.entitys.push(entity);
        }
    },

    /**
     * 取出对象
     */
    get() {
        if (this.entitys.length == 0) {
            return null;
        }
        let last = this.entitys.length - 1;
        let entity = this.entitys[last];
        this.entitys.length = last;
        return entity;
    },

    onUpdate(dt) {
        this.loopIntervalAdditive += dt;
        if (this.loopIntervalAdditive >= this.loopInterval) {
            this.loopIntervalAdditive = 0;
            this._loopEntitysShouldRelease();
        }
    },

    _loopEntitysShouldRelease() {
        if (this.entitys.length == 0) return;
        //每次取出第0个判断是否过期，如果没过期则说明后面的都没过期
        let nowDate = Date.now();
        let out = false;
        while (!out) {
            if (this.entitys.length == 0) {
                out = true;
                break;
            }
            let firstEntity = this.entitys[0];
            if (nowDate - firstEntity._MLPool_putDate >= this.releaseInterval * 1000) {
                cc.js.array.remove(this.entitys, firstEntity);
                firstEntity.node.destroy();
            } else {
                out = true;
            }
        }
    },
});
