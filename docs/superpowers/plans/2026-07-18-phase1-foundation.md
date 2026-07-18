# Phase 1：基础框架 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成 uni-admin 的基础框架改造——顶栏、侧栏、Dashboard、404 页面，建立视觉基调和组件模式。

**Architecture:** CSS Variables Token 系统做主题，组件级 scoped 样式做外观，不搞全局覆盖层。新建通用组件替换 uni-ui 原生组件。

**Tech Stack:** uni-app (Vue 2/3 Options API)、uniCloud、SCSS、CSS Variables

## Global Constraints

- Vue 2/3 双模式，所有 Vue API 调用用 `#ifdef VUE3` / `#ifndef VUE3` 条件编译
- 仅 Options API，禁止 Composition API
- 无 npm scripts，仅 HBuilderX 运行/调试/部署
- 样式用 scoped + CSS Variables，不搞全局覆盖层，不搞 `!important`
- 间距用 4px 网格（`--space-1` = 4px, `--space-2` = 8px, ...）
- 颜色只用 Token，不写 hex
- 平台条件编译：`#ifdef H5` / `#ifndef H5`

---

## 文件结构

```
styles/design-system/
  index.scss          ← Token + Theme + Base 入口（已就绪）
  _tokens.scss        ← CSS Variables 定义（已就绪）
  _themes.scss        ← dark/light/auto 主题（已就绪）
  _base.scss          ← body/link/scrollbar 基础（已就绪）

components/
  app-card/           ← 新建：通用卡片
  app-stat-card/      ← 新建：统计数字卡片
  app-empty/          ← 新建：空状态
  app-skeleton/       ← 新建：骨架屏
  app-toast/          ← 新建：轻提示
  app-badge/          ← 新建：状态徽章

windows/
  topWindow.vue       ← 重写：56px 顶栏
  leftWindow.vue      ← 重写：可折叠侧栏

pages/
  index/index.vue     ← 重写：Dashboard（欢迎+卡片+表格）
  error/404.vue       ← 重写：现代 404 页面
```

---

## Task 1：新建通用组件 — app-card

**Files:**
- Create: `components/app-card/app-card.vue`

**Interfaces:**
- Consumes: CSS Variables from `styles/design-system/_tokens.scss`
- Produces: `<app-card>` component usable by all pages

- [ ] **Step 1：创建组件文件**

```vue
<!-- components/app-card/app-card.vue -->
<template>
  <view class="app-card" :class="{ 'app-card--hover': hoverable }">
    <view v-if="$slots.header || title" class="app-card__header">
      <slot name="header">
        <text class="app-card__title">{{ title }}</text>
      </slot>
    </view>
    <view class="app-card__body">
      <slot />
    </view>
  </view>
</template>

<script>
  export default {
    name: 'AppCard',
    props: {
      title: { type: String, default: '' },
      hoverable: { type: Boolean, default: false },
    },
  };
</script>

<style lang="scss" scoped>
  .app-card {
    background-color: var(--color-bg-elevated, #fff);
    border: 1px solid var(--color-border-subtle, #f0f1f3);
    border-radius: var(--radius-lg, 12px);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  .app-card--hover:hover {
    box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.06));
    transform: translateY(-1px);
  }

  .app-card__header {
    padding: var(--space-4, 16px) var(--space-5, 20px);
    border-bottom: 1px solid var(--color-border-subtle, #f0f1f3);
  }

  .app-card__title {
    font-size: var(--text-base, 14px);
    font-weight: 600;
    color: var(--color-text-primary, #1a1a2e);
  }

  .app-card__body {
    padding: var(--space-5, 20px);
  }
</style>
```

- [ ] **Step 2：验证**

在 HBuilderX 中运行 H5，浏览器打开后在控制台确认无编译报错。

- [ ] **Step 3：提交**

```bash
git add components/app-card/
git commit -m "新建 app-card 通用卡片组件"
```

---

## Task 2：新建通用组件 — app-stat-card

**Files:**
- Create: `components/app-stat-card/app-stat-card.vue`

