# js_sdk/validator/

数据集合校验器。为每个 opendb 数据集合提供字段校验规则和查询转换工具。

## 文件清单

| 文件 | 数据集合 |
|---|---|
| `opendb-admin-menus.js` | 管理菜单 |
| `opendb-app-list.js` | 应用列表 |
| `opendb-app-versions.js` | 应用版本 |
| `uni-id-log.js` | 用户日志 |
| `uni-id-permissions.js` | 权限 |
| `uni-id-roles.js` | 角色 |
| `uni-id-tag.js` | 标签 |
| `uni-id-users.js` | 用户 |
| `uni-pay-orders.js` | 支付订单 |
| `uni-stat-app-crash-logs.js` | 应用崩溃日志 |
| `uni-stat-pages.js` | 统计页面 |

## 导出能力

每个校验器通常导出：
- `enumConverter` — 枚举值转换（数据库值 ↔ 显示文本）
- `filterToWhere` — 将 UI 筛选条件转换为 JQL where 子句
