# uni-admin 全量设计系统重构规格

## 状态
已确认。用户要求完整执行，不以首页或少量组件为边界。

## 目标
将 uni-admin 重构为支持亮色、暗色与跟随系统主题的现代化后台管理系统。建立统一、可复用的 UI 基础设施，随后以该体系迁移 Shell、首页、系统管理、统计、安全审计和演示模块。保留业务路由、权限、菜单数据、数据库查询与 i18n 契约。

## 背景与审计结论
当前界面由 `uni.scss`、`common/theme.scss`、`common/uni.css` 和 `styles/design-system/*` 共同控制。它们的主题和样式职责重叠：

- `styles/design-system/_themes.scss` 将 `:root` 固定为暗色玻璃风格，`[data-theme='default']` 没有亮色覆盖，因此 default 并非真实亮色主题。
- `common/uni.css` 对页面壳、按钮、输入、表面、弹窗和统计区块进行全局玻璃拟态覆盖，破坏组件本身的主题边界。
- 现有 `app-*` 组件仅覆盖卡片、统计、骨架、空态、标签和 toast，未被业务页面普遍采用，并包含 emoji 反馈图标。
- 业务页面广泛直接使用 `uni-table`、`uni-forms`、`uni-easyinput`、`uni-popup`、`uni-pagination`、`uni-notice-bar`、`uni-card`、`uni-stat-tabs`，因此这些原语必须被统一收口。

## 不变量

- 使用 uni-app 与 Vue Options API，保持 Vue 2/3 双模式。
- 使用 `view`、`text`、`image` 等 uni-app 标签；不引入 DOM API、vue-router、axios 或新 Web 框架。
- 不新增 npm scripts，验证通过 HBuilderX 运行的 H5 目标完成。
- 所有新增用户可见文本必须进入 `i18n/zh-Hans.json`、`i18n/zh-Hant.json`、`i18n/en.json`。
- 业务路由、页面地址、菜单数据、权限名称、表单字段顺序和 uniCloud 查询保持不变。
- 样式使用既有主题 map、`themeify`/`themed` 和 CSS 变量；组件中不硬编码颜色。
- 样式用 rpx 或 px，不用 rem、vh、vw。

## 设计语言

- 方向：现代运营控制台。清晰的层级、克制的表面、适中的数据密度与可感知但不干扰的反馈。
- 双主题：亮色为中性浅灰画布与白色分层表面；暗色为深石墨画布与低反射分层表面。
- 品牌强调色：一套蓝色主色贯穿交互、焦点、激活状态和主要操作。成功、警告、危险仅表达真实语义。
- 质感：细边框、轻量主题化阴影和稳定圆角。移除玻璃、全局 blur、环境光晕和渐变按钮。
- 动效：仅使用 opacity 与 transform。路由内容进入、菜单激活状态、下拉与弹窗、骨架加载、按钮 pressed 状态遵守统一节奏。`prefers-reduced-motion` 下禁用非必要动画。
- 图标：保留项目内现有 admin icon 字体或 `uni-icons`。禁止 emoji 作为 UI 图标。

## 主题契约

`theme` 保留 `default`、`dark`、`auto` 三种存储值。`auto` 解析为系统实际主题并设置 `body[data-theme]`。

主题变量按语义定义，而非按组件或视觉技巧定义：

- 画布：`--color-bg-primary`、`--color-bg-secondary`、`--color-bg-tertiary`
- 表面：`--color-surface`、`--color-surface-raised`、`--color-surface-overlay`
- 文字：`--color-text-primary`、`--color-text-secondary`、`--color-text-tertiary`、`--color-text-inverse`
- 边框与焦点：`--color-border-subtle`、`--color-border-strong`、`--color-focus-ring`
- 交互：`--color-accent`、`--color-accent-hover`、`--color-accent-active`、`--color-accent-subtle`
- 状态：`--color-success`、`--color-warning`、`--color-error` 及对应 subtle 表面
- 结构：间距、字号、行高、圆角、阴影、层级和动效变量

`uni.scss` 的 `$themes` 保持为 uni-ui 兼容层。`common/theme.scss` 负责将其映射至 uni-ui 原语。`styles/design-system/_themes.scss` 是所有 CSS 变量的唯一来源。`common/uni.css` 只保留布局兼容和通用类，不再决定主题视觉。

