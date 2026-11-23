# Vue 3 笔记
> 组合式 API、`script setup` 宏、`v-model` 变化与 Vue 2 响应式原理实现。

## 生命周期

组合式 API 下以 `onXxx` 函数注册生命周期钩子。

| 生命周期 | 说明 |
| :------: | :----- |
| `onMounted()` | 注册一个回调函数，在组件挂载完成后执行。 |
| `onUpdated()` | 注册一个回调函数，在组件因为响应式状态变更而更新其 DOM 树之后调用。 |
| `onUnMounted()` | 注册一个回调函数，在组件实例被卸载之后调用。 |
| `onBeforeMount()` | 注册一个钩子，在组件被挂载之前被调用。 |
| `onBeforeUpdate()` | 注册一个钩子，在组件即将因为响应式状态变更而更新其 DOM 树之前调用。 |
| `onBeforeUnmount()` | 注册一个钩子，在组件实例被卸载之前调用。 |
| `onErrorCaptured()` | 注册一个钩子，在捕获了后代组件传递的错误时调用。 |
| `onRenderTracked()` | 调试钩子，当组件渲染过程中追踪到响应式依赖时调用。仅在开发模式下可用。 |
| `onRenderTriggered()` | 调试钩子，当响应式依赖的变更触发了组件渲染时调用。仅在开发模式下可用。 |
| `onActivated()` | 若组件实例是 `<KeepAlive>` 缓存树的一部分，当组件被插入到 DOM 中时调用。 |
| `onDeactivated()` | 若组件实例是 `<KeepAlive>` 缓存树的一部分，当组件从 DOM 中被移除时调用。 |
| `onServerPrefetch()` | 注册一个异步函数，在组件实例在服务器上被渲染之前调用。只有 SSR 时才有。 |

## reactive

### reactive 赋值方式

```js
let react = reactive({
  a: 1,
});

Object.assign(react, { b: 2 });
// {a:1,b:2}

// or

Object.assign(react, { a: 3 });
// {a:3}
```

### reactive 删除属性

`reactive` 对象不能整体重新赋值，需要遍历删除。

```js
const b = reactive({
  /* ... */
});

// b = reactive({}) // 报错

// 假设 b 中有很多属性，需要遍历删除
Object.keys(b).forEach((key) => delete b[key]);
```

## ref

### ref 赋值方式

```js
let a = ref({});

a.value = { c: 1 };
```

### ref 删除属性

```js
const a = shallowRef({});
const b = reactive({});

// 如果要清空，同样需要遍历
Object.keys(b).forEach((key) => delete b[key]);
```

## style 中的 `v-bind`

`v-bind()` 可以看作 Vue 对 CSS 变量的一种封装，让 `<style>` 读取组件状态。

```html
<template>
  <p>123</p>
</template>
<script setup>
const pcolor = ref('#000');
</script>
<style scoped>
p {
  color: v-bind('pcolor');
}
</style>
```

注意：在某些情况下，伪元素的 `content` 属性中使用 `v-bind` 不生效。

```html
<template>
  <div>
    <p>123</p>
    <p>123</p>
  </div>
</template>
<script setup>
const text = ref('hello');
</script>
<style scoped>
/* 失效 */
div p:first-of-type:before {
  content: v-bind('text');
}
</style>
```

建议改为把值写入 data 属性，再用 `attr()` 读取。

```html
<template>
  <div>
    <p :data-text="text">123</p>
    <p>123</p>
  </div>
</template>
<script setup>
const text = ref('hello');
</script>
<style scoped>
div p:first-of-type:before {
  content: attr(data-text);
}
</style>
```

## `script setup` 形式

- 全局编译器宏只能在 `script setup` 模式下使用。
- `script setup` 模式下，使用宏时无需 `import`，可以直接使用。
- 一共提供 4 个宏：`defineProps`、`defineEmits`、`defineExpose`、`withDefaults`。

### 为 props 提供默认值

`defineProps` 用来定义组件的入参。

```html
<script setup lang="ts">
let props = defineProps<{
  schema: AttrsValueObject;
  modelValue: any;
}>();
</script>
```

这种声明方式没有提供设置 props 默认值的方式，可以通过 `withDefaults` 宏实现。

```html
<script setup lang="ts">
let props = withDefaults(
  defineProps<{
    schema: AttrsValueObject;
    modelValue: any;
  }>(),
  {
    schema: [],
    modelValue: '',
  }
);
</script>
```

### 配置全局自定义参数

```js
// Vue2.x
Vue.prototype.$api = axios;
Vue.prototype.$eventBus = eventBus;

// Vue3.x
const app = createApp({});
app.config.globalProperties.$api = axios;
app.config.globalProperties.$eventBus = eventBus;
```

### `v-model` 的变化

`v-model` 实际上是 `v-bind` 和 `v-on` 组合的简写，Vue 2 与 Vue 3 的实现不同。

```html
<!-- vue2 -->
<ChildComponent v-model="pageTitle" />

<!-- 等价于 -->
<ChildComponent :value="pageTitle" @input="pageTitle = $event" />

<!-- vue3 -->
<ChildComponent v-model="pageTitle" />

<!-- 等价于 -->
<ChildComponent
  :modelValue="pageTitle"
  @update:modelValue="pageTitle = $event"
/>
```

`script setup` 模式下不能使用 `this.$emit` 派发更新事件，需要借用 `defineProps`、`defineEmits` 两个宏。

```html
<!-- 子组件 child.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const emit = defineEmits(['update:modelValue']); // 定义需要派发的事件名称

let curValue = ref('');
let props = withDefaults(
  defineProps<{
    modelValue: string;
  }>(),
  {
    modelValue: '',
  }
);

onMounted(() => {
  // 先将 v-model 传入的 modelValue 保存
  curValue.value = props.modelValue;
});

watch(curValue, (newVal) => {
  // 当 curValue 变化，则通过 emit 派发更新
  emit('update:modelValue', newVal);
});
</script>

<template>
  <div></div>
</template>
```

父组件使用：

```html
<!-- 父组件 father.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';

let curValue = ref('');

watch(curValue, (newVal) => {
  console.log('[curValue 发生变化]', newVal);
});
</script>

<template>
  <Child v-model="curValue"></Child>
</template>
```

### `script setup` 模式下获取路由参数

使用 `useRoute` 获取当前路由，使用 `useRouter` 做跳转。

```html
<!-- A.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

let detailId = ref<string>('');
const router = useRouter();

onMounted(() => {
  const route = useRoute();
  detailId.value = route.params.id as string; // 获取参数
});

function goSearch() {
  router.push({
    name: 'search',
    query: {
      /* ... */
    },
  });
}
</script>
```

## Vue 响应式原理实现

### Observer 监听器

```js
function defineReactive(data, key, val) {
  observe(val);
  var dep = new Dep();

  const property = Object.getOwnPropertyDescriptor(data, key);
  if (property && property.configurable === false) {
    return; // 属性不可配置，直接返回
  }
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      if (Dep.target) {
        // 在 watcher 初始化时触发
        dep.addSub(Dep.target); // 添加一个订阅者
      }
      return val;
    },
    set: function (newVal) {
      if (val === newVal) {
        // 如果数据没变就不更新
        return;
      }
      val = newVal;
      console.log('数据已发生变化！');
      dep.notify(); // 数据变化，通知所有订阅者
    },
  });
}

function observe(data) {
  if (!data || typeof data !== 'object') {
    return;
  }
  Object.keys(data).forEach((key) => {
    defineReactive(data, key, data[key]);
  });
}

function Dep() {
  this.subs = [];
}

Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub);
  },
  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update(); // 通知每个订阅者
    });
  },
};

Dep.target = null;
```

### Watcher 订阅者

```js
function Watcher(vm, exp, cb) {
  this.vm = vm;
  this.exp = exp;
  this.cb = cb;
  this.value = this.get();
}

Watcher.prototype = {
  update: function () {
    this.run();
  },
  run: function () {
    var value = this.vm.data[this.exp];
    var oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal);
    }
  },
  get: function () {
    Dep.target = this; // 缓存自己
    var value = this.vm.data[this.exp]; // 强制执行监听器里的 get 函数
    Dep.target = null; // 释放自己
    return value;
  },
};
```

### SelfVue：关联 Observer 与 Watcher

```js
function SelfVue(data, el, exp) {
  this.data = data;
  observe(data);
  el.innerHTML = this.data[exp];
  new Watcher(this, exp, function (value) {
    el.innerHTML = value;
  });
  return this;
}

/*
  对比 Vue 会发现一个问题：给属性赋值时的形式是 selfVue.data.name = 'word'，
  而理想的形式是 selfVue.name = 'word'。
  在 new SelfVue 时做代理处理，让访问 SelfVue 的属性代理为访问 selfVue.data 的属性，
  原理还是使用 Object.defineProperty() 对属性再包装一层。
*/
function selfVue(data, el, exp) {
  var self = this;
  this.data = data;
  Object.keys(data).forEach(function (key) {
    self.proxyKeys(key); // 绑定代理属性
  });
  observe(data);
  el.innerHTML = this.data[exp]; // 初始化模板数据的值
  new Watcher(this, exp, function (value) {
    el.innerHTML = value;
  });
  return this;
}

// 优化 selfVue
function SelfVue(options) {
  var self = this;
  this.vm = this;
  this.data = options.data;
  Object.keys(this.data).forEach(function (key) {
    self.proxyKeys(key); // 绑定代理属性
  });
  observe(options.data);
  new Compile(options.el, this.vm);
  return this;
}

// 最后优化
function selfVue(options) {
  var self = this;
  this.data = options.data;
  this.methods = options.methods;
  Object.keys(this.data).forEach(function (key) {
    self.proxyKeys(key);
  });
  observe(options.data);
  new Compile(options.el, this);
  options.mounted.call(this);
}

selfVue.prototype = {
  proxyKeys: function (key) {
    var self = this;
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function proxyGetters() {
        return self.data[key];
      },
      set: function proxySetter(newVal) {
        self.data[key] = newVal;
      },
    });
  },
};
```

### Compile 编译

```js
function Compile() {}

Compile.prototype = {
  nodeToFragment: function (el) {
    var fragment = document.createDocumentFragment();
    var child = el.firstChild;
    while (child) {
      // 将 DOM 元素移入 fragment 中
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  },
  /*
    遍历所有节点，对含有指令的节点进行特殊处理。
    这里先处理最简单的情况，只对带有 '{{ 变量 }}' 这种形式的指令进行处理。
  */
  compileElement: function (el) {
    var childNodes = el.childNodes; // NodeList
    var self = this;
    [].slice.call(childNodes).forEach(function (node) {
      var reg = /\{\{(.*)\}\}/;
      var text = node.textContent; // 设置或返回指定节点的文本内容
      if (self.isTextNode(node) && reg.test(text)) {
        self.compileText(node, reg.exec(text)[1]);
      }
      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node); // 继续递归遍历子节点
      }
    });
  },
};
```

> 面试问答题见 [Vue 面试题](/01-前端基础/05-Vue与React/Vue面试题)，使用问题见 [Vue 常见问题](/01-前端基础/05-Vue与React/Vue常见问题)。
