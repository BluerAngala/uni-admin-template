# uni-admin 覆盖层设计系统

**日期：** 2026-07-18
**状态：** 已确认
**范围：** 核心框架优先（token + 布局），页面组件后续逐步覆盖

## 背景

uni-admin 官方框架样式存在以下问题：
- `$themes` SCSS map 与硬编码 SCSS 变量并存，无统一 token 体系
- 组件内混用两种变量引用方式，暗色模式只能靠逐组件覆盖
- 颜色、间距、圆角、阴影无设计规范，视觉一致性差

**决策：** 采用覆盖层设计系统方案，不动官方组件源码，通过独立的 CSS 变量体系 + 选择器优先级覆盖实现视觉升级。

**约束：** 偶尔同步官方关键更新，覆盖层必须与原代码隔离。

## 设计 Token 体系

### 三层结构

所有视觉决策收敛为 CSS Custom Properties，组件只引用变量，不写死值。

#### 第一层：原始色板（不直接用于 UI）

```scss
--palette-blue-50:  #eff6ff;   --palette-blue-100: #dbeafe;
--palette-blue-400: #60a5fa;   --palette-blue-500: #5b8def;
--palette-blue-600: #4a7de0;   --palette-blue-700: #3b6dd0;

--palette-gray-50:  #f9fafb;   --palette-gray-100: #f3f4f6;
--palette-gray-200: #e5e7eb;   --palette-gray-300: #d1d5db;
--palette-gray-400: #9ca3af;   --palette-gray-500: #6b7280;
--palette-gray-600: #4b5563;   --palette-gray-700: #374151;
--palette-gray-800: #1f2937;   --palette-gray-900: #111827;

--palette-green-500: #10b981;  --palette-yellow-500: #f59e0b;
--palette-red-500:   #ef4444;
```

#### 第二层：语义 Token（主题切换层）

**Light 主题默认值，dark 主题通过 `[data-theme="dark"]` 覆盖。**

```scss
// 背景
--color-bg-primary:    #ffffff;     // dark: #0f0f1a
--color-bg-secondary:  #f7f8fa;     // dark: #16162a
--color-bg-tertiary:   #f0f1f3;     // dark: #1e1e32
--color-bg-elevated:   #ffffff;     // dark: #1a1a2e

// 文字
--color-text-primary:  #1a1a2e;     // dark: #e8e8f0
--color-text-secondary:#6b7280;     // dark: #9e9eb0
--color-text-tertiary: #9ca3af;     // dark: #6b7290

// 边框
--color-border-primary:#e5e7eb;     // dark: #2a2a42
--color-border-subtle: #f0f1f3;     // dark: #1e1e32

// 强调色
--color-accent:        #5b8def;     // dark: #5b8def
--color-accent-hover:  #4a7de0;     // dark: #6b9df0
--color-accent-subtle: rgba(91,141,239,0.08);  // dark: rgba(91,141,239,0.12)

// 语义色
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error:   #ef4444;
```

#### 第三层：组件 Token

```scss
--btn-primary-bg:      var(--color-accent);
--btn-primary-text:    #ffffff;
--input-border:        var(--color-border-primary);
--input-focus-ring:    rgba(91,141,239,0.2);
--table-header-bg:     var(--color-bg-secondary);
--sidebar-bg:          var(--color-bg-elevated);
--topbar-bg:           var(--color-bg-elevated);
--topbar-border:       var(--color-border-primary);
--card-bg:             var(--color-bg-elevated);
--card-border:         var(--color-border-subtle);
```

### 间距（4px 基准网格）

```scss
--space-1:  4px;   --space-2:  8px;   --space-3:  12px;
--space-4:  16px;  --space-5:  20px;  --space-6:  24px;
--space-8:  32px;  --space-10: 40px;  --space-12: 48px;
```

### 圆角

```scss
--radius-sm: 6px;  --radius-md: 8px;  --radius-lg: 12px;
--radius-xl: 16px; --radius-full: 9999px;
```

### 阴影（elevation 层级）

```scss
--shadow-sm:  0 1px 2px rgba(0,0,0,0.04);
--shadow-md:  0 4px 12px rgba(0,0,0,0.06);
--shadow-lg:  0 8px 24px rgba(0,0,0,0.08);
--shadow-xl:  0 16px 48px rgba(0,0,0,0.12);
```

### 排版

```scss
--font-sans:  -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
--font-mono:  'SF Mono', 'Fira Code', 'Consolas', monospace;

--text-xs:  12px;  --text-sm:  13px;  --text-base: 14px;
--text-lg:  16px;  --text-xl:  18px;  --text-2xl:  24px;

--leading-tight: 1.25;  --leading-normal: 1.5;  --leading-relaxed: 1.75;
--tracking-tight: -0.01em;  --tracking-normal: 0;  --tracking-wide: 0.02em;
```

## 主题架构

### 切换机制

采用 CSS Custom Properties + `data-theme` 属性运行时切换，替代现有 SCSS `$themes` map 编译时方案。

```scss
// 默认（light）定义在 :root
:root {
  --color-bg-primary: #ffffff;
  --color-text-primary: #1a1a2e;
  // ...
}

// dark 主题覆盖
[data-theme="dark"] {
  --color-bg-primary: #0f0f1a;
  --color-text-primary: #e8e8f0;
  // ...
}

// auto 模式跟随系统
@media (prefers-color-scheme: dark) {
  [data-theme="auto"] {
    --color-bg-primary: #0f0f1a;
    --color-text-primary: #e8e8f0;
    // ...
  }
}
```

