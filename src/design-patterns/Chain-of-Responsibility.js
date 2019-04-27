/*
 * @Author: 18219
 * @Date:   2019-04-27 21:19:47
 * @Last Modified by:   18219
 * @Last Modified time: 2019-04-28 00:15:55
 */
// 设计模式之职责链模式 职责链模式（Chain of responsibility）是使多个对象都有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系。将这个对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理他为止。  
//职责链模式（Chain of responsibility）是使多个对象都有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系。将这个对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理他为止。
/*
基本流程:
1. 发送者知道链中的第一个接收者，它向这个接收者发送该请求。

2. 每一个接收者都对请求进行分析，然后要么处理它，要么它往下传递。

3. 每一个接收者知道其他的对象只有一个，即它在链中的下家(successor)。

4. 如果没有任何接收者处理请求，那么请求会从链中离开。
 */
'use strict';
var NO_TOPIC = -1;
var Topic;

function Handler(s, t) {
    this.successor = s || null;
    this.topic = t ||
        0;
}
Handler.prototype = {
    handle: function() {
        if (this.successor) { this.successor.handle() }
    },
    has: function() {
        return this.topic != NO_TOPIC; }
};
var app = new
Handler({ handle: function() { console.log('app handle'); } },
    3);

var dialog = new Handler(app, 1);
dialog.handle = function () {
    console.log('dialog before ...')
    // 这里做具体的处理操作
    Handler.prototype.handle.call(this); //继续往上走
    console.log('dialog after ...')
};

var button = new Handler(dialog, 2);
// button.handle = function () {
//     console.log('button before ...')
//     // 这里做具体的处理操作
//     // Handler.prototype.handle.call(this);
//     console.log('button after ...')
// };

button.handle();
// 类比--DOM里的事件冒泡机制也和此好像有点类似，比如点击一个按钮以后，如果不阻止冒泡，其click事件将一直向父元素冒泡
