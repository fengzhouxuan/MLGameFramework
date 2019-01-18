/**
 * HASDO:
 * 1.单个资源动态异步加载
 * 2.批量动态异步加载，通常用于游戏启动时的预加载
 * TODO:
 * 1，资源释放
 * 2，缓存
 */
const BaseModule = require('BaseModule');
cc.Class({
    extends: BaseModule,

    properties: {
        bmfontSp:cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.moduleName = 'resource';
        this._super();
    },

    start() {
    },
    /**
     * 加载resources下的cc.SpriteFrame, cc.AnimationClip, cc.Prefab
     * 不带扩展名
     * @method loadAsset
     * @param {String} url resources下路径
     * @param {typeof cc.Asset} assetType cc.SpriteFrame, cc.AnimationClip, cc.Prefab..
     * @param {Function} [callback] (err:Error,asset:cc.Asset)
     * @param {typeof cc.Asset} callback.asset cc.SpriteFrame, cc.AnimationClip, cc.Prefab..
     */
    loadAsset(url,assetType,callback) {
        let res = cc.loader.getRes(url,assetType);
        if(res){
            if(callback){
                callback(null,res);
            }
            return;
        }
        cc.loader.loadRes(url,assetType,function(err,asset){
            if(callback){
                callback(err,asset);
            }
        });
    },

    /**
     * 加载resources目录下某个目录下的指定类型的资源(用于预加载整个目录资源)
     * @param {string} dir resources下的目录
     * @param {typeof cc.Asset} type 
     * @param {Function} progressCallback (precent:number)
     * @param {Function} completeCallback (err:Error,reses:Asset[])
     */
    loadAssetDir(dir,type,progressCallback,completeCallback){
        cc.loader.loadResDir(dir,type,
        function(completedCount, totalCount, item){
            let precent = completedCount/totalCount*100;
            precent = Math.ceil(precent);
            if(progressCallback){
                progressCallback(precent);
            }
        },
        function(err,res){
            if(completeCallback){
                completeCallback(err,res);
            }
        });
    },

     /**
     * 获取resources下指定目录下所有文件相对于resources的路径和UUid
     * @param {cc.String} path 
     * @param {cc.Asset} type 
     */
    getDirUrlsAndUUids(path,type){
        return this._getDirUrlsAndUUids(path,type);
    },

    /**
     * 获取resources下指定目录下所有文件相对于resources的路径和UUid
     * @param {cc.String} path 
     * @param {cc.Asset} type 
     */
    _getDirUrlsAndUUids(path,type){
        let urls = [];
        let uuids = cc.loader._resources.getUuidArray(path, type, urls);
        // console.log('所有贴图路径:',urls);
        // console.log('所有贴图uuid:',uuids);
        return {
            urls:urls,
            uuids:uuids,
        };
    },

    insertSpriteFrameTodynamicAtlasManager(spriteFrame){
        this._insertSpriteFrameTodynamicAtlasManager(spriteFrame);
    },

    _insertSpriteFrameTodynamicAtlasManager(spriteFrame){
        cc.dynamicAtlasManager.insertSpriteFrame(spriteFrame);
    }
    // update (dt) {},
});
