# Hook

## useState (initialState)

```typescript jsx
function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

`state`只在首次渲染时创建, 以后渲染返回当前的`state`

## useEffect(effect, deps?)

```typescript jsx
function Example() {
  const [count, setCount] = useState(0);

  // 相当于componentDidMount和componentDidUpdate:
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

可以看做`componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合。

在第一次渲染之后, 每次更新之后, 组件卸载后都会执执行一次函数

清除`effect`, 返回一个函数, 每次在组件销毁后会执行

```typescript jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
  return ()=> console.log('返回函数,然后清除effect')
});
```

性能优化, 只在`deps`参数变化时运行函数

```typescript jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```

如果传入一个空数组,那么这个effect,在渲染中只会运行一次, 相当于`componentDidMount`

```typescript jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, []); // 仅在执行一次
```

## Hook规则

* 只在 React 函数中调用 Hook
* 不要在普通的 JavaScript 函数中调用 Hook。
* 在 React 的函数组件中调用 Hook
* 在自定义 Hook 中调用其他 Hook 
