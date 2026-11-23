# React
> React Hooks、diff 算法与 Redux 速查；逐题答案见 [React 面试题](/01-前端基础/05-Vue与React/React面试题)。

## Hooks 速查

| Hook | 作用 |
| --- | --- |
| `useState` | 设置和改变 state，代替原来的 state 和 `setState`。 |
| `useEffect` | 代替 `componentDidMount`、`componentDidUpdate`、`componentWillUnmount` 的合并版。 |
| `useLayoutEffect` | 与 `useEffect` 作用相同，但会同步调用 effect。 |
| `useMemo` | 缓存计算结果。 |
| `useCallback` | 缓存函数。 |
| `useRef` | 跟以前的 ref 一样，只是更简洁。 |

`useMemo` 与 `useCallback` 的区别、`useEffect` 清除副作用的写法见 [React 面试题](/01-前端基础/05-Vue与React/React面试题)。

## diff 算法的三层策略

- tree 层级：DOM 节点跨层级的移动操作特别少，可以忽略不计。
- component 层级：拥有相同类的两个组件会生成类似的树形结构，拥有不同类的两个组件会生成不同的树形结构。
- element 层级：对于同一层级的一组子节点，可以通过唯一 key 进行区分。

完整说明见 [React 面试题 · diff 算法](/01-前端基础/05-Vue与React/React面试题)。

## Redux 的三个核心概念

- store、action、reducer。
- 关键函数：`getState()`、`subscribe()`、`dispatch()`。
- 执行流程见 [React 面试题 · Redux](/01-前端基础/05-Vue与React/React面试题)。

## 搜索框防抖与异步操作访问事件 target 为 null

搜索框使用 `useEffect` 做防抖，以及在异步操作中访问事件对象 `target` 为 `null` 的问题，参考：

- [useEffect 防抖](https://zhuanlan.zhihu.com/p/186271278)

> 组件通信、高阶组件、Hooks 优势等问答见 [React 面试题](/01-前端基础/05-Vue与React/React面试题)。
