# TypeScript

> TypeScript 专题目录，按基础、对象类型、泛型、条件类型、keyof、typeof、索引访问顺序学习，题目见[面试题](./面试题.md)。

## 目录

| 页面 | 内容 |
| --- | --- |
| [01-基础](./01-基础.md) | 常见类型、类型断言、字面量推断、类型收窄、函数签名、泛型函数、重载、`void`/`unknown`/`never` |
| [02-对象类型](./02-对象类型.md) | 索引签名、属性继承、交叉类型、泛型对象、`ReadonlyArray`、元组 |
| [03-泛型](./03-泛型.md) | 泛型类型变量、泛型接口与类、泛型约束、类类型工厂 |
| [04-条件类型](./04-条件类型.md) | 条件类型、条件约束、`infer`、分发条件类型 |
| [05-keyof](./05-keyof.md) | 属性名联合、数字字面量、Symbol、泛型约束实战 |
| [06-typeof](./06-typeof.md) | 值转类型、限制、对象/函数/enum |
| [07-索引访问](./07-索引访问.md) | 索引访问类型、`typeof APP[number]` 推导字面量联合 |
| [面试题](./面试题.md) | `type` vs `interface`、泛型、条件类型、类型收窄、工具类型、`unknown` vs `any`、`never` |

建议顺序：先看 01 建立类型系统的基本概念，再看 02 的对象建模，然后 03–07 逐个掌握类型操作符，最后用面试题查漏。

## 小知识点

### keyof 返回的类型

`keyof` 操作符返回的类型是 `string | number | symbol`（具体取决于对象的属性名类型）。

### 模板字面量返回的类型

模板字面量类型可以展开的类型包括 `string | number | bigint | boolean | null | undefined`。

### Exclude 排除某种类型

```ts
// 排除 Type 中的 symbol 类型
type PropEventSource<Type> = {
  on(
    eventName: `${Exclude<keyof Type, symbol>}Changed`,
    callback: (newValue: any) => void
  ): void
}
```

### Extract 提取某个类型

```ts
// 从 Type 中提取 string 类型
type PropEventSource<Type> = {
  on(
    eventName: `${Extract<keyof Type, string>}Changed`,
    callback: (newValue: any) => void
  ): void
}
```

## 工具类型速查

### `Partial<Type>`
构造一个 Type 下所有属性都可选的类型，返回给定类型的子集。

```ts
interface Todo {
  title: string
  description: string
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate }
}

const todo1 = {
  title: 'organize desk',
  description: 'clear clutter'
}

const todo2 = updateTodo(todo1, {
  description: 'throw out trash'
})
// fieldsToUpdate 可以是 Todo 类型中的部分属性
```

### `Record<Keys, Type>`
构造一个对象类型，所有 key 都是 `Keys` 类型，所有 value 都是 `Type` 类型，可用于把一个类型的属性映射到另一个类型。

```ts
interface CatInfo {
  age: number
  breed: string
}

type CatName = 'miffy' | 'boris' | 'mordred'

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: 'Persian' },
  boris: { age: 5, breed: 'Maine Coon' },
  mordred: { age: 16, breed: 'British Shorthair' }
}
// const cats: Record<CatName, CatInfo>
```

### `Pick<Type, Keys>`
从 `Type` 中挑出属性 `Keys`，`Keys` 是字符串字面量或字符串字面量联合类型。

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false
}
```

### `Omit<Type, Keys>`
从 `Type` 中过滤掉属性 `Keys`。

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
  createdAt: number
}

type TodoPreview = Omit<Todo, 'description'>

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
  createdAt: 1615544252770
}

type TodoInfo = Omit<Todo, 'completed' | 'createdAt'>

const todoInfo: TodoInfo = {
  title: 'Pick up kids',
  description: 'Kindergarten closes at 5pm'
}
```

### `Exclude<UnionType, ExcludedMembers>`
从 `UnionType` 联合类型中排除所有可以赋给 `ExcludedMembers` 的类型。

```ts
type T0 = Exclude<'a' | 'b' | 'c', 'a'>
// type T0 = "b" | "c"

type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>
// type T1 = "c"

type T2 = Exclude<string | number | (() => void), Function>
// type T2 = string | number
```

