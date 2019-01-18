const BaseModule = require('BaseModule');
let ADBanner = require('ADBanner');
let ADVideo = require('ADVideo');
cc.Class({
    extends: BaseModule,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.moduleName = 'ad';
        this._super();

        this.gameBannerId = 'adunit-a55687ebe928a7e5';
        this.getItemBannerId = 'adunit-07a52d65c9a99033';
        this.comebackBannerId = 'adunit-0ff2beace1816ee1';
        this.gameCompleteBannerId = 'adunit-80f1940853881c2d';

        this.boxVidioId = 'adunit-60efd99ee80cb3f7';
        this.comeBackVideoId = 'adunit-ec6279205fcaa9d8';
        this.getItemVideoId = 'adunit-ba2bc83750fb4321';
        this.unLockLevelVideoId = 'adunit-0da98c97062d848c';

        this.bannerMaxHeight = ML.wx.isIphoneX() ? 209 + 68 : 209;
        this.adVideoInstance = new ADVideo();

        this.currentBanner = null;
    },

    onStart() {
        //预加载视频
        if (window.wx) {
            this.adVideoInstance.load(this.getItemVideoId);
        }
        this.initBanner();
    },

    lateStart() {

    },

    //Banner----------------------
    initBanner() {
        this.gamingBanner = this._initBanner(this.gameBannerId, 300, 0);
        this.getItemBanner = this._initBanner(this.getItemBannerId, 1000, 10);
        this.comebackBanner = this._initBanner(this.comebackBannerId, 300, 0);
        this.gameCompleteBanner = this._initBanner(this.gameCompleteBannerId, 300, 0);
    },

    isBannerOpen() {
        // return false;
        return ML.api.getBannerSwitch();
    },

    getBannerMaxHeight() {
        let review = ML.api.isReviewVersion();
        let extra = 0;
        if (review) {
            extra = 20;
        }
        if (!this.isBannerOpen()) {
            return 0;
        } else {
            if (ML.wx.isSmallWidth()) {
                return 260 + extra;
            }
            return Math.ceil(this.bannerMaxHeight + 20 + extra);
        }
    },

    hideBanner() {
        if (this.currentBanner) {
            this.currentBanner.hide();
        }
    },

    showGamingBanner() {
        this.currentBanner = this.gamingBanner;
        this.gamingBanner.show();
    },

    showGetItemBanner() {
        this.currentBanner = this.getItemBanner;
        this.getItemBanner.show();
    },

    showComebackBanner() {
        this.currentBanner = this.comebackBanner;
        this.comebackBanner.show();
    },

    showGameCompleteBanner() {
        this.currentBanner = this.gameCompleteBanner;
        this.gameCompleteBanner.show();
    },

    _initBanner(bannerId, width, yOffset, callback = null) {
        let banner = new ADBanner();
        banner.yOffset = yOffset;
        let self = this;
        banner.init(bannerId, width, function (banner, ad, size) {
            let realSize = self._bottomCenterBanner(ad, size, banner.yOffset);
            if (callback) {
                callback(realSize);
            }
        });
        return banner;
    },

    _bottomCenterBanner(banner, size, yOffset) {
        let wxsys = ML.wx.getSystemInfoSync();
        let windowWidth = wxsys.windowWidth;
        let windowHeight = wxsys.windowHeight;
        let iphoneX = ML.wx.isIphoneX();
        let bottomOffset = iphoneX ? 34 : 0;
        let raW = cc.Canvas.instance.node.width / windowWidth;
        let raH = cc.Canvas.instance.node.height / windowHeight;
        banner.style.height = size.height;
        banner.style.width = size.width;
        banner.style.left = (windowWidth - size.width) / 2;
        banner.style.top = windowHeight - size.height - bottomOffset - yOffset;
        let realHeight = (size.height + bottomOffset) * raH;
        let realWidth = size.width * raW;
        // console.log('banner___center', size, realHeight, realWidth,yOffset);
        return cc.v2(realWidth, realHeight);
    },

    //VIdeo-----------
    canPlayVideo() {
        return this.adVideoInstance.isLoaded();
    },

    showGetItemVideo(complete, error) {
        //点击
        ML.ald.event_videoGetItem(3);
        if (!window.wx) {
            complete(true);
            return;
        }
        this.adVideoInstance.show(this.getItemVideoId,
            function (isEnd) {
                if (isEnd) {
                    //成功
                    ML.ald.event_videoGetItem(5);
                }
                complete(isEnd);
            },
            function (msg, code) {
                //失败
                error(msg, code);
            },
            function () {
                //开始
                ML.ald.event_videoGetItem(4);
            });
    },

    showComeBackVideo(complete, error) {
        ML.ald.event_videoComeback(3);
        if (!window.wx) {
            complete(true);
            return;
        }
        this.adVideoInstance.show(this.comeBackVideoId,
            function (isEnd) {
                if (isEnd) {
                    ML.ald.event_videoComeback(5);
                }
                complete(isEnd);
            },
            function (msg, code) {
                error(msg, code);
            },
            function () {
                ML.ald.event_videoComeback(4);
            });
    },

    showUnlockLevelVideo(complete, error) {
        ML.ald.event_videoUnlockLevel(3);
        if (!window.wx) {
            complete(true);
            return;
        }
        this.adVideoInstance.show(this.unLockLevelVideoId,
            function (isEnd) {
                if (isEnd) {
                    ML.ald.event_videoUnlockLevel(5);
                }
                complete(isEnd);
            },
            function (msg, code) {
                error(msg, code);
            },
            function () {
                ML.ald.event_videoUnlockLevel(4);
            });
    },

    showDeadlineVideo(complete, error) {
        ML.ald.event_videoClearBrickWhenDeadline(3);
        if (!window.wx) {
            complete(true);
            return;
        }
        this.adVideoInstance.show(this.unLockLevelVideoId,
            function (isEnd) {
                if (isEnd) {
                    ML.ald.event_videoClearBrickWhenDeadline(5);
                }
                complete(isEnd);
            },
            function (msg, code) {
                error(msg, code);
            },
            function () {
                ML.ald.event_videoClearBrickWhenDeadline(4);
            });
    },

});