# pages/system/

系统管理子包。包含用户、角色、权限、菜单、应用、标签、安全日志等管理模块。

## 模块清单

| 目录 | 功能 | 数据集合 |
|---|---|---|
| `user/` | 用户管理（列表/新增/编辑） | `uni-id-users` |
| `role/` | 角色管理（列表/新增/编辑） | `uni-id-roles` |
| `permission/` | 权限管理（列表/新增/编辑） | `uni-id-permissions` |
| `menu/` | 菜单管理（列表/新增/编辑） | `opendb-admin-menus` |
| `app/` | 应用管理（列表/新增/发布页管理） | `opendb-app-list` |
| `tag/` | 标签管理（列表/新增/编辑） | `uni-id-tag` |
| `safety/` | 用户操作日志 | `uni-id-log` |

## CRUD 模式

每个模块统一三件套（`role/` 为参考实现）：

1. **list.vue** — 列表页：`<unicloud-db>` 绑定集合 → `<uni-table>` 渲染 → `<uni-pagination>` 分页
2. **add.vue** — 新增页：`<uni-forms>` 表单 → 调用 `uniCloud.database().collection().add()`
3. **edit.vue** — 编辑页：通过 URL 参数 `id` 查询已有数据 → 表单回填 → `update()`

## 注意事项

- 页面中使用 `$hasPermission(name)` / `$hasRole(name)` 控制操作按钮可见性
- `admin` 角色跳过所有权限检查
- `app/` 目录下有 `mixin/publish_add_detail_mixin.js`，供发布相关页面复用逻辑
