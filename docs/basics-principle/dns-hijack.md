# 你所需要知道DNS劫持--web安全篇（1）

### 一、前言

> 背景：在一次CTO面试过程中，突然问起了我，平时开发过程中有没有遇到过DNS劫持的情况，啊，啥是DNS劫持？脑子突然蹦出所有的DNS的知识点，回忆之前工作遇到的问题，很凌乱，最终回答不知道。努力学习的我回来抓紧做功课，于是才有了这篇文章。
>
> DNS劫持（DNS Hijacking）：又被称为域名劫持，DNS重定向（DNS direaction）,是一种DNS攻击方式。即是DNS查询没有得到正确的解析，以致引导user访问到恶意的网站，从而窃取用户隐私，或者进行某些恶意的操作。

### DNS劫持:vs:HTTP劫持 

开始正式介绍DNS劫持之前，先与HTTP劫持做一个比较，可能有助于有些同学对下文更容易理解更深入一点。

DNS劫持现象：你输入一个google.com网址，出来的是百度的页面

HTTP劫持现象：访问着github的页面，右下角出现了一个格格不入的广告弹窗

**好比：**

> DNS劫持是你想去机场的时候，把你给丢到火车站。
> HTTP劫持是你去机场途中，有人给你塞小广告、

### 二、什么是DNS

> 理解dns劫持之前，先来回忆一下dns是如何工作的 

DNS(Domin Name System or Domain Name Service)，域名解析系统(服务) ：在网络世界中，服务器（server）是通过IP 地址标识的，网站（client）通过端口80/443 （http/https）可以访问，因此有些网站（没有限制IP访问的）直接通过ip地址也是可以访问的。DNS的责任就是将难以记忆的IP地址**映射**成对用户友好，易于记忆的域名。有了这样的映射表（:notes:注意，不是一对一关系，一个服务器（IP）可以对应多个域名），这样用户可以直接输入域名就可以通过DNS 服务器查到对应的服务器IP地址。

> 比如我们在终端命令 dig `https://www.tungee.com/`(探迹科技)就可以看到对应的服务器IP(49.99.141.230)了
>
> ![1560171939541](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560171939541.png)

从`www.tungee.com` 到 `49.99.141.230`的过程就叫做域名解析，域名解析需要由专门的域名解析服务器来完成

> 注：一般的网站会选择放在虚拟主机，且在主机上放置了很多个网站，而每个网站绑定1个或以上域名。虽然主机上有多个站点，但当用户访问某个站点时，服务器会根据http报文信息（域名），访问对应站点的部署目录，从而实现一台服务器上配置多个站点，即使有多个网站，也不会相互干扰。但使用IP访问，主机不知道用户访问的具体目录，请求便会出现异常情况。）

### 三、DNS解析原理

#### 1.查询步骤

![img](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/g98x0nn0p1.jpeg)

从上图（图片来源网络，如侵权请联系删）可以大概看出大体的步骤：

1. 客户端（浏览器）发送一个域名（例如`www.tungee.com`）解析请求，先检查浏览器缓存中有没有对应域名解析的IP地址，如果有直接返回。

2. 如果用户浏览器缓存没有查到的话，会先到操作系统的hosts文件中查找（听说ios设备没有该步骤，待验证），有对应的域名IP地址的话直接返回。

3. 如果本地hosts文件没有查到，会向外网的本地区域名服务器（Local DNS）发起查询请求，本地服务器收到请求之后，会先查询本地缓存，如果有的话会直接返回。

   > 本地区域名服务器通常性能都会很好，它们一般都会缓存域名解析结果，当然缓存时间是受域名的失效时间控制的，一般缓存空间不是影响域名失效的主要因素。大约90%的域名解析都到这里就已经完成了，所以LDNS主要承担了域名的解析工作。

4. 如果LDNS缓存没有结果的话，会向跟域名服务器发起请求，根域名（Root Server）返回来的是一个所查询域（根的子域，例如`.com`）的主域名服务器（gTLD Server）的地址，gTLD是国际顶级域名服务器，如.com，.cn、.org等。听说全球只有13台左右。

5. 接着，本地服务器再向上一步返回来的域名服务器下发送请求。

6. 接受请求的gTLD服务器查找并返回此域名对应的Name Server域名服务器的地址，这个Name Server通常就是你注册的域名服务器，例如你在某个域名服务提供商申请的域名，那么这个域名解析任务就由这个域名提供商的服务器来完成。