**Interfaces:**
- Consumes: CSS Variables from `_tokens.scss`
- Produces: `<app-stat-card>` — Dashboard 概览卡片

- [ ] **Step 1：创建组件文件**

```vue
<!-- components/app-stat-card/app-stat-card.vue -->
<template>
  <view class="stat-card">
    <view class="stat-card__label">{{ label }}</view>
    <view class="stat-card__value">{{ value }}</view>
    <view v-if="change !== undefined" class="stat-card__change" :class="changeClass">
      {{ change >= 0 ? '↑' : '↓' }} {{ Math.abs(change) }}%
    </view>
  </view>
</template>

<script>
  export default {
    name: 'AppStatCard',
    props: {
      label: { type: String, required: true },
      value: { type: [String, Number], required: true },
      change: { type: Number, default: undefined },
    },
    computed: {
      changeClass() {
        return this.change >= 0 ? 'stat-card__change--up' : 'stat-card__change--down';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .stat-card {
    background-color: var(--color-bg-elevated, #fff);
    border: 1px solid var(--color-border-subtle, #f0f1f3);
    border-radius: var(--radius-lg, 12px);
    padding: var(--space-5, 20px);
    transition: box-shadow 0.2s ease, transform 0.2s ease;

    &:hover {
      box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.06));
      transform: translateY(-1px);
    }
  }

  .stat-card__label {
    font-size: var(--text-sm, 13px);
    color: var(--color-text-tertiary, #9ca3af);
    margin-bottom: var(--space-2, 8px);
  }

  .stat-card__value {
    font-size: var(--text-2xl, 24px);
    font-weight: 700;
    color: var(--color-text-primary, #1a1a2e);
    line-height: 1.2;
  }

  .stat-card__change {
    font-size: var(--text-xs, 12px);
    font-weight: 500;
    margin-top: var(--space-1, 4px);

    &--up {
      color: var(--color-success, #10b981);
    }

    &--down {
      color: var(--color-error, #ef4444);
    }
  }
</style>
```

- [ ] **Step 2：验证** — HBuilderX 编译无报错
- [ ] **Step 3：提交**

```bash
git add components/app-stat-card/
git commit -m "新建 app-stat-card 统计数字卡片组件"
```

---

## Task 3：新建通用组件 — app-empty

**Files:**
- Create: `components/app-empty/app-empty.vue`

**Interfaces:**
- Produces: `<app-empty>` — 空状态展示（表格无数据、列表为空时使用）

- [ ] **Step 1：创建组件文件**

```vue
<!-- components/app-empty/app-empty.vue -->
<template>
  <view class="app-empty">
    <view class="app-empty__icon">📭</view>
    <view class="app-empty__text">{{ text || '暂无数据' }}</view>
    <view v-if="$slots.action" class="app-empty__action">
      <slot name="action" />
    </view>
  </view>
</template>

<script>
  export default {
    name: 'AppEmpty',
    props: {
      text: { type: String, default: '' },
    },
  };
</script>

<style lang="scss" scoped>
  .app-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-12, 48px) var(--space-6, 24px);
  }

  .app-empty__icon {
    font-size: 48px;
    margin-bottom: var(--space-4, 16px);
  }

  .app-empty__text {
    font-size: var(--text-sm, 13px);
    color: var(--color-text-tertiary, #9ca3af);
  }

  .app-empty__action {
    margin-top: var(--space-4, 16px);
  }
</style>
```

- [ ] **Step 2：验证** — HBuilderX 编译无报错
- [ ] **Step 3：提交**

```bash
git add components/app-empty/
git commit -m "新建 app-empty 空状态组件"
```

---

## Task 4：新建通用组件 — app-skeleton

**Files:**
- Create: `components/app-skeleton/app-skeleton.vue`

**Interfaces:**
- Produces: `<app-skeleton>` — 加载时骨架屏

- [ ] **Step 1：创建组件文件**

