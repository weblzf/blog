# Context

## 使用content

当多数组件都需要某数据时使用

缺点: 会导致组件耦合度高, 复用性变差

如果只是嫌层层传递属性麻烦,可使用[组件组合（component composition）](https://react.docschina.org/docs/composition-vs-inheritance.html)来解决

> 创建content

```typescript jsx
// 文件 C.tsx    创建context,默认值为'light'
const ThemeContext = React.createContext('light')
```

> 父组件 Context.Provider

```typescript jsx
import { ThemeContext } from "./C"

class App extends Component {
  render() {
    return (
      // context的值为 'dark'
      <ThemeContext.Provider value={"dark"}>
        <ThemeButton />
      </ThemeContext.Provider>
    )
  }
}
```
> 子组件

```typescript jsx
import { ThemeContext } from "./C"

class ThemeButton extends Component {
  static contextType = ThemeContext
  context!: ContextType<typeof ThemeContext>

  render() {
    return <button>{this.context}</button>
  }
}
```

> context在函数式组件中使用, Context.Consumer

```typescript jsx
<Context.Consumer>
  {value => <div>{value}</div>}
</Context.Consumer>
```

## 动态context

将context的值,由state来提供,通过改变state重新渲染新的context值

```typescript jsx
class App extends Component {
  state = {
    theme : 'dark'
  }

  changeTheme = () => {
    this.setState({ theme : 'light' })
    console.log(1, this.state)
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state.theme}>
        <ThemeButton onClick={this.changeTheme} />
      </ThemeContext.Provider>
    )
  }
}
```

将修改函数直接写入context里

```typescript jsx
class App extends Component {
  state = {
    theme : 'dark',
    toggleTheme : () => this.setState({
      theme : this.state.theme + 1
    })
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        <ThemeButton />
      </ThemeContext.Provider>
    )
  }
}


class ThemeButton extends Component {
  static contextType = ThemeContext
  context!: ContextType<typeof ThemeContext>

  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme, toggleTheme }) => (
          <button onClick={toggleTheme}>{theme}</button>
        )}
      </ThemeContext.Consumer>
    )
  }
}
```

## 注意事项

如果value你直接赋值为固定值,有可能这个组件在每次重渲染都会渲染所有子组件

防止这种情况: 直接将value状态提升到父节点的state,例如:`value={this.state.value}`
