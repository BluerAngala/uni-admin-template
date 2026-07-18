# js_sdk/uni-admin/

Admin 框架核心 SDK。通过 `plugin.js` 在 `main.js` 中全局注入，是整个管理后台的"大脑"。

## 文件清单

| 文件 | 职责 |
|---|---|
| `plugin.js` | 入口 — 注册全局助手（`$request`、`$hasPermission`、`$hasRole` 等），挂载到 Vue 原型 |
| `request.js` | 统一请求封装 — 支持云函数和云对象两种调用方式 |
| `permission.js` | 权限助手 — `$hasPermission(name)` 检查 permission 数组，`$hasRole(name)` 检查角色 |
| `interceptor.js` | 导航拦截 — 路由失败时重定向到 404 页面 |
| `embed.js` | iframe 嵌入模式 — Token 注入、窗口元素隐藏、跨窗口通信 |
| `error.js` | 错误处理 — 错误日志收集与展示 |
| `fetchMock.js` | Mock 请求 — 开发环境模拟云函数响应 |
| `constants.js` | 常量定义 — 应用级常量 |
| `util.js` | 工具函数 — 通用辅助方法 |

## 调用链路

```
main.js → plugin.js 注册 → Vue.prototype.$*
    ↓
页面中 this.$request / this.$hasPermission()
    ↓
request.js → 云函数/云对象 → uniCloud API
```

## 依赖关系

- 依赖 `admin.config.js` 的全局配置
- `permission.js` 依赖 Vuex store 中的用户信息
- `embed.js` 依赖 `uni-id-pages/store.js` 的 Token 管理
