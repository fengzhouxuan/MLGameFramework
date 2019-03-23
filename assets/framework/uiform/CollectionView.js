
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        // itemPrefab:cc.Prefab,
        itemSize: cc.Vec2,
        spacingX: 0,
        spacingY: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.items = [];
        this.currentItemCount = 0,
            this.resueItems = [];
        this.lastContentPosY = 0
        this.scrollView.node.on('scrolling', this._onScrolling, this);
        this.contentNode = this.scrollView.content;
    },

    start() {
        this._initList();
    },

    getReuseItem() {
        if (this.resueItems.length == 0) {
            return null;
        }
        return this.resueItems.pop();
    },

    reload() {
        //
        if (!this.items) return;
        let oldCount = this.currentItemCount;
        let newCount = this._getItemCount();
        //新数据长度等于旧数据长度
        if (newCount == oldCount) {
            this._updateVisiableItem();
        } else {
            //重新生成
            //1回收所有项
            for (let i = 0; i < this.items.length; i++) {
                let rawItems = this.items[i];
                this._recycleItem(rawItems);
            }
            this._initList();
        }
    },
    update(dt) {
        
    },

    _initList() {
        //根据数据项计算滑动区域
        let itemCount = this._getItemCount();
        //计算一页需要多少项
        //列数
        let contentWidth = this.contentNode.width;
        let cloum = (contentWidth + this.spacingX) / (this.itemSize.x + this.spacingX);
        cloum = Math.floor(cloum);
        //需要几行
        let raw = this.node.height / (this.itemSize.y + this.spacingY);
        raw = Math.ceil(raw);
        this.itemCountOnePage = raw * cloum;
        this.cloum = cloum;
        let currentItemCount = raw * cloum;
        if (currentItemCount > itemCount) {
            currentItemCount = itemCount;
        }
        let initedItemCount = 0;
        //实际的行数
        let currentRaw = Math.ceil(currentItemCount / cloum);
        for (let i = 0; i < currentRaw; i++) {
            let rawItems = [];
            for (let j = 0; j < cloum; j++) {
                if (initedItemCount >= currentItemCount) {
                    break;
                }
                let index = i * cloum + j;
                let itemNode = this._getItemForIndex(index);
                itemNode.x = j * (this.itemSize.x + this.spacingX) + this.itemSize.x / 2;
                itemNode.y = -i * (this.itemSize.y + this.spacingY) - this.itemSize.y/2 - this.spacingY;
                if (itemNode.parent == null) {
                    this.contentNode.addChild(itemNode);
                }
                let item = {
                    raw: i,
                    cloum: j,
                    index: index,
                    node: itemNode,
                };
                rawItems.push(item);
                initedItemCount++;
            }
            this.items.push(rawItems);
        }
        //
        this.totalRaw = Math.ceil(itemCount / cloum);
        this.contentNode.height = this.totalRaw * this.itemSize.y + (this.totalRaw) * this.spacingY;
    },

    _updateVisiableItem() {
        if (!this.items) return;
        for (let i = 0; i < this.items.length; i++) {
            let raw = this.items[i];
            for (let j = 0; j < raw.length; j++) {
                let item = raw[j];
                if (this.delegate) {
                    this.delegate.onItemReloadInCollection(this, item.node, item.index);
                }
            }
        }
    },

    _onScrolling(event) {
        let isDown = this.scrollView.content.y < this.lastContentPosY; // scrolling direction
        this.lastContentPosY = this.scrollView.content.y;
        this._replaceList(isDown);
    },

    _replaceList(isDown) {
        if (this._getItemCount() <= this.itemCountOnePage) {
            return;
        }
        if (this.items.length == 0) return;
        // console.log('scroll:',this.scrollView.getScrollOffset());
        let firstRawItem = this.items[0];
        let lastRawItem = this.items[this.items.length - 1];
        if (firstRawItem.length == 0) return;
        if (lastRawItem.length == 0) return;
        let lastItemPositionInView = this._getItemPositionInView(lastRawItem[0].node);
        let firstItemPositionInView = this._getItemPositionInView(firstRawItem[0].node);
        if (isDown) {
            //向下滑动，回收底部项，追加顶部项
            let firstItem = firstRawItem[0];
            if (firstItem.index == 0) {
                //到达顶部，不在追加
                return;
            }
            //回收最后一行
            if (lastItemPositionInView.y < this.node.y - this.node.height / 2) {
                this._recycleItem(lastRawItem);
            }
            //第一行追加
            if (firstItemPositionInView.y < this.node.y + this.node.height / 2) {
                let count = this.cloum;
                this._addItemToScrollView(firstItem.raw - 1, count, true);
            }

        } else {
            //上滑
            let lastItem = lastRawItem[lastRawItem.length - 1];
            if (lastItem.index == this._getItemCount() - 1) {
                //已经到达最后一列，不在追加
                return;
            }
            //第一行超过顶部
            if (firstItemPositionInView.y - this.itemSize.y > this.node.y + this.node.height / 2) {
                //回收顶部行
                this._recycleItem(firstRawItem);
            }

            if (lastItemPositionInView.y - this.itemSize.y > this.node.y - this.node.height / 2) {
                //最后一行追加
                let count = this.cloum;
                if (this._getItemCount() - 1 - lastItem.index < this.cloum) {
                    //如果当前最后一项下标域总项数差值不足一行
                    count = this._getItemCount() - 1 - lastItem.index;
                }
                this._addItemToScrollView(lastItem.raw + 1, count, false);
            }
        }
    },

    _addItemToScrollView(raw, count, isTop) {
        let rawItems = [];
        for (let i = 0; i < count; i++) {
            let index = raw * this.cloum + i;
            let itemNode = this._getItemForIndex(index);
            itemNode.x = i * (this.itemSize.x + this.spacingX) + this.itemSize.x / 2;
            itemNode.y = -raw * (this.itemSize.y + this.spacingY) - this.itemSize.y/2 - this.spacingY;
            if (itemNode.parent == null) {
                this.contentNode.addChild(itemNode);
            }
            let item = {
                raw: raw,
                cloum: i,
                index: index,
                node: itemNode,
            };
            rawItems.push(item);
        }
        if (isTop) {
            this.items.unshift(rawItems);
        } else {
            this.items.push(rawItems);
        }
    },

    _recycleItem(rawItems) {
        for (let i = 0; i < rawItems.length; i++) {
            let item = rawItems[i];
            // item.active = false;
            this.resueItems.push(item.node);
        }
        cc.js.array.remove(this.items, rawItems);
    },

    _getItemCount() {
        let count = 0;
        if (this.delegate) {
            count = this.delegate.itemCountIncollectionView(this);
        }
        this.currentItemCount = count;
        return count;
    },

    _getItemForIndex(index) {
        if (this.delegate) {
            return this.delegate.itemForIndexInCollection(index, this);
        }
        return null;
    },

    _getItemPositionInView(item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    // update (dt) {},
});
