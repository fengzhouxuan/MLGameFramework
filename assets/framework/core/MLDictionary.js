
ML.MLDictionary = function () {
    this._size = 0;
    this.data = {};
};
ML.MLDictionary.prototype = {
    constructor: ML.MLDictionary,

    size: function () {
        return this._size;
    },

    clear: function () {
        this.data = {};
        this._size = 0;
    },

    add: function (k, v) {
        if (!this.containKey(k)) {
            this._size++;
        }
        this.data[k] = v;
    },

    remove: function (k) {
        if (this.containKey(k) && (delete this.data[k])) {
            this._size--;
        }
    },

    valueForKey: function (k) {
        return this.containKey(k) ? this.data[k] : null;
    },

    keyForValue: function (v) {
        for (var prop in this.data) {
            if (this.data[prop] === v) {
                return prop;
            }
        }
        return null;
    },

    getAllKeys: function () {
        var keys = [];
        for (var prop in this.data) {
            keys.push(prop);
        }
        return keys;
    },

    getAllValues: function () {
        var values = [];
        for (var prop in this.data) {
            values.push(this.data[prop]);
        }
        return values;
    },

    containKey: function (k) {
        return (k in this.data);
    },
};

module.exports = ML.MLDictionary;