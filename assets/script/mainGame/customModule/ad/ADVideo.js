let RewardedVideoAd = null;
let complete = null;
let error = null;
let loading = null;
let ADLoaded = false;

var ADVideo = cc.Class({
    name: 'ADVideo',
    properties: {

    },
    isLoaded() {
        return ADLoaded;
    },
    show(videoId, completeCallback = null, error = null,onShow = null) {
        complete = completeCallback;
        error = error;
        this.createRewardAD(videoId,true,onShow);
    },

    load(videoId){
        this.createRewardAD(videoId,false);
    },

    createRewardAD(adUnitId, show,onShow = null) {
        let self = this;
        if (loading) {
            return;
        }
        if (ML.wx.getSystemInfoSync().SDKVersion < '2.0.4') {
            return;
        }
        if (RewardedVideoAd) {
            RewardedVideoAd.offClose(self._onClose);
            RewardedVideoAd.offError(self._error);
            RewardedVideoAd.offLoad(self._onLoad);
        }
        RewardedVideoAd = wx.createRewardedVideoAd({
            adUnitId: adUnitId
        });
        RewardedVideoAd.onError(self._error);
        RewardedVideoAd.onClose(self._onClose);
        RewardedVideoAd.onLoad(self._onLoad);
        loading = true;
        RewardedVideoAd.load().then(() => {
            if (show) {
                ADLoaded = false;
                RewardedVideoAd.show().then(()=>{
                    if(onShow){
                        onShow();
                    }
                });
            }
        }).catch(err => console.log(err.errMsg));
    },

    _onLoad() {
        ADLoaded = true;
        loading = false;
    },

    _onClose(isEnd) {
        loading = false;
        if (complete) {
            complete(isEnd.isEnded);
        }
    },

    _error(msg, code) {
        loading = false;
        if (error) {
            error(msg, code);
        }
    },

    handleErrorCode(msg, code) {
        console.log('ADVideo_Error:', msg, code);

        switch (code) {
            case 1000:
                console.log('ADVideo_Error:', '后端接口调用失败');
                break;
            case 1001:
                console.log('ADVideo_Error:', '参数错误');
                break;
            case 1002:
                console.log('ADVideo_Error:', '广告单元无效');
                break;
            case 1003:
                console.log('ADVideo_Error:', '内部错误');
                break;
            case 1004:
                console.log('ADVideo_Error:', '无合适的广告');
                break;
            case 1005:
                console.log('ADVideo_Error:', '广告组件审核中');
                break;
            case 1006:
                console.log('ADVideo_Error:', '广告组件被驳回');
                break;
            case 1007:
                console.log('ADVideo_Error:', '广告组件被封禁');
                break;
            case 1008:
                console.log('ADVideo_Error:', '广告单元已关闭');
                break;

            default:
                break;
        }
    },
});