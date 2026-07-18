# uni-admin Modern Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the conflicting Glass UI styling with one responsive, dual-theme admin design system, then migrate the shared shell and every reusable UI primitive before migrating pages.

**Architecture:** CSS variables in `styles/design-system/_themes.scss` become the only CSS-variable theme source. `uni.scss` and `common/theme.scss` remain the uni-ui compatibility layer. The layout shell and menu tree preserve existing route, permission, and data contracts while consuming semantic variables. Existing uni-ui components retain their public APIs and gain centralized visual state coverage.

**Tech Stack:** uni-app, Vue Options API, SCSS, uni-ui, Vuex, uniCloud, HBuilderX H5 runtime.

## Global Constraints

- Options API only. Preserve Vue 2/3 compatibility.
- Use uni-app components and APIs. Do not add DOM APIs, vue-router, axios, packages, or npm scripts.
- Use rpx or px only. No rem, vh, or vw.
- Theme values remain `default`, `dark`, and `auto`; `auto` resolves through the existing Vuex store mutation.
- Business routes, permissions, form field order, i18n keys, menu data, and database queries must not change.
- All new user-visible strings must exist in zh-Hans, zh-Hant, and en locale files.
- No `glass-*`, `backdrop-filter`, background glow, gradient button, or emoji UI icon may remain in application UI.
- Motion affects only `transform` and `opacity`; reduced-motion disables nonessential animation.
- Verify changed H5 paths through HBuilderX, in `default`, `dark`, and `auto` themes at 375px, 768px, 1024px, and 1440px.

---

## File Map

| Path | Responsibility |
|---|---|
| `styles/design-system/_tokens.scss` | Theme-independent spacing, type, elevation, radius, motion and z-index variables |
| `styles/design-system/_themes.scss` | Complete default and dark semantic CSS variable maps |
| `styles/design-system/_base.scss` | Reduced-motion, document base, scrollbar, focus-visible and page background rules |
| `common/uni.css` | Shell compatibility layout and shared utility classes only, no visual glass system |
| `common/theme.scss` | uni-ui primitive mapping for each `uni.scss` theme map |
| `windows/topWindow.vue` | Accessible responsive top navigation and themed overlay menus |
| `windows/leftWindow.vue` | Responsive sidebar and application identity |
| `components/uni-nav-menu/*` | Menu hierarchy behavior and visual states |
| `components/app-*/*` | Shared surface, metrics and feedback primitives |
| `components/uni-stat-table/uni-stat-table.vue` | Statistics table wrapper with themed state slots |
| `pages/index/index.vue` | Reference dashboard migrated to shared system |
| `pages/system/**/*.vue` | CRUD form and data-table migration surfaces |
| `pages/uni-stat/**/*.vue` | Analytics filters, data tables and charts migration surfaces |
| `pages/system/safety/**/*.vue`, `pages/demo/**/*.vue` | Remaining page migration surfaces |

## Task 1: Consolidate semantic theme tokens

**Files:**
- Modify: `styles/design-system/_tokens.scss`
- Modify: `styles/design-system/_themes.scss`
- Modify: `styles/design-system/_base.scss`
- Modify: `uni.scss`
- Test: HBuilderX H5 launch with `data-theme="default"`, `data-theme="dark"`, and stored `auto`

**Interfaces:**
- Consumes: Vuex `app/SET_THEME` and `$themes` in `uni.scss`.
- Produces: semantic CSS variables consumed by all shell, components, and uni-ui overrides.

- [ ] Define theme-independent variables only once: spacing, typography, radii, elevation, motion, z-index and breakpoint-compatible container values.
- [ ] Replace the dark-first `:root` visual map in `_themes.scss` with a neutral fallback plus complete `[data-theme='default']` and `[data-theme='dark']` semantic maps.
- [ ] Define every required semantic token in both maps: canvas, three surface elevations, overlay, primary/secondary/tertiary/inverse text, subtle/strong borders, focus ring, accent states, semantic states, form/table/menu/modal tokens.
- [ ] Delete glass palette, glow gradients, blur variables, ambient animations, and glass shadow variables from both theme files.
- [ ] Add a `@media (prefers-reduced-motion: reduce)` rule in `_base.scss` that sets animation duration and transition duration to minimal values for all descendants.
- [ ] Keep `uni.scss` theme maps aligned with the semantic accent, text, background, border, menu and table values used by `common/theme.scss`.
- [ ] Launch H5, switch all three theme values, and confirm the body `data-theme` attribute selects visibly different default and dark maps.