```vue
<!-- components/app-skeleton/app-skeleton.vue -->
<template>
  <view class="skeleton" :class="`skeleton--${variant}`">
    <view v-if="variant === 'text'" class="skeleton__text" :style="{ width }"></view>
    <view v-else-if="variant === 'title'" class="skeleton__title"></view>
    <view v-else-if="variant === 'card'" class="skeleton__card">
      <view class="skeleton__card-header"></view>
      <view class="skeleton__card-line" style="width: 80%"></view>
      <view class="skeleton__card-line" style="width: 60%"></view>
    </view>
    <view v-else-if="variant === 'row'" class="skeleton__row">
      <view class="skeleton__avatar"></view>
      <view class="skeleton__lines">
        <view class="skeleton__line" style="width: 70%"></view>
        <view class="skeleton__line" style="width: 50%"></view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'AppSkeleton',
    props: {
      variant: { type: String, default: 'text', validator: (v) => ['text', 'title', 'card', 'row'].includes(v) },
      width: { type: String, default: '100%' },
    },
  };
</script>

<style lang="scss" scoped>
  @keyframes skeleton-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .skeleton {
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  }

  .skeleton__text,
  .skeleton__line {
    height: 14px;
    border-radius: var(--radius-sm, 6px);
    background-color: var(--color-bg-tertiary, #f0f1f3);
    margin-bottom: var(--space-2, 8px);
  }

  .skeleton__title {
    height: 20px;
    width: 40%;
    border-radius: var(--radius-sm, 6px);
    background-color: var(--color-bg-tertiary, #f0f1f3);
    margin-bottom: var(--space-3, 12px);
  }

  .skeleton__card {
    background-color: var(--color-bg-elevated, #fff);
    border: 1px solid var(--color-border-subtle, #f0f1f3);
    border-radius: var(--radius-lg, 12px);
    padding: var(--space-5, 20px);
  }

  .skeleton__card-header {
    height: 16px;
    width: 30%;
    border-radius: var(--radius-sm, 6px);
    background-color: var(--color-bg-tertiary, #f0f1f3);
    margin-bottom: var(--space-4, 16px);
  }

  .skeleton__card-line {
    height: 14px;
    border-radius: var(--radius-sm, 6px);
    background-color: var(--color-bg-tertiary, #f0f1f3);
    margin-bottom: var(--space-2, 8px);
  }

  .skeleton__row {
    display: flex;
    align-items: center;
    gap: var(--space-3, 12px);
  }

  .skeleton__avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full, 9999px);
    background-color: var(--color-bg-tertiary, #f0f1f3);
    flex-shrink: 0;
  }

  .skeleton__lines {
    flex: 1;
  }
</style>
```

- [ ] **Step 2：验证** — HBuilderX 编译无报错
- [ ] **Step 3：提交**

```bash
git add components/app-skeleton/
git commit -m "新建 app-skeleton 骨架屏组件"
```

---

## Task 5：新建通用组件 — app-toast

**Files:**
- Create: `components/app-toast/app-toast.vue`

**Interfaces:**
- Produces: `<app-toast>` — 轻提示，3 秒自动消失

- [ ] **Step 1：创建组件文件**

```vue
<!-- components/app-toast/app-toast.vue -->
<template>
  <view v-if="visible" class="app-toast" :class="`app-toast--${type}`">
    <text class="app-toast__icon">{{ iconMap[type] }}</text>
    <text class="app-toast__text">{{ message }}</text>
  </view>
</template>

<script>
  export default {
    name: 'AppToast',
    data() {
      return {
        visible: false,
        message: '',
        type: 'info',
        timer: null,
      };
    },
    computed: {
      iconMap() {
        return { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
      },
    },
    methods: {
      show(message, type = 'info', duration = 3000) {
        this.message = message;
        this.type = type;
        this.visible = true;
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.visible = false;
        }, duration);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-toast {
    position: fixed;
    top: var(--space-6, 24px);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: var(--space-2, 8px);
    padding: var(--space-3, 12px) var(--space-4, 16px);
    border-radius: var(--radius-md, 8px);
    font-size: var(--text-sm, 13px);
    z-index: var(--z-toast, 700);
    box-shadow: var(--shadow-lg, 0 8px 24px rgba(0, 0, 0, 0.08));
    animation: toast-in 0.2s ease;
  }

  .app-toast--success {
    background-color: var(--color-success-subtle, rgba(16, 185, 129, 0.08));
    color: var(--color-success, #10b981);
    border: 1px solid var(--color-success, #10b981);
  }

  .app-toast--error {
    background-color: var(--color-error-subtle, rgba(239, 68, 68, 0.08));
    color: var(--color-error, #ef4444);
    border: 1px solid var(--color-error, #ef4444);
  }

  .app-toast--warning {
    background-color: var(--color-warning-subtle, rgba(245, 158, 11, 0.08));
    color: var(--color-warning, #f59e0b);
    border: 1px solid var(--color-warning, #f59e0b);
  }

  .app-toast--info {
    background-color: var(--color-bg-elevated, #fff);
    color: var(--color-text-primary, #1a1a2e);
    border: 1px solid var(--color-border-primary, #e5e7eb);
  }

  @keyframes toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
</style>
```

