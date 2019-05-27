# 视频直播那些事

### 一、前提知识

视频流TS/PS

- PS（Program Stream）: 静态文件流
- TS（Transport Stream）: 动态文件流

针对于上面两种容器格式，实际上是对一个视频比特流做了不一样的处理。

- PS: 将完成视频比特流放到一个盒子里，生成固定的文件
- TS: 将接受到的视频，分成不同的盒子里。最终生成带有多个盒子的文件。

那么结果就是，如果一个或多个盒子出现损坏，PS 格式无法观看，而 TS 只是会出现跳帧或者马赛克效应。两者具体的区别就是：对于视频的容错率越高，则会选用 TS，对视频容错率越低，则会选用 PS。

### 二、H5录制视频

一般来讲可以使用浏览器HTML5提供给我们的API来录制，例如**webRTC** （Web Real-Time Communication）

--是一个支持网页浏览器进行实时语音对话或视频对话的技术，缺点是只在 PC 的 Chrome 上支持较好，移动端支持不太理想。

**使用 webRTC 录制视频基本流程是：**

1. 调用 `window.navigator.webkitGetUserMedia()` 获取用户的PC摄像头视频数据。
2. 将获取到视频流数据转换成 `window.webkitRTCPeerConnection` (一种视频流数据格式)。
3. 利用 webscoket 将视频流数据传输到服务端

> 因为浏览器支持率不高，因此一般也不使用这个方式，一般是靠客户端（iOS，Android）实现

### 三、H5播放直播视频

对于视频播放，可以使用 HLS(HTTP live streaming)协议播放直播流，iOS和 Android 都天然支持这种协议，配置简单，直接使用 `video` 标签即可。

#### 1. HLS协议

> 基于 HTTP 的视频流协议。这是 Apple 提出的直播流协议

一个提供 HLS 的服务器需要做两件事:

1. 编码：以 H.263 格式对图像进行编码，以 MP3 或者 HE-AAC 对声音进行编码，最终打包到 MPEG-2 TS（Transport Stream）容器之中；

2. 分割：把编码好的 TS 文件等长切分成后缀为 ts 的小文件，并生成一个 .m3u8 的纯文本索引文件；

把整个视频流分成一个个小的,基于HTTP文件来下载,每次只下载一点,这个HTTP文件就是.m3u8文件,这个文件基于hls协议,存放视频流元数据的文件。

>  每一个 .m3u8 文件，分别对应若干个 ts 文件，这些 ts 文件才是真正存放视频的数据，m3u8 文件只是存放了一些 ts 文件的配置信息和相关路径，当视频播放时，.m3u8 是动态改变的，`video` 标签会解析这个文件，并找到对应的 ts 文件来播放，所以一般为了加快速度，.m3u8 放在 Web 服务器上，ts 文件放在 CDN 上。

#### 2.HLS 的请求流程：

1. HTTP 请求 m3u8 的 url。

2. 服务端返回一个 m3u8 的播放列表，这个播放列表是实时更新的，一般一次给出5段数据的 url。

   ```
   //m3u8纯文本索引文件
   #EXTM3U
   #EXT-X-VERSION:3
   #EXT-X-ALLOW-CACHE:NO
   #EXT-X-MEDIA-SEQUENCE:1558707594
   #EXT-X-TARGETDURATION:7
   #EXTINF:5.984,
   3112_ce4de9cf7e2e11e992905cb9018cf0d4-1558707594.ts
   #EXTINF:6.318,
   3112_ce4de9cf7e2e11e992905cb9018cf0d4-1558707595.ts
   #EXTINF:6.309,
   3112_ce4de9cf7e2e11e992905cb9018cf0d4-1558707596.ts
   #EXTINF:5.283,
   3112_ce4de9cf7e2e11e992905cb9018cf0d4-1558707597.ts
   #EXTINF:6.033,
   3112_ce4de9cf7e2e11e992905cb9018cf0d4-1558707598.ts
   ```

   

3. 客户端解析 m3u8 的播放列表，再按序请求每一段的 url，获取 ts 数据流

   > 整个直播过程就是依靠一个不断更新的 m3u8 和一堆小的 ts 文件组成，m3u8 必须动态更新，ts 可以走 CDN。

#### 3.HLS 直播延时:

我们知道 hls 协议是将直播流分成一段一段的小段视频去下载播放的，所以假设列表里面的包含5个 ts 文件，每个 TS 文件包含5秒的视频内容，那么整体的延迟就是25秒。因为当你看到这些视频时，主播已经将视频录制好上传上去了，所以时这样产生的延迟。当然可以缩短列表的长度和单个 ts 文件的大小来降低延迟，极致来说可以缩减列表长度为1，并且 ts 的时长为1s，但是这样会造成请求次数增加，增大服务器压力，当网速慢时回造成更多的缓冲，所以苹果官方推荐的 ts 时长时10s，所以这样就会大改有30s的延迟。所以服务器接收流，转码，保存，切块，再分发给客户端，这里就延时的根本原因。

**但是 H5 直播视频却有一些不可替代的优势:**

1. 传播性好，利于分享等操作。
2. 可以动态发布，有利于实时迭代产品需求并迅速上线。
3. 不用安装 App，直接打开浏览器即可。

### 四、关于 RTMP

RTMP(Real Time Messaging Protocol)是macromedia开发的一套视频直播协议，现在属于 Adobe。和 HLS 一样都可以应用于视频直播，区别是 RTMP **基于 flash **无法在 iOS 的浏览器里播放，但是实时性比 HLS 要好。所以一般使用这种协议来上传视频流，也就是视频流推送到服务器。

![img](https://user-gold-cdn.xitu.io/2018/3/15/16228f66b4ed3670?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 五、关于HTTP-FLV

比较常用的就是 HTTP-FLV 进行播放。但，由于手机端上不支持，所以，H5 的 HTTP-FLV 也是一个痛点。不过，现在 flv.js 可以帮助高版本的浏览器，通过 mediaSource 来进行解析。HTTP-FLV 的使用方式也很简单。和 HLS 一样，只需要添加一个连接即可：
```html
<object type="application/x-shockwave-flash" src="xxx.flv"></object>
```

### 六、兼容方案

PC端

1、优先使用 HTTP-FLV，因为它延迟小，性能也不差1080P都很流畅。

2、不支持 flv.js 就使用 Flash播放器播 RTMP 流。Flash兼容性很好，但是性能差默认被很多浏览器禁用。

3、不想用Flash兼容也可以用HLS，但是PC端只有Safari支持HLS

移动端

1、优先使用 HTTP-FLV，因为它延迟小，支持HTTP-FLV的设备性能运行 flv.js 足够了。

2、不支持 flv.js 就使用 HLS，但是 HLS延迟非常大。

3、HLS 也不支持就没法直播了，因为移动端都不支持Flash。