## Task 2: Remove global visual conflicts and theme uni-ui primitives

**Files:**
- Modify: `common/uni.css`
- Modify: `common/theme.scss`
- Test: HBuilderX H5 list, add/edit form, popup, table and pagination paths

**Interfaces:**
- Consumes: semantic variables from Task 1 and `$themes` from `uni.scss`.
- Produces: one global styling boundary for existing uni-ui elements with no per-page visual reset needed.

- [ ] Remove body pseudo-elements, glass classes, global backdrop filters, ambient animations, gradient buttons, and glass-dependent fallback color values from `common/uni.css`.
- [ ] Preserve H5 left-window layout, embedded-mode selectors, pointer utility, responsive visibility utilities, and non-H5 `fix-top-window` support.
- [ ] Define semantic styles for `.uni-header`, `.uni-container`, `.uni-button-group`, `.uni-search`, `.uni-input-border`, `.uni-textarea-border`, `.uni-stat--x`, `.modal`, and pagination container using only semantic variables.
- [ ] Map uni-ui button, input, picker, checkbox, switch, table, popup, tag, notice and calendar states in `common/theme.scss` through `themeify` without hardcoded colors or dark-only conditional branches.
- [ ] Add visible keyboard focus styling to native buttons, links, inputs, selects, textareas and uni-ui focusable controls on H5.
- [ ] Verify system list pages, app form, menu popup and pagination display correct states in both themes.

## Task 3: Rebuild shared page, surface and feedback primitives

**Files:**
- Create: `components/app-page/app-page.vue`
- Create: `components/app-page-header/app-page-header.vue`
- Create: `components/app-section/app-section.vue`
- Create: `components/app-surface/app-surface.vue`
- Modify: `components/app-card/app-card.vue`
- Modify: `components/app-stat-card/app-stat-card.vue`
- Modify: `components/app-empty/app-empty.vue`
- Modify: `components/app-skeleton/app-skeleton.vue`
- Modify: `components/app-badge/app-badge.vue`
- Modify: `components/app-toast/app-toast.vue`
- Test: Dashboard and a CRUD list in H5

**Interfaces:**
- Consumes: Task 1 tokens and existing slots/props where components already exist.
- Produces: `app-page`, `app-page-header`, `app-section`, `app-surface` and normalized existing app primitives.

- [ ] Implement `app-page` with `fluid` boolean prop, responsive page padding and a content container slot.
- [ ] Implement `app-page-header` with `title`, `description`, `breadcrumb` and `actions` slots; no user-visible default copy.
- [ ] Implement `app-section` with `title`, `description`, `actions` slot and default slot; hide absent header content rather than rendering empty space.
- [ ] Implement `app-surface` with `variant` values `standard`, `raised`, and `inset`, plus `padding` values `none`, `compact`, and `default`.
- [ ] Preserve `app-card` title/header slot API, but implement it as a compatibility wrapper around the same semantic surface treatment.
- [ ] Extend `app-stat-card` with `status` and `loading` props, a label/value/meta slot layout, tabular figures, and semantic up/down/neutral change treatment.
- [ ] Replace emoji markup in empty and toast components with existing `uni-icons` or admin icon classes; preserve text/action APIs.
- [ ] Update skeleton to use a shimmer transform only when reduced-motion allows it; maintain static shape fallback.
- [ ] Verify loading, empty, error, success, warning and info states in both themes.

## Task 4: Rebuild top-level shell and navigation tree

