# VuePress的学习&实践
### [安装及运行](https://vuepress.vuejs.org/guide/#how-it-works)
> 这个不用多说,看官方文档即可
### 问题
1. 运行时可能会出现下面这个报错(这个输入阶段性错误)
   ```js
   UnhandledPromiseRejectionWarning: TypeError: res.getHeader is not a function

  >原因: webpack-dev-middleware这个模块的问题
  >解决办法: 利用npm install webpack-dev-middleware@3.6.0 [更加详细请看](https://github.com/vuejs/vuepress/issues/1417)
