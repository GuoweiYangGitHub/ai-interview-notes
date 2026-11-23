# Vue 面试题
> Vue 2/3 响应式、生命周期、路由、模板编译与性能优化问答。组合式 API 与实现代码见 [Vue 笔记](/01-前端基础/05-Vue与React/Vue.md)。

## 响应式与数据

### [重点] Vue 2 响应式原理

`Object.defineProperty()` 进行数据劫持，针对对象的特定属性设置 `getter` 和 `setter`。读取属性时触发 `getter`；视图层数据变化时触发 `setter`。

### [重点] Vue 3 响应式原理

`Proxy` 针对 object 类型数据的所有属性添加 `get` 和 `set` 进行监听。实现嵌套数据时更简单，原生支持数组监听。

### [重点] Proxy 和 Object.defineProperty 的区别

- `Proxy` 代理的是整个对象，`Object.defineProperty` 只代理对象中的某一个属性。
- 对象上定义新属性时，`Proxy` 可以监听到，`Object.defineProperty` 监听不到。
- 数组上新增、删除、修改时，`Proxy` 可以监听到，`Object.defineProperty` 监听不到。
- `Proxy` 不兼容 IE，`Object.defineProperty` 不兼容 IE8 及以下。

### 在 Vue 中怎么检测数组变化？

- Vue 重写了这几个方法：`push`、`pop`、`shift`、`unshift`、`sort`、`reverse`、`splice`。
- 也可以通过 `this.$set` 处理。

## 生命周期

### Vue 生命周期

- `onErrorCaptured`：捕获后代组件传递的错误时调用。
- `onActivated`：激活时调用，适用于 `keep-alive` 缓存的组件。
- `onDeactivated`：停用时调用，适用于 `keep-alive` 缓存的组件。

完整的生命周期列表见 [Vue 笔记](/01-前端基础/05-Vue与React/Vue.md)。

### 父子组件生命周期执行顺序

- 父组件 `beforeCreate`
- 父组件 `created`
- 父组件 `beforeMount`
- 子组件 `beforeCreate`
- 子组件 `created`
- 子组件 `beforeMount`
- 子组件 `mounted`
- 父组件 `mounted`

### 当父组件引入了 mixin 之后

- mixin `beforeCreate`
- 父组件 `beforeCreate`
- mixin `created`
- 父组件 `created`
- mixin `beforeMount`
- 父组件 `beforeMount`
- 子组件 `beforeCreate`
- 子组件 `created`
- 子组件 `beforeMount`
- 子组件 `mounted`
- mixin `mounted`
- 父组件 `mounted`

### 从 A 页面跳转 B 页面时的生命周期

- A：`beforeRouteLeave`（组件守卫）
- `beforeEach`（全局守卫）
- `beforeEnter`（路由独享守卫）
- B：`beforeRouteEnter`（组件守卫）
- `beforeResolve`（全局解析守卫）
- `afterEach`（全局守卫）
- B：`beforeCreate`
- B：`created`
- B：`beforeMount`
- A：`beforeDestroy`
- A：`destroyed`
- B：`mounted`

## 组件通信

### 怎样理解单项数据流

这个概念出现在组件通信中。父组件通过 prop 把数据传到子组件，但这个 prop 只能由父组件修改，子组件不能修改，否则会报错。子组件想修改时，只能通过 `$emit` 派发一个自定义事件，父组件接收后由父组件修改。

### Vue 的传值方式

- `$emit`
- 路由传参
  - query 传参（地址栏显示参数）
    - name 和 path 都能用
    - 地址栏会显示参数
  - params 传参（地址栏不显示参数）
    - 跳转只能用 name，不能用 path
    - 地址栏不显示参数
- vuex
- EventBus
- localStorage
- `provide` / `inject`
- `$refs`
  - `this.$refs.children`、`this.$refs.parents`

### 父组件可不可以监听子组件的生命周期

可以。`$emit` 和 `@hook:` 两种写法见 [Vue 常见问题 · 父组件监听子组件的生命周期](/01-前端基础/05-Vue与React/Vue常见问题)。

### 在什么场景下会用到 slot

- 频繁替换或更新时可以使用 slot。
- slot 相当于传递了一个组件给子组件。

### Vue 中的插槽

具名插槽：

```html
<!-- 组件 -->
<slot name="default" />

<!-- 使用 -->
<template v-slot:default> </template>
<!-- 或者 -->
<template #default> </template>
```

作用域插槽：

