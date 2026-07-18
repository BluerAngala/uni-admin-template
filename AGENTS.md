# 仓库指南

## 项目身份

uni-admin — DCloud 官方管理后台框架，基于 uni-app（Vue 2/3 双模式）+ uniCloud（Serverless）。专为 HBuilderX 设计。

## 绝对禁忌

- **无 npm scripts** — 只能通过 HBuilderX 运行/调试/部署
- **无 TypeScript / ESLint / Babel** — 纯 JS + Prettier 格式化
- **仅 Options API** — 禁止 Composition API
- **Vue 2/3 双模式** — 所有 Vue API 调用必须用条件编译 `#ifdef VUE3` / `#ifndef VUE3`
- **uni-app ≠ Web** — 不用 vue-router / axios / DOM API / HTML 标签，详见各场景文档

## 场景文档（按需读取，不要全读）

根据当前任务，只读对应的那一个：

| 场景 | 文档 | 何时读 |
|---|---|---|
| 开发新页面 | `docs/ai-agent-docs/page-dev.md` | 新增/修改页面组件时 |
| 开发云函数 | `docs/ai-agent-docs/cloud-dev.md` | 新增/修改云函数或云对象时 |
| 修改样式/主题 | `docs/ai-agent-docs/style-dev.md` | 修改 CSS、添加主题、调整布局时 |
| 系统管理功能 | `docs/ai-agent-docs/admin-dev.md` | 用户/角色/权限/菜单等 CRUD 功能时 |
| 项目架构总览 | `docs/ai-agent-docs/architecture.md` | 需要理解整体结构、数据流时 |
| 官方文档链接 | `docs/ai-agent-docs/references.md` | 需要查阅 uni-app / uniCloud 文档时 |

## 通用速查

**权限：** `$hasPermission(name)` / `$hasRole(name)`，admin 角色免检

**格式化：** Prettier — 行宽 180、单引号、2 空格、ES5 尾逗号

**平台条件编译：** `#ifdef H5` / `#ifdef APP-VE` / `#ifdef MP-WEIXIN` / `#ifndef H5`
