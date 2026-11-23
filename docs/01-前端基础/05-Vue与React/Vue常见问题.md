# Vue 常见问题
> 日常开发中的防抖、自定义指令、组件封装、样式与升级问题。

## input 输入框防抖

在 `input` 事件中调用 `lodash` 的 `debounce`。注意 `debounce` 包装的方法不能写成箭头函数，否则拿不到组件实例。

```html
<input
  ref="input"
  @input="change"
  :name="name"
  :value="formatterValue"
  :placeholder="placeholder"
/>

<script>
import _ from 'lodash';

export default {
  methods: {
    change(event) {
      this._change(event);
    },
    // 注意 debounce 不能写成箭头函数
    _change: _.debounce(function (event) {
      // 获取 input 框中的值
      const value = event.target.value;
      console.log(event.target.value);
    }),
  },
};
</script>
```

## 父组件监听子组件的生命周期

方式一：子组件在生命周期里 `$emit`，父组件监听自定义事件。

```html
<!-- 父组件 -->
<template>
  <div>
    <child-component @mounted="handleDoSomething"></child-component>
  </div>
</template>
<script>
export default Vue.component('HelloWorld', {
  methods: {
    handleDoSomething(data) {
      console.log('监听到子组件生命周期钩子函数 mounted 时触发', data);
    },
  },
  components: {
    'child-component': ChildComponent,
  },
});
</script>

<!-- 子组件 -->
<script>
export default {
  mounted() {
    this.$emit('mounted', 'mounted 触发了');
  },
};
</script>
```

方式二：使用 `@hook:`。原理仍是在父子组件通信基础上，由 Vue 自动发布对应的生命周期事件，不需要在子组件里手动 `$emit`。

```html
<!-- 父组件 -->
<template>
  <div>
    <child-component @hook:mounted="handleDoSomething"></child-component>
  </div>
</template>
```

`@hook` 适合用生命周期控制 loading：`mounted` 之后停止 loading，`beforeUpdate` 时开始 loading，`updated` 之后停止。

```html
<!-- 子组件：组件销毁时清除定时器 -->
<script>
export default {
  mounted() {
    const timer = setInterval(() => {
      /* ... */
    }, 1000);
    this.$once('hook:beforeDestroy', () => clearInterval(timer));
  },
};
</script>
```

## 自定义指令的常用场景

指令的生命周期：

- `created`：绑定元素的 attribute 前，或事件监听器应用前调用。
- `beforeMount`：元素被插入到 DOM 前调用。
- `mounted`：Vue 3 常用，绑定元素的父组件及自己的所有子节点都挂载完成后调用。
- `beforeUpdate`：绑定元素的父组件更新前调用。
- `updated`：绑定元素的父组件及自己的所有子节点都更新后调用。
- `beforeUnmount`：绑定元素的父组件卸载前调用。
- `unmounted`：绑定元素的父组件卸载后调用。

`mounted` / `inserted` 的参数：

- `el`：指令绑定到的元素，可直接操作 DOM。
- `binding`：
  - `value`：传递给指令的值。
  - `oldValue`：之前的值。
  - `arg`：指令的参数，例如 `v-my-directive:foo` 中的 `"foo"`。
- `vnode`：代表绑定元素的底层 VNode。

常见场景：输入框自动聚焦、下拉菜单点击外部关闭、相对时间转换、按钮级权限。

### 输入框自动聚焦

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时
  inserted: function (el) {
    el.focus();
  },
});
```

```html
<input v-focus />
```

### 下拉菜单点击外部关闭

> 点击下拉菜单本身不会隐藏菜单，点击菜单以外的区域隐藏菜单。

```js
Vue.directive('clickoutside', {
  bind(el, binding) {
    function documentHandler(e) {
      if (el.contains(e.target)) {
        return false;
      }

      if (binding.expression) {
        binding.value(e);
      }
    }

    el.__vueMenuHandler__ = documentHandler;
    document.addEventListener('click', el.__vueMenuHandler__);
  },
  unbind(el) {
    document.removeEventListener('click', el.__vueMenuHandler__);
    delete el.__vueMenuHandler__;
  },
});
```

### 相对时间转换

> 类似微博、朋友圈发布动态后的相对时间，比如刚刚、两分钟前。

```js
Vue.directive('relativeTime', {
  bind(el, binding) {
    // Time.getFormatTime() 方法自行补充
    el.innerHTML = Time.getFormatTime(binding.value);
    el.__timeout__ = setInterval(() => {
      el.innerHTML = Time.getFormatTime(binding.value);
    }, 6000);
  },
  unbind(el) {
    clearInterval(el.__timeout__);
    delete el.__timeout__;
  },
});
```

```html
<span v-relativeTime="time"></span>
```

### 按钮级权限

封装 `permissions.js`，用全局自定义指令根据权限数组删除无权限按钮。

```js
// permissions.js
import Vue from 'vue';