## 组件系统

### 页面与布局

| 单元 | 责任 |
|---|---|
| `app-page` | 页面画布与内容最大宽度、响应式内边距、进入动效 |
| `app-page-header` | 面包屑、标题、说明和操作区 |
| `app-section` | 内容区块标题、辅助说明、操作槽位与一致间距 |
| `app-surface` | standard / raised / inset 三种分层表面，取代手写卡片和 `uni-stat--x` |
| Shell | 顶栏、侧栏、主内容区和嵌入模式布局 |

### 导航

| 单元 | 责任 |
|---|---|
| 顶栏 | 侧栏控制、页面上下文、主题菜单、用户菜单、错误入口 |
| 侧栏 | 品牌区、滚动导航、展开态、紧凑态和移动端抽屉态 |
| `uni-nav-menu`、`uni-menu-item`、`uni-sub-menu`、`uni-menu-group` | 唯一菜单行为和视觉实现，active/hover/focus/disabled 状态统一 |
| `uni-stat-breadcrumb`、`uni-stat-tabs` | 页面路径和筛选导航的统一外观 |

### 输入与操作

直接主题化并保持 API 的 uni-ui 原语：原生 `button`、`uni-easyinput`、原生 `input`/`textarea`、`uni-data-select`、`uni-data-checkbox`、`switch`、`uni-datetime-picker`、`uni-file-picker`、`uni-pagination`。

统一状态：default、hover、focus-visible、active、disabled、error、loading。表单标签在控件上方或保持现有 `uni-forms-item` 标签布局，不改变字段顺序。

### 数据与反馈

| 单元 | 责任 |
|---|---|
| `app-stat-card` | 统计标题、指标、辅助对比、语义趋势和加载态 |
| `uni-table`、`uni-stat-table` | 表头、行 hover、选择、排序、筛选、空态、加载态和窄屏横向滚动 |
| `app-badge`/`uni-tag` | 统一状态语义与可读性 |
| `uni-notice-bar` | information / warning / error 提示级别与操作入口 |
| `uni-popup`、`uni-popup-dialog`、`app-toast` | 覆盖层、标题、正文、操作区、打开/关闭动效与焦点视觉 |
| `app-empty`、`app-skeleton`、qiun loading | 无数据、加载、错误状态，禁止 emoji |
| qiun charts | 由主题变量提供坐标、网格、文字和数据颜色 |

## Shell 响应式契约

- 桌面大于等于 1200px：完整 240px 侧栏与 56px 顶栏，主内容最大宽度 1440px。
- 768px 到 1199px：侧栏为紧凑态，保留菜单图标和 hover/tap 提示；主内容使用紧凑边距。
- 小于 768px：侧栏通过既有 `uni.showLeftWindow()`/`uni.hideLeftWindow()` 以抽屉展示；所有内容单列；表格允许其自身横向滚动。
- 嵌入模式：保留 `.uni-embed-hide-left` 与 `.uni-embed-hide-top` 契约，不将其耦合进页面组件。

## 实施顺序

1. 重建主题 token 和全局基础样式，移除全局 glass 规则。
2. 重构 Shell、菜单树、顶栏和响应式状态。
3. 主题化全部高频 uni-ui 原语及现有 app 反馈组件。
4. 迁移首页作为页面模板，保留全部统计查询逻辑。
5. 迁移系统管理 CRUD 页面。
6. 迁移统计、安全审计、演示及其图表、表格、筛选控件。
7. 在亮色、暗色、auto 和主要断点下进行 H5 验收。

## 验收标准

- 切换 default/dark/auto 后，画布、表面、文本、边框、表格、表单、弹窗、菜单和图表均使用对应主题，且文本与背景可读。
- 不存在 `glass-*`、`backdrop-filter`、全局环境光晕或 emoji UI 图标残留。
- 全部高频表单、表格、分页、提示、弹窗、导航组件有一致的 hover、focus、active、disabled、loading 与 empty/error 呈现。
- 原菜单路由、权限、查询、创建/编辑/删除和统计筛选行为保持可用。
- 动效只使用 transform/opacity，且在 reduced motion 下停用。
- H5 在 375px、768px、1024px、1440px 无非预期横向溢出；数据表格除外，表格需保留可滚动提示和可操作性。