**Files:**
- Modify: `windows/topWindow.vue`
- Modify: `windows/leftWindow.vue`
- Modify: `components/uni-nav-menu/uni-nav-menu.vue`
- Modify: `components/uni-menu-item/uni-menu-item.vue`
- Modify: `components/uni-sub-menu/uni-sub-menu.vue`
- Modify: `components/uni-menu-group/uni-menu-group.vue`
- Modify: `components/uni-menu-sidebar/uni-menu-sidebar.vue`
- Modify: `components/uni-stat-breadcrumb/uni-stat-breadcrumb.vue`
- Test: H5 navigation at 375px, 768px, 1024px, and 1440px

**Interfaces:**
- Consumes: existing `uni.showLeftWindow`, `uni.hideLeftWindow`, nav menu route data, user store and `SET_THEME` mutation.
- Produces: responsive visual shell without route or menu-data changes.

- [ ] Replace topbar emoji menu, theme, log and caret glyphs with project icon font or `uni-icons` equivalents.
- [ ] Keep topbar user menu, error log popup, password flow, locale behavior, and theme values unchanged.
- [ ] Render theme options as clear selectable rows showing current state, including `auto`; keep each overlay separately positioned and never render both menus as one ambiguous dropdown.
- [ ] Implement a 56px topbar with semantic surface/background/border tokens, focusable interactive targets, pressed feedback and motion limited to opacity/transform.
- [ ] Implement desktop sidebar width 240px, intermediate compact mode styling, and small-screen drawer behavior using existing left-window APIs.
- [ ] Unify menu item, sub-menu and group spacing, active indicator, nesting, disabled state and open/close transition; retain current menu selection behavior.
- [ ] Ensure all sidebar text, icon alignment and navigation feedback remains readable in both themes.
- [ ] Verify direct route navigation, external URL navigation, menu nesting, user popup, theme menu, password action and error-log action.

## Task 5: Standardize tables, filters, tabs, pagination, notices and overlays

**Files:**
- Modify: `components/uni-stat-table/uni-stat-table.vue`
- Modify: `components/uni-stat-tabs/uni-stat-tabs.vue`
- Modify: `components/app-badge/app-badge.vue`
- Modify: `common/theme.scss`
- Modify: `common/uni.css`
- Test: `pages/index/index`, `pages/system/user/list`, `pages/system/role/list`, `pages/system/app/list`

**Interfaces:**
- Consumes: Task 2 primitive styles and Task 3 surfaces.
- Produces: reusable display rules without changing `uni-table`, `uni-pagination`, `uni-notice-bar`, `uni-popup` or tab public APIs.

- [ ] Theme table header, row, hover, selected, disabled, sort/filter, empty and loading states centrally.
- [ ] Make tables horizontally scrollable within their own surface on narrow H5 viewports while keeping page canvas overflow-free.
- [ ] Update `uni-stat-table` tooltip icon color to semantic token usage and provide slot-compatible header rendering.
- [ ] Theme platform tabs for selected, hover, disabled and overflow states without changing filter values or mode props.
- [ ] Theme notices by semantic severity and preserve their existing click actions.
- [ ] Theme popup/dialog overlays, panel surface, title/body/action regions and opening/closing transitions.
- [ ] Verify pagination, table sorting/filter controls, notice click-through, platform filtering and popups in both themes.

## Task 6: Migrate the dashboard reference page

**Files:**
- Modify: `pages/index/index.vue`
- Test: `pages/index/index` in default/dark/auto plus no-data, loading and data-present scenarios

**Interfaces:**
- Consumes: Tasks 1-5 components and existing dashboard computed properties, queries, navigation and table field maps.
- Produces: reference composition for subsequent page migrations.

- [ ] Preserve `query`, `getApps`, `getAllData`, `navTo`, `checkAppId`, `checkdbInit`, `summaryStats`, field maps, URL targets and notice conditions.
- [ ] Replace hand-built KPI cards with `app-stat-card`; pass `loading` from existing `complete` state and use status only for true change semantics.
- [ ] Replace `uni-stat--x` wrappers with `app-section` and `app-surface` while retaining `uni-stat-tabs`, tables and their headers/data loops.
- [ ] Replace dashboard emoji icons with the existing icon set or remove non-semantic decorative icons.
- [ ] Use `app-page` and `app-page-header` for welcome title, date and page actions; retain all displayed information.
- [ ] Remove dashboard-only glass CSS and hardcoded fallback colors.
- [ ] Verify platform selection, empty-stat notice, app-id links, device links and user links remain functional.

