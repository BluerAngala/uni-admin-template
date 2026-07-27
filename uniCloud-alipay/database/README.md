# database/

数据库 Schema 目录。定义数据集合的字段结构、索引和初始数据。

## 文件规范

每个数据集合由最多 3 个文件组成：

| 文件 | 用途 |
|---|---|
| `*.schema.json` | 字段定义（名称、类型、必填、默认值）+ JQL 权限规则（permission 表达式） |
| `*.index.json` | 索引定义（单字段/复合索引、排序方向） |
| `*.init_data.json` | 初始数据（安装或初始化时导入的默认记录） |

注：部分集合只有 `index.json`（仅定义索引），其 schema 由 uni_modules 或云端定义。

## 表清单

### 后台管理核心表

| 表名 | schema | index | init_data | 说明 |
|---|---|---|---|---|
| `opendb-admin-menus` | ✅ | ✅ | ✅ 2.9KB | 管理后台菜单树 |
| `opendb-app-list` | ✅ | ✅ | — | 应用列表 |
| `uni-id-users` | — | ✅ | ✅ 264B | 用户账号 |
| `uni-id-roles` | — | ✅ | ✅ 167B | 角色定义 |
| `uni-id-permissions` | — | ✅ | — | 权限定义 |
| `uni-id-tag` | ✅ | ✅ | — | 用户标签 |
| `uni-id-log` | — | ✅ | — | 登录日志 |

### 统计（uni-stat 看板用）

| 表名 | schema | index | init_data | 说明 |
|---|---|---|---|---|
| `uni-stat-app-platforms` | ✅ | ✅ | ✅ 2.1KB | 应用平台定义 |
| `uni-stat-result` | ✅ | ✅ | — | 统计结果 |

## JQL 权限规则

Schema 中的 `permission` 字段定义数据访问权限，示例：

```json
"permission": {
  "read": true,
  "create": "'CREATE_OPENDB_ADMIN_MENUS' in auth.permission",
  "update": "'UPDATE_OPENDB_ADMIN_MENUS' in auth.permission",
  "delete": "'DELETE_OPENDB_ADMIN_MENUS' in auth.permission"
}
```

权限检查基于 `auth.permission` 数组，管理员可通过 `uni-id-permissions` 表配置角色权限。
