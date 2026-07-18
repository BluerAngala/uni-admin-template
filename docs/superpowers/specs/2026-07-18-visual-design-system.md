# uni-admin 视觉设计系统规范

## 设计目标

打造一个 2025 年水准的现代化管理后台，对标 Vercel Dashboard / Linear / Ant Design Pro。
面向开发者和技术用户，简洁高效，视觉层次清晰。

---

## 1. 色彩系统

### 亮色模式 `[data-theme="default"]`

| 用途 | 变量名 | 色值 |
|---|---|---|
| 页面背景 | `--color-bg-primary` | `#ffffff` |
| 内容区背景 | `--color-bg-secondary` | `#f9fafb` |
| 输入框/悬浮背景 | `--color-bg-tertiary` | `#f3f4f6` |
| 卡片/弹窗背景 | `--color-bg-elevated` | `#ffffff` |
| 主文字 | `--color-text-primary` | `#111827` |
| 次要文字 | `--color-text-secondary` | `#6b7280` |
| 辅助文字/占位符 | `--color-text-tertiary` | `#9ca3af` |
| 反色文字 | `--color-text-inverse` | `#ffffff` |
| 主边框 | `--color-border-primary` | `#e5e7eb` |
| 次边框 | `--color-border-subtle` | `#f3f4f6` |
| 强调色 | `--color-accent` | `#3b82f6` |
| 强调色 hover | `--color-accent-hover` | `#2563eb` |
| 强调色 active | `--color-accent-active` | `#1d4ed8` |
| 强调色浅底 | `--color-accent-subtle` | `rgba(59,130,246,0.08)` |
| 成功 | `--color-success` | `#22c55e` |
| 成功浅底 | `--color-success-subtle` | `rgba(34,197,94,0.08)` |
| 警告 | `--color-warning` | `#f59e0b` |
| 警告浅底 | `--color-warning-subtle` | `rgba(245,158,11,0.08)` |
| 错误 | `--color-error` | `#ef4444` |
| 错误浅底 | `--color-error-subtle` | `rgba(239,68,68,0.08)` |
| 遮罩 | `--color-mask` | `rgba(0,0,0,0.5)` |

### 暗色模式 `[data-theme="dark"]`

| 用途 | 变量名 | 色值 |
|---|---|---|
| 页面背景 | `--color-bg-primary` | `#0a0a0b` |
| 内容区背景 | `--color-bg-secondary` | `#111113` |
| 输入框/悬浮背景 | `--color-bg-tertiary` | `#18181b` |
| 卡片/弹窗背景 | `--color-bg-elevated` | `#1c1c1f` |
| 主文字 | `--color-text-primary` | `#fafafa` |
| 次要文字 | `--color-text-secondary` | `#a1a1aa` |
| 辅助文字 | `--color-text-tertiary` | `#71717a` |
| 主边框 | `--color-border-primary` | `#27272a` |
| 次边框 | `--color-border-subtle` | `#1e1e20` |
| 强调色 | `--color-accent` | `#3b82f6` |
| 成功 | `--color-success` | `#22c55e` |
| 警告 | `--color-warning` | `#f59e0b` |
| 错误 | `--color-error` | `#ef4444` |

---

## 2. 排版

### 字体栈

```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
--font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;
```

### 字阶

| 名称 | 大小 | 行高 | 用途 |
|---|---|---|---|
| `--text-xs` | 12px | 1.5 | 标签、徽章 |
| `--text-sm` | 13px | 1.5 | 辅助文字、表格 |
| `--text-base` | 14px | 1.5 | 正文、表单 |
| `--text-lg` | 16px | 1.5 | 小标题 |
| `--text-xl` | 18px | 1.5 | 区域标题 |
| `--text-2xl` | 24px | 1.3 | 页面标题 |
| `--text-3xl` | 30px | 1.2 | 数字展示 |

### 字重

- 400: 正文
- 500: 次要强调（菜单项、按钮）
- 600: 标题（卡片标题、表格表头）
- 700: 大标题、数字

---

## 3. 间距系统（4px 网格）

| 变量 | 值 | 用途 |
|---|---|---|
| `--space-0` | 0 | - |
| `--space-1` | 4px | 紧凑间距 |
| `--space-2` | 8px | 元素内间距 |
| `--space-3` | 12px | 小组件间距 |
| `--space-4` | 16px | 标准间距 |
| `--space-5` | 20px | 区块间距 |
| `--space-6` | 24px | 页面边距 |
| `--space-8` | 32px | 大区块间距 |
| `--space-10` | 40px | 页面顶部留白 |
| `--space-12` | 48px | 空状态留白 |

---

## 4. 圆角

| 变量 | 值 | 用途 |
|---|---|---|
| `--radius-sm` | 6px | 按钮、输入框、徽章 |
| `--radius-md` | 8px | 下拉菜单、小卡片 |
| `--radius-lg` | 12px | 大卡片、弹窗、页面容器 |
| `--radius-xl` | 16px | 模态框 |
| `--radius-full` | 9999px | 药丸、头像、圆形 |

---

## 5. 阴影