```html
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>

<!-- 使用 -->
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

### `$attrs` 和 `$listeners`

透传 Attributes 是指由父组件传入、且没有被子组件声明为 props 或组件自定义事件的 attributes 和事件处理函数。可以通过 `inheritAttrs: false` 禁用默认行为。

### 怎么封装一个复用性比较高的组件

思路是“求同存异”，插槽与 `v-if` 两种处理方式见 [Vue 常见问题 · 封装复用性高的组件](/01-前端基础/05-Vue与React/Vue常见问题)。

## 路由

### 导航守卫

- 全局守卫
  - `beforeEach`：全局前置守卫，路由跳转前触发。
  - `beforeResolve`：全局解析守卫，在所有组件内守卫和异步组件被解析后触发。
  - `afterEach`：路由跳转完成后触发。
- 路由守卫
  - `beforeEnter`：路由独享守卫。
- 组件守卫
  - `beforeRouteEnter`
  - `beforeRouteUpdate`
  - `beforeRouteLeave`
- 参数
  - `to`：即将要进入的目标路由对象。
  - `from`：即将要离开的路由对象。
  - `next`：是否可以进入某个具体路由，或某个具体路由的路径。

### 路由的两种模式

- hash 模式
- history 模式
- abstract 模式：在不支持浏览器 API 的环境中充当 fallback。

### Vue 的 history 和 hash 的实现原理

- hash 通过 `window.onHashChange()` 事件监听。
- history 通过 `window.history.pushState(null, null, path)`（新增历史记录）、`window.history.replaceState(null, null, path)`（替换历史记录），在不刷新页面的情况下操作浏览器历史记录。

## 核心机制

### [重点] keep-alive 原理

通过缓存 vnode 实现。渲染时对比组件的 name（通过 `include` 和 `exclude` 控制），命中缓存就从缓存中读取。

- 使用 `keep-alive` 时数据传递过去不会更新。
- 会触发 `activated`、`deactivated`。
- 内存超限时通过 LRU 算法管理。

### [重点] nextTick 原理

修改数据时会开启一个异步队列，将 watcher 的 update 更新操作缓存在同一事件循环中。同一个 watcher 只会被推入队列一次（通过 watcherId 去重），然后在下一事件循环中刷新队列、执行代码。这样能减少频繁不必要的更新，提升更新渲染效率。

原理：`nextTick` 内部通过一系列异步 API 尝试将回调函数放入异步队列，包括 Promise、MutationObserver、setImmediate、setTimeout。所有回调方法都放在 `callbacks` 数组里，最后通过 `flushCallbacks` 遍历 `callbacks` 依次执行。Vue 的 DOM 更新是异步的，本身也使用 `nextTick`。

### nextTick 使用场景

- 获取数据更新后的 DOM。
- 在 `created` 中进行 DOM 操作。
- 获取元素的宽高。

### [重点] Vue 模板编译过程

将模板编译为抽象语法树 AST（多叉树），将 AST 转化为渲染函数，执行渲染函数生成 VDOM，将 VDOM 映射为真实 DOM。

### [重点] computed 和 watch 的区别

计算属性自动监听依赖值的变化，动态返回内容；监听是一个过程，在监听的值变化时触发回调并做事情。

区别来源于用法：只需要动态值就用计算属性；需要知道值改变后执行业务逻辑就用 watch。反过来或混用虽然可行，但都是不正确的用法。

### watch 和 watchEffect 的区别

- `watch` 需要传入侦听的数据源；`watchEffect` 自动收集数据源作为依赖。
- `watchEffect` 初始化时就会执行一次；`watch` 只有设置 `immediate: true` 时才会在初始化时监听。

### watchEffect

立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。

- 设置 `flush: 'post'` 会让侦听器延迟到组件渲染后执行。
- 返回值是一个用来停止该副作用的函数。

```js
// 副作用清除
watchEffect(async (onCleanup) => {
  const { response, cancel } = doAsyncWork(id.value);
  // `cancel` 会在 `id` 更改时调用，以便取消之前未完成的请求
  onCleanup(cancel);
  data.value = await response;
});

// 停止侦听器
const stop = watchEffect(() => {});

