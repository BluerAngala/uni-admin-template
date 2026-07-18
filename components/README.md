# components/

项目自定义组件。全局注册，在所有页面中可直接使用。

## 组件清单

| 组件 | 文件 | 用途 |
|---|---|---|
| `uni-data-menu` | `uni-data-menu/` | 动态菜单组件 — 从 `opendb-admin-menus` 集合查询菜单树，按权限过滤 |
| `uni-nav-menu` | `uni-nav-menu/` | 导航菜单 — 支持多级嵌套（`uni-sub-menu`）和叶节点（`uni-menu-item`） |
| `uni-sub-menu` | `uni-sub-menu/` | 子菜单展开容器 |
| `uni-menu-item` | `uni-menu-item/` | 菜单项叶节点 |
| `uni-menu-group` | `uni-menu-group/` | 菜单分组容器 |
| `uni-stat-breadcrumb` | `uni-stat-breadcrumb/` | 面包屑导航 — 根据当前路由自动生成 |
| `uni-stat-panel` | `uni-stat-panel/` | 统计数据面板 — 展示单个指标 |
| `uni-stat-tabs` | `uni-stat-tabs/` | 统计标签切换 — 日期/平台/应用等维度切换 |
| `uni-stat-table` | `uni-stat-table/` | 统计表格 — 增强的表格组件，支持排序和字段映射 |
| `fix-window` | `fix-window/` | 固定头部布局 — 将 header 固定在页面顶部 |
| `batch-sms` | `batch-sms/` | 批量短信发送组件 |
| `download-excel` | `download-excel/` | Excel 导出组件（含 `download.js` 工具） |
| `show-info` | `show-info/` | 信息展示组件 |

## 注册方式

组件通过 `main.js` 中的 `Vue.component()` 全局注册，无需在页面中单独 import。

## uni-nav-menu 层级关系

```
uni-nav-menu（根）
├── uni-menu-group（分组）
├── uni-sub-menu（子菜单）
│   └── uni-menu-item（叶节点）
└── uni-menu-item（叶节点）
```
