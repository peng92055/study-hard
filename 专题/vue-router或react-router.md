# hashchange 和h5 history popstate

```
  window.addEventListener('hashchange', () => {
    const path = window.location.hash.slice(1)
    const component = routeMap[path].component
    render(h) => h(component)
  })
```