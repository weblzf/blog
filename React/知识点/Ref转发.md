# ref获取DOM

## 使用

```typescript jsx
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

## 类组件中使用

```typescript jsx
class ThemeButton extends Component<{ forwardedRef?: Ref<any> }> {
  render() {
    return (
      <button ref={this.props.forwardedRef} >
        test
      </button>
    )
  }
}

export default forwardRef(((props, ref) => (
  <ThemeButton {...props} forwardedRef={ref} />
)))



class App extends Component {
  node = createRef()

  componentDidMount(): void {
    console.log(this.node.current)
  }

  render() {
    return (
      <ThemeButton ref={this.node} />
    )
  }
}
```