### 与现有代码共存

- 现有 `$themes` map 和 `$uni-text-color` 等 SCSS 变量**暂时保留不动**
- 设计系统通过 `data-theme` 属性选择器自然提升 CSS 优先级覆盖
- 不使用 `!important`，除非组件使用行内样式或极高特异性选择器
- `App.vue` 的 `SET_THEME` mutation 已写入 `data-theme`，无需修改

## 布局框架

### 侧栏（windows/leftWindow.vue）

- 背景：`var(--sidebar-bg)`
- 分隔线：`var(--color-border-subtle)` 右侧 1px border
- 菜单项 hover：`var(--color-bg-tertiary)`
- 激活项：左侧 3px accent 色指示条 + `var(--color-accent-subtle)` 背景
- 菜单折叠/展开过渡动画：`max-height 0.3s ease`
- 文字：`var(--font-sans)` + `var(--text-sm)` + `var(--color-text-secondary)`

### 顶栏（windows/topWindow.vue）

- 背景：`var(--topbar-bg)`
- 底部分隔线：`var(--topbar-border)` 1px border-bottom
- 标题文字：`var(--color-text-primary)` + `var(--text-base)`
- 右侧工具项文字：`var(--color-text-secondary)`
- 下拉菜单：`var(--shadow-lg)` + `var(--radius-md)` 圆角 + `var(--color-bg-elevated)` 背景

### 主内容区

- 背景：`var(--color-bg-primary)`
- 页面 padding：`var(--space-6)`（24px）
- 卡片容器：`var(--card-bg)` + `var(--shadow-sm)` + `var(--radius-lg)` + `var(--card-border)` 1px border
- 所有颜色/背景变化加 `transition: 0.2s ease`

## 组件覆盖策略

### 原则

1. **不动组件源码**——通过外部 CSS 选择器覆盖
2. **选择器特异性优先**——用 `[data-theme]` 属性选择器提升优先级，尽量避免 `!important`
3. **按组件拆文件**——每个组件类别一个 SCSS 文件，便于维护

### 关键组件覆盖清单

| 组件 | 覆盖文件 | 主要改动 |
|------|----------|---------|
| 按钮 | `_buttons.scss` | 圆角统一 `var(--radius-md)`、hover 阴影、primary 用 accent 色 |
| 表格 | `_tables.scss` | 表头 `var(--table-header-bg)`、行 hover 高亮、边框用 `var(--color-border-subtle)` |
| 表单 | `_forms.scss` | 输入框 border/ring 用 token、focus accent ring、placeholder 色 |
| 卡片 | `_cards.scss` | `var(--card-bg)` + `var(--shadow-sm)` + `var(--radius-lg)` |
| 弹窗 | `_modals.scss` | 遮罩、圆角、阴影层级 |
| 标签/徽章 | `_badges.scss` | 语义色用 token、pill 圆角 |
| 面包屑 | `_breadcrumbs.scss` | 文字色层级 |
| 分页器 | `_pagination.scss` | 按钮样式统一 |
| 下拉菜单 | `_dropdowns.scss` | 阴影、圆角、hover 状态 |

## 文件结构

```
styles/
  design-system/
    _index.scss            ← 总入口，按顺序 import 所有模块
    _tokens.scss           ← 所有 CSS 变量定义（色板 + 语义 + 组件 token）
    _themes.scss           ← :root / [data-theme="dark"] / @media auto 定义
    _base.scss             ← 全局 reset + 基础元素样式覆盖（body, a, hr 等）
    layout/
      _sidebar.scss        ← 侧栏样式覆盖
      _topbar.scss         ← 顶栏样式覆盖
      _content.scss        ← 主内容区样式
    components/
      _buttons.scss
      _tables.scss
      _forms.scss
      _cards.scss
      _modals.scss
      _badges.scss
      _breadcrumbs.scss
      _pagination.scss
      _dropdowns.scss
```

**App.vue 集成：** 在 `<style lang="scss">` 块顶部加 `@import '@/styles/design-system/index.scss';`

## 实施顺序

1. **Phase 1：Token 基础** — `_tokens.scss` + `_themes.scss` + `_base.scss`
2. **Phase 2：布局框架** — `_sidebar.scss` + `_topbar.scss` + `_content.scss`
3. **Phase 3：核心组件** — `_buttons.scss` + `_tables.scss` + `_forms.scss` + `_cards.scss`
4. **Phase 4：其余组件** — `_modals.scss` + `_badges.scss` + `_breadcrumbs.scss` + `_pagination.scss` + `_dropdowns.scss`
5. **Phase 5：页面级覆盖** — 逐页面审查和调整

Phase 1-2 为核心框架优先范围，Phase 3-5 后续逐步推进。

## 约束与风险

- **uni-app 限制：** 部分 uni-ui 组件使用 Shadow DOM 或 scoped style，选择器可能无法穿透。遇到时用组件自身暴露的 CSS 变量或 class 前缀处理。
- **CSS 变量兼容性：** uni-app H5 端完全支持；App 端（nvue）不支持 CSS 变量，需走 SCSS 方案。当前项目主要运行在 H5，暂不考虑 nvue。
- **体积：** 覆盖层会增加约 5-10KB CSS，可接受。