// 使用 Vue.directive 声明自定义指令 btn-key
export const buttonPermissions = Vue.directive('btn-key', {
  /**
   * inserted：被绑定元素插入父节点时调用
   * el：指令所绑定的元素，可以用来直接操作 DOM
   * binding.value：指令的绑定值，例如：v-my-directive="1 + 1" 中绑定值为 2
   */
  inserted(el, binding) {
    let buttonKey = binding.value;
    // 代表某个元素需要通过权限验证
    if (buttonKey) {
      let key = checkKey(buttonKey);
      if (!key) {
        // 没有权限
        el.remove();
      }
    } else {
      throw new Error('缺少唯一指令');
    }
  },
});

// 检测传入的元素 key 是否可以显示
function checkKey(key) {
  // 获取权限数组
  let permissionData = sessionStorage.getItem('permissionData')
    ? sessionStorage.getItem('permissionData')
    : [];
  // 如果传入的元素 key 不在权限数组里，则不可显示
  let index = permissionData.indexOf(key);
  return index > -1;
}
```

在 `main.js` 中挂载：

```js
import { buttonPermissions } from './common/permissions';
```

## 封装复用性高的组件

思路是“求同存异”：

- 相同部分封装在一起。
- 不同部分有两种处理方式：
  - 变化种类比较多时，交给外部处理，通过插槽把不同部分插入。
  - 种类只有固定几种时，由内部处理：写一个方法，把种类传进来，通过 `v-if` 渲染其中一种。

## 封装的公共样式 Less

- 将变量提取为 `variable.less`，把通用颜色挂载写入，并通过 webpack 的 `style-resources-loader` 挂载到全局。
- 封装单行溢出、多行溢出、1px 问题。
- 设置通用样式，去掉浏览器默认样式等。

## 样式中的 `/deep/` 与 `vars`

Vue 3 中样式穿透从 `/deep/` 变为 `::deep`，并且 `<style>` 支持 `vars`。

```html
<script>
export default {
  data() {
    return {
      color: 'red',
    };
  },
};
</script>

<style vars="{ color }">
.text {
  color: var(--color);
}
</style>
```

## `main.js` 中的区别

```js
import App from './App.vue';
const app = createApp(App);

/**
 * 1. 不能通过 Vue.prototype 挂载全局属性。
 *    如果要在 Vue 3 中挂载全局属性，可以通过
 *    app.config.globalProperties.$axios = axios 挂载，官方不推荐挂载全局属性。
 *
 * 2. 创建方式不一样。
 *    Vue 2 创建实例的方式是 new Vue({})，可以在实例化之前 .use() 使用插件；
 *    Vue 3 中必须先 createApp(App)，之后才可以 .use() 插件。
 */
```

## 升级过程中第三方库的问题

`vue-count-to` 不支持 Vue 3，需要把插件下载下来手动修改，将 `beforeDestroy` 改为 `beforeUnmount`。

## Vue 为什么会有首页白屏

Vue 在启动应用时，会对组件中的 `data` 和 `computed` 状态值通过 `Object.defineProperty` 转成 `get`/`set` 访问属性，以便监听数据变化。这一过程都在启动应用时完成，因此页面启动阶段会比非 JS 驱动的页面（如 jQuery 应用）慢一些。

> 首屏白屏的优化方案见 [性能优化](/01-前端基础/06-工程化与性能/性能优化)。