// 当不需要此侦听器时
stop();
```

### mixins 合并规则

data 数据和 methods 之类的对象类型的值会遍历合并，冲突时以组件内优先；钩子函数合并时都会执行，先执行 mixins 里的。

### Vue.extend()

用于拓展组件生成一个构造器，通过 `new` 构造函数生成一个新的组件实例，类似组件继承。Vue 3.0 中已废弃。

### Vue.use()

实际调用了该插件的 `install` 方法。引入的插件有 `install` 时需要调用。

### Vue 2 中为什么 Vue.use 要在 new Vue() 之前调用

`new Vue(options)` 时首先执行 `this._init` 进行初始化，把 Vue 上的属性和 options 合并，然后进行事件、生命周期等初始化，`beforeCreate`、`created` 也在这里调用。

如果 `Vue.use` 在 `new Vue()` 之后执行，`this._init()` 时插件内容还没有添加到 `Vue.options.components`、`Vue.options.directives`、`Vue.options.filters` 等属性中，所以新初始化的 Vue 实例中也就没有插件内容。

```js
Vue.prototype._init = function (options) {
  const vm = this;
  vm._uid = uid++;
  let startTag, endTag;
  // ...
  vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
  );
  // ...
  // 挂载到 DOM 上
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
};
```

### Suspense 组件

作用：在组件树上层等待下层的多个嵌套异步依赖项时，通过 `#fallback` 渲染一个加载状态。

### Teleport

作用：将组件内部的一部分模板“传送”到该组件 DOM 结构的最外层。

## 自定义指令

### 自定义指令的完整写法

指令生命周期、参数、自动聚焦、下拉菜单、相对时间、按钮级权限的完整写法见 [Vue 常见问题 · 自定义指令的常用场景](/01-前端基础/05-Vue与React/Vue常见问题)。

### Vue 按钮级权限怎么去做？

使用自定义指令，根据 `sessionStorage` 中的权限数组判断并删除无权限按钮。实现见 [Vue 常见问题 · 按钮级权限](/01-前端基础/05-Vue与React/Vue常见问题)。

## 性能与工程

### Vue 优化方式

1. 减少 `v-if`，多用 `v-show`。
2. `v-for` 遍历添加 key 属性。
3. 将组件进行切割。Vue 的更新是组件粒度的，将耗时任务单独拆分成一个组件，父组件数据变化时只会重新渲染父组件，耗时组件并不会渲染。
4. 使用 `keep-alive` 缓存组件。
5. 区分 computed 和 watch。
6. 图片资源懒加载。
7. 动态加载组件、异步加载组件。
8. 使用防抖和节流。
9. 开启 Gzip 压缩。
10. 使用 CDN 缓存。

### 图片加载优化

- 减少文件体积大小，减少图片资源请求。
- 预加载。

```js
var images = new Array();
function preload() {
  for (var i = 0; i < preload.arguments.length; i++) {
    images[i] = new Image();
    images[i].src = preload.arguments[i];
  }
}
preload('1.png', '2.png', '3.png');
```

### 为什么 Vue 3 的打包体积比 Vue 2.x 小了很多

- 一部分原因是 tree shaking，删除了一部分全局方法。
- Vue 将功能模块化，在需要的时候引入。
- 全局 API tree shaking 影响到的 API：`nextTick`、`observable`（用 `Vue.reactive` 替换）、`version`、`compile`、`set`、`delete`。
- Vue 3 中所有组件都按需加载，`nextTick`、`ref`、`toRefs`、`watch`、`computed` 等都可以按需引入。
- Composition API：
  - `ref` 接受一个内部值并返回一个响应式且可变的 ref 对象，具有指向内部值的单个 property `value`。
  - `reactive` 返回一个对象的响应式副本，直接可以读取。
  - `toRefs` 可以将解构的数据转化成响应式。
  - `reactive` + `toRefs` 可以转化为跟 Vue 2.x 相似的写法。
  - `isRef` 判断当前值是否是 Ref 对象。
- Proxy。

### Vue 的缺点

- 存在首页白屏的情况。
- 原因见 [Vue 常见问题 · 首页白屏](/01-前端基础/05-Vue与React/Vue常见问题)。

## Vue 3 与 Vue 2 的区别

### [重点] Vue 3 和 Vue 2.6.2 的区别有哪些

- 数据响应式：Vue 3 使用 Proxy，Vue 2 使用 `Object.defineProperty()`。
- 全局 API 重构为可以按需引入的实例。
- 插件安装方式不同：Vue 3 要 `createApp(App)` 之后才可以 `use` 插件；Vue 2.x 通过 `Vue.use()` 就可以安装。
- 其他普通更改和不兼容语法更改：
  - 生命周期重命名。
  - router 写法更改。
  - `v-model` 更改。
  - 新增 Composition API 的 `setup()`。
  - `<style>` 标签中支持 `vars`。

