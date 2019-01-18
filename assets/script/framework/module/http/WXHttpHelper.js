let HttpBaseHelper = require('HttpBaseHelper');

cc.Class({
    extends: HttpBaseHelper,

    GET(url, params, header = { 'content-type': 'application/json' }, success = null, fail = null) {
        if (!window.wx) {
            return;
        }
        wx.request({
            // url: url + "?" + this.objectToForm(params),
            url:url,
            data: params,
            method: 'GET',
            header: header,
            success: function (result) {
                if (success) success(result);
            },
            fail: function () {
                if (fail) fail();
            }
        });
    },

    POST(url, params, header = { 'content-type': 'application/json' }, success = null, fail = null) {
        if (!window.wx) {
            return;
        }
        wx.request({
            url: url,
            data: this.objectToForm(params),
            method: "POST",
            header: header,
            success: function (result) {
                if (success) success(result);
            },
            fail: function () {
                if (fail) fail();
            }
        });
    },

    objectToForm(obj) {
        let str = [];
        for (let p in obj) {
            str.push(p + "=" + obj[p]);
        }
        // console.log("post param", str.join("&"));
        return str.join("&");
    },
});
