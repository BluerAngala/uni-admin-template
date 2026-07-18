# store/

Vuex 状态管理。3 个命名空间模块，分别管理应用状态、用户信息和错误日志。

## 模块

| 模块 | 文件 | 职责 |
|---|---|---|
| `app` | `modules/app.js` | 主题切换、导航菜单、路由状态。主题通过 `localStorage` 持久化，运行时设置 `document.body.dataset.theme` |
| `user` | `modules/user.js` | 用户信息 — 通过 JQL 从 `uni-id-users` 集合获取 |
| `error` | `modules/error.js` | 调试日志收集 — H5 环境下捕获的错误记录 |

## 常量

`constants.js` — 定义 store 中使用的常量（如 mutation/action 名称）。

## 访问方式

```js
// 组件中
import { mapState, mapActions } from 'vuex';
computed: { ...mapState('app', ['theme']) }
methods: { ...mapActions('app', ['setTheme']) }
```

## 依赖

- `admin.config.js` 提供初始配置（菜单、路由等）
- 主题 SCSS 变量定义在 `uni.scss`，`common/theme.scss` 提供运行时样式切换
