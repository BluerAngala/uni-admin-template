# uni-admin 现代化重设计方案

## 目标

将 uni-admin 从 2018 风格的管理后台改造为 2025 现代 SaaS 管理面板。视觉对标 Vercel Dashboard / Linear，面向开发者和技术用户，简洁高效。

## 约束

- **平台：** 当前仅 H5，架构预留跨平台扩展
- **框架：** uni-app（Vue 2/3 双模式，Options API only）
- **构建：** 无 npm scripts，仅 HBuilderX 运行/调试/部署
- **样式：** CSS Variables 做主题系统，组件级样式为主，不搞全局覆盖层
- **后端：** uniCloud Serverless，数据模型不变

## 视觉方向：Clean Minimal

```
关键词：留白、呼吸感、中性色、微动效、信息层次清晰

色板：
  主色    #5b8def（蓝色，链接/按钮/激活态）
  成功    #10b981（绿色）
  警告    #f59e0b（琥珀色）
  错误    #ef4444（红色）
  背景    #ffffff / #f7f8fa（浅灰交替）
  文字    #1a1a2e（主）/ #6b7280（次）/ #9ca3af（辅助）

字体：
  英文    Inter（Google Fonts CDN 或系统字体回退）
  中文    PingFang SC / Microsoft YaHei
  等宽    JetBrains Mono（代码/ID）

间距（4px 网格）：
  4 / 8 / 12 / 16 / 24 / 32 / 48 / 64

圆角：
  按钮/输入框  8px
  卡片  12px
  弹窗  16px
  药丸/徽章  9999px

阴影（3 级）：
  sm  0 1px 2px rgba(0,0,0,0.04)
  md  0 4px 12px rgba(0,0,0,0.06)
  lg  0 8px 24px rgba(0,0,0,0.08)
```

## 架构改造

### 1. 主题系统（保留，已就绪）

`styles/design-system/` 中保留三个文件：

| 文件 | 职责 |
|---|---|
| `_tokens.scss` | CSS Variables 定义（色板、间距、圆角、阴影、排版、层级、过渡） |
| `_themes.scss` | light / dark / auto 三套主题映射 |
| `_base.scss` | body/link/scrollbar/page 全局基础样式 |

`App.vue` 引入顺序：`uni.css` → `uni-icons.css` → `admin-icons.css` → `theme.scss` → `design-system/index.scss`

不做全局组件覆盖。组件样式由各组件自行处理。

### 2. 布局 Shell（重构）