7. 得到了Name Server 服务器地址之后，Local DNS 再次向Name server 服务器发送请求，Name Server提供商是你申请的域名提供商，因此Name Server域名服务器会查询存储的域名和IP的映射关系表，正常情况下都根据域名得到目标IP记录。

8. Local DNS 得到了`www.tungee.com`对应的ip地址与TTL值（Time to live 的缩写，也就是上面的588这个值）之后，会根据这TTL值缓存这个域名与ip的对应关系。

9. 最终把该ip地址返回给浏览器

#### 2.dig+域名 命令的输出解读

> 虽然最终只返回了一个ip地址，但是查询的过程还是非常复杂的，分多个步骤，利用dig命令（windows 下需要额外装dig工具）可以大概知道这个查询过程。

```shell
dig tungee.com 
```

随后会出现以下几节信息

![1560173202968](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560173202968.png)

- 第一段是dig工具版本，查询参数和统计信息

  ![1560173887079](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560173887079.png)

- 第二段是查询内容

  ![1560174303420](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560174303420.png)

- 第三段是DNS服务器的答复

  ![1560174346252](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560174346252.png)

  >上面结果显示，tungee有1个A记录，即1个IP地址。
  >588是TTL值（Time to live 的缩写），表示缓存时间，即588秒之内不用重新查询。

- 第四段显示 tungee.com的NS记录（Name Server的缩写），即哪些服务器负责管理tungee.com的DNS记录

  ![1560174469165](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560174469165.png)

  > 上面结果显示 tungee.com共有2条NS记录，即2个域名服务器，向其中任一台查询就能知道 tungee.com的IP地址是什么。

- 第五段是上面2个域名服务器的IP地址，这是随着前一段一起返回的

  ![1560174876546](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560174876546.png)

- 第六段是DNS服务器的一些传输信息

  ![1560174932404](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560174932404.png)

  > 上面结果显示，本机的DNS服务器是192.168.1.253，查询端口是53（DNS服务器的默认端口），以及回应长度是418字节。

更多关于dig命令与解读，请可以看参考列表链接或者自行谷歌，百度。

#### 3.DNS服务器

上面第六段截图中you

```
；； SERVER: 202.96.128.86#53
```

上面这个就是当前电脑的DNS服务器ip地址，这个DNS服务器的ip地址是自动分配（当然也可以自定义）的，当用户联网时，宽带运营商会分配一个DNS服务器，这个服务器通常情况下时最快，距离最近的服务器。

![1560231821680](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560231821680.png)

> 上图就是window电脑的当前电脑分配的DNS服务器，Mac，Linux系统DNS服务器IP地址保存在/etc/resolv.conf文件中

如果用户因为某些网络问题，安全问题需要手动设置DNS服务器也是可以的

![1560236586648](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560236586648.png)

