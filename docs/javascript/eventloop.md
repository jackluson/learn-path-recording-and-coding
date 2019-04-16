# EventLoop的理解
> 由于JavaScript是本身是单线程语言,如果某一个任务执行时间很长,这会导致了后面的任务一直在等待,造成了"堵塞"(同步执行),为了解决这个问题又可以免去多线程带来资源浪费的问题,JS建立了EventLoop机制,根据Wikipedia解释:"Event Loop是一个程序结构，用于等待和发送消息和事件。（a programming construct that waits for and dispatches events or messages in a program.）"
> 结合JS来说就是一个主要负责程序从上到下的主线程(main Loop),另一个负责响应一些异步任务(文件读取,http请求等),与主线程通信的EventLoop线程
> RunTime:浏览器提供的API（window对象，DOM相关的API等）+JS的事件循环（Event Loop）+ 事件队列（CallBack Queue）统称为RunTime（执行时），所以也这样说Node就是js的一个执行时
> Call Stack调用栈：JS中所有的任务都放在调用栈执行，注意时所有，不管是异步还是同步
> EventLoop工作机制：回调函数通过一定的规则加入到CallBack Queue（队列结构，先进先出）中，EventLoop通过轮询，监听到Call Stack调用栈（栈结构，后进先出）为空时，才会从事件队列中（按照队列数据结构）出队，放入到调用栈中执行

### EventLoop中的任务
  > 在EventLoop轮询过程中遇到两种任务：一种宏任务（MarcoTask）也叫Task，一种叫微任务（MricoTask）
  #### MacroTask（宏任务）
  > script全部代码、setTimeout、setInterval、setImmediate（浏览器暂时不支持，只有IE10支持，具体可见MDN）、I/O、UI Rendering。
  #### MicroTask（微任务）
  > Process.nextTick（Node独有）、Promise、Object.observe(废弃)、MutationObserver
Event loop in Browser

> 参考链接:
>
> 1. **掘金** <https://juejin.im/post/5a69885351882573467d2a93>
> 2. **掘金** <https://juejin.im/post/5a5d64fbf265da3e243b831f>
> 3. **阮一峰** <http://www.ruanyifeng.com/blog/2013/10/event_loop.html>