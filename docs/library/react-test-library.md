# react 项目单元测试技术方案

![image.png](https://cdn.nlark.com/yuque/0/2021/png/365160/1628517126934-c513f0ef-8cf8-40ad-af78-8d4f7d94de7a.png#clientId=u06b74433-ee40-4&from=paste&id=u11a75c68&margin=%5Bobject%20Object%5D&name=image.png&originHeight=400&originWidth=720&originalType=binary&ratio=1&size=45269&status=done&style=shadow&taskId=u45c238dc-d374-4f96-ad61-936cb3207a6)
​

## Why

The more your tests resemble the way your software is used, the more confidence they can give you.

## 背景

该项目是用 umi 框架搭建，其自身内置了 jest 测试框架

- umi 内置的 jest 配置

```javascript
{
    collectCoverageFrom: [
      'index.{js,jsx,ts,tsx}',
      hasSrc && 'src/**/*.{js,jsx,ts,tsx}',
      isLerna && !args.package && 'packages/*/src/**/*.{js,jsx,ts,tsx}',
      isLerna &&
        args.package &&
        `packages/${args.package}/src/**/*.{js,jsx,ts,tsx}`,
      '!**/typings/**',
      '!**/types/**',
      '!**/fixtures/**',
      '!**/examples/**',
      '!**/*.d.ts',
    ].filter(Boolean),
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    moduleNameMapper: {
      '\\.(css|less|sass|scss|stylus)$': require.resolve('identity-obj-proxy'),
    },
    setupFiles: [require.resolve('../../helpers/setupFiles/shim')],
    setupFilesAfterEnv: [require.resolve('../../helpers/setupFiles/jasmine')],
    testEnvironment: require.resolve('jest-environment-jsdom-fourteen'),
    testMatch: [
      `${testMatchPrefix}**/?*.(${testMatchTypes.join('|')}).(j|t)s?(x)`,
    ],
    testPathIgnorePatterns: ['/node_modules/', '/fixtures/'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': require.resolve(
        '../../helpers/transformers/javascript',
      ),
      '^.+\\.(css|less|sass|scss|stylus)$': require.resolve(
        '../../helpers/transformers/css',
      ),
      '^(?!.*\\.(js|jsx|ts|tsx|css|less|sass|scss|stylus|json)$)': require.resolve(
        '../../helpers/transformers/file',
      ),
    },
    verbose: true,
    transformIgnorePatterns: [
      // 加 [^/]*? 是为了兼容 tnpm 的目录结构
      // 比如：_umi-test@1.5.5@umi-test
      // `node_modules/(?!([^/]*?umi|[^/]*?umi-test)/)`,
    ],
    // 用于设置 jest worker 启动的个数
    ...(process.env.MAX_WORKERS
      ? { maxWorkers: Number(process.env.MAX_WORKERS) }
      : {}),
  }
```

- 合并配置部分代码如下：

```javascript
const config = mergeConfig(
  createDefaultConfig(cwd, args),
  packageJestConfig,
  userJestConfig
);
```

其源码在此：[点击跳转](https://github.com/umijs/umi/blob/master/packages/test/src/createDefaultConfig/createDefaultConfig.ts)

## 技术栈选择

由于 umi 内置的 jest 配置是不能满足我们项目的需求的，jest 是 JavaScript 的测试框架，如果需要对 dom 做单元测试，需要引入更多测试库

### Jest

jest 是 umi 自带的，这个是基础，需要对其有基本的认识，其文档如下：
[https://jestjs.io/zh-Hans/](https://jestjs.io/zh-Hans/)

### ts-jest

ts-jest 是让我们能用 Typescript 写测试代码的转换工具，也是 umi 内置配置，很少需要更改，如需更改可参考官方文档：
[https://kulshekhar.github.io/ts-jest/docs/](https://kulshekhar.github.io/ts-jest/docs/)

### React Testing Library

React Testing Library 是 测试 React 组件的解决方案，其包含了 React 官方的测试工具 react-dom/test-utils 的 API，也是 React 官方推荐的测试 DOM 库。
至于为什么不用老牌测试库 Enzyme ,可以看作者的 blog 这篇文章：
[https://kentcdodds.com/blog/introducing-the-react-testing-library](https://kentcdodds.com/blog/introducing-the-react-testing-library)
![Untitled.png](https://cdn.nlark.com/yuque/0/2021/png/210656/1627278840847-6381bcd3-21a2-4ea1-961f-a6279c9bf46a.png#clientId=u4ea35102-efdf-4&from=paste&height=221&id=u11da665c&margin=%5Bobject%20Object%5D&name=Untitled.png&originHeight=221&originWidth=797&originalType=binary&ratio=1&size=37038&status=done&style=none&taskId=u600b1086-55cb-47ce-a093-ea6b1003159&width=797)
平时写测试代码时更多接触的是 React Testing Library ,其文档如下：
[https://testing-library.com/docs/react-testing-library/intro](https://testing-library.com/docs/react-testing-library/intro)
除了 @testing-library/react 外，平时@testing-library 旗下的其他库，例如 @testing-library/user-event 用来模拟交互的。 @testing-library/react 是基于 @testing-library/dom 的，所以对 @testing-library/dom 有基本的了解，有助于深入理解@testing-library/react

### Mock Service Worker

Mock Service Worker (MSW) 是用来 mock Axios 的请求结果的， 执行 REST/GraphQL API
其文档如下：[https://github.com/mswjs/msw](https://github.com/mswjs/msw)

## 使用引导

### 单元测试编写

这里不做过多介绍，可以参考官方 example 及其他指导文章，以及现有的单元测试代码，分享一下如下几篇

1. 官方 demo： [https://testing-library.com/docs/react-testing-library/example-intro](https://testing-library.com/docs/react-testing-library/example-intro)
1. 作者 blog—Common mistakes with React Testing Library — [https://kentcdodds.com/blog/common-mistakes-with-react-testing-library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
1. 测试 react-toolkit — [https://ogzhanolguncu.com/blog/testing-react-redux-toolkit-with-typescript](https://ogzhanolguncu.com/blog/testing-react-redux-toolkit-with-typescript)

注：写单元测试能够加深你对代码的理解以及对自己代码的信任度

### 运行

单元测试环境已经搭建好了，只需要执行对应的命名就可以了

```jsx
"test": "umi test --no-cache", // 一次性执行单元测试
"test:watch": "umi test --watch", // 实时监听代码变动，执行
"test:clear": "umi test --clearCache",
"test:coverage": "umi test --coverage", // 执行，输出覆盖报告
```

### 配置

有些情况现有的配置不能满足自己的需求，可以根据情况更改配置

1. jest.config.js
1. ./src/setupTests.ts

### 覆盖率

使用了 Istanbul 代码覆盖工具，关于覆盖指标参考：
阮一峰这篇文章 — [http://www.ruanyifeng.com/blog/2015/06/istanbul.html](http://www.ruanyifeng.com/blog/2015/06/istanbul.html)
目前项目确定如下的覆盖目标：

```jsx
global: {
  branches: 90,
  functions: 90,
  lines: 90,
  statements: 90,
},
```

使用 `yarn test:coverage` 可以测试输出覆盖率报告

### 踩坑过程问题记录

记录一些问题：以防重复踩坑

1. [Jest test fails : TypeError: window.matchMedia is not a function](https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function)
1. [Jest + react-testing-library: Warning update was not wrapped in act()](https://stackoverflow.com/questions/55181009/jest-react-testing-library-warning-update-was-not-wrapped-in-act)
1. Uncaught [Error: Invalid hook call. Hooks can only be called inside of the body of a function component — mock module 在 setupTests.ts 中引入
1. The module factory of jest.mock() is not allowed to reference any out-of-scope variable — 用 require 在里面解决,参考:[https://github.com/facebook/jest/issues/2567](https://github.com/facebook/jest/issues/2567)

## 后续计划

1. 抽离公共测试代码，使写单测更加丝滑
1. 补充单元测试，满足覆盖率指标
1. 端对端测试搞起来
1. 接入到 CI/CD 中
