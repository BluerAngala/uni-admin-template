# 顶部栏控制重构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a branded topbar, direct three-state theme selection, language selection, and persistent desktop sidebar collapse without changing current routing or identity behavior.

**Architecture:** Vuex owns theme and desktop sidebar collapse state. The topbar renders separate theme, language, and user controls; the sidebar consumes the collapse state to change between 240px and 72px layouts. Existing uni-app H5 drawer APIs remain mobile-only behavior.

**Tech Stack:** uni-app, Vue 3 Options API, Vuex, SCSS, uni-icons.

## Global Constraints

- Preserve Vue 3 Options API and existing Vue 2 conditional compilation.
- Use uni-app tags and APIs. No DOM manipulation beyond existing H5 theme mutation.
- Retain existing routes, user menu methods, language data, theme storage behavior, and mobile drawer API calls.
- Use semantic design tokens only. No green theme, emoji UI icons, glass styles, or hardcoded visual colors.

---

### Task 1: Remove the green theme

**Files:**
- Modify: `admin.config.js`
- Modify: `uni.scss`

- [ ] Replace `navBar.themes` with exactly `{ text: '浅色', value: 'default' }`, `{ text: '暗色', value: 'dark' }`, `{ text: '跟随系统', value: 'auto' }`.
- [ ] Remove the `green` map from `$themes` in `uni.scss`.
- [ ] Verify no `green` theme option or map remains.

### Task 2: Persist desktop sidebar collapse state

**Files:**
- Modify: `store/constants.js`
- Modify: `store/modules/app.js`

- [ ] Add `sidebarCollapsed: 'uni-admin-sidebar-collapsed'` to `uniAdminCacheKey`.
- [ ] Initialize `state.sideBarCollapsed` from storage, defaulting to `false`.
- [ ] Add `SET_SIDEBAR_COLLAPSED` mutation that stores the Boolean value.
- [ ] Verify the state mutation has no route or user-data side effect.

### Task 3: Build topbar controls

**Files:**
- Modify: `windows/topWindow.vue`

- [ ] Render `navBar.logo` and `appName || 'uni-admin'` at the left of the topbar.
- [ ] In desktop H5, menu button toggles `sideBarCollapsed`; in mobile it retains existing left-window drawer behavior.
- [ ] Replace theme dropdown with three direct option buttons that call `changeTheme(index)` and mark the selected option active.
- [ ] Add a language action button and dropdown that iterates `langs`, calls `changeLanguage(index)`, and marks `langIndex` active.
- [ ] Keep user, language and theme menus mutually exclusive.
- [ ] Add semantic styles for brand, theme segmented control, language dropdown and compact mobile behavior.

### Task 4: Make sidebar consume collapse state

**Files:**
- Modify: `windows/leftWindow.vue`
- Modify: `components/uni-menu-sidebar/uni-menu-sidebar.vue`

- [ ] Bind `sidebar--collapsed` to Vuex `sideBarCollapsed` on H5 desktop.
- [ ] Use CSS class selectors to set 72px width, center logo/menu icons, hide labels, and retain active indicator when collapsed.
- [ ] Retain full-width sidebar in mobile drawer mode.
- [ ] Add title attributes / text labels to menu nodes for icon-only discoverability in H5 without changing menu data or navigation behavior.

### Task 5: Verify

**Files:**
- Test: H5 topbar and dashboard after login.

- [ ] Vue 3 compile `windows/topWindow.vue`, `windows/leftWindow.vue`, `components/uni-menu-sidebar/uni-menu-sidebar.vue`.
- [ ] Compile `uni.scss` and `common/theme.scss` with HBuilderX Dart Sass.
- [ ] Verify green is absent from configuration and theme maps.
- [ ] In H5 after login, verify default/dark/auto, language selection, 240px/72px sidebar, and mobile drawer behavior.
