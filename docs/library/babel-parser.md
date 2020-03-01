# babel编译认识&实践（demo）

### 1. 关于babel是什么，怎么用

参考知乎这篇文章  [一口（很长的）气了解 babel](https://zhuanlan.zhihu.com/p/43249121)解释了babel的周边

值得注意的是：

> 1. preset，plugins的处理顺序，preset从后到前，plugins从前到后，先处理plugins在处理preset
> 2. babel默认只处理语法的，如果要处理promise、Set、Proxy等新API就要引入相关的polyfill之类的

### 2. babel解析、转换的demo实践

> Bebel编译大致分为下面3个步骤 
>
> 1. 解析代码字符串成抽象语法树，即是AST
> 2. 对AST进行处理，处理es6的代码，各种插件的处理等
> 3. 将处理后的AST转换成对应的代码字符串

详情的demo请看github—[babel编译认识与实践](https://github.com/jackluson/easy-babel)

简单来说先使用 `@babel/parser` 的 `parse` 方法，将代码字符串解析成 AST；再使用 `@babel/core` 的 `transformFromAstSync` 方法，对 AST 进行处理，将其转成 ES5 并生成相应的代码字符串；过程中，可能还需要使用 `@babel/traverse` 来获取依赖文件等



1. parse 解析文件

```js
let content = fs.readFileSync(filePath, 'utf-8')
  // 生成 AST
let ast = parse(content, { sourceType: 'module' })
```

```bash
// AST如下：
Node {
  type: 'File',
  start: 0,
  end: 47,
  loc: SourceLocation {
    start: Position { line: 1, column: 0 },
    end: Position { line: 4, column: 0 }
  },
  program: Node {
    type: 'Program',
    start: 0,
    end: 47,
    loc: SourceLocation { start: [Position], end: [Position] },
    sourceType: 'module',
    interpreter: null,
    body: [ [Node], [Node] ],
    directives: []
  },
  comments: []
}
```

2. 转换生成代码字符串

```js
let { code } = transformFromAstSync(ast, null, { presets: ['@babel/preset-env'] })

```

```js
// code 如下
"use strict";

var _say = _interopRequireDefault(require("./say.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log((0, _say.default)())
```

> 当前上面只是其中一部分，还涉及到依赖收集，遍历等