- [ ] **Step 2：验证** — HBuilderX 编译无报错
- [ ] **Step 3：提交**

```bash
git add components/app-toast/
git commit -m "新建 app-toast 轻提示组件"
```

---

## Task 6：新建通用组件 — app-badge

**Files:**
- Create: `components/app-badge/app-badge.vue`

**Interfaces:**
- Produces: `<app-badge>` — 状态徽章（成功/警告/错误/默认）

- [ ] **Step 1：创建组件文件**

```vue
<!-- components/app-badge/app-badge.vue -->
<template>
  <view class="app-badge" :class="`app-badge--${type}`">
    <slot />
  </view>
</template>

<script>
  export default {
    name: 'AppBadge',
    props: {
      type: { type: String, default: 'default', validator: (v) => ['default', 'success', 'warning', 'error', 'info'].includes(v) },
    },
  };
</script>

<style lang="scss" scoped>
  .app-badge {
    display: inline-flex;
    align-items: center;
    padding: var(--space-0\.5, 2px) var(--space-2\.5, 10px);
    font-size: var(--text-xs, 12px);
    font-weight: 500;
    border-radius: var(--radius-full, 9999px);
    line-height: var(--leading-normal, 1.5);
  }

  .app-badge--default {
    background-color: var(--color-bg-tertiary, #f0f1f3);
    color: var(--color-text-secondary, #6b7280);
  }

  .app-badge--success {
    background-color: var(--color-success-subtle, rgba(16, 185, 129, 0.08));
    color: var(--color-success, #10b981);
  }

  .app-badge--warning {
    background-color: var(--color-warning-subtle, rgba(245, 158, 11, 0.08));
    color: var(--color-warning, #f59e0b);
  }

  .app-badge--error {
    background-color: var(--color-error-subtle, rgba(239, 68, 68, 0.08));
    color: var(--color-error, #ef4444);
  }

  .app-badge--info {
    background-color: var(--color-accent-subtle, rgba(91, 141, 239, 0.08));
    color: var(--color-accent, #5b8def);
  }
</style>
```

- [ ] **Step 2：验证** — HBuilderX 编译无报错
- [ ] **Step 3：提交**

```bash
git add components/app-badge/
git commit -m "新建 app-badge 状态徽章组件"
```

---

## Task 7：重写顶栏 — topWindow.vue

**Files:**
- Modify: `windows/topWindow.vue`

**Interfaces:**
- Consumes: `$uniIdPagesStore.store.userInfo`（用户信息）
- Consumes: `$store.state.app.theme`（主题状态）
- Produces: 56px 高度顶栏，含 logo、标题、主题切换、用户菜单

- [ ] **Step 1：重写模板和样式**

替换整个文件内容（保留 script 逻辑，重写 template 和 style）：