```
┌─────────────────────────────────────────────────────┐
│  Shell.vue（统一布局容器）                             │
│                                                      │
│  ┌─── TopBar (56px) ──────────────────────────────┐ │
│  │ [☰] [Logo]    [⌘K 搜索占位]    [🔔] [🌙] [👤] │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌─── Sidebar ──────┐ ┌─── Content ──────────────┐ │
│  │  📊 首页          │ │                           │ │
│  │  ▸ 系统管理       │ │  <router-view />          │ │
│  │    用户管理       │ │                           │ │
│  │    角色管理       │ │                           │ │
│  │    菜单管理       │ │                           │ │
│  │    权限管理       │ │                           │ │
│  │  ▸ uni 统计       │ │                           │ │
│  │  ▸ 安全审计       │ │                           │ │
│  └───────────────────┘ └───────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**改造要点：**
- `topWindow.vue` 重写：高度 56px，清洁顶栏，无冗余 SVG icon
- `leftWindow.vue` 重写：可折叠至 icon-only 模式（64px）
- 侧栏菜单项：44px 高度，左侧 3px 激活指示条，hover 背景色过渡
- 移动端/小屏：侧栏默认收起，汉堡菜单触发

### 3. 组件库（新建）

在 `components/` 下新建现代组件，逐步替换 uni-ui 原生组件：

| 组件 | 用途 | 替换目标 |
|---|---|---|
| `app-card` | 通用卡片容器（圆角、阴影、hover） | `uni-card` / 手写 div |
| `app-table` | 数据表格（骨架屏、空状态、斑马纹） | `uni-table` |
| `app-form-item` | 表单项（label + input + error） | `uni-forms-item` |
| `app-modal` | 模态框（居中弹出、遮罩、ESC 关闭） | `uni-popup` |
| `app-drawer` | 侧滑抽屉（新增/编辑表单容器） | `uni-popup type="right"` |
| `app-toast` | 轻提示（自动消失、支持 undo） | 无 |
| `app-badge` | 状态徽章（圆角药丸、语义色） | `uni-tag` |
| `app-empty` | 空状态（插画 + 引导操作） | 无 |
| `app-skeleton` | 骨架屏（行/卡片形状） | 无 |
| `app-stat-card` | 统计数字卡片（数字 + 趋势 + sparkline） | 无 |

**组件设计原则：**
- 每个组件自包含样式（scoped），通过 props 控制变体
- 颜色用 CSS Variables 引用，支持主题切换
- 不搞全局覆盖，不搞 `!important`
- Props 优先于 class 控制外观

### 4. 页面改造清单

#### Phase 1 — 基础框架（第 1 周）
| 页面 | 改造内容 |
|---|---|
| `windows/topWindow.vue` | 重写顶栏：56px 高度、清洁布局、主题/语言切换 |
| `windows/leftWindow.vue` | 重写侧栏：可折叠、激活指示条、hover 过渡 |
| `pages/index/index.vue` | Dashboard：欢迎区域 + 概览卡片 + 统计表格 |
| `pages/error/404.vue` | 现代空状态页面 |

#### Phase 2 — 系统管理（第 2 周）
| 页面 | 改造内容 |
|---|---|
| `pages/system/user/list.vue` | 用户列表：新表格、批量操作栏、筛选面板 |
| `pages/system/user/add.vue` | 新建用户：Drawer 抽屉表单 |
| `pages/system/user/edit.vue` | 编辑用户：Drawer 抽屉表单 |
| `pages/system/role/list.vue` | 角色列表 |
| `pages/system/role/add.vue` | 新建角色 |
| `pages/system/role/edit.vue` | 编辑角色 |
| `pages/system/menu/list.vue` | 菜单列表（树形表格） |
| `pages/system/menu/add.vue` | 新建菜单 |
| `pages/system/menu/edit.vue` | 编辑菜单 |
| `pages/system/permission/list.vue` | 权限列表 |
| `pages/system/permission/add.vue` | 新建权限 |
| `pages/system/permission/edit.vue` | 编辑权限 |
| `pages/system/tag/list.vue` | 标签管理 |
| `pages/system/tag/add.vue` | 新建标签 |
| `pages/system/tag/edit.vue` | 编辑标签 |

#### Phase 3 — 统计模块（第 3 周）
| 页面 | 改造内容 |
|---|---|
| `pages/uni-stat/device/overview/` | 设备概览 |
| `pages/uni-stat/user/overview/` | 用户概览 |
| `pages/uni-stat/channel/` | 渠道分析 |
| `pages/uni-stat/scene/` | 场景分析 |
| `pages/uni-stat/event/` | 事件分析 |
| `pages/uni-stat/page-content/` | 页面分析 |
| `pages/uni-stat/page-res/` | 页面资源 |
| `pages/uni-stat/page-ent/` | 页面入口 |
| `pages/uni-stat/error/` | 错误分析 |
| `pages/uni-stat/pay-order/` | 支付订单 |

#### Phase 4 — 其他页面 + 交互打磨（第 4 周）
| 页面 | 改造内容 |
|---|---|
| `pages/system/app/` | 应用管理 |
| `pages/system/safety/` | 安全审计 |
| `pages/demo/` | 功能演示 |
| 全局 | 骨架屏替换 loading spinner |
| 全局 | 空状态插画 |
| 全局 | Toast 通知系统 |
| 全局 | 深色模式精调 |

## 实施原则

### 渐进式改造
- 每个 Phase 独立可交付、可验证
- 新组件先建后用，不破坏现有功能
- 旧页面改造时保持数据逻辑不变，只改模板和样式

### 样式规范
- 新页面/新组件：全面使用 CSS Variables
- 旧页面改造：逐步替换硬编码颜色为 CSS Variables
- 不搞全局覆盖层，组件样式自包含
- 间距用 4px 网格（`--space-1` = 4px, `--space-2` = 8px, ...）
- 颜色只用 Token，不写 hex

### 测试验证
- 每个 Phase 完成后：浏览器验证亮色/暗色模式
- 重点检查：表格可读性、表单交互、弹窗层级、侧栏折叠
- H5 专属：检查响应式（768px / 1024px 断点）
