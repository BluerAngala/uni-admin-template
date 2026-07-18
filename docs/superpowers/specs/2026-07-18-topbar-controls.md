# 顶部栏控制重构规格

## 状态
已确认。

## 目标
优化 uni-admin 顶部栏的品牌、导航、主题和语言控制。保留现有登录、用户菜单、错误日志、修改密码、语言持久化及 H5/移动端窗口行为。

## 交互契约

### 左侧品牌与侧栏

- 顶部栏左侧显示 `admin.config.js` 中 `navBar.logo` 与 `appName`，缺少 `appName` 时显示 `uni-admin`。
- 菜单按钮仅切换侧栏状态。
- 桌面大于等于 768px：状态保存为 `expanded` 或 `collapsed`。展开宽度为 240px，收起宽度为 72px，收起时保留 logo、菜单图标和可访问导航。
- 小于 768px：沿用 `uni.showLeftWindow()` / `uni.hideLeftWindow()` 抽屉行为，不保存桌面收起状态。
- `app/sideBarCollapsed` 作为 Shell 状态，存储键为 `uni-admin-sidebar-collapsed`。

### 主题

- 仅保留三个选项：浅色 `default`、暗色 `dark`、跟随系统 `auto`。
- 从 `admin.config.js` 删除 `green` 主题；从 `uni.scss` 删除 green 主题 map。
- 顶部栏以三个紧凑按钮直接选择主题，而非额外主题下拉。当前项通过按钮底色与图标颜色表示。
- 所有主题选择仍调用既有 `SET_THEME`，继续持久化到 `uni-admin-theme`。

### 语言

- 恢复独立语言按钮和下拉菜单。
- 菜单显示 `admin.config.js` 的 `langs`，当前语言显示选中状态。
- 复用现有 `changeLanguage()`，继续使用 `this.$i18n.locale` 与 `uni.setLocale()`。
- 语言、用户、主题菜单互斥。

## 不变量

- Vue 3 Options API，保留项目的 Vue 2 条件编译块。
- 使用 uni-app 标签与 API。
- 不改变现有路由、用户数据、登录、语言数据或主题存储键。
- 不使用 emoji 作为 UI 图标；图标使用 `uni-icons`。
- 样式只使用语义 token，支持 default、dark 和 auto。

## 验收

- 顶部栏显示 logo 与应用名；按钮切换 240px 和 72px 侧栏。
- 浅色、暗色、跟随系统三个主题可单击切换；green 不再存在于配置和主题 map。
- 简体、繁体、英文入口可见，点击后 UI 文案更新且菜单关闭。
- 用户、语言菜单不会重叠；移动端菜单按钮仍能打开/关闭左侧抽屉。
- H5 控制台无错误，Vue 3 SFC 模板编译无错误。