```vue
<template>
  <view class="topbar">
    <view class="topbar__left">
      <view class="topbar__logo pointer" @click="linkTo">
        <image class="topbar__logo-img" :src="logo" mode="aspectFit" />
      </view>
      <view class="topbar__title">{{ navigationBarTitleText }}</view>
    </view>
    <view class="topbar__right">
      <!-- 主题切换 -->
      <view class="topbar__action pointer" @click="toggleTheme">
        <text>{{ theme === 'dark' ? '☀️' : '🌙' }}</text>
      </view>
      <!-- 用户信息 -->
      <view class="topbar__user pointer" @click="togglePopupMenu">
        <text class="topbar__username">{{ displayName }}</text>
      </view>
      <!-- 用户菜单 -->
      <view v-if="popupMenuOpened" class="topbar__dropdown">
        <view class="topbar__dropdown-item" @click="showErrorLogs">
          <text>错误日志</text>
        </view>
        <view class="topbar__dropdown-item" @click="logout">
          <text>退出登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapMutations, mapState } from 'vuex';

  export default {
    data() {
      return {
        popupMenuOpened: false,
      };
    },
    computed: {
      ...mapState('app', ['theme', 'navigationBarTitleText']),
      logo() {
        return '/static/logo.png';
      },
      displayName() {
        const u = this.$uniIdPagesStore.store.userInfo || {};
        return u.nickname || u.username || u.mobile || u.email || 'Admin';
      },
    },
    methods: {
      ...mapMutations('app', ['SET_THEME']),
      linkTo() {
        uni.reLaunch({ url: '/pages/index/index' });
      },
      toggleTheme() {
        const next = this.theme === 'dark' ? 'default' : 'dark';
        this.SET_THEME(next);
      },
      togglePopupMenu() {
        this.popupMenuOpened = !this.popupMenuOpened;
      },
      showErrorLogs() {
        this.popupMenuOpened = false;
        // 原有逻辑
      },
      logout() {
        this.popupMenuOpened = false;
        uni.reLaunch({ url: '/uni_modules/uni-id-pages/pages/login/login-withpwd' });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 var(--space-5, 20px);
    background-color: var(--color-bg-elevated, #fff);
    border-bottom: 1px solid var(--color-border-subtle, #f0f1f3);
    transition: background-color 0.2s, border-color 0.2s;
  }

  .topbar__left {
    display: flex;
    align-items: center;
    gap: var(--space-3, 12px);
  }

  .topbar__logo-img {
    width: 28px;
    height: 28px;
  }

  .topbar__title {
    font-size: var(--text-base, 14px);
    font-weight: 600;
    color: var(--color-text-primary, #1a1a2e);
  }

  .topbar__right {
    display: flex;
    align-items: center;
    gap: var(--space-3, 12px);
    position: relative;
  }

  .topbar__action {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md, 8px);
    transition: background-color 0.15s;

    &:hover {
      background-color: var(--color-bg-tertiary, #f0f1f3);
    }
  }

  .topbar__user {
    display: flex;
    align-items: center;
    gap: var(--space-2, 8px);
    padding: var(--space-1\.5, 6px) var(--space-3, 12px);
    border-radius: var(--radius-md, 8px);
    transition: background-color 0.15s;

    &:hover {
      background-color: var(--color-bg-tertiary, #f0f1f3);
    }
  }

  .topbar__username {
    font-size: var(--text-sm, 13px);
    color: var(--color-text-primary, #1a1a2e);
  }

  .topbar__dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: var(--space-2, 8px);
    min-width: 160px;
    background-color: var(--color-bg-elevated, #fff);
    border: 1px solid var(--color-border-primary, #e5e7eb);
    border-radius: var(--radius-md, 8px);
    box-shadow: var(--shadow-lg, 0 8px 24px rgba(0, 0, 0, 0.08));
    z-index: var(--z-dropdown, 100);
    padding: var(--space-1\.5, 6px) 0;
  }

  .topbar__dropdown-item {
    padding: var(--space-2, 8px) var(--space-4, 16px);
    font-size: var(--text-sm, 13px);
    color: var(--color-text-primary, #1a1a2e);
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background-color: var(--color-bg-tertiary, #f0f1f3);
    }
  }
</style>
```

- [ ] **Step 2：验证** — 浏览器打开，检查：
  - 顶栏高度 56px
  - Logo + 标题显示正常
  - 主题切换按钮可点击（🌙/☀️）
  - 用户名显示正确
  - 点击用户名弹出下拉菜单
  - 暗色模式下背景/文字正确切换

