const BaseModule = require('BaseModule');
const RandomUtil = require('RandomUtil');
cc.Class({
    extends: BaseModule,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:
    // 轻松餐厅 wx6c14c4b07a253198
    // 坦克1号 wxfcb3bf2298d6de64
    // 超级90坦克 wxa2fd73a6fc715041
    // 贪吃蛇大作战 wxf4ac0077b6ffb1e7
    // 球球冲刺 wx5fff8998292bb3ea 
    // 锤子大作战 wxebb8abe1f4cadacd
    // 经典大冒险 wx2105e6d39cf24afc
    // 跳跃吧球球 wxdb05a20158191f56
    // 抢滩奇兵 wx0d8633ed416b050e
    // 脑力吃鸡 wx89a162de6d063c73
    // {
    //     "icon": "https://wxflag.afunapp.com/90tank/sword4.png",
    //     "image": "https://wxflag.afunapp.com/90tank/ball.png",
    //     "appid": "wxb12fb9300c93a4fb",
    //     "path": "?ald_media_id=3127&ald_link_key=f528a55ba2da1551&ald_position_id=0",
    //     "directJump": 1,
    //     "jumpName": "sword",
    //     "weight": 25
    //     },
    onLoad() {
        this.moduleName = 'promotion';
        this._super();
    },

    onStart() {

    },

    lateStart() {

    },

    navigate(promotionData){
        ML.ald.event_promotion(promotionData.jumpName,2);
        let success = function(res){
            // console.log('跳转成功',res);
            ML.ald.event_promotion(promotionData.jumpName,3);
        };
        let fail = function(res){
            // console.log('跳转失败',res);
        };
        let obj = {
            appId:promotionData.appid,
            path:promotionData.path,
            success:success,
            fail:fail,
        };
        ML.wx.navigatTomini(obj);
    },

    getPromotionData(callback){
        if(!window.wx){
            callback(null);
            return;
        }
        //获取推广列表
        ML.api.getOrRequestGameConfig(function(config){
            if(!config.recommends){
                callback(null);
                return;
            }
            if(config.recommends.hasRecommand===0){
                callback(null);
                return;
            }
            if (config.recommends.contents.length == 0) {
                callback(null);
                return;
            }
            let weights = [];
            for (let i = 0; i < config.recommends.contents.length; i++) {
                let info = config.recommends.contents[i];
                weights.push(info.weight);
            }
            let index = RandomUtil.weight(weights);
            let promotionData = config.recommends.contents[index];
            ML.ald.event_promotion(promotionData.jumpName,1);
            callback(promotionData);
        });
    },

    
});