## Task 7: Migrate system-management CRUD pages

**Files:**
- Modify: `pages/system/app/**/*.vue`
- Modify: `pages/system/user/**/*.vue`
- Modify: `pages/system/role/**/*.vue`
- Modify: `pages/system/menu/**/*.vue`
- Modify: `pages/system/permission/**/*.vue`
- Modify: `pages/system/tag/**/*.vue`
- Modify: `pages/system/safety/**/*.vue`
- Test: one list, add, edit, delete/selection, popup and pagination flow per module

**Interfaces:**
- Consumes: Tasks 2-5 primitives and shell contract.
- Produces: every existing system-management screen using consistent page/surface/header structure without logic changes.

- [ ] Wrap each list page in the page/header/surface hierarchy without changing `unicloud-db` fields, where clauses, selection handlers, sorting or pagination bindings.
- [ ] Convert existing `uni-header` action layouts to `app-page-header` action slots while preserving labels, permissions and click handlers.
- [ ] Convert form page sections from raw page backgrounds or `uni-card` visual styling to semantic surfaces while preserving `uni-forms`, validation rules and field order.
- [ ] Replace inline visual colors and layout-only local overrides with semantic shared classes or component props where they are part of the new system.
- [ ] Preserve all destructive actions, confirmation behavior, upload flows, icon selection popup and external links.
- [ ] Verify CRUD data operations and validation error displays for every system module through H5.

## Task 8: Migrate analytics, safety and demonstration surfaces

**Files:**
- Modify: `pages/uni-stat/**/*.vue`
- Modify: `pages/demo/**/*.vue`
- Modify: chart option builders under `pages/uni-stat/**/components/**/*.vue` as required
- Test: device overview, user overview, channel, event, chart, table and demo interactions

**Interfaces:**
- Consumes: Tasks 1-5 themes and shared layout primitives.
- Produces: analytics module visual parity with system-management module.

- [ ] Apply page/header/surface structure to each analytics page without changing query construction, aggregation, date ranges, platform selection, chart series or navigation targets.
- [ ] Replace local glass/card/gradient styles with semantic surfaces and shared spacing.
- [ ] Map chart axis, grid, legend, tooltip, background and series colors to current theme values so both themes remain legible.
- [ ] Retain table horizontal scrolling and analytics filter behavior at narrow widths.
- [ ] Migrate demonstration pages only after the shared primitive they use has been finalized; do not introduce demo-only visual conventions.
- [ ] Verify each analytics section loads, filters, renders tables/charts, and presents empty/loading/error states in both themes.

## Task 9: Full H5 visual and behavioral verification

**Files:**
- Modify only if verification exposes a defect in Tasks 1-8.
- Test: HBuilderX H5 target and browser inspection.

**Interfaces:**
- Consumes: full migrated application.
- Produces: verified dual-theme responsive UI with unchanged business behavior.

- [ ] Launch through HBuilderX H5 and inspect browser console for runtime errors.
- [ ] Exercise default, dark and auto theme selection. For auto, change system preference or emulate it and confirm resolved `data-theme` updates.
- [ ] Verify dashboard, system list/add/edit, popup, pagination, stats tables, platform tabs, safety list and at least one chart page at 375px, 768px, 1024px and 1440px.
- [ ] Check focus-visible state for keyboard-accessible controls in topbar, sidebar, page actions, forms and popups.
- [ ] Confirm reduced motion stops route/overlay/skeleton/menu nonessential motion.
- [ ] Search changed style files for `backdrop-filter`, `glass-`, emoji UI glyphs, gradient button declarations and hardcoded visual colors. Remove remaining redesign-scope occurrences.
- [ ] Record any unavoidably external uni-ui visual constraints in the final delivery, with exact component and platform scope.
