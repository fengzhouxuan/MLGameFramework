cc.Class({
    name:'EntityPoolData',
    properties: {
        groupName:{
            displayName: "实体组名",
            default:"Default",
        },
        poolSize:{
            displayName:'对象池大小',
            default:30,
        },
        autoReleseInterval:{
            displayName:'自动释放时长',
            default:30,
        },
    },
});