# windows/

布局窗口组件。通过 `pages.json` 的 `topWindow` 和 `leftWindow` 配置，形成 admin 后台的经典三栏布局。

## 文件

| 文件 | 职责 |
|---|---|
| `topWindow.vue` | 顶部导航栏（60px）— Logo、应用名、页面标题、主题切换、语言切换、用户菜单、错误日志入口 |
| `leftWindow.vue` | 左侧菜单栏（240px）— 使用 `uni-data-menu` 组件从数据库动态加载菜单树 |
| `components/error-log.vue` | 错误日志弹窗 — 展示 `store/error` 中收集的运行时错误 |

## 布局结构

```
┌──────────── topWindow (60px) ────────────────┐
│ Logo │ 页面标题 │ 主题/语言/用户菜单           │
├──────────┼───────────────────────────────────┤
│ leftWindow│  content pages                   │
│ (240px)  │  （pages/ 下的页面内容）            │
│          │                                   │
│ 动态菜单  │                                   │
└──────────┴───────────────────────────────────┘
```

## 菜单数据源

`leftWindow.vue` 通过 `uni-data-menu` 查询 `opendb-admin-menus` 集合，同时支持：
- **动态菜单** — 数据库中的菜单记录（按权限过滤）
- **静态菜单** — `admin.config.js` 中 `sideBar.staticMenu` 配置
