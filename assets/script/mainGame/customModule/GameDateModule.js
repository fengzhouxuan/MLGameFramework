let BaseModule = require('BaseModule');
cc.Class({
    extends: BaseModule,

    onLoad() {
        this.moduleName = 'date';
        this._super();
    },

    onStart() {
        // this._resgisterGameHide();
        // this._resgisterGameShow();
        this.thisGameStartTime = new Date(); //本次游戏进入前台时间
        this.lastGameStartTime = null;
        let self = this;
        this.getLastGameStartDate(function (date) {
            self.lastGameStartTime = date;
            self.setLastGameStartDate();
            ML.event.sendEventImmediately('Game_RefreshTime',null);
        });
    },

    lateStart() {

    },

    /**
     * 用于启动时检测是否到了刷新点，以上次启动游戏时间为对比
     * @param {int} refreshHours 
     */
    checkRefreshHourForLastLaunch(refreshHours) {
        let need = this._checkRefreshHour(refreshHours, this.lastGameStartTime);
        return need;
    },

    /**
     * 用于游戏中检测是否到了刷新点，以本次启动游戏时间为对比
     * @param {int} refreshHours 
     */
    checkRefreshHourForThisLuanch(refreshHours) {
        return this._checkRefreshHour(refreshHours, this.thisGameStartTime);
    },

    //计算当前时间距离date是否超过了每天的refreshHours
    _checkRefreshHour(refreshHours, date) {
        let now = new Date();
        let lastDate = date;
        if (lastDate == null) {
            lastDate = new Date();
            return true;
        }

        //以刷新点为每天的起点换算时间
        now.setHours(now.getHours() - refreshHours);
        lastDate.setHours(lastDate.getHours() - refreshHours);

        let formatNow = now;
        let formatLast = lastDate;

        let nowY = formatNow.getFullYear();
        let nowM = formatNow.getMonth();
        let nowD = formatNow.getDate();

        let lastY = formatLast.getFullYear();
        let lastM = formatLast.getMonth();
        let lastD = formatLast.getDate();

        if (nowY >= lastY && nowM >= lastM && nowD > lastD) {
            //需要刷新
            return true;
        }
        return false;
    },



    _resgisterGameShow() {
        let self = this;
        ML.event.addListener('OnWXShow', this, function (data) {
            self._onShow();
        });

        // cc.game.on(cc.game.EVENT_SHOW, function () {
        //     self._onShow();
        // });
    },

    _resgisterGameHide() {
        let self = this;
        ML.event.addListener('OnWXHide', this, function (data) {
            self._onHide();
        });
        cc.game.on(cc.game.EVENT_HIDE, function () {
            self._onHide();
        });
    },

    _onShow() {
        // this.thisGameStartTime = new Date(); //本次游戏进入前台时间
    },

    _onHide() {
        // ML.setting.setObject('Game_LastHide', new Date().toString());
        //记录本次游戏进入前台时间为上次时间
        // ML.setting.setObject('Game_LastStart', this.thisGameStartTime.toString());
        // this.setLastGameStartDate();
    },

    getLastGameStartDate(callback) {
        let self = this;
        this._getLastGameStartTime_server(function (date) {
            if (date) {
                console.log('服务器存在时间');
                callback(date);
            } else {
                let date = self._getLastGameStartTime_local();
                if (!date) {
                    console.log('本地不存在时间');
                    date = new Date();
                }
                console.log('最终时间', date);
                callback(date);
            }
        });
    },

    setLastGameStartDate() {
        this._setLastGameStartTime_server();
        this._setLastGameStartTime_local();
    },

    _getLastGameStartTime_server(callback) {
        ML.api.getSelfStorage('Game_LastStartDate', function (dateStr) {
            console.log('服务器时间:',dateStr);
            if (dateStr) {
                let json = JSON.parse(dateStr);
                let date = new Date(json.date);
                callback(date);
            } else {
                callback(null);
            }
        });
    },

    _getLastGameStartTime_local() {
        let dateStr = ML.setting.getObject('Game_LastStartDate', null);
        if(dateStr){
            return new Date(dateStr);
        }else{
            return null;
        }
    },

    _setLastGameStartTime_server() {
        let obj = {
            date: this.thisGameStartTime
        };
        let value = JSON.stringify(obj);
        ML.api.setSelfStorage('Game_LastStartDate', value);
    },

    _setLastGameStartTime_local() {
        ML.setting.setObject('Game_LastStartDate', this.thisGameStartTime);
    },

    // update (dt) {},
});