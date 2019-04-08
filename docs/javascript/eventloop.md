# EventLoop的理解
> 由于JavaScript是本身是单线程语言,如果某一个任务执行时间很长,这会导致了后面的任务一直在等待,造成了"堵塞"(同步执行),为了解决这个问题又可以免去多线程带来资源浪费的问题,JS建立了EventLoop机制,根据Wikipedia解释:"Event Loop是一个程序结构，用于等待和发送消息和事件。（a programming construct that waits for and dispatches events or messages in a program.）"
> 结合JS来说就是一个主要负责程序从上到下的主线程(main Loop),另一个负责响应一些异步任务(文件读取,http请求等),与主线程通信的EventLoop线程



> 参考链接: 
>
> 1. <https://juejin.im/post/5a69885351882573467d2a93>
> 2. <http://www.ruanyifeng.com/blog/2013/10/event_loop.html>