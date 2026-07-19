# 更新日志

## v2.7.0（当前版本）

### 🎨 视觉升级

- 浅色模式改为暖白色调（`#faf9f7`），告别冷灰
- 暗色模式毛玻璃效果（`backdrop-filter` + 半透明渐变背景）
- 表格加载遮罩从黑色改为半透明暖白色
- 表格选择框在浅色/暗色模式下边框可见度提升
- 全部阴影从紫色调改为中性色调，更自然

### 🌗 主题系统

- 新增「跟随系统」主题选项，自动监听 `prefers-color-scheme`
- 移除 `green` 主题，仅保留 `default` / `dark` / `auto`
- CSS Variables 完整覆盖：背景、文字、边框、阴影、菜单、表格、表单
- `data-theme` 属性运行时切换，无需刷新页面

### 🧩 新增通用组件（6 个）

- `app-card` — 通用卡片容器（圆角、阴影、hover 动效）
- `app-stat-card` — 统计数字卡片（标签 + 数字 + 趋势箭头）
- `app-empty` — 空状态展示（插画 + 引导文案）
- `app-skeleton` — 骨架屏（text / title / card / row 四种变体）
- `app-toast` — 轻提示（自动消失，info / success / warning / error）
- `app-badge` — 状态徽章（圆角药丸，语义色）

### 📐 布局重构

- 顶栏高度 60px → 56px，Logo 迁移至顶栏
- 侧栏菜单项 56px → 36px，圆角 6px，紧凑间距
- Dashboard 新增欢迎区域 + 概览统计卡片 + 骨架屏加载
- 404 页面重写：现代设计 + 返回首页按钮
- 侧栏收起状态持久化

### 🎯 样式现代化

- 全部硬编码颜色替换为 CSS Variables（含 fallback）
- 全局样式重写：按钮/输入框/表格/弹窗/分页统一圆角 8px
- 输入框 focus 蓝色光环，按钮 hover 动效 + active 缩放
- 容器间距 15px → 24px，增加呼吸感
- 字体加入 Inter / SF Pro Display

### 🤖 AI 开发规范

- 新增 `AGENTS.md` 仓库指南
- 新增 `docs/ai-agent-docs/` 场景化开发文档（页面/云函数/样式/管理/架构）
- 适配 Cursor / Claude / Trae 等 AI 编码工具

### 🔧 构建与兼容

- `vue.config.js` 迁移至 `vite.config.js`
- 条件编译保护（`#ifdef H5` / `#ifndef H5`）
- 修复 SCSS import 路径与文件扩展名问题
- 修复 `App.vue` 孤立的 `#endif` 条件编译指令

---

## v2.6.2（官方原版）

- 基于 uni-app（Vue 2/3 双模式）+ uniCloud 的管理后台框架
- 系统管理：用户 / 角色 / 权限 / 菜单 / 应用 / 标签 CRUD
- uni-stat 数据统计分析模块
- 动态菜单 + 多窗口布局（topWindow / leftWindow / content）
- 主题切换（默认蓝 / 绿）
- i18n 国际化（简中 / 繁中 / 英文）