### `Extract<Type, Union>`
从 `Type` 中提取所有可以赋给 `Union` 的类型。

```ts
type T0 = Extract<'a' | 'b' | 'c', 'a' | 'f'>
// type T0 = "a"

type T1 = Extract<string | number | (() => void), Function>
// type T1 = () => void
```

### `NonNullable<Type>`
从 `Type` 中排除所有 `null`、`undefined`。

```ts
type T0 = NonNullable<string | number | undefined>
// type T0 = string | number

type T1 = NonNullable<string[] | null | undefined>
// type T1 = string[]
```

### `Parameters<Type>`
根据函数类型的参数构造元组类型。

```ts
declare function f1(arg: { a: number; b: string }): void

type T0 = Parameters<() => string>
// type T0 = []

type T1 = Parameters<(s: string) => void>
// type T1 = [s: string]

type T2 = Parameters<<T>(arg: T) => T>
// type T2 = [arg: unknown]

type T3 = Parameters<typeof f1>
// type T3 = [arg: { a: number; b: string }]

type T4 = Parameters<any>
// type T4 = unknown[]

type T5 = Parameters<never>
// type T5 = never
```

### `ConstructorParameters<Type>`
根据构造函数类型构造元组或数组类型，产生包含所有参数类型的元组；`Type` 不是函数时返回 `never`。

```ts
type T0 = ConstructorParameters<ErrorConstructor>
// type T0 = [message?: string]

type T1 = ConstructorParameters<FunctionConstructor>
// type T1 = string[]

type T2 = ConstructorParameters<RegExpConstructor>
// type T2 = [pattern: string | RegExp, flags?: string]

type T3 = ConstructorParameters<any>
// type T3 = unknown[]
```

### `ReturnType<Type>`
构造一个含有 `Type` 函数返回值的类型。

```ts
declare function f1(): { a: number; b: string }

type T0 = ReturnType<() => string>
// type T0 = string

type T1 = ReturnType<(s: string) => void>
// type T1 = void

type T2 = ReturnType<<T>() => T>
// type T2 = unknown

type T3 = ReturnType<<T extends U, U extends number[]>() => T>
// type T3 = number[]

type T4 = ReturnType<typeof f1>
// type T4 = { a: number; b: string }

type T5 = ReturnType<any>
// type T5 = any

type T6 = ReturnType<never>
// type T6 = never
```

### `InstanceType<Type>`
构造一个由 `Type` 构造函数的所有实例类型组成的类型。

```ts
class C {
  x = 0
  y = 0
}

type T0 = InstanceType<typeof C>
// type T0 = C

type T1 = InstanceType<any>
// type T1 = any

type T2 = InstanceType<never>
// type T2 = never
```

### `ThisParameterType<Type>`
提取函数类型 `Type` 的 `this` 参数类型；函数没有 `this` 参数时返回 `unknown`。

```ts
function toHex(this: Number) {
  return this.toString(16)
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n)
}
```

### `OmitThisParameter<Type>`
移除函数类型 `Type` 的 `this` 参数类型。`Type` 没有显式声明 `this` 时返回 `Type`；否则返回一个基于 `Type` 但没有 `this` 参数的新函数类型。泛型会被抹去，只有最后一个重载签名会进入返回的新函数类型。

```ts
function toHex(this: Number) {
  return this.toString(16)
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5)

console.log(fiveToHex())
```

### `ThisType<Type>`
不返回转换后的类型，只用作标记上下文的 `this` 类型。使用它需要开启 `noImplicitThis`。

```ts
type ObjectDescriptor<D, M> = {
  data?: D
  methods?: M & ThisType<D & M> // methods 中的 this 类型是 D & M
}

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {}
  let methods: object = desc.methods || {}
  return { ...data, ...methods } as D & M
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx
      this.y += dy
    }
  }
})

obj.x = 10
obj.y = 20
obj.moveBy(5, 5)
```

`ThisType<T>` 是声明在 `lib.d.ts` 中的简单空接口。除被当作对象字面量的上下文类型外，它表现得就像空接口。

## 相关页面

- 类型操作符的完整说明：[keyof](./05-keyof.md)、[typeof](./06-typeof.md)、[索引访问](./07-索引访问.md)
- 高频题目：[TypeScript 面试题](./面试题.md)
