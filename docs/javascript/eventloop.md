---
date: 2019-04-18
tags: javascipts
---

# EventLoop的理解

## JavaScript是单线程语言

> 由于JavaScript是本身是单线程语言,如果某一个任务执行时间很长,这会导致了后面的任务一直在等待,造成了"堵塞"(同步执行),为了解决这个问题又可以免去多线程带来资源浪费的问题,JS建立了EventLoop机制,根据Wikipedia解释:"Event Loop是一个程序结构，用于等待和发送消息和事件。（a programming construct that waits for and dispatches events or messages in a program.）"

#### 1. JavaScript内存模式

讲到EventLoop之前,先看一张在网上看到了Javascript的内存模型图,相信之前没看过的话,同我一样有一种拨开云雾见云开的感觉

![内存模式示例图](https://raw.githubusercontent.com/jackluson/git-static/master/images/learn-path-recording-and-coding/20190418094811.png)

上图设计到了栈,队列,堆的数据结构

- 调用栈（Call Stack）：用于主线程任务的执行
- 堆(Heap): 用于存储引用数据类型的数据,例如对象,数组等
- 任务队列(Queue): 用于存放异步任务与定时任务(MacroTask and MicroTask)

> 结合JS来说就是一个主要负责程序从上到下的主线程(main Loop),另一个负责响应一些异步任务(文件读取,http请求等),与主线程通信的EventLoop线程
>
> - RunTime:浏览器提供的API（window对象，DOM相关的API等）+JS的事件循环（Event Loop）+ 事件队列（CallBack Queue）统称为RunTime（执行时），所以也这样说Node就是js的一个执行时
>
> - Call Stack调用栈：JS中所有的任务都放在调用栈执行，注意是**所有**，不管是异步还是同步
>
> - EventLoop工作机制：回调函数通过一定的规则加入到CallBack Queue（队列结构，先进先出）中，EventLoop通过轮询，监听到Call Stack调用栈（栈结构，后进先出）为空时，才会从事件队列中（按照队列数据结构）出队，放入到调用栈中执行
>
>   ```javascript
>   //基本逻辑代码
>   while (queue.waitForMessage()) {
>   	queue.processNextMessage();
>   }
>   ```
>
>   



### EventLoop中的任务
  > 在EventLoop轮询过程中遇到两种任务：一种宏任务（MarcoTask）也叫Task，一种叫微任务（MricoTask）
  >   #### MacroTask（宏任务,Task）
  > script全部代码、setTimeout、setInterval、setImmediate（浏览器暂时不支持，只有IE10支持，具体可见MDN）、I/O、UI Rendering,requestAnimation(浏览器)。



  >   #### MicroTask（微任务,在ES2015规范中称为Job）
  > Process.nextTick（Node独有）、Promise、Object.observe(废弃)、MutationObserver
  > Event loop in Browser

**备注**:微任务的优先级高于宏任务

## EventLoop执行机制

> EventLoop 是一种执行机制,js本身是不提供的,在不同的执行环境下有不一样的实现,浏览器和Node.Js基于不同的技术实现各自的EventLoop

1. #### 浏览器的EventLoop

   >浏览器至少有一个EventLoop即浏览器上下文EventLoop,有时也需要workers。 见于[[html5的规范](https://link.juejin.im/?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fhtml5%2Fwebappapis.html%23event-loops)]，下面说即是浏览器的EventLoop

   **规范:**

   - 一个`event loop`可以有1个或多个task queue，而仅有一个` MicroTask Queue`。
   - 一个`task queue`是一列有序的task, 每个task定义时都有一个`task source`，从同一个task source来的task必须放到同一个task queue，从不同源来的则被添加到不同队列。

   **执行顺序:**

   > - 调用栈`call stack` 执行同步任务后,如果调用栈为空时,就会检查**微任务队列** 是否为空,如果为空的话,再去执行任务,不为空的话,一次性执行完所有的微任务
   >
   > - 每次当个宏任务执行完之后,就会去检查**微任务队列**(`MicroTask` )是否为空,如果不为空的话，会按照**先入先**出的规则全部执行完**微任务**(`microTask`)后，设置**微任务**(`microTask`)队列为`null`，然后再执行**宏任务**，如此循环。

   如浏览器的事件循环机制图解:

   ![](https://raw.githubusercontent.com/jackluson/git-static/master/images/learn-path-recording-and-coding/20190418102750.png)

```javascript
/*注不同浏览器内核,和版本不一样结果有差异,因为对async/await的规范不一样*/
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end') 
}
async1()

setTimeout(function() {
  console.log('setTimeout');
  new Promise(resolve => {
  console.log('Promise2')
  resolve()
  }).then(function() {
    console.log('promise3')
  })
}, 0)
setTimeout(function() {
  console.log('setTimeout2')
}, 0)
new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
/*
'script start'-->'async2 end'-->'Promise'-->'script end'-->'promise1'-->'promise2'
-->'setTimeout'-->'Promise2'-->'promise3'-->'setTimeout2'
*/
```



2. ### NodeJS的Event Loop

> `Node`中的`Event Loop`是基于`libuv`实现的，而`libuv`是一个支持多平台,专注于异步I/O库，libuv使用异步，事件驱动的编程方式，核心是提供`i/o`的事件循环和异步回调。libuv的`API`包含有时间，非阻塞的网络，异步文件操作，子进程等等。 `Event Loop`就是在`libuv`中实现的。

如示例图:

![](https://raw.githubusercontent.com/jackluson/git-static/master/images/learn-path-recording-and-coding/20190418201018.png)



#### `Node`的`Event loop` 执行宏队列的回调任务一共分为6个阶段
>  每个细节具体如下：

- **timers阶段**：这个阶段执行setTimeout和setInterval预定的callback

  **I/O callback阶段**：执行除了close事件的callbacks、被timers设定的callbacks、setImmediate()设定的callbacks这些之外的callbacks

  **idle, prepare阶段**：仅node内部使用

  **poll阶段：获取新的I/O事件**，适当的条件下node将阻塞在这里

  **check阶段**：执行setImmediate()设定的callbacks

  **close callbacks阶段**：执行socket.on('close', ....)这些callbacks

![](https://raw.githubusercontent.com/jackluson/git-static/master/images/learn-path-recording-and-coding/20190418201854.png)

**备注**: node执行宏任务是一个轮回,一个轮回执行的

**NodeJS中宏队列主要有4个**

由上面的介绍可以看到，回调事件主要位于4个macrotask queue中：

1. Timers Queue
2. IO Callbacks Queue
3. Check Queue
4. Close Callbacks Queue

> 这4个都属于宏队列，但是在浏览器中，可以认为只有一个宏队列，所有的macrotask都会被加到这一个宏队列中，但是在NodeJS中，不同的macrotask会被放置在不同的宏队列中。

**NodeJS中微队列主要有2个**：

1. Next Tick Queue：是放置process.nextTick(callback)的回调任务的
2. Other Micro Queue：放置其他microtask，比如Promise等

> 在浏览器中，也可以认为只有一个微队列，所有的microtask都会被加到这一个微队列中，但是在NodeJS中，不同的microtask会被放置在不同的微队列中。

具体可以参考下图辅助理解

![](https://raw.githubusercontent.com/jackluson/git-static/master/images/learn-path-recording-and-coding/20190418202306.png)

大体解释一下NodeJS的Event Loop过程：

1. 执行全局Script的同步代码
2. 执行microtask微任务，先执行所有Next Tick Queue中的所有任务，再执行Other Microtask Queue中的所有任务
3. 开始执行macrotask宏任务，共6个阶段，从第1个阶段开始执行相应每一个阶段macrotask中的所有任务，注意，这里是所有每个阶段宏任务队列的所有任务，在浏览器的Event Loop中是只取宏队列的第一个任务出来执行，每一个阶段的macrotask任务执行完毕后，开始执行微任务，也就是步骤2
4. Timers Queue -> 步骤2 -> I/O Queue -> 步骤2 -> Check Queue -> 步骤2 -> Close Callback Queue -> 步骤2 -> Timers Queue ......
5. 这就是Node(10版本及低于10版本)的Event Loop

**注意!** :node11以上的版本会执行一个宏任务就检查`microtask`,执行,和浏览器的event保持一致,而不是执行完当前阶段的所有宏任务再去执行`microtask`

如图所示

![](https://raw.githubusercontent.com/jackluson/git-static/master/images/learn-path-recording-and-coding/20190418213045.png)

![](https://raw.githubusercontent.com/jackluson/git-static/master/images/learn-path-recording-and-coding/20190418213100.png)

#### 总结
以上就是关于EventLoop的知识总结

参考链接:
>
> 1. **浏览器和NodeJS中不同的Event Loop** <https://github.com/kaola-fed/blog/issues/234>
> 2. **一次弄懂Event Loop** <https://juejin.im/post/5c3d8956e51d4511dc72c200>
> 3. **阮一峰** <http://www.ruanyifeng.com/blog/2013/10/event_loop.html>
> 4. **运行机制：事件队列与调用栈** <https://github.com/bigdots/blog/issues/5>