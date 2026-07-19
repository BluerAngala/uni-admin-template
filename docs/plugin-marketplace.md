# uni-admin Modern UI

基于 [DCloud 官方 uni-admin](https://github.com/dcloudio/uni-admin) 二次开发的现代化管理后台模板。

## 📸 预览

| 浅色模式 | 暗色模式 |
|---------|---------|
| 暖白色调，柔和阴影 | 毛玻璃深色主题 |

## ✨ 特性

### 🎨 视觉升级

- **暖白浅色主题** — 告别冷灰，采用暖米色调（`#faf9f7`），视觉更舒适
- **毛玻璃暗色主题** — `backdrop-filter` 半透明模糊效果，紫蓝渐变背景
- **跟随系统** — 自动监听 `prefers-color-scheme`，无缝切换
- **CSS Variables 驱动** — 全部颜色走语义化 Token，一键切换主题
- **现代化圆角** — 按钮/卡片/输入框/弹窗统一 8-16px 圆角
- **柔和阴影** — 多层叠加阴影，告别生硬边框

### 🧩 新增通用组件（6 个）

| 组件 | 说明 |
|------|------|
| `app-card` | 通用卡片容器（圆角、阴影、hover 动效） |
| `app-stat-card` | 统计数字卡片（标签 + 数字 + 趋势箭头） |
| `app-empty` | 空状态展示（插画 + 引导文案） |
| `app-skeleton` | 骨架屏（text / title / card / row 四种变体） |
| `app-toast` | 轻提示（自动消失，支持 info / success / warning / error） |
| `app-badge` | 状态徽章（圆角药丸，语义色） |

### 📐 布局重构

- **顶栏** — 高度 56px（原 60px），Logo + 用户头像 + 主题/语言切换
- **侧栏** — 紧凑菜单项 36px，圆角 6px，激活态高亮
- **Dashboard** — 欢迎区域 + 概览统计卡片 + 骨架屏加载
- **404 页面** — 现代设计 + 返回首页按钮

### 🌗 主题系统

```
styles/design-system/
├── _themes.scss    ← 浅色 / 暗色 CSS Variables 完整映射
├── _tokens.scss    ← 主题无关 Token（间距、圆角、阴影、字体）
├── _base.scss      ← 全局 reset + 滚动条 + 焦点样式 + 毛玻璃
└── index.scss      ← 入口文件
```

**切换方式：** 通过 `data-theme="default"` / `data-theme="dark"` 属性运行时切换，无需刷新页面。

### 🤖 AI 开发规范

内置完整的 AI 辅助开发配置：

- `AGENTS.md` — 仓库指南（禁忌、场景文档索引、通用速查）
- `docs/ai-agent-docs/` — 场景化开发文档：
  - `page-dev.md` — 页面开发规范
  - `cloud-dev.md` — 云函数开发规范
  - `style-dev.md` — 样式与主题开发规范
  - `admin-dev.md` — 系统管理功能规范
  - `architecture.md` — 项目架构总览
  - `references.md` — 官方文档链接

适配 Cursor / Claude / Trae 等 AI 编码工具，开箱即用。

## 🗂 项目结构

```
├── App.vue                    # 应用入口
├── main.js                    # Vue 实例
├── uni.scss                   # 全局 SCSS 变量 + 主题映射
├── admin.config.js            # 中心配置（URL、菜单）
├── pages.json                 # 路由 + 窗口布局
├── styles/design-system/      # 设计系统 Token
├── common/                    # 全局样式
│   ├── theme.scss             # uni-ui 主题兼容层
│   └── uni.css                # 全局布局与组件样式
├── components/                # 通用组件
│   ├── app-card/              # 卡片
│   ├── app-stat-card/         # 统计卡片
│   ├── app-skeleton/          # 骨架屏
│   ├── app-toast/             # 轻提示
│   ├── app-badge/             # 徽章
│   └── app-empty/             # 空状态
├── windows/                   # 布局窗口
│   ├── topWindow.vue          # 顶部导航栏
│   └── leftWindow.vue         # 左侧菜单栏
├── pages/                     # 页面
│   ├── index/                 # Dashboard
│   ├── system/                # 系统管理（用户/角色/权限/菜单/应用/标签）
│   ├── uni-stat/              # uni 统计
│   └── demo/                  # 功能演示
├── docs/ai-agent-docs/        # AI 开发文档
└── store/                     # Vuex 状态管理
```

## 🚀 快速开始

### 环境要求

- [HBuilderX](https://www.dcloud.io/hbuilderx.html) 3.6.0+
- uni-app 4.36+
- uniCloud（阿里云或腾讯云）

### 使用方式

1. 在 HBuilderX 插件市场导入本项目
2. 关联 uniCloud 云空间
3. 上传部署云函数
4. 运行到浏览器或模拟器

## 🎯 主题自定义

### 修改色板

编辑 `styles/design-system/_themes.scss`：

```scss
:root,
[data-theme='default'] {
  --color-accent: #635bff;        // 强调色
  --color-bg-primary: #faf9f7;    // 主背景
  --color-text-primary: #1a1a1a;  // 主文字
  // ...
}

[data-theme='dark'] {
  --color-accent: #8178ff;
  --color-bg-primary: #08080f;
  // ...
}
```

### 添加新主题

1. 在 `uni.scss` 的 `$themes` map 中添加新主题色值
2. 在 `_themes.scss` 中添加对应的 `[data-theme='xxx']` 选择器
3. 在 `admin.config.js` 的 `themes` 数组中注册主题选项

## 📋 更新日志

### v2.7.0（当前版本）

- 🎨 浅色模式改为暖白色调，告别冷灰
- 🌙 暗色模式毛玻璃效果（backdrop-filter）
- 🧩 新增 6 个通用组件
- 📐 顶栏/侧栏/Dashboard 全面重写
- 🎯 全部硬编码颜色替换为 CSS Variables
- 📦 表格加载遮罩改为半透明暖白色
- 🤖 内置 AI 开发规范文档

### v2.6.2（官方原版）

- 基于 uni-app + uniCloud 的管理后台框架
- 系统管理（用户/角色/权限/菜单/应用/标签）
- uni-stat 数据统计分析
- i18n 国际化（简中/繁中/英文）

## 📄 许可证

MIT License

## 🔗 相关链接

- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [uniCloud 官方文档](https://uniapp.dcloud.net.cn/uniCloud/)
- [uni-admin 官方仓库](https://github.com/dcloudio/uni-admin)
- [DCloud 插件市场](https://ext.dcloud.net.cn/)
