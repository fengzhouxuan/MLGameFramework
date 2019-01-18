let onResizeCallback = null;
var ADBanner = cc.Class({
    name: 'ADBanner',
    properties: {

    },

    init(bannerId, width = 300, onResize = null) {
        this.bannerId = bannerId;
        this.bannerWidth = width;
        this.showCount = 0;
        onResizeCallback = onResize;
        this.prepare();
    },

    show() {
        if (!window.wx) {
            return;
        }
        this.banner.show();
    },

    prepare() {
        if (!window.wx) {
            return;
        }
        let self = this;
        let wxsys = ML.wx.getSystemInfoSync();
        let windowWidth = wxsys.windowWidth;
        if (windowWidth < this.bannerWidth) {
            this.bannerWidth = windowWidth;
        }
        if (this.banner) {
            this.banner.offResize(self._onResize);
            this.banner.offError(self._onError);
        }
        this.banner = this._createBannerAd(this.bannerId, this.bannerWidth);
        this.banner.onResize(self._onResize.bind(self));
        this.banner.onError(self._onError);
        // this.banner.show();
    },

    _onResize(size) {
        let self = this;
        // console.log('banner___resize1', self);
        if (onResizeCallback) {
            // console.log('banner___resize2', self.banner);
            onResizeCallback(self, self.banner, size);
        }
    },

    _onError(msg, code) {
        console.log('banner___error', msg);

    },

    hide() {
        if (!window.wx) return;
        if (this.banner) {
            if (this.showCount >= 5) {
                this.banner.destroy();
                this.prepare();
                this.showCount = 0;
                // console.log('banner---destory');
            } else {
                this.banner.hide();
                this.showCount++;
            }
        }
    },

    _createBannerAd(adUnitId, width) {
        if (!window.wx) return;
        if (ML.wx.getSystemInfoSync().SDKVersion < '2.0.4') {
            return;
        }
        let banner = wx.createBannerAd({
            adUnitId: adUnitId,
            style: {
                left: 0,
                top: 0,
                width: width,
            }
        });
        return banner;
    },

});