### 样式中的 `/deep/` 变成了 `::deep`

Vue 3 中样式穿透改为 `::deep`，并支持 `vars`。写法见 [Vue 常见问题 · 样式中的 /deep/ 与 vars](/01-前端基础/05-Vue与React/Vue常见问题)。

### `main.js` 中的区别

Vue 3 不能通过 `Vue.prototype` 挂载全局属性，创建方式也改为 `createApp(App)`。对比见 [Vue 常见问题 · main.js 中的区别](/01-前端基础/05-Vue与React/Vue常见问题)。

### router 中的差别

```js
// ========= 区别 1 ==========
// Vue 2 中的 router
import Vue from 'vue';
import Router from 'vue-router';
export const constantRoutes = [];
const createRouter = () =>
  new Router({
    mode: 'history',
    routes: constantRoutes,
  });
export default createRouter;

// Vue 3 中的 router
import { createRouter, createWebHashHistory } from 'vue-router';
const routes = [];
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});
export default router;

// ========= 区别 2 ==========
// 匹配所有页面的微小差别
// Vue 2
const routes = [
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
];

// Vue 3
const routes = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    hidden: true,
  },
];
```

### 异步组件的使用（defineAsyncComponent）

```js
// Vue 2 中的异步组件
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    resolve({
      template: '<div>I am async!</div>',
    });
  }, 1000);
});

// 推荐做法：和 webpack 的 code-splitting 配合
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 require 语法会告诉 webpack 自动把构建代码切割成多个包
  require(['./my-async-component'], resolve);
});

// 工厂函数中返回 Promise
Vue.component('async-webpack-example', () => import('./my-async-component'));

// 组件局部使用
new Vue({
  components: {
    'my-component': () => import('./my-async-component'),
  },
});

// Vue 3 的异步组件
// defineAsyncComponent 可以接收一个对象：加载成功的组件、加载中的组件、加载失败的组件，以及一些配置
import { defineAsyncComponent } from 'vue';
export default {
  components: {
    toolBox: defineAsyncComponent(() => import('./components/toolbox')),
  },
};
```

### 新增 Suspense 组件

```html
<template>
  <Suspense>
    <!-- 正常结果的组件 -->
    <template #default>
      <async-comp />
    </template>

    <!-- 还没有请求完成时显示的组件 -->
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import { onErrorCaptured } from 'vue';
export default {
  name: 'App',
  setup() {
    onErrorCaptured((error) => {
      console.log(error);
    });
  },
};
</script>
```

异步组件：

```html
<template>
  <div>这是个异步组件，结果为 {{ result }}</div>
</template>

<script>
export default {
  async setup() {
    const resData = await getData();
    return { result: resData.data };
  },
};
</script>
```

### 新增 Teleport 组件

可以将组件挂载在 DOM 的任何地方。

```html
<!-- index.html -->
<div id="model"></div>

<!-- 在组件中使用，有一个 to 属性 -->
<teleport to="#model">
  <model-component />
</teleport>
```

### 插槽的区别

Vue 3 只保留两种插槽：具名插槽和带作用域的插槽，修改了 `slot-scope`。

注意：默认插槽的缩写语法不能和具名插槽混用，否则会导致作用域不明确。

```html
<!-- =========== 方式一：具名插槽 ============ -->
<!-- 设置具名插槽 -->
<template>
  <slot name="header"></slot>
</template>

<!-- 使用插槽：v-slot:header 或简写 #header -->
<template>
  <template #header></template>
</template>

<!-- =========== 方式二：作用域插槽 ============ -->
<!-- 设置作用域插槽，可以拿到插槽内的数据去渲染 -->
<template>
  <div v-for="item in items">
    <slot name="header" :item="item"></slot>
  </div>
</template>

<!-- 使用插槽，点后面的属性跟的是自定义属性 -->
<template>
  <template #header="slotProps">
    {{ slotProps.item }}
  </template>
</template>

<!-- =========== 只有一个默认插槽时 ============ -->
<template>
  <div v-slot="slotProps">
    <!-- 要插入的内容 -->
  </div>
</template>
```

## MVC 和 MVVM 的区别

没有很大的区别。MVC 是单向数据绑定，只绑定了数据，数据更改后视图跟着渲染；MVVM 实现了双向数据绑定，在基础上多了一层视图更改，视图变化时对应数据也跟着更改。从 MVC 到 MVVM 其实不难，一个 onchange 事件就够了。

> React 问答见 [React 面试题](/01-前端基础/05-Vue与React/React面试题)。