| 变量 | 值 | 用途 |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | 微阴影 |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)` | 卡片悬浮 |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)` | 下拉菜单 |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06)` | 弹窗 |

---

## 6. 布局

### 页面 Shell

```
┌─────────────────────────────────────────────────────┐
│  TopBar (56px)                                       │
│  [☰] [页面标题]              [🌙] [👤 头像 Admin ▾] │
├──────────┬──────────────────────────────────────────┤
│ Sidebar  │  Content Area                            │
│ (240px)  │  padding: 24px                           │
│          │  background: var(--color-bg-secondary)   │
│  📊 首页  │                                          │
│  ▸ 系统   │  ┌─────────────────────────────────────┐│
│  ▸ 统计   │  │ Page Body                           ││
│  ▸ 审计   │  │ background: var(--color-bg-primary) ││
│          │  │ border-radius: 12px                  ││
│          │  │ box-shadow: var(--shadow-sm)         ││
│          │  └─────────────────────────────────────┘│
└──────────┴──────────────────────────────────────────┘
```

### 侧栏

- 宽度: 240px（固定）
- 菜单项高度: 36px
- 菜单项圆角: 6px
- 菜单项间距: 2px
- 菜单项 padding: 0 12px
- 激活态: 蓝色背景浅底 + 蓝色文字
- Hover: 浅灰背景过渡（0.15s）
- Logo 区域: 底部边框分隔

### 顶栏

- 高度: 56px
- 左侧: 汉堡菜单 + 页面标题
- 右侧: 错误日志 badge + 主题切换 + 用户头像下拉
- 底部边框分隔

---

## 7. 组件规范

### 按钮

| 类型 | 背景 | 文字 | 边框 | 圆角 |
|---|---|---|---|---|
| primary | `--color-accent` | #fff | 同背景 | 8px |
| default | `--color-bg-primary` | `--color-text-primary` | `--color-border-primary` | 8px |
| warn | `--color-error` | #fff | 同背景 | 8px |
| primary plain | transparent | `--color-accent` | `--color-accent` | 8px |
| mini | 同上 | 同上 | 同上 | 6px |

高度: 36px（默认）/ 28px（mini）
字号: 14px（默认）/ 12px（mini）
Hover: 深一度
Active: scale(0.98)

### 输入框

- 高度: 36px
- 圆角: 8px
- 边框: 1px solid `--color-border-primary`
- Focus: 蓝色边框 + 3px 蓝色光环
- 字号: 14px
- 占位符色: `--color-text-tertiary`

### 表格

- 表头: 背景 `--color-bg-secondary`，字号 12px，字重 600，大写
- 行高: 48px
- 行 Hover: 背景 `--color-bg-tertiary`
- 斑马纹: 奇数行 `--color-bg-secondary`
- 边框: 1px solid `--color-border-subtle`
- 圆角: 12px（容器）

### 卡片

- 背景: `--color-bg-elevated`
- 边框: 1px solid `--color-border-subtle`
- 圆角: 12px
- 阴影: `--shadow-sm`
- Hover: `--shadow-md` + translateY(-1px)
- Header: padding 16px 20px，底部边框分隔
- Body: padding 20px

### 弹窗

- 圆角: 16px
- 阴影: `--shadow-xl`
- Header: 16px 字号，600 字重，底部边框
- Footer: 顶部边框，右对齐按钮组
- 遮罩: `--color-mask`

### 空状态

- 图标: 48px emoji
- 文字: 13px `--color-text-tertiary`
- 上下留白: 48px

### 骨架屏

- 动画: pulse 1.5s infinite
- 背景: `--color-bg-tertiary`
- 圆角: 6px

### 徽章/标签

- 圆角: 9999px（药丸）
- padding: 2px 10px
- 字号: 12px
- 类型: default/success/warning/error/info

### Toast

- 位置: 顶部居中
- 圆角: 8px
- 阴影: `--shadow-lg`
- 动画: 从上滑入 0.2s

---

## 8. 交互规范

### 过渡

| 变量 | 值 | 用途 |
|---|---|---|
| `--transition-fast` | 0.15s ease | hover、focus |
| `--transition-normal` | 0.2s ease | 背景色、边框色切换 |
| `--transition-slow` | 0.3s ease | 展开/折叠 |

### Hover 效果

- 菜单项: 背景色变化
- 按钮: 深一度
- 卡片: 阴影增强 + 微上移
- 链接: 颜色变化

---

## 9. 文件结构

```
common/
  uni.css              ← 全局样式（CSS Variables 引用 + 组件覆盖）

styles/design-system/
  _themes.scss         ← CSS Variables 定义（default/dark/auto）
  _base.scss           ← body/link/scrollbar/page 全局基础
  index.scss           ← 入口

windows/
  topWindow.vue        ← 顶栏（样式在组件内）
  leftWindow.vue       ← 侧栏（样式在组件内）

components/
  app-card/            ← 通用卡片
  app-stat-card/       ← 统计卡片
  app-empty/           ← 空状态
  app-skeleton/        ← 骨架屏
  app-toast/           ← 轻提示
  app-badge/           ← 徽章
```
