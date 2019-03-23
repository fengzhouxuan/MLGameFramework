
const BaseModule = require('BaseModule');
cc.Class({
    extends: BaseModule,
    properties: {

    },

    onLoad() {
        this.moduleName = 'setting';
        this._super();
    },

    getInt(k, defaultValue) {
        var v = this._getValue(k, defaultValue);
        return parseInt(v);
    },

    getFloat(k, defaultValue) {
        var v = this._getValue(k, defaultValue);
        return parseFloat(v);
    },

    getBool(k, defaultValue) {
        if(defaultValue==true){
            defaultValue = 'true';
        }else{
            defaultValue = 'false';
        }
        var v = this.getString(k, defaultValue);
        if (v == 'true') {
            return true;
        }
        return false;
    },

    getString(k, defaultValue) {
        return this._getValue(k, defaultValue);
    },

    getObject(k, defaultValue) {
        var v = this._getValue(k, defaultValue);
        if (!v || v == '') {
            return null;
        }
        return JSON.parse(v);
    },

    //---------------------------------------------

    setObject(k, v) {
        if (v) {
            var v = JSON.stringify(v);
        }
        this.setValue(k, v);
    },

    setBool(k,v){
        if(v==true){
            this.setValue(k,'true');
        }else{
            this.setValue(k,'false');
        }
    },
    setValue(k, v) {
        cc.sys.localStorage.setItem(k, v);
    },

    /**
     * 追加整数形
     */
    appendInt(k, v) {
        let vint = this.getInt(k, 0);
        let v2Save = parseInt(v) + vint;
        this.setValue(k, v2Save);
    },

    appendFloat(k, v) {
        let vf = this.getFloat(k, 0);
        let v2Save = parseFloat(v) + vf;
        this.setValue(k, v2Save);
    },

    //-------------------------------------------------

    removeValueOfKey(key) {
        cc.sys.localStorage.removeItem(key);
    },

    removeAll() {
        cc.sys.localStorage.clear();
    },

    //-------------------------------------------------

    _getValue(k, defaultValue) {
        let value = cc.sys.localStorage.getItem(k);
        if (value === null || value === ''||value===undefined) {
            value = defaultValue;
        }
        return value;
    }
});