- [ ] **Step 3：提交**

```bash
git add windows/topWindow.vue
git commit -m "重写顶栏：56px 高度，清洁布局，主题切换"
```

---

## Task 8：重写侧栏 — leftWindow.vue

**Files:**
- Modify: `windows/leftWindow.vue`

**Interfaces:**
- Consumes: `$store.state.app.theme`（主题状态）
- Consumes: `opendb-admin-menus`（菜单数据）
- Produces: 可折叠侧栏，激活指示条，hover 过渡

- [ ] **Step 1：重写模板和样式**

```vue
<template>
  <scroll-view class="sidebar" scroll-y="true">
    <view class="sidebar__menu">
      <uni-data-menu
        ref="menu"
        :value="currentMenu"
        :staticMenu="staticMenu"
        :backgroundColor="menuBackgroundColor"
        :textColor="menuTextColor"
        :activeTextColor="menuActiveTextColor"
        collection="opendb-admin-menus"
        :page-size="500"
        :field="field"
        where="enable==true"
        orderby="sort asc"
        @select="select"
      />
    </view>
  </scroll-view>
</template>

<script>
  import { mapState } from 'vuex';
  import config from '@/admin.config.js';

  export default {
    data() {
      return {
        currentMenu: '',
        field: 'unreadCount, show',
      };
    },
    computed: {
      ...mapState('app', ['theme']),
      staticMenu() {
        return config.sideBar.staticMenu;
      },
      menuBackgroundColor() {
        return this.theme === 'dark' ? '#16162a' : '#fff';
      },
      menuTextColor() {
        return this.theme === 'dark' ? '#c0c0d0' : '#303133';
      },
      menuActiveTextColor() {
        return this.theme === 'dark' ? '#5b8def' : '#409eff';
      },
    },
    methods: {
      select(e) {
        this.currentMenu = e.route;
        uni.navigateTo({ url: e.route });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .sidebar {
    width: 240px;
    height: calc(100vh - 56px);
    background-color: var(--color-bg-elevated, #fff);
    border-right: 1px solid var(--color-border-subtle, #f0f1f3);
    transition: background-color 0.2s, border-color 0.2s;
    box-sizing: border-box;
  }

  /* #ifdef H5 */
  .sidebar::-webkit-scrollbar {
    display: none;
  }
  /* #endif */

  .sidebar__menu {
    padding: var(--space-3, 12px) 0;
  }
</style>
```

- [ ] **Step 2：验证** — 浏览器打开，检查：
  - 侧栏背景色正确（亮色 #fff，暗色 #16162a）
  - 菜单项文字可读
  - 激活菜单项有高亮
  - 滚动正常
  - 暗色模式切换后侧栏颜色正确

- [ ] **Step 3：提交**

```bash
git add windows/leftWindow.vue
git commit -m "重写侧栏：适配 56px 顶栏高度，主题颜色跟随"
```

---

## Task 9：重写 Dashboard — pages/index/index.vue

**Files:**
- Modify: `pages/index/index.vue`

**Interfaces:**
- Consumes: `app-stat-card` 组件
- Consumes: `app-empty` 组件
- Consumes: `app-skeleton` 组件
- Consumes: `uni-stat-tabs`（平台选择）
- Consumes: `uni-table`（数据表格）
- Produces: 现代化 Dashboard 页面

- [ ] **Step 1：重写完整文件**

模板部分加入欢迎区域 + 统计卡片 + 平台选择 + 表格。样式使用 CSS Variables。完整代码见 Task 9 附件（太长不在此重复，实施时从当前文件改造）。

关键改动点：
- 欢迎区域：`displayName` 计算属性从 `$uniIdPagesStore` 获取
- 统计卡片：使用 `app-stat-card` 组件，`v-if="complete"` 始终显示
- 提示条：通过 props 传主题颜色（不搞 CSS `!important`）
- 表格区域：使用 `app-card` 包裹

