
var RandomUtil = cc.Class({
    statics: {
        randomIntegerN2M: function (n, m) {
            var random = Math.floor(Math.random() * (m - n + 1) + n);
            return random;
        },
        
        probabilityCanHappen:function(num){
            let random = RandomUtil.randomIntegerN2M(0,100);
            return random<=num;
        },

        //传入概率值数组，返回中标的概率下标
        probabilitys(parr){
            var arr = 0;
            var pres = cc.js.array.copy(parr);
            var probabilityCount = 0;
            for (let i = 0; i < pres.length; i++){
                probabilityCount+=pres[i];
            }
            if(probabilityCount!=100){
                console.error('所有概率值总和不等于100%');
            }
            var nums = new Array();
            for (let i = 0; i < pres.length; i++) {
                const element = pres[i];
                for (let index = 0; index < element; index++) {
                    nums.push(arr);
                }
                arr++;
            }
            var random = RandomUtil.randomIntegerN2M(0,99);
            var targetIndex = nums[random]; 
            return targetIndex;
        },
        
        weight(weigths){
            let flag = 0;
            let total = 0;
            let tempWeigths = cc.js.array.copy(weigths);
            for (let i = 0; i < tempWeigths.length; i++) {
                let weight = tempWeigths[i];
                total+=weight;
            }
            let nums = [];
            for (let i = 0; i < tempWeigths.length; i++) {
                let weigth = tempWeigths[i];
                for (let j = 0; j < weigth; j++) {
                    nums.push(flag);
                }
                flag++;
            }
            let random = RandomUtil.randomIntegerN2M(0,total-1);
            let targetIndex = nums[random]; 
            return targetIndex;
        },
    },
});
