const BaseModule = require('BaseModule');
const Toast_None = 'none';
const Toast_Success = 'success';
cc.Class({
    extends: BaseModule,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.moduleName = 'wx';
        this._super();

        this._regisiterWXCallback();
        this.showShareMenuWithTicket(true);

        this.share_clickTime = null; //分享拉起时间
        this.currentShareCallback = null; //模拟分享回调
        this.shareFail = false;
    },

    onStart() {

    },

    lateStart() {
        this.updateProgram();
        if (!window.wx) return;
        ML.event.sendEventImmediately('OnWXShow', this.getLaunchOption());
    },

    isIphoneX() {
        if (!window.wx) return;
        let sysInfo = this.getSystemInfoSync();
        let screenHeight = sysInfo.screenHeight;
        let screenWidth = sysInfo.screenWidth;
        let ratioWH = screenWidth / screenHeight;
        if (ratioWH <= 0.5 || ratioWH >= 2) {
            return true;
        } else {
            return false;
        }
        // let lanscape = screenHeight == 375 && screenWidth == 812;
        // let portrait = screenHeight == 812 && screenWidth == 375;
        // if (lanscape || portrait) {
        //     return true;
        // }
        // return false;
    },

    isSmallWidth() {
        if (!window.wx) return;
        let sysInfo = this.getSystemInfoSync();
        let screenHeight = sysInfo.screenHeight;
        let screenWidth = sysInfo.screenWidth;
        if (screenHeight < 667) {
            console.log('高度不够', screenHeight);
            return true;
        }
        return false;
    },

    login(success, fail) {
        if (!window.wx) {
            fail('非微信环境');
            return;
        }
        wx.login({
            success(res) {
                if (res.code) {
                    if (success) success(res.code);
                } else {
                    if (fail) fail(res.errMsg);
                }
            }
        })
    },

    postMessage(data) {
        if (!window.wx) return;
        // console.log("postMessage:", data);
        wx.getOpenDataContext().postMessage(data);
    },

    navigatTomini(obj) {
        if (!window.wx) return;
        wx.navigateToMiniProgram(obj);
    },

    updateProgram() {
        let self = this;
        if (!window.wx) return;
        if (typeof wx.getUpdateManager === 'function') { // 请在使用前先判断是否支持
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                // console.log('是否有新版本', res.hasUpdate);
            })

            updateManager.onUpdateReady(function (res) {
                self.showModal('发现新版本', '新版本已经准备好，是否更新？', function () {
                    updateManager.applyUpdate();
                });
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            })

            updateManager.onUpdateFailed(function () {
                // 新的版本下载失败
            })
        }
    },

    showModal(title, content, cancelTitle, confirmTitle, confirm) {
        if (!window.wx) {
            return;
        }
        wx.showModal({
            title: title,
            content: content,
            cancelText: cancelTitle,
            confirmText: confirmTitle,
            success(res) {
                if (res.confirm) {
                    if (confirm) confirm(true);
                    // console.log('用户点击确定')
                } else if (res.cancel) {
                    if (confirm) confirm(false);
                    // console.log('用户点击取消')
                }
            }
        })
    },

    showModalWithoutCancel(title, content, confirmTitle, confirm) {
        if (!window.wx) {
            return;
        }
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
            confirmText: confirmTitle,
            success(res) {
                if (res.confirm) {
                    if (confirm) confirm(true);
                    // console.log('用户点击确定')
                } else if (res.cancel) {
                    if (confirm) confirm(false);
                    // console.log('用户点击取消')
                }
            }
        })
    },

    showToast(title, toastType = 'none', mask = false) {
        if (!window.wx) {
            return;
        }
        wx.showToast({
            title: title,
            icon: toastType,
            duration: 2000,
            mask: mask,
        })
    },

    createImage(sptite, avatarUrl, callback) {
        if (!window.wx) {
            callback(null);
            return;
        }
        let image = wx.createImage();
        image.onload = (res) => {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            let spriteFrame = new cc.SpriteFrame(texture);
            sptite.spriteFrame = spriteFrame;
            callback(image, spriteFrame);
        };
        image.onerror = () => {
            callback(null);
        };
        image.src = avatarUrl;
    },

    authOrGetUserInfo(callback) {
        if (!window.wx) {
            return;
        }
        let self = this;

        this.getSetting(
            function (setting) {
                console.log('授权信息', setting);
                if (setting['scope.userInfo']) {
                    //已经授权
                    self.getUserInfo(
                        function (userInfo) {
                            //获取用户信息成功
                            console.log('获取用户信息：', userInfo);
                            callback(userInfo);
                        },
                        function (error) {
                            //获取用户信息失败
                            callback(null);
                        });
                } else {
                    //未授权
                    self.showUserInfoButton(
                        function (userInfo) {
                            callback(userInfo);
                            console.log('授权获取用户信息：', userInfo);
                        }
                    );
                }
            },
            function (error) {
                //获取授权设置失败
                self.showUserInfoButton(
                    function (userInfo) {
                        callback(userInfo);
                        console.log('授权获取用户信息：', userInfo);
                    }
                );
            });



    },

    showUserInfoButton(callback) {
        let obj = {
            type: 'text',
            text: '',
            style: this._initLoginButton(),
        };
        let btn = wx.createUserInfoButton(obj);
        btn.onTap(function (res) {
            if (res.errMsg == "getUserInfo:ok") {
                //授权成功
                callback(res.userInfo);
            } else {
                //授权失败
                callback(null);
            }
            btn.hide();
        });
        btn.show();
    },

    getSetting(success, fail) {
        wx.getSetting({
            success: function (res) {
                success(res.authSetting);
                // res.authSetting = {
                //   "scope.userInfo": true,
                //   "scope.userLocation": true
                // }
            },
            fail: function (error) {
                fail(error);
            }
        })
    },

    getUserInfo(success, fail) {
        wx.getUserInfo({
            success: function (res) {
                success(res.userInfo);
            },
            fail: function (res) {
                fail(res);
            }
        })
    },

    /**
     * 获取游戏启动参数
     * 返回值
     * scene	number	场景值	
     * query	Object	启动参数	
     * isSticky	boolean	当前小游戏是否被显示在聊天顶部	
     * shareTicket	string	shareTicket   分享到群后点击进入小游戏会有此变量 
     */
    getLaunchOption() {
        if (!window.wx) return;
        return wx.getLaunchOptionsSync();
    },

    /**
     * return obj
     * brand	string	手机品牌
     * model	string	手机型号
     * pixelRatio	number	设备像素比
     * screenWidth	number	屏幕宽度
     * screenHeight	number	屏幕高度
     * windowWidth	number	可使用窗口宽度
     * windowHeight	number	可使用窗口高度
     * language	string	微信设置的语言
     * version	string	微信版本号
     * system	string	操作系统版本
     * platform	string	客户端平台
     * fontSizeSetting	number	用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px。	>= 1.5.0
     * SDKVersion	string	客户端基础库版本	                                >= 1.1.0
     * benchmarkLevel	number	性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好(目前设备最高不到50)	                                >= 1.8.0
     * battery	number	电量，范围 1 - 100	                                   >= 1.9.0
     * wifiSignal	number	wifi 信号强度，范围 0 - 4	                        >= 1.9.0
     */
    getSystemInfoSync() {
        if (!window.wx) return;
        return wx.getSystemInfoSync();
    },

    showShareMenuWithTicket(ticket) {
        if (!window.wx) return;
        wx.showShareMenu({
            withShareTicket: ticket
        });
    },

    getShareInfo(ticket, success, fail = null) {
        if (!window.wx) {
            return;
        }
        wx.getShareInfo({
            shareTicket: ticket,
            success:function(res){
                success(res.encryptedData,res.iv);
            },
            fail:function(res){
                if(fail)fail(res);
            },
        });
    },

    share(title, imageUrl, query, callback) {
        if (!window.wx) {
            callback(true);
        }
        this.currentShareCallback = callback;
        this.share_clickTime = Date.now();
        this.shareFail = false;
        this._share(title, imageUrl, query);
    },

    _share(title, imageUrl, query = null) {
        if (!window.wx) return;
        let self = this;
        let shareInfo = this._buildShareInfo(title, imageUrl, query);
        shareInfo.cancel = function (cancle) {
            console.log('share___cancel', cancle);
            self.shareFail = true;
        };
        // wx.shareAppMessage(shareInfo);
        wx.aldShareAppMessage(shareInfo);
    },

    //构建分享内容
    _buildShareInfo(title, imageUrl, query) {
        let shareInfo = {
            title: title,
            imageUrl: imageUrl,
            query: query,
        };
        return shareInfo;
    },

    _onShareback() {
        let self = this;
        setTimeout(() => {
            if (this.share_clickTime && this.currentShareCallback) {
                // console.log('分享回来:',this.shareFail);
                if (this.shareFail) {
                    this.currentShareCallback(false);
                } else {
                    if (Date.now() - this.share_clickTime >= ML.config.share.successSecond * 1000) {
                        //分享成功
                        this.currentShareCallback(true);
                        // console.log('分享成功',this.shareFail);
                    } else {
                        this.currentShareCallback(false);
                        // console.log('分享失败',this.shareFail);
                    }
                }
            }
            this.shareFail = false;
            this.currentShareCallback = null;
            this.share_clickTime = null;
        }, 100);
    },

    _initLoginButton() {
        if (!window.wx) return;
        let wxsys = wx.getSystemInfoSync();
        let style = {
            left: 0,
            top: 0,
            width: wxsys.screenWidth,
            height: wxsys.screenHeight,
            lineHeight: 40,
            // backgroundColor: '#de0000',
            color: '#ffffff',
            type: 'text',
            text: '获取用户信息',
            textAlign: 'center',
            fontSize: 28,
            // borderRadius: 5,
            textAlign: 'center',
        }
        return style;
    },
    //-----------------注册事件------------------

    /**
     * 注册微信各种回调
     */
    _regisiterWXCallback() {
        if (!window.wx) return;
        this._regisiterOnShow();
        this._regisiterOnHide();
    },

    _regisiterOnShow() {
        let self = this;
        wx.onShow(function (res) {
            self._onShowCallback(res);
        });
    },

    _onShowCallback(res) {
        this._onShareback();
        // ML.log.log('WX_show:', res);
        ML.event.sendEventImmediately('OnWXShow', res);
    },

    _regisiterOnHide() {
        let self = this;
        wx.onHide(self._onHideCallback);
    },

    _onHideCallback() {
        // ML.log.log('WX_hide');
        ML.event.sendEventImmediately('OnWXHide', null);
    },


    //----自定义--
    showEndlessOverRank() {
        let data = {
            messageType: 10,
        };
        this.postMessage(data);
    },

    hideEndlessOverRank() {
        let data = {
            messageType: 11,
        };
        this.postMessage(data);
    },

    updateEndlessScore(score) {
        let data = {
            messageType: 12,
            value: score,
        };
        this.postMessage(data);
    },

    showEndlessRankList() {
        let data = {
            messageType: 20,
        };
        this.postMessage(data);
    },

    hideEndlessRankList() {
        let data = {
            messageType: 21,
        };
        this.postMessage(data);
    },

    endlessRankListPrePage() {
        let data = {
            messageType: 22,
        };
        this.postMessage(data);
    },

    endlessRankListNextPage() {
        let data = {
            messageType: 23,
        };
        this.postMessage(data);
    },

    //关卡模式
    showLevelOverRank(level, y) {
        let data = {
            messageType: 30,
            level: level,
            y: y,
        };
        this.postMessage(data);
    },
    hideLevelOverRank() {
        let data = {
            messageType: 31,
        };
        this.postMessage(data);
    },

    updateSingleLevelRank(level, score, starCount) {
        let data = {
            messageType: 32,
            level: level,
            score: score,
            starCount: starCount,
        };
        this.postMessage(data);
    },

    showTotalLevelRank() {
        let data = {
            messageType: 40,
        };
        this.postMessage(data);
    },

    hideTotalLevelRank() {
        let data = {
            messageType: 41,
        };
        this.postMessage(data);
    },

    updateTotalLevelRank(level, score, starCount) {
        let data = {
            messageType: 42,
            level: level,
            score: score,
            starCount: starCount,
        };
        this.postMessage(data);
    },

    showEndlessOverOther(score, y){
        let data = {
            messageType: 50,
            score: score,
            y: y,
        };
        this.postMessage(data);
    },

    hideEndlessOverOther(){
        let data = {
            messageType: 51,
        };
        this.postMessage(data);
    },
});