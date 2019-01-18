
const MathUtil = cc.Class({
    statics:{
        /**
         * 计算等差数列第n项的值
         * @param {*} a1 首项
         * @param {*} d 公差
         * @param {*} n 第几项
         */
        NOfArithmeticProgression(a1,d,n){
            //公式 an=a1+(n-1)*d
            return a1+(n-1)*d;
        },

        /**
         * 计算等差数列前n项的和
         * @param {*} a1 首项
         * @param {*} d 公差
         * @param {*} n 几项
         */
        SumOfArithmeticProgression(a1,d,n){
            // 公式 a1*n+[n*(n-1)*d]/2
            return a1*n+(n*(n-1)*d)/2;
        },

        lerp(a,b,r){
            return cc.misc.lerp(a,b,r);
        },
    },
});
