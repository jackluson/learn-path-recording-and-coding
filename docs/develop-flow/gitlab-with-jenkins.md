# 利用 Gitlab CI/CD + Jenkins 实现自动构建，自动部署

本来只是想用 curl 去模拟触发部署静态资源的请求的。后来想到如果把这个操作交给 gitlab 操作岂不是更方便？ 所以这几天折腾了一下 gitlab 的 CI/CD,读了一些 gitlab 的官方文档，进一步完善了.gitlab-ci.yml。记录这个过程如下：

### 模拟请求

> 利用 curl 命令行工具去模拟我们点击 `开始构建` 时那一时刻发起的第一个请求。

#### 第一个请求

![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1593768148367-d6c374ae-c772-4494-b8f8-3fc6c26ed8f0.png#align=left&display=inline&height=563&margin=%5Bobject%20Object%5D&name=image.png&originHeight=563&originWidth=808&size=58988&status=done&style=none&width=808)
经实践，第一个请求为上面的这个请求，重要参数是 json：xxx 和 Cookie，请求结果是一个 303 重定向。
<a name="XGAOu"></a>

#### 编写请求脚本

方便起见，首先用浏览器提供的方式，复制该请求。
![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1593768350093-0da708c7-2e03-448d-bb7b-f8951e388695.png#align=left&display=inline&height=263&margin=%5Bobject%20Object%5D&name=image.png&originHeight=525&originWidth=599&size=61074&status=done&style=none&width=300)复制了整个请求之后，删除了一些不必要的参数之后，与提取 env， branch 这些变量之后， 得知下面的脚本

```shell
env=uat
branch=test

curl 'https://xxxx/job/tao.tao/build?delay=0sec' \
  -H 'Cookie: JSESSIONID=8EF2BD7082FB37279EE93A3B7BB3ED25' \
  --data-raw 'json={"parameter":[{"name":"PJ","value":"crm-finance-static"},{"name":"MYENV", "value":"'$env'"},{"name":"TAG","value":"'$branch'"}]}' \
  --compressed

```

上面的脚本是用 cookie 做用户认证的，既然是 cookie,就存在过期的可能。还好 Jenkins 提供了 token 的方法给用户。
具体看官方文档这两篇文章：
[https://www.jenkins.io/doc/book/system-administration/authenticating-scripted-clients/](https://www.jenkins.io/doc/book/system-administration/authenticating-scripted-clients/)
[https://www.jenkins.io/blog/2018/07/02/new-api-token-system/](https://www.jenkins.io/blog/2018/07/02/new-api-token-system/)

配置了 token 之后，修改之后脚本

```shell
env=uat
branch=test

curl 'https://xxxx/job/tao.tao/build?delay=0sec' \
  --user tao-tao:1169ee9c0493b27d915632c0577fdd66fd \
  --data-raw 'json={"parameter":[{"name":"PJ","value":"crm-finance-static"},{"name":"MYENV", "value":"'$env'"},{"name":"TAG","value":"'$branch'"}]}' \
  --compressed

```

我们直接使用了 `sh 上面的脚本.sh`  执行，打开 jenkins 发布平台就可以看到有任务在执行了

<a name="KZ9kd"></a>

### 安排到 gitlab 上面

> 注：原来已经有了.gitlab-ci.yml 文件存在了，主要负责： 当我们 push 代码到 gitlab 仓库之后，自动执行 build 命令，并且复制到目标静态资源仓库中，之后再 push 到 gitlab 上

> 不熟悉 gitlab 工作流的话，可以先看，开卷有益
>
> 1. [https://docs.gitlab.com/ee/ci/introduction/](https://docs.gitlab.com/ee/ci/introduction/)
> 1. [https://docs.gitlab.com/ce/ci/quick_start/README.html](https://docs.gitlab.com/ce/ci/quick_start/README.html)

增加如下代码：

```yaml
deploy:
  stage: deploy
  only:
    - /^(test|pre|dev)$/
  script:
    - command -v curl >/dev/null 2>&1 || exit 1 #判断是否执行curl，否则推荐脚本
    - env="$REF_NAME" # 默认env 与 分支名一致， 特殊处理uat --》 test
    - >
      if [ "$REF_NAME" == "test" ]; then
        env="uat"
      fi
    - sh ./scripts/fetch-jenkins.sh $env $REF_NAME # 执行脚本， 带上参数
```

最初我是放在 after_script 中执行的，后来发现 after_script 即使脚本执行出错，gitlab 上面的 CI/CD/Pipelines 的 Job 的状态，照样是 passed 状态。
搜索得知 after_script 中是忽略失败的，如果需要支持的话，要另外安装脚本，具体可以看如下解释：[https://gitlab.com/gitlab-org/gitlab-foss/-/issues/43010](https://gitlab.com/gitlab-org/gitlab-foss/-/issues/43010)，所以我后面把它放在了 script 中，这样脚本出错的话，Job 的状态也是 failed 的状态（Job 失败的话，gitlab 还给我们发了邮件）

---

另外，curl 只是模拟构建请求，但是我们如何判断请求成功还是失败的？前面我们说构建请求是返回 303 重定向的， 没有 response 内容回来，据此我们就可以判断，请求成功还是失败了，如果有请求结果的话，脚本就 exit 1

```shell
if [ "$RES" ]; then { echo 'failed!'; exit 1;  } fi
```

`.gitlab-ci.yml`  与 `fetch-jenkins.sh`  代码附件:
[.gitlab-ci.yml](https://www.yuque.com/attachments/yuque/0/2020/yml/365160/1593771925625-835c8fda-6f86-4a8e-8270-dd43c182dbc6.yml?_lake_card=%7B%22uid%22%3A%221593771925609-0%22%2C%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2020%2Fyml%2F365160%2F1593771925625-835c8fda-6f86-4a8e-8270-dd43c182dbc6.yml%22%2C%22name%22%3A%22.gitlab-ci.yml%22%2C%22size%22%3A1712%2C%22type%22%3A%22%22%2C%22ext%22%3A%22yml%22%2C%22progress%22%3A%7B%22percent%22%3A99%7D%2C%22status%22%3A%22done%22%2C%22percent%22%3A0%2C%22id%22%3A%22FIJyr%22%2C%22card%22%3A%22file%22%7D)
[fetch-jenkins.sh](https://www.yuque.com/attachments/yuque/0/2020/sh/365160/1593771950682-e5d84018-6882-4746-b001-082cb57a3565.sh?_lake_card=%7B%22uid%22%3A%221593771950767-0%22%2C%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2020%2Fsh%2F365160%2F1593771950682-e5d84018-6882-4746-b001-082cb57a3565.sh%22%2C%22name%22%3A%22fetch-jenkins.sh%22%2C%22size%22%3A602%2C%22type%22%3A%22text%2Fx-sh%22%2C%22ext%22%3A%22sh%22%2C%22progress%22%3A%7B%22percent%22%3A99%7D%2C%22status%22%3A%22done%22%2C%22percent%22%3A0%2C%22id%22%3A%22GoS0f%22%2C%22card%22%3A%22file%22%7D)
<a name="O7ZU6"></a>

### 忽略.gitlab-ci.yml 的作用

如果我们有一个这样的需要,在某一次 push,我不需要 gitlab 执行构建任务,或者我们觉得 gitlab 构建任务 pengding 太久, 或者 running 太慢。 如何解决这个痛点呢？

这样，我们如果控制 push 代码的时候，携带信息通知 gitlab 服务器，达到我们想要的结果。

很幸运，Gitlab CI/CD 是提供这个服务的，只不过有版本限制，
![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1593772618316-6c282123-36bd-4ebb-87d0-68db0c2ec965.png#align=left&display=inline&height=498&margin=%5Bobject%20Object%5D&name=image.png&originHeight=498&originWidth=918&size=44078&status=done&style=stroke&width=918)
得知，我们的 gitlab runner 版本是![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1593772742447-e585f11c-9f58-44f3-8a08-94a3d9a63537.png#align=left&display=inline&height=95&margin=%5Bobject%20Object%5D&name=image.png&originHeight=128&originWidth=380&size=23639&status=done&style=none&width=283)是支持 ci.skip。

携带 `-o ci.skip` 之后 再 Pipelines 中就可以看到 ,如下图所示:跳过 job![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1593772891052-6450b5d5-e7ac-4f6e-b95c-93b1cf5f67cd.png#align=left&display=inline&height=87&margin=%5Bobject%20Object%5D&name=image.png&originHeight=87&originWidth=570&size=8443&status=done&style=none&width=570)

<a name="bbnOT"></a>

### 本地执行 CI/CD 脚本

> 如果觉得 gitlab 构建速度太慢,结合我之前写的构建脚本,同样也可以实现自动构建,自动部署。

大概脚本如下：

```shell
#!/usr/bin/env bash
set -euo pipefail
branch=$1
curPath=`pwd`
targetPath="./build" # 打包静态资源路径配置, 为了统一推荐clone在源码根目录下的build文件夹(.gitignore 已忽略build)
commitID=`git rev-parse --short HEAD` # get last commit SHA
subModule=finance
curBranch=`git symbolic-ref --short -q HEAD` # get current branch

# 首先判断是否在目标分支build
if [ "$curBranch" != "$branch" ]; then
    echo -------------------------------------
    echo -e "\033[41;37m please checkout $branch before building \033[0m"
    echo -------------------------------------
    exit 1
fi

cd "$targetPath"
# 获取分支名称
targetBranch=`git symbolic-ref --short -q HEAD`
#  判断是否在目标分支,不在的话checkout
if [ "$targetBranch" != "$branch" ]; then
    git checkout "$branch"
fi

git pull
rm -rf "$targetPath/$subModule/"
cp -r "$curPath/dist/$subModule/" "./"


message="deploy based on $branch from $commitID"

# set +e
git add .
git commit -m "$message"
git push -u origin

cd -

# fetch jenkins interface
case $branch in
  dev  ) env="dev"
      ;;
  test ) env="uat"
      ;;
  pre )  env="pre"
      ;;
  master ) echo -e "\033[41;37m not support master \033[0m" && exit 0
      ;;
  *    ) echo -------------------------------------
         echo -e "\033[41;37m branch($branch) error before fetch jenkins \033[0m"
         echo -------------------------------------
         exit 1
esac

sh ./scripts/fetch-jenkins.sh $env $branch # 执行触发jenkins请求脚本

```

附件如下：

- [deploy.sh](https://www.yuque.com/attachments/yuque/0/2020/sh/365160/1594003103252-ceeff864-c94e-4ed9-8c3d-a842a4b7f2f6.sh?_lake_card=%7B%22uid%22%3A%221594003103166-0%22%2C%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2020%2Fsh%2F365160%2F1594003103252-ceeff864-c94e-4ed9-8c3d-a842a4b7f2f6.sh%22%2C%22name%22%3A%22deploy.sh%22%2C%22size%22%3A1518%2C%22type%22%3A%22text%2Fx-sh%22%2C%22ext%22%3A%22sh%22%2C%22progress%22%3A%7B%22percent%22%3A99%7D%2C%22status%22%3A%22done%22%2C%22percent%22%3A0%2C%22id%22%3A%22GujHr%22%2C%22card%22%3A%22file%22%7D)
- [fetch-jenkins.sh](https://www.yuque.com/attachments/yuque/0/2020/sh/365160/1594003103562-0d3ca043-0f06-4990-9571-dee8a400f3ba.sh?_lake_card=%7B%22uid%22%3A%221594003103166-1%22%2C%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2020%2Fsh%2F365160%2F1594003103562-0d3ca043-0f06-4990-9571-dee8a400f3ba.sh%22%2C%22name%22%3A%22fetch-jenkins.sh%22%2C%22size%22%3A602%2C%22type%22%3A%22text%2Fx-sh%22%2C%22ext%22%3A%22sh%22%2C%22progress%22%3A%7B%22percent%22%3A99%7D%2C%22status%22%3A%22done%22%2C%22percent%22%3A0%2C%22id%22%3A%22Xpjed%22%2C%22card%22%3A%22file%22%7D)

然后 package.json 在配置如下
![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1593778259694-0e7219c1-ba50-4f99-9823-ad7669353cf4.png#align=left&display=inline&height=266&margin=%5Bobject%20Object%5D&name=image.png&originHeight=266&originWidth=659&size=32796&status=done&style=none&width=659)

> 直接执行 yarn deploy:dev 就帮助我们构建，push 到静态自然仓库，触发 jenkins 请求，部署到了 dev 了

最后，CI/CD 能有很多方式实现，有待大家挖掘， 这个也算是根据实际的项目情况，打通了 Jenkins，欢迎大家多多交流。
