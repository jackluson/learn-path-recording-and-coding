# About BOM and DOM 高级API

> ##  BOM

### 1. requestAnimationFrame

> **补充说明**: 该API可用于JS实现动画,可弥补setInterval实现动画存在的问题,渲染性能,设置间隔时间等带来的问题
>
> 参考链接: 
>
> 1. **MDN**: <https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame>
> 2. **阮一峰**: <https://javascript.ruanyifeng.com/htmlapi/requestanimationframe.html>

> ## DOM 

### 1. IntersectionObserver

> **补充说明**: 该js提供的API用于检测页面元素是否在浏览器可视区域,能够用来实现"懒加载","滚动加载更多"等效果,(代替之前用比较scrollTop实现懒加载)
>
> 参考链接:
>
> 1. **MDN**: <https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver>
> 2. **阮一峰的网络日志**: <http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html>

### 2. MutationObserver

> **补充说明**: 该API可用于监听dom元素的任何变动(本身属性,节点),从而实现某些业务
>
> 参考链接:
>
> 1. **MDN**: <https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver>>
> 2. **兼容性**: <https://caniuse.com/#search=MutationObserver>
> 3. **阮一峰Javascript教程**: <https://wangdoc.com/javascript/dom/mutationobserver.html>

### 3. scrollIntoView与scrollIntoViewIfNeeded

> **补充说明**: 该API可实现让特定的元素滚动到浏览器可视区域(top,bottom),但是*注意* 对fixed定位的元素无效,某些情况可用于移动端实现键盘弹起时动效,代替'#'做瞄点等
>
> 1. **MDN**: <https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView>
> 2. **掘金**:<https://juejin.im/post/59d74afe5188257e8267b03f>
> 3. **伯乐在线**: <http://web.jobbole.com/95327/>