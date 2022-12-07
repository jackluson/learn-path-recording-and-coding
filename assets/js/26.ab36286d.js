(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{317:function(t,s,a){"use strict";a.r(s);var n=a(13),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"babel编译认识-实践-demo"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#babel编译认识-实践-demo"}},[t._v("#")]),t._v(" babel编译认识&实践（demo）")]),t._v(" "),s("h3",{attrs:{id:"_1-关于babel是什么-怎么用"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-关于babel是什么-怎么用"}},[t._v("#")]),t._v(" 1. 关于babel是什么，怎么用")]),t._v(" "),s("p",[t._v("参考知乎这篇文章  "),s("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/43249121",target:"_blank",rel:"noopener noreferrer"}},[t._v("一口（很长的）气了解 babel"),s("OutboundLink")],1),t._v("解释了babel的周边")]),t._v(" "),s("p",[t._v("值得注意的是：")]),t._v(" "),s("blockquote",[s("ol",[s("li",[t._v("preset，plugins的处理顺序，preset从后到前，plugins从前到后，先处理plugins在处理preset")]),t._v(" "),s("li",[t._v("babel默认只处理语法的，如果要处理promise、Set、Proxy等新API就要引入相关的polyfill之类的")])])]),t._v(" "),s("h3",{attrs:{id:"_2-babel解析、转换的demo实践"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-babel解析、转换的demo实践"}},[t._v("#")]),t._v(" 2. babel解析、转换的demo实践")]),t._v(" "),s("blockquote",[s("p",[t._v("Bebel编译大致分为下面3个步骤")]),t._v(" "),s("ol",[s("li",[t._v("解析代码字符串成抽象语法树，即是AST")]),t._v(" "),s("li",[t._v("对AST进行处理，处理es6的代码，各种插件的处理等")]),t._v(" "),s("li",[t._v("将处理后的AST转换成对应的代码字符串")])])]),t._v(" "),s("p",[t._v("详情的demo请看github—"),s("a",{attrs:{href:"https://github.com/jackluson/easy-babel",target:"_blank",rel:"noopener noreferrer"}},[t._v("babel编译认识与实践"),s("OutboundLink")],1)]),t._v(" "),s("p",[t._v("简单来说先使用 "),s("code",[t._v("@babel/parser")]),t._v(" 的 "),s("code",[t._v("parse")]),t._v(" 方法，将代码字符串解析成 AST；再使用 "),s("code",[t._v("@babel/core")]),t._v(" 的 "),s("code",[t._v("transformFromAstSync")]),t._v(" 方法，对 AST 进行处理，将其转成 ES5 并生成相应的代码字符串；过程中，可能还需要使用 "),s("code",[t._v("@babel/traverse")]),t._v(" 来获取依赖文件等")]),t._v(" "),s("ol",[s("li",[t._v("parse 解析文件")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" content "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" fs"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("readFileSync")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("filePath"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'utf-8'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 生成 AST")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" ast "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("parse")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("content"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("sourceType")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'module'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[t._v("// AST如下：\nNode "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  type: "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'File'")]),t._v(",\n  start: "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(",\n  end: "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("47")]),t._v(",\n  loc: SourceLocation "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    start: Position "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" line: "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v(", column: "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n    end: Position "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" line: "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("4")]),t._v(", column: "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n  program: Node "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    type: "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Program'")]),t._v(",\n    start: "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(",\n    end: "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("47")]),t._v(",\n    loc: SourceLocation "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" start: "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Position"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(", end: "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Position"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n    sourceType: "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'module'")]),t._v(",\n    interpreter: null,\n    body: "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Node"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(", "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("Node"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(",\n    directives: "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n  comments: "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("ol",{attrs:{start:"2"}},[s("li",[t._v("转换生成代码字符串")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" code "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("transformFromAstSync")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("ast"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("presets")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@babel/preset-env'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n")])])]),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// code 如下")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"use strict"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" _say "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("_interopRequireDefault")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"./say.js"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("_interopRequireDefault")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("obj")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" obj "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&&")]),t._v(" obj"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("__esModule "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),t._v(" obj "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("default")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" obj "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\nconsole"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" _say"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("default"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("blockquote",[s("p",[t._v("当前上面只是其中一部分，还涉及到依赖收集，遍历等")])])])}),[],!1,null,null,null);s.default=e.exports}}]);