# React 面试题
> 组件通信、diff 算法、Hooks 与 Redux 的高频问答。Hooks 速查见 [React 笔记](/01-前端基础/05-Vue与React/React.md)。

## 组件与通信

### 组件通信

- 父传子：props。
- 子传父：子调用父组件中的函数并传参。
- 兄弟：利用 Redux 实现，或利用共同父组件。

### 高阶组件

高阶组件就是一个函数，且该函数接收一个组件作为参数，并返回一个新的组件。

## diff 算法

### [重点] diff 算法

diff 算法的本质是找出两个对象之间的差异，目的是尽可能做到节点复用。这里的对象指的是 virtual DOM（虚拟 DOM 树），即使用 JS 对象表示页面中的 DOM 结构。

三个层级策略：

1. tree 层级：DOM 节点跨层级的移动操作特别少，可以忽略不计。
2. component 层级：拥有相同类的两个组件会生成类似的树形结构，拥有不同类的两个组件会生成不同的树形结构。
3. element 层级：对于同一层级的一组子节点，可以通过唯一 key 进行区分。

## Hooks

### 常用的 Hooks

- `useState`：设置和改变 state，代替原来的 state 和 `setState`。
- `useEffect`：代替原来的生命周期 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 的合并版。
- `useLayoutEffect`：与 `useEffect` 作用相同，但它会同步调用 effect。
- `useMemo`：缓存的是计算结果。
- `useCallback`：缓存的是函数。
- `useRef`：跟以前的 ref 一样，只是更简洁了。

### [重点] useCallback 和 useMemo 的区别

- `useMemo` 缓存的是计算结果（值）。组件发生更新重新渲染时，会采用已有的缓存结果，而不是重新计算，从而达到性能优化的效果。
- `useCallback` 缓存的是函数。函数式组件每次任何一个 state 变化，整个组件都会被重新刷新，一些函数没有必要重新刷新，此时应该缓存起来，提高性能并减少资源浪费。利用缓存函数，使子组件不会重新渲染。

### [重点] 清除 useEffect 中的副作用

在 `useEffect` 中 return 出一个函数，在函数中写清除副作用的内容。

```js
useEffect(() => {
  const timeId = setInterval(() => {
    console.log(123);
  }, 3000);

  // 清除函数副作用
  return () => {
    clearInterval(timeId);
  };
}, []);
```

### Hooks 优势

1. 函数组件无 this 问题。
2. 自定义 Hooks 方便状态复用。
3. 副作用关注点分离。

## Redux

### [重点] Redux 的执行流程

核心概念：store、action、reducer。

关键函数：

- `getState()`：获取当前最新的状态。
- `subscribe()`：订阅监听当前状态的变化，然后促使页面重新渲染。
- `dispatch()`：发布最新的状态。

执行流程：

1. 用户通过事件触发 ActionCreator 制造 action。
2. 同时，用户触发的事件内调用 `dispatch` 派发 action。
3. reducer 接收 action，并处理 state 返回 newState。
4. View 层通过 `getState()` 接收 newState 并重新渲染视图层。
