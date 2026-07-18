# pages/

应用页面目录。主包包含首页、错误页和 demo 页；业务子包通过 `pages.json` 的 `subPackages` 配置。

## 目录结构

```
pages/
├── index/          # 首页（数据概览仪表盘）
├── error/          # 错误页（404）
├── demo/           # 演示页（图标、表格组件示例）
├── system/         # 子包：系统管理（菜单/权限/角色/用户/应用/标签/安全）
└── uni-stat/       # 子包：uni-stat 数据统计分析套件
```

## 路由配置

所有路由在 `pages.json` 中声明。主包页面直接在 `pages` 数组中注册，`system/` 和 `uni-stat/` 作为分包。

## 页面模式

每个管理模块遵循统一 CRUD 三件套：
- `list.vue` — 列表页（`<unicloud-db>` + `<uni-table>` + `<uni-pagination>`）
- `add.vue` — 新增页（`<uni-forms>` 表单提交）
- `edit.vue` — 编辑页（加载已有数据，表单回填后更新）

参考实现：`pages/system/role/list.vue`、`add.vue`、`edit.vue`。

## 组件引用

页面中使用的主要组件：
- `fix-window` — 固定头部布局
- `uni-stat-breadcrumb` — 面包屑导航
- `uni-stat-panel` — 统计面板
- `uni-stat-tabs` — 统计标签切换
- `uni-stat-table` — 统计表格
- `uni-data-menu` — 动态菜单
