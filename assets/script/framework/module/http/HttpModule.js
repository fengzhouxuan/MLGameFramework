const BaseModule = require('BaseModule');
let WXHttpHelper = require('WXHttpHelper');
cc.Class({
    extends: BaseModule,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.moduleName = 'http';
        this._super();
        this.helper = new WXHttpHelper();
    },

    onStart() {
    },

    lateStart() {

    },

    GET(url, params,header, success, fail) {
        this.helper.GET(url, params,header, success, fail);
    },

    POST(url, params,header,success, fail) {
        this.helper.POST(url, params,header, success, fail);
    },

});
