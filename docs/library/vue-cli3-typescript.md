# 如何引进 Typescript 到现存 Vue-cli3+项目中

![image.png](https://cdn.nlark.com/yuque/0/2021/png/365160/1628517679069-6d107ddb-1b56-4b1d-bea6-481863c9f3f1.png#clientId=uee6969e3-26f5-4&from=paste&height=421&id=ub085a507&margin=%5Bobject%20Object%5D&name=image.png&originHeight=439&originWidth=750&originalType=binary&ratio=1&size=25839&status=done&style=none&taskId=u16571b65-f7b7-4a90-b564-6ce970171a1&width=720)

## 前言

在把项目改造支持 Typescript 之后, 跑了几个迭代,也踩了一些坑。还好这些坑总体可控， 没翻车， 所以就写篇文章分享一下， 如果想要体验 vue+typescript 的同学可以看看。
之前配置的过程查找了很多资料，但大部分都是下面两种方案：

- 基于 vue-cli3+的全新的项目
- vue-cli2 的老项目引进 typescript

但是我们公司的项目在新建项目的时候并没有引入 typescript 的支持。如果后期想引入 typescript 呢，有没有一种**向后兼容（backward compatibility）**的方式整合到现有的项目中呢，既可支持 ts，也可以兼容 js，这样现有的代码就几乎不用改动了。
下面分三部分来描述 👇：

- 一个基于 vue-cli3+、支持 typescript 的新项目是怎么配置的？
- 如何应用这些不同的配置到现存的项目中？
- 因为子项目需要引入主模块的 app，还有 vue，element-ui 等等是以 extenal 引进来的，这些需要如何配置才不使 ts 报错？

## 1. 一个基于 vue-cli3+、支持 typescript 的新项目是怎么配置的？

> 开始之前，我们先了解一下 Typescript 是什么？为什么需要它，能给项目带来什么？(如果熟悉 typescript 的话，这部分可以跳过哈)

- **Typescript 是 JavaScript 的超集**

正如官方说描述: "A superset of Javascript"， Typescript 更接近面对对象语言， 支持更多的 JS 不能支持的语法：
例如，链式语法， `js: res && res.data && res.data.name` ; ts 的话： `res?.data?.name`  虽然 babel 也有类似的插件实现该语法 。
而且 ts 是向后兼容的, 也就 js 的语法都可以直接在 ts 都可以运用。

- **更严谨，能提前避免一些 bug 出现， 同时有利后期项目的维护**

js 是解析式弱类型语言。比如，js 很多情况存在隐形转换，但是又是在运行时才报错, 这无疑给我们埋了很多未知的坑,特别是在一些大型项目中,所以一些大型项目都投入 ts 的怀抱，例如[ant-design](https://github.com/ant-design/ant-design)、[vscode](https://github.com/microsoft/vscode)、 还有即将发布的 vue3 版本[vue-next](https://github.com/vuejs/vue-next)。 ts 是要编译成 js 才能在浏览器中执行的， 所以在编译过程中可以提示我们很多可能出现错误的地方， 我们以此纠正。

- **更好的开发体验**

这个主要是编辑器更智能，更友好的提示。 我们现在的编辑器提示功能主要是借助一些 Snippets 插件实现的， 但是 ts 的 xx.d.ts 的声明文章对编辑器来说更智能，更友好。可以说申明文件写的越完整，编辑器越智能，例如
![image.png](https://cdn.nlark.com/yuque/0/2020/png/365160/1597042737532-dbed3c63-e722-47b8-bf46-ba714e6fae61.png#height=137&id=kYepm&margin=%5Bobject%20Object%5D&name=image.png&originHeight=137&originWidth=573&originalType=binary&ratio=1&size=7982&status=done&style=none&width=573)

> 现在很多 npm 包都有了自己的 typescript 声明文件了, 没有的话可以在[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)上面找找, 或者自己写声明文件, 例如上面我写的"app"

```typescript
declare module "app" {
  import { Store, Module } from "vuex";
  import { IState } from "@/store";
  type SubModuleOptions = {
    name: string;
    store?: Module<IState, any>; //TODO:Module<S, R> 中的R指的是rootState, 应该app主项目还没改造成typescript, 先用any
    generator: (path: string) => () => Promise<Vue>;
  };
  interface System {
    registerModule(subModuleOptions: SubModuleOptions): void;
  }
  let system: System;
  let utils: Record<string, any>;
  let config: Record<string, string>;
  let request: Record<string, any>;
  let router: Record<string, any>;
  let store: Store<IState>;
}
```

更多关于 ts 的知识，请查看官方文档[https://www.typescriptlang.org/](https://www.typescriptlang.org/),网上也有很多文章描述采用 ts 的优点,缺点。 这里就不再展开了，下面开始我们的正式内容。ヾ(≧▽≦\*)o

### 新建一个空的 vue+typescript 的项目

新建一个基于 vue-cli3+的 typescript 项目, 网上有很多这种文档, 比如[https://segmentfault.com/a/1190000019905650](https://segmentfault.com/a/1190000019905650), 注意选择 `Use class-style component syntax?`  的时候我们选择 yes, 因为我们需要用类组件。
对比与不支持 typescript 的 vue 项目， 新的地方如下：

```powershell
├─src
│  ├─main.ts
│  ├─shims-tsx.d.ts
│  └─shims-vue.d.ts
├─tsconfig.json
```

从名字可以看出这几个文件的作用， 但是这里我们先不用理会。 此外当然 package.json 和.eslintrc.js 中的配置也有些差别， 对比发现，其他 package.json 只是多了`vue-class-component、vue-property-decorator、typescript、@typescript-eslint/parser` 、@typescript-eslint/parser、@vue/cli-plugin-typescript、@vue/eslint-config-typescript   这几个包。

## 2. 应用这些不同点到现存的项目中

我们要怎样应用这些不同点到现有的项目中呢， 摸着石头过河，我们在同样的目录结构下直接复制这些不同的新文件过来， 然后增加 package.json 不存在的包， 修改 main.js 为 main.ts(这里可能有坑)， 复制.eslintrc.js 配置过来。
准备好这些之后， 删除 node_modules 重新 `npm install`  安装一次
​

## 3. 因地制宜，根据项目具体情况配置

直接运行项目的话，可能会报很多类似的？Cannot find module 'xxx' or its corresponding type declarations. 的错误， 这是因为找不到对应报的声明文件。 根据项目的具体情况，例如我们的项目 vue、vuex、element-ui、app 等是通过 externals 方式引入的， 所以在 package.json 中找不到对应的依赖， 这样的话也没有这些包声明文件。还好 vue、vuex、element-ui 是提供声明文件的， 我们只需要把这些包安装成开发依赖 devDependencies ，在后面的开发中我们就可以使用这些声明文件了。 但是 app 是主项目的 umd 包，也是没有申明文件的， 这时候我们就要针对 app 自己写声明文件了。 最简单的就是在 src 目录下新建一个 typings 目录，在创建一个 app.d.ts, `declare module "app"`  声明就可以了， 这样就不会报错了。 更多申明文件怎么写可以参考[https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) 。 此外可能还有出现其他的错误， 比如 eslint 错误， 这些要根据具体错误具体解决了。

## 4.利用 ts 进行业务开发

搭建好 ts 的开发环境之后， 因为 ts 是向后兼容的，所以之前的业务代码全部不用改。后面用 ts 开发的话， 学会使用 ts、[vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)和[vue-class-component](https://github.com/vuejs/vue-class-component)就行了。 后面有机会可以写 tsconfig 的配置， 声明文件， vuex 这些内容了，感谢大家的阅读了， 有问题欢迎沟通哈。
