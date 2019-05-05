/*
* @Author: 18219
* @Date:   2019-05-04 18:59:28
* @Last Modified by:   18219
* @Last Modified time: 2019-05-04 20:06:13
*/

'use strict';
// 定义了一个为了解决某个问题的算法的框架,由两部分组成:父类与子类,父类定义了子类算法结构---一些公共方法,封装了所有方法的执行顺序,子类则继承这个父类,从而父类的方法,实现具体的业务逻辑
// 相比喻组合模式,也分子类,父类,但是有关键的差别则是组合模式关注点是有相同的结构,单个与组合的层次
var CaffeineBeverage = function () {

};
CaffeineBeverage.prototype.prepareRecipe = function () {
    this.boilWater();
    this.brew();
    this.pourOnCup();
    if (this.customerWantsCondiments()) {
        // 如果可以想加小料，就加上
 				this.addCondiments();
    }
};
CaffeineBeverage.prototype.boilWater = function () {
    console.log("将水烧开!");
};
CaffeineBeverage.prototype.pourOnCup = function () {
    console.log("将饮料到再杯子里!");
};
CaffeineBeverage.prototype.brew = function () {
    throw new Error("该方法必须重写!");
};
CaffeineBeverage.prototype.addCondiments = function () {
    throw new Error("该方法必须重写!");
};
// 默认加上小料
CaffeineBeverage.prototype.customerWantsCondiments = function () {
    return true;
};
// 冲咖啡
var Coffee = function () {
    CaffeineBeverage.apply(this);
};
Coffee.prototype = new CaffeineBeverage();
Coffee.prototype.brew = function () {
    console.log("从咖啡机想咖啡倒进去!");
};
Coffee.prototype.addCondiments = function () {
    console.log("添加糖和牛奶");
};
Coffee.prototype.customerWantsCondiments = function () {
		console.log('你想添加糖和牛奶吗？')
    // return confirm("你想添加糖和牛奶吗？");
};
// Coffee.prepareRecipe();
// console.log(Coffee)
var coffee1 = new Coffee();
coffee1.prepareRecipe();
//冲茶叶
var Tea = function () {
    // CaffeineBeverage.apply(this);
};
Tea.prototype = new CaffeineBeverage();
Tea.prototype.brew = function () {
    console.log("泡茶叶!");
};
Tea.prototype.addCondiments = function () {
    console.log("添加柠檬!");
};
Tea.prototype.customerWantsCondiments = function () {
    return confirm("你想添加柠檬嘛？");
};