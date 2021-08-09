# 引入钉钉机器人通知 Gitlab CI/CD 的构建状态

## 前言

本篇是之前写的[《利用 Gitlab CI/CD 实现自动构建，自动部署》](https://www.yuque.com/docs/share/fd36e616-3df8-4e20-934d-9e129da3f15c)的续篇。我们知道 Gitlab 的 Pipeline 中的 Job 执行成功或者失败之后，对应 Job 状态会改变为 passedorfailed，当 Job 的状态改变之后， 我们需要再到 Gitlab CI/CD 的页面下查看 Job 的状态,去看看有没有打包完成。<br />实践表明，某些时候我们的 gitlab 执行 Job 往往需要等待很长且不稳定。导致我们反复到 CI/CD 的页面看看 Job 是否执行完毕。所以我们需要一个更友好，高效的 Job 执行完成状态的反馈方案。由此我想到了钉钉通知机器人。

## 引入钉钉机器人

其实就是在一个钉钉群引入 webhook 机器人，然后给你提供 token 和 secret， 依照指定的格式发起 http 请求就可以了

> 详情请看：[https://ding-doc.dingtalk.com/doc#/serverapi3/iydd5h](https://ding-doc.dingtalk.com/doc#/serverapi3/iydd5h)

官方文档解析很清楚，需要注意点就是需要加签这个步骤:

```javascript
/* 把timestamp+"\n"+密钥当做签名字符串，使用HmacSHA256算法计算签名，然后进行Base64 encode，\n
最后再把签名参数再进行urlEncode，得到最终的签名（需要使用UTF-8字符集）。
- 这里用node的crypto加密模块实现,大概实现如下
*/
const encryptSign = (secret, content) => {
  const str = crypto
    .createHmac("sha256", secret)
    .update(content)
    .digest()
    .toString("base64");
  return encodeURIComponent(str);
};
const sign = encryptSign(this.secret, timestamp + "\n" + this.secret);
```

## 定制钉钉机器人

钉钉机器人支持多种类型消息，我们需要的是一个文本和卡片类型消息，图片如下。<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1594885514400-bc4c9728-8049-4db9-ab3c-31e390847a6d.png)<br />结合钉钉文档，我们封装了自己的机器人 dingtalkBot 类,支持快速发送文本和卡片消息。脚本如下：

[dingtalkBot.js](https://www.yuque.com/attachments/yuque/0/2020/js/365160/1594885981137-af51c06f-1b5e-4f93-9bee-86fbd845fb51.js?_lake_card=%7B%22uid%22%3A%221594885981113-0%22%2C%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2020%2Fjs%2F365160%2F1594885981137-af51c06f-1b5e-4f93-9bee-86fbd845fb51.js%22%2C%22name%22%3A%22dingtalkBot.js%22%2C%22size%22%3A2942%2C%22type%22%3A%22text%2Fjavascript%22%2C%22ext%22%3A%22js%22%2C%22progress%22%3A%7B%22percent%22%3A99%7D%2C%22status%22%3A%22done%22%2C%22percent%22%3A0%2C%22id%22%3A%22HYfKA%22%2C%22card%22%3A%22file%22%7D)

```javascript
/* eslint-disable @typescript-eslint/no-var-requires */
const crypto = require("crypto");
const axios = require("axios");
const encryptSign = (secret, content) => {
  const str = crypto
    .createHmac("sha256", secret)
    .update(content)
    .digest()
    .toString("base64");
  return encodeURIComponent(str);
};

/**
 * 钉钉机器人 WebHook：用于支持钉钉机器人消息发送
 *
 * 官方文档：https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq
 */
class DingtalkBot {
  /**
   * 机器人工厂，所有的消息推送项目都会调用 this.webhook 接口进行发送
   *
   * @param {String} options.webhook 完整的接口地址
   * @param {String} options.baseUrl 接口地址
   * @param {String} options.accessToken accessToken
   * @param {String} options.secret secret
   */
  constructor(options) {
    options = options || {};
    if (!options.webhook && !(options.accessToken && options.baseUrl)) {
      throw new Error("Lack for arguments!");
    }
    // 优先使用 options.webhook
    // 次之将由 options.baseUrl 和 options.accessToken 组合成一个 webhook 地址
    this.webhook =
      options.webhook ||
      `${options.baseUrl}?access_token=${options.accessToken}`;
    this.secret = options.secret;
  }

  /**
   * 发送钉钉消息
   *
   * @param {Object} content 发动的消息对象
   * @return {Promise}
   */
  send(content) {
    let singStr = "";
    if (this.secret) {
      const timestamp = Date.now();
      singStr =
        "&timestamp=" +
        timestamp +
        "&sign=" +
        encryptSign(this.secret, timestamp + "\n" + this.secret);
    }
    return axios.request(this.webhook + singStr, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(content),
    });
  }

  /**
   * 发送纯文本消息，支持@群内成员
   *
   * @param {String} content 消息内容
   * @param {Object} at 群内@成员的手机号
   * @return {Promise}
   */
  text(content, at) {
    at = at || {};
    return this.send({
      msgtype: "text",
      text: {
        content,
      },
      at,
    });
  }

  /**
   * 发送actionCard(动作卡片)
   * Ps: 支持多个按钮，支持Markdown
   *
   * @param {String} card.title 标题
   * @param {String} card.text 消息内容
   * @param {String} card.btnOrientation 按钮排列的方向(0竖直，1横向，默认为0)
   * @param {String} card.btn.title 某个按钮标题
   * @param {String} card.btn.actionURL 某个按钮链接
   * @return {Promise}
   */
  actionCard(card) {
    return this.send({
      msgtype: "actionCard",
      actionCard: {
        title: card.title,
        text: card.text,
        btnOrientation: card.btnOrientation || 0,
        btns: card.btns || [],
      },
    });
  }
}

module.exports = DingtalkBot;
```

<a name="L2ZPz"></a>

## 定制消息模板

上面的消息类型我们知道，我们需要一些构建信息（项目，分支，环境等），还有需要@指定的提交人。经过折腾,我们知道 gitlab runner 执行 node 脚本时, process.env 这个变量下包含着我们需要的所有变量，如图所示<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1594886819835-463cebea-4931-4e9b-be5e-9cc185045a49.png#align=left&display=inline&height=425&margin=%5Bobject%20Object%5D&name=image.png&originHeight=851&originWidth=828&size=83113&status=done&style=none&width=414)

> 上面的截图只是一部分

<br />由此我们定义如下的 markdown 格式模板<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1594887218007-f42e1eec-382f-4672-ac1a-3466dc622004.png#align=left&display=inline&height=265&margin=%5Bobject%20Object%5D&name=image.png&originHeight=528&originWidth=505&size=34798&status=done&style=none&width=253)<br />除了卡片消息之外。我们需要@通知指定提交人。依据钉钉提供的 API， 我们需要提交人的电话号码信息。那我们暴露提交人的电话号码信息在 node 执行 js 的时候呢。同样经过折腾，我们可以为项目设置环境变量，gitlab runner 执行 Job 时，就会暴露在其中执行环境中，详情看：[https://docs.gitlab.com/help/ci/variables/README#variables](https://docs.gitlab.com/help/ci/variables/README#variables)<br />例如：<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1594888657442-a2045f4d-2b18-4398-9232-38a07d35cbb8.png#align=left&display=inline&height=413&margin=%5Bobject%20Object%5D&name=image.png&originHeight=413&originWidth=1075&size=39899&status=done&style=none&width=1075)<br />这里设置了 luxuemin 的变量名，变量值为我的号码：xxxxx。<br />**注意:这里存在映射关系, 变量名为 luxuemin, 是我的 gitlab 平台上的用户名,应该也是 git 的用户名，如图![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1594888850206-e2b16981-e44f-43a3-b594-2dcedfb73338.png#align=left&display=inline&height=83&margin=%5Bobject%20Object%5D&name=image.png&originHeight=83&originWidth=392&size=5015&status=done&style=none&width=392)**<br />**配置好映射关系，我们就能@指定的提交人了。**

```javascript
const gitlabUserName = process.env.GITLAB_USER_NAME;
const phoneNumber = process.env[gitlabUserName]; // 在gitlab CI/CD上配置GITLAB_USER_NAME映射的电话号码

await robot.text("请查收你的构建信息", {
  atMobiles: [phoneNumber],
  isAtAll: false,
});
```

发送消息脚本文件[notify.js](https://www.yuque.com/attachments/yuque/0/2020/js/365160/1594889373949-579ad1eb-73df-49f6-8044-a8456937bc75.js?_lake_card=%7B%22uid%22%3A%221594889374014-0%22%2C%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2020%2Fjs%2F365160%2F1594889373949-579ad1eb-73df-49f6-8044-a8456937bc75.js%22%2C%22name%22%3A%22notify.js%22%2C%22size%22%3A3757%2C%22type%22%3A%22text%2Fjavascript%22%2C%22ext%22%3A%22js%22%2C%22progress%22%3A%7B%22percent%22%3A99%7D%2C%22status%22%3A%22done%22%2C%22percent%22%3A0%2C%22id%22%3A%2288rNQ%22%2C%22card%22%3A%22file%22%7D)

> 上面的脚本文件还加了一个 Github Today Trending 的小彩蛋（随机推荐一个 github 的今日流行趋势项目），和随机一张养眼图片。

如图：![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1594889577117-e90e172e-2326-4e0b-bada-dd0a40eec40d.png#align=left&display=inline&height=537&margin=%5Bobject%20Object%5D&name=image.png&originHeight=715&originWidth=465&size=152393&status=done&style=none&width=349)<br />

## 在之前的脚本中使用

根据模拟 jenkins 请求的结果，node 执行上面的脚本之前，携带成功，失败状态，这里用 status 表示， 同时推出 js 脚本是，用 process.exit(status)退出，可参考下面脚本

```javascript
RES=$( curl -X POST \
       --user tao-tao:1169ee9c0493b27d915632c0577fdd66fd \
       --data 'json={"parameter":[{"name":"PJ","value":"crm-finance-static"},{"name":"MYENV", "value":"'$env'"},{"name":"TAG","value":"'$branch'"}]}' \
       --compressed \
       'http://xxxx/job/tao.tao/build?delay=0sec' \
     )
# if [ "$RES" ]; then { echo 'failed!'; exit 1;  } fi
if [ "$RES" ]; then
  node scripts/notify.js $env $branch --status=1 || { echo 'failed!'; exit 1;}
else
  node scripts/notify.js $env $branch --status=0 && { echo 'succused!'; exit 0;}
fi

```

<a name="jUWv5"></a>

## 最后

目前配置了 crm-finance 引入了这个机器人。后续需要的小伙伴可在自己的项目中引入，如果小伙伴想进入 Gitlab&Dingtalk 通知机器人测试群，可扫码加入哈。热烈欢迎！<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1594890417489-1e33a3a3-b365-4794-b031-903349cf5302.png#align=left&display=inline&height=369&margin=%5Bobject%20Object%5D&name=image.png&originHeight=736&originWidth=537&size=149438&status=done&style=none&width=269)
