
cc.Class({
    extends: cc.Component,

    properties: {
        itemSize: cc.Vec2.ZERO,
        spacing: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.currentItems = [];
        this.reuseItems = [];
        this.lastContentPosX = 0;
        this.scrollView = this.node.getComponent(cc.ScrollView);
        this.scrollView.node.on('scrolling', this._onScrolling, this);
        this.content = this.scrollView.content;
        //限制水平滑动
        this.scrollView.horizontal = true;
        this.scrollView.vertical = false;
        //设置滚动视图锚点
        this.content.anchorX = 0;
        this.content.anchorY = 0.5;
        this.content.parent.anchorX = 0;
        this.content.parent.anchorY = 0.5;
        this.content.position = cc.v2(0, 0);
    },

    start() {
    },

    getReuseItemOfIndex() {
        if (this.reuseItems.length == 0) {
            return null;
        }
        return this.reuseItems.pop();
    },

    _addToReuseQueue(item) {
        this.reuseItems.push(item.node);
        item.node.active = false;
        cc.js.array.remove(this.currentItems, item);
    },

    _getItemCount() {
        let count = 30;
        if (this.delegate && this.delegate.itemCountIncollectionView) {
            count = this.delegate.itemCountIncollectionView(this);
        }
        return count;
    },

    _getItemForIndex(index) {
        if (this.delegate && this.delegate.itemForIndexInCollection) {
            return this.delegate.itemForIndexInCollection(index, this);
        }
        return null;
    },


    reload() {
        //移除所有元素
        if (this.currentItems.length != 0) {
            for (let i = 0; i < this.currentItems.length; i++) {
                let item = this.currentItems[i];
                this._addToReuseQueue(item);
                i--;
            }
            this.currentItems.length = 0;
        }
        this.content.removeAllChildren();
        //计算滑动区域宽度
        let itemCount = this._getItemCount();
        if (itemCount == 0) {
            return;
        }
        let contentWidth = itemCount * (this.itemSize.x + this.spacing);
        if (this.content.width > contentWidth) {
            this.scrollView.scrollToLeft();
        }
        this.content.width = contentWidth;
        let scrollWidth = this.node.width;
        //计算一页容纳的单元格
        let itemCountPerPage = Math.ceil(scrollWidth / (this.itemSize.x + this.spacing));
        //计算当前偏移量的单元格下标
        let currentOffset = this.scrollView.getScrollOffset().x;
        if (currentOffset > 0) {
            //左边未回位
            this.scrollView.scrollToLeft();
            currentOffset = 0;
        }
        if (-currentOffset > this.scrollView.getMaxScrollOffset().x) {
            let maxOffsetX = this.scrollView.getMaxScrollOffset().x;
            //右边未回位
            this.scrollView.scrollToRight();
            currentOffset = -maxOffsetX;
        }

        let currentOffsetIndex = this._getIndexOfContenOffset(currentOffset);
        let itemCountToPlace = Math.min(itemCountPerPage, itemCount);
        for (let i = 0; i < itemCountToPlace; i++) {
            let index = currentOffsetIndex+i;
            this._addchildForIndex(index);
        }
    },

    _onScrolling(event) {
        // console.log('offset--', this.scrollView.content.x);
        // console.log('maxoffset--', this.scrollView.getMaxScrollOffset().x);
        let isLeft = this.scrollView.content.x < this.lastContentPosX; // scrolling direction
        this.lastContentPosX = this.scrollView.content.x;
        this._updateContent(isLeft);
    },

    _updateContent(isLeft) {
        let rightItem = this.currentItems[this.currentItems.length - 1];
        let leftItem = this.currentItems[0];
        let rightPositionInMask = this._getItemPositionInMaskView(rightItem.node);
        let leftPositionInMask = this._getItemPositionInMaskView(leftItem.node);
        if (isLeft) {
            //左滑，
            //最后一项
            if (rightItem.index == this._getItemCount() - 1) {
                return;
            }
            //右边的不足右边界
            if (rightPositionInMask.x + this.itemSize.x / 2 < this.scrollView.node.width) {
                //右边追加一个
                this._addchildForIndex(rightItem.index + 1);
            }
            //左边超出左边界
            if (leftPositionInMask.x + this.itemSize.x / 2 < 0) {
                //回收左边
                this._addToReuseQueue(leftItem);
            }
        } else {
            //右滑
            //第一项
            if (leftItem.index == 0) {
                return;
            }
            //左边不足
            if (leftPositionInMask.x - this.itemSize.x / 2 > 0) {

                //左边追加一个
                this._addchildForIndex(leftItem.index - 1, false);
            }
            //右边超过边界
            if (rightPositionInMask.x - this.itemSize.x / 2 > this.scrollView.node.width) {
                // //回收最后一个
                this._addToReuseQueue(rightItem);
            }
        }
    },


    _addchildForIndex(index, push = true) {
        // console.log('addChild---;', index);
        let itemNode = this._getItemForIndex(index);
        let position = this._getItemLocalPositionOfIndex(index);
        itemNode.position = position;
        if (itemNode.parent == null) {
            this.content.addChild(itemNode);
        }
        itemNode.active = true;
        let item = {
            index: index,
            node: itemNode,
        };
        if (push) {
            this.currentItems.push(item);
        } else {
            this.currentItems.unshift(item);
        }
    },

    _getItemLocalPositionOfIndex(index) {
        let x = (this.itemSize.x + this.spacing) * index + this.itemSize.x / 2;
        let y = 0;
        return cc.v2(x, y);
    },
    //根据当前content的偏移量计算当前下标
    _getIndexOfContenOffset(offset) {
        let spaceOFitem = this.itemSize.x + this.spacing;
        let index = Math.floor(offset / spaceOFitem);
        return Math.abs(index);
    },

    _getItemPositionInMaskView(item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.content.parent.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },


    // update (dt) {},
});