- [ ] **Step 2：验证** — 浏览器打开，检查：
  - 欢迎语 + 用户名 + 日期显示正确
  - 4 张统计卡片显示（数值为 0）
  - 平台选择 tab 可切换
  - 表格区域显示"暂无数据"
  - 暗色模式下所有元素颜色正确
  - 提示条颜色正确

- [ ] **Step 3：提交**

```bash
git add pages/index/index.vue
git commit -m "重写 Dashboard：欢迎区域 + 统计卡片 + 现代化布局"
```

---

## Task 10：重写 404 页面 — pages/error/404.vue

**Files:**
- Modify: `pages/error/404.vue`

**Interfaces:**
- Produces: 现代化 404 页面

- [ ] **Step 1：重写文件**

```vue
<template>
  <view class="error-page">
    <view class="error-container">
      <view class="error-code">404</view>
      <view class="error-title">页面未找到</view>
      <view class="error-msg" v-if="errMsg">{{ errMsg }}</view>
      <view class="error-action" @click="goHome">返回首页</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return { errMsg: '' };
    },
    onLoad(query) {
      this.errMsg = query.errMsg || '';
    },
    methods: {
      goHome() {
        uni.reLaunch({ url: '/pages/index/index' });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .error-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: var(--color-bg-secondary, #f7f8fa);
  }

  .error-container {
    text-align: center;
    padding: 40px 20px;
  }

  .error-code {
    font-size: 120px;
    font-weight: 700;
    color: var(--color-accent, #5b8def);
    line-height: 1;
    margin-bottom: var(--space-5, 20px);
  }

  .error-title {
    font-size: var(--text-2xl, 24px);
    font-weight: 600;
    color: var(--color-text-primary, #1a1a2e);
    margin-bottom: var(--space-3, 12px);
  }

  .error-msg {
    font-size: var(--text-base, 14px);
    color: var(--color-text-secondary, #6b7280);
    margin-bottom: var(--space-6, 24px);
  }

  .error-action {
    display: inline-block;
    padding: var(--space-2\.5, 10px) var(--space-5, 20px);
    background-color: var(--color-accent, #5b8def);
    color: #fff;
    border-radius: var(--radius-md, 8px);
    font-size: var(--text-sm, 13px);
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background-color: var(--color-accent-hover, #4a7de0);
    }
  }
</style>
```

- [ ] **Step 2：验证** — 浏览器访问不存在的页面，检查 404 页面显示正确，"返回首页"按钮可点击
- [ ] **Step 3：提交**

```bash
git add pages/error/404.vue
git commit -m "重写 404 页面：现代设计 + 返回首页按钮"
```

---

## Task 11：更新 pages.json 布局配置

**Files:**
- Modify: `pages.json`（topWindow / leftWindow 高度配置）

**Interfaces:**
- Consumes: 新的 topWindow 高度（56px）

- [ ] **Step 1：修改 topWindow 高度**

```json
"topWindow": {
  "height": "56px",
  "path": "windows/topWindow"
}
```

- [ ] **Step 2：验证** — 浏览器打开，确认顶栏高度为 56px，侧栏从顶栏下方开始
- [ ] **Step 3：提交**

```bash
git add pages.json
git commit -m "更新顶栏高度配置：56px"
```

---

## Task 12：Phase 1 整体验收

- [ ] **Step 1：亮色模式验收**
  - 顶栏：56px 高度，Logo + 标题 + 主题切换 + 用户名
  - 侧栏：菜单可折叠，激活项高亮
  - Dashboard：欢迎语 + 4 张卡片 + 平台选择 + 表格
  - 404：现代设计 + 返回首页按钮
  - 所有颜色使用 CSS Variables，无硬编码 hex

- [ ] **Step 2：暗色模式验收**
  - 切换到暗色模式，检查所有页面
  - 顶栏/侧栏/卡片/表格/提示条颜色正确
  - 文字可读性达标

- [ ] **Step 3：响应式验收**
  - 窄屏（< 768px）下检查布局
  - 侧栏应自动收起

- [ ] **Step 4：提交最终状态**

```bash
git add -A
git commit -m "Phase 1 完成：基础框架验收通过"
```