> 上图就是window设置DNS服务器页面，关于手动设置公共DNS服务器IP地址可以阅读[公共DNS哪家强？](<https://www.zhihu.com/question/32229915>)

#### 4.域名的层级

从查询的步骤来看,域名是有层级的。

> 举个例子来说,`www.tungee.com` 真正的域名是`www.tungee.com.root` 
>
> 因为所有的域名的根域名都是`.root` 所以默认都是省掉的

根域名的下一级叫做‘顶级域名’（top-level domain），比如`.com` `.net`

再下一级则是"次级域名"（second-level domain），比如`www.tungee.com`里面的`tungee`,这级域名用户是可以注册的。

再下一级是主机名（host），比如`www.tungee.com`里面的www，又称为"三级域名"，这是用户在自己的域里面为服务器分配的名称，是用户可以任意分配的。

> 主机名.次级域名.顶级域名.根域名
>
> `www.tungee.com.root`

#### 5.分级查询的实例演示

我们已经介绍过了域名的层级，那是具体怎么样分级查询的呢

我们可以利用dig命令来显示每一级的域名记录查询过程。

```shell
dig +trace www.tungee.com
```

每一级域名都有自己的NS记录，NS记录指向（后面跟着）就是该级的域名服务器，这些服务器知道下一级域名的各种记录（类比电话簿，记录着域名与ip地址映射关系）。

大致分级查询的过程如下：

- **首先本地DNS服务器向根域名发起请求，**
- **"根域名服务器"查到"顶级域名服务器"的NS记录和A记录（IP地址）**
- **从"顶级域名服务器"查到"次级域名服务器"的NS记录和A记录（IP地址）**
- **从"次级域名服务器"查出"主机名"的IP地址**

> 仔细琢磨，你就会发现本地DNS服务器怎么知道根域名的ip地址呢？
>
> 回答是根域名服务器目前全球一共只有十三台，从下面截图可以看出从`a.root-servers.net.`到`m.root-servers.net.`,它们对应的ip地址，已经内置在本地DNS服务器中了

![1560238945877](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560238945877.png)

> 上面的截图大概分成4段

**1.第一段**

   > ![1560241035661](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560241035661.png)
   >
   > 根据内置的根域名服务器IP地址，DNS服务器向所有这些IP地址发出查询请求，询问`www.tungee.com`的顶级域名服务器com的NS记录。

**2.第二段**

> ![1560241453237](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560241453237.png)
>
> 接着向`j.root-server.net`返回来的13条`.com`域名的NS记录，同时也返回来每一条的IP地址（这里并不是每一条都显示），然后DNS再向这些顶级域名服务器发出查询请求。查询tungee.com次级域名的NS记录

**3.第三段**

> ![1560242314260](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560242314260.png)
>
> 同样，最先返回来的结果的是`i.gtld-server.net`域名服务器查询的结果，分别有`2`条NS记录，同时返回来每一条NS记录对应的IP地址，DNS服务器再向以上两台NS服务器查询tungee.com的主机ip地址

**4.第四段**

> ![1560242780840](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/1560242780840.png)
>
> 最先返回来的`dns10.hichina.com`这个NS域名服务器的查询结果（A,Address，返回来的ip地址记录），得到ip地址之后，DNS服务器缓存起来，返回来浏览器

### 四、DNS劫持的方法以及防范

从上面可以知道DNS解析原理，解析步骤，在dns解析过程中，有哪一环节出现问题的话，都可能会导致DNS解析错误，导致客户端（浏览器）得到一个假的ip地址，从而引导用户访问到这个冒名顶替，恶意的网站。

**DNS劫持带来的危害：**

1.钓鱼诈骗

2.网上购物支付安全

3.泄露个人隐私 

4.轻则影响网速，重则不能上网

#### 1.DNS劫持的方法

![img](https://raw.githubusercontent.com/jackluson/learn-path-recording-and-coding/master/docs/screenshots/mubwxk981b.jpeg)

**下面大概说几种DNS劫持方法**

**1.本机DNS劫持**

攻击者通过某些手段使用户的计算机感染上木马病毒，或者恶意软件之后，恶意修改本地DNS配置，比如修改本地hosts文件，缓存等

**2. 路由DNS劫持**

很多用户默认路由器的默认密码，攻击者可以侵入到路由管理员账号中，修改路由器的默认配置

**3.攻击DNS服务器**

直接攻击DNS服务器，例如对DNS服务器进行DDOS攻击，可以是DNS服务器宕机，出现异常请求，还可以利用某些手段感染dns服务器的缓存，使给用户返回来的是恶意的ip地址

**4.......**

#### 2.DNS的防范

> 就这上面的劫持方法，说几种方法手段

**1.加强本地计算机病毒检查，开启防火墙等，防止恶意软件，木马病毒感染计算机**

**2.改变路由器默认密码，防止攻击者修改路由器的DNS配置指向恶意的DNS服务器**

**3.企业的话可以准备两个以上的域名，一旦一个域名挂掉，还可以使用另一个**

**4.用HTTP DNS 代替 Local DNS**

> 对于DNS劫持，往往单靠个人设置很难解决，如果已经出现了劫持现象的话，对电脑进去杀毒，清理，检查hosts文件，核查网络设置的DNS配置（可以使用写公共的DNS服务器）

最后，查了很多资料才写了这篇文章，补充自己这方面的知识点，后面考虑继续写关于web安全--ddos攻击，xss，csrf等

### 

### Reference 

> 下面是参考，补充文章，感谢以下文章作者提供的思路

- [How to Prevent DNS Hijacking](https://antivirusinsider.com/prevent-dns-hijacking/)
- [What is a DNS hijacking / redirection attack](https://www.imperva.com/learn/application-security/dns-hijacking-redirection/)
- [黑客技术？没你想象的那么难！——dns劫持篇](<https://cloud.tencent.com/developer/article/1197474>)
- [深入理解Http请求、DNS劫持与解析](<https://juejin.im/post/59ba146c6fb9a00a4636d8b6>)
- [如何使用Dig命令在Linux中查询DNS记录](https://www.sysgeek.cn/linux-dig/)
- [从dig查询结果看DNS的A记录和NS记录](<https://my.oschina.net/u/1382972/blog/340197>)
- [TCP/UDP端口列表](<https://zh.wikipedia.org/wiki/TCP/UDP%E7%AB%AF%E5%8F%A3%E5%88%97%E8%A1%A8>)