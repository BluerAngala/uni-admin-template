# 架构与数据流

## 整体结构

```
┌─────────────────────────────────────────────────────┐
│  HBuilderX IDE（通过 uni-app CLI 构建/运行）          │
├─────────────────────────────────────────────────────┤
│  main.js → App.vue → Vuex Store → vue-i18n         │
│       ↓                                              │
│  js_sdk/uni-admin/plugin.js（全局注入）               │
│       ↓                                              │
│  ┌─────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │topWindow│  │ leftWindow │  │  content pages   │  │
│  │ (60px)  │  │  (240px)   │  │  (unicloud-db)   │  │
│  └─────────┘  └────────────┘  └──────────────────┘  │
│       ↓              ↓                ↓               │
│  uni-id-pages   opendb-admin-menus   uniCloud DB     │
│  （认证/Token）  （动态菜单树）       （JQL 查询）     │
├─────────────────────────────────────────────────────┤
│  uniCloud-alipay/                                    │
│  ├── cloudfunctions/  （云函数 + 云对象）              │
│  └── database/        （~140 个 opendb 数据表）       │
└─────────────────────────────────────────────────────┘
```

## 启动流程

1. `main.js` — 创建 Vue 实例，注册 Vuex store、vue-i18n、admin plugin
2. `js_sdk/uni-admin/plugin.js` — `install()` 将 6 个全局助手挂载到 Vue 原型：
   - `$request` — 统一云函数/云对象请求
   - `$hasPermission` / `$hasRole` — 权限检查
   - `$uniIdPagesStore` — 认证状态 store
   - `$formatDate` / `$formatBytes` — 工具函数
3. `App.vue` — `onLaunch` 检查登录状态、初始化主题、配置 ext-storage 上传
4. `windows/topWindow.vue` — 渲染顶部导航栏（logo、主题/语言切换、用户菜单）
5. `windows/leftWindow.vue` — 从 `opendb-admin-menus` 加载动态菜单 + `admin.config.js` 静态菜单

## 布局系统

三窗口布局，声明在 `pages.json`：
- `topWindow`（60px）— 顶部导航栏
- `leftWindow`（240px）— 左侧菜单
- `content` — 主内容区（页面路由）

H5 平台支持嵌入模式：通过 URL 参数 `hideLeftWindow`/`hideTopWindow` 隐藏窗口，`token` 注入认证。

## 目录结构

| 目录 | 用途 |
|---|---|
| `pages/` | 主包页面（index、error、demo）+ 分包（`system/`、`uni-stat/`） |
| `js_sdk/uni-admin/` | 核心 Admin SDK：plugin、权限、请求、拦截器、嵌入模式、常量 |
| `js_sdk/uni-id-pages/` | 认证 SDK：登录/注册/store、Token 管理 |
| `js_sdk/uni-stat/` | 统计工具：查询构建、数据格式化、图表数据处理 |
| `js_sdk/validator/` | 按数据集合的校验器，提供 `enumConverter` 和 `filterToWhere` |
| `store/` | Vuex — 3 个模块：`app`（主题/菜单/路由）、`user`（用户信息）、`error`（调试日志） |
| `components/` | 自定义组件：`uni-data-menu`、`uni-stat-*`、`batch-sms`、`download-excel` |
| `windows/` | 布局窗口：`topWindow.vue`（顶部导航栏）、`leftWindow.vue`（左侧菜单栏） |
| `uniCloud-alipay/cloudfunctions/` | 7 个云函数/云对象 + `uni-stat` 公共模块 |
| `uniCloud-alipay/database/` | ~140 个 opendb schema 文件 |
| `uni_modules/` | 36 个 DCloud 官方/社区包 |
| `common/` | 全局样式：`uni.css`、`theme.scss`、图标字体 |
| `i18n/` | 国际化：`zh-Hans.json`、`zh-Hant.json`、`en.json` |
| `mock/uni-stat/` | 统计模块的 Mock 数据 |

## 重要文件

| 文件 | 职责 |
|---|---|
| `main.js` | 应用入口 |
| `App.vue` | 根组件 — 登录检查、主题初始化、404 处理 |
| `admin.config.js` | 中心配置：URL、导航栏、侧边栏菜单 |
| `pages.json` | 路由、窗口布局、uniIdRouter 认证守卫 |
| `manifest.json` | uni-app 清单：appid、平台配置 |
| `js_sdk/uni-admin/plugin.js` | 全局助手注入（框架"大脑"） |
| `js_sdk/uni-admin/request.js` | 统一请求封装 |
| `js_sdk/uni-admin/permission.js` | `$hasPermission()` / `$hasRole()` |
| `js_sdk/uni-id-pages/store.js` | 认证响应式 store |
| `js_sdk/uni-admin/interceptor.js` | 导航失败 → 404 重定向 |
| `js_sdk/uni-admin/embed.js` | iframe 嵌入模式 |
| `store/modules/app.js` | 主题、导航菜单、路由状态 |
| `store/modules/user.js` | 用户信息获取 |
| `windows/topWindow.vue` | 顶部导航栏 |
| `windows/leftWindow.vue` | 侧边栏菜单 |
