---
date: 2022-05-16
tags: javascipts
---

# EventLoop 的小记 -- 微任务是否造成页面阻塞

## Why

`Javascript` 是一门单线程语言，也就是同一时间只能执行一个任务。在浏览器环境中存在很多异步任务，比如`Promise`、事件回调、setTimeout 等这些异步任务。这些任务执行时间是不定的，满足一定的条件后就会调用这些异步回调函数。所以就需要一套机制来管理这些异步任务，不至于页面的阻塞。也就是`Eventloop`机制

## 简介

其实 `eventloop` 就是一个不断循环的读取异步任务的机制，首先他有一套既定的规则：

1.  首先检查同步任务有没有执行完(也就是调用栈是否为空)。
1.  如果为空的话，就去检查`micro task` (微任务)队列是否有任务，如果有的话就一次性把`micro task` (微任务)执行完为止（包括`micro task` (微任务)执行过程中再次生成微任务），直到`micro task` (微任务)队列为空再去检查宏任务 `macro task` (宏任务)队列。每执行完一个 `macro task` (宏任务)还要去检查`micro task` (微任务)队列是否为空，不为空的话先去把 micro task 队列清空。如此反复。

## 任务

上面说了`micro task` 与 `macro task` 就是异步任务的分类。创建它们的 API 也是不一样的比如：

创建`micro task` (微任务)的有`Promise`、`MutationObserver` 等

创建 `macro task` (宏任务) 的有：`setTimeout`、 `setInterval`、`requestAnimationFrame` `MessageChannel`还有一些 IO 事件等(这里 rAF 有争议，但它绝对不是微任务）

### 任务表现差异

任务都是在调用栈中执行的，不断什么任务，单个任务是不能被中断的。

关于`micro task` (微任务)与`macro task` (宏任务) 上面说了它们的执行顺序不一样，也就是微任务的优先级高。**但是还有一个最重要的不同任务表现区别，也就是这篇文章最想要记录的 — 微任务会阻塞页面的渲染，给用户造成卡顿的感觉**。`EventLoop类似的规则如下:`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/977a2329b43f4012ab3af988ca760902~tplv-k3u1fbpfcp-watermark.image?)

可以看出直到把`micro task` (微任务)队列情况才去执行渲染，有关视频可以去[事件循环的进一步探索 - Erin Zimmer - JSConf EU 2018](https://www.youtube.com/watch?v=u1kqx6AenYw&t=853s) 看

我也做了一个 demo 验证上面的规则，确实如此：[Demo 跳转](https://codepen.io/jackluson/pen/eYVgewE)，这个 demo 其实就是在 15 秒之内一直执行、创建微任务 or 宏任务。在这期间去点击页面交互、看页面是否及时渲染。结果发现只有 promise 才会造成页面的卡顿，其他都不会（基于这个原因我更倾向把 rAF 规律为宏任务）。此外 setTimeout 还有最小 4ms 的限制(第一次执行除外)。也就容易理解 React 调度器 scheduler 为什么用 MessageChanel 来实现还有 Vue 的 nextTick 因此 MessageChannel 是一对一通信，没有像 setTimeout 受到 4ms 限制，还有 rAF 受到浏览器渲染频率限制(16.6ms)。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b536e6ca592d408aa7c20e57c7ac5493~tplv-k3u1fbpfcp-watermark.image?)

部分代码如下

```
const button2 = document.querySelector('.btn2');
button2.addEventListener('click', () => {
    // 可以交互， 不会造成页面卡顿
    let pre = performance.now();
    let count = 0;
    const fn = () => {
      count++;
      if (count % 250 === 0) {
        console.log('count', count);
      }
      if (performance.now() - pre < 1000 * 15) {
        setTimeout(() => {
          fn();
        }, 0);
      }
    };
    fn();
});
```

## 不同宿主环境

`JavaScript` 有不同的运行时环境，比如浏览器、Node、Web Worker 等各种环境也为`JS` 提供创建异步任务的 API。上面说的是浏览器环境，比如 Node 环境还有 `setImmediate` `process.nextTick` 等，不同环境 Eventloop 也有差别。这里不做重点介绍。

## Reference

1.  [规范文档](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)
