/**
 * DO:
 * 1栈方式管理UI，
 * 2缓存UI
 * 3入栈（显示UI）
 * 4出栈（关闭UI）
 * 5关闭指定UI
 * 
 * TODO:
 * 1上层UI遮盖下层UI逻辑回调
 * 2设置label默认字体
 * 3按需清理缓存
 * 
 * ISSUE
 * 1由于UI是异步加载，导致UI栈顺序会错乱 (fixed)
 * 2连续push相同UI（待测试）
 */
const BaseModule = require('BaseModule');
var FormModel = cc.Class({
    name: "FormModel",
    properties: {
        name: null,   //resource/UI下的uiPrefab
        node: null,   //ui节点
        UIForm: null, //节点上的UIForm脚本或其子类
        zIndex: 0,
    }
})

cc.Class({
    extends: BaseModule,
    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.moduleName = 'UI';
        this._super();
        this.layerIndex = 0;
        this.UIRoot = 'prefab/uiForm/';     //定义resources目录下存放UI预设的目录
        this.UIFormStack = [];
        this.cachedUIForms = [];

        this.toastForm = null;
        this.tipToastForm = null;
    },

    showToast(msg){
        let self = this;
        if(self.toastForm==null){
            this._createUINode('toastForm',1000,function(node,index){
                cc.Canvas.instance.node.addChild(node);
                self.toastForm = node.getComponent('ToastForm');
                node.zIndex = index;
                self.toastForm.show(msg);
            });
        }else{
            self.toastForm.show(msg);
        }
    },
    showTipToast(msg){
        let self = this;
        if(self.tipToastForm==null){
            this._createUINode('tipToast',2000,function(node,index){
                cc.Canvas.instance.node.addChild(node);
                self.tipToastForm = node.getComponent('TipToastForm');
                node.zIndex = index;
                self.tipToastForm.willShow(msg);
                self.tipToastForm.show(msg);
            });
        }else{
            self.tipToastForm.willShow(msg);
            self.tipToastForm.show(msg);
        }
    },
    /**
     * 显示一个ui
     * @param {string} name  resources/UI目录下的预设名字 
     * @param {Object} data 携带的自定义数据
     * @param {Function} callback ui显示后回调:(formModel,data:Object)
     */
    pushUIForm(name, data, callback) {
        let self = this;
        let cachedFormModel = this._getUINodeFromCacheByName(name);
        if (cachedFormModel == null) {
            this._createUIFormModel(name, function (formModel) {
                self._showUIForm(formModel,data);
                if (callback) {
                    callback(formModel, data);
                }
            });
        } else {
            //缓存取出
            cachedFormModel.zIndex = this.layerIndex++;
            this.UIFormStack.push(cachedFormModel);
            this._showUIForm(cachedFormModel, data);
            if (callback) {
                callback(cachedFormModel, data);
            }
        }
    },

    /**
     * 从栈顶隐藏一个UI
     */
    pop() {
        if (this.UIFormStack.length == 0) return;
        let formModel = this.UIFormStack.pop();
        this._hideUIForm(formModel, null);
    },

     /**
     * 获取一个UIForm
     * @param {string} name 
     */
    getUIFrom(name){
        for (let i = 0; i < this.UIFormStack.length; i++) {
            const formModel = this.UIFormStack[i];
            if (formModel.name == name) {
                return formModel.UIForm;
            }
        }
    },

    /**
     * 隐藏某个UI
     * @param {*} name 预设名
     * @param {*} data 携带的自定义数据
     */
    hideUIForm(name, data) {
        for (let i = 0; i < this.UIFormStack.length; i++) {
            const formModel = this.UIFormStack[i];
            if (formModel.name == name) {
                this._hideUIForm(formModel, data);
            }
        }
    },

    hideAllUIForm(){
        for (let i = this.UIFormStack.length-1; i>=0; i--) {
            const formModel = this.UIFormStack[i];
                this._hideUIForm(formModel, null);
        }
    },

    /**
     * 实例化resource下ui目录的prefab
     * @param {Int} formId 层级
     * @param name resources下的路径   
     * @param callback 参数 node
     */
    _createUINode(name, formId, callback) {
        let path = this.UIRoot + name;
        ML.resource.loadAsset(path, cc.Prefab, function (err, prefab) {
            var formNode = cc.instantiate(prefab);
            if (callback) callback(formNode, formId);
        });
    },

    /**
     * 创建一个formModel
     * @param {*} name  
     * @param {*} callback 
     */
    _createUIFormModel(name, callback) {
        //防止异步加载UI层级错乱方案
        //1异步加载预设前初始化一个model,记录将要加载的预设名以及zindex
        //2异步时传入该zindex，在加载完成时回调返回该zindex
        //3循环匹配UIStack，判断取出zindex和name相等的model，赋值UIForm和node
        let self = this;
        let formModel = new FormModel();
        formModel.name = name;
        let index = this.layerIndex++;
        formModel.zIndex = index;
        this.UIFormStack.push(formModel);

        this._createUINode(name, index, function (node, index) {
            for (let i = 0; i < self.UIFormStack.length; i++) {
                const tempFormModel = self.UIFormStack[i];
                if (tempFormModel.zIndex == index && tempFormModel.name ==node.name) {
                    if (node == null) {
                        cc.js.array.remove(self.UIFormStack, formModel);
                        return;
                    } else {
                        let UIForm = node.getComponent('UIForm');
                        tempFormModel.UIForm = UIForm;
                        tempFormModel.node = node;
                        if (callback) {
                            callback(formModel);
                        }
                        return;
                    }
                }
            }
        });
    },

    _getUINodeFromCacheByName(name) {
        for (let i = 0; i < this.cachedUIForms.length; i++) {
            const element = this.cachedUIForms[i];
            if (element.node!=null && element.name == name) {
                cc.js.array.remove(this.cachedUIForms, element);
                return element;
            }
        }
        return null;
    },

    _showUIForm(formModel, data) {
        for (let i = 0; i < this.UIFormStack.length; i++) {
            let form = this.UIFormStack[i];
            form.UIForm.onOtherFormWillShow(formModel);
        }
        cc.Canvas.instance.node.addChild(formModel.node);
        formModel.UIForm.willShow(data);
        formModel.node.active = true;
        formModel.node.zIndex = formModel.zIndex;
        formModel.UIForm.onShow(data);
    },

    _hideUIForm(formModel, data) {
        formModel.UIForm.willHide(data);
        formModel.node.removeFromParent();
        formModel.UIForm.onHide(data);
        formModel.node.active = false;
        cc.js.array.remove(this.UIFormStack, formModel);
        this.cachedUIForms.push(formModel);
        for (let i = 0; i < this.UIFormStack.length; i++) {
            let form = this.UIFormStack[i];
            form.UIForm.onOtherFormHide(formModel);
        }
    },
});
