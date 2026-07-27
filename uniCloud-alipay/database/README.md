# database/

数据库 Schema 目录。定义数据集合的字段结构、索引和初始数据。

## 文件规范

每个数据集合由最多 3 个文件组成：

| 文件 | 用途 |
|---|---|
| `*.schema.json` | 字段定义（名称、类型、必填、默认值）+ JQL 权限规则（permission 表达式） |
| `*.index.json` | 索引定义（单字段/复合索引、排序方向） |
| `*.init_data.json` | 初始数据（安装或初始化时导入的默认记录） |

注：部分集合只有 `index.json`（仅定义索引）或只有 `init_data.json`（仅提供初始数据），其 schema 由 uni_modules 或云端定义。

## 表清单

### opendb 系列 — DCloud 标准表

| 表名 | schema | index | init_data | 说明 |
|---|---|---|---|---|
| `opendb-admin-menus` | ✅ | ✅ | ✅ | 管理后台菜单树 |
| `opendb-app-list` | ✅ | ✅ | ✅ | 应用列表 |
| `opendb-app-versions` | ✅ | ✅ | ✅ | 应用版本管理 |
| `opendb-department` | — | ✅ | ✅ | 部门组织 |
| `opendb-device` | — | ✅ | ✅ | 设备信息 |
| `opendb-feedback` | — | ✅ | ✅ | 用户反馈 |
| `opendb-poi` | — | ✅ | ✅ | POI 地理位置 |
| `opendb-tempdata` | ✅ | — | ✅ | 临时数据存储 |
| `opendb-verify-codes` | — | ✅ | ✅ | 验证码记录 |
| `opendb-frv-logs` | — | — | ✅ | 人脸识别日志 |
| `opendb-open-data` | — | — | ✅ | 开放数据 |
| `opendb-sign-in` | — | — | ✅ | 签到数据 |

### uni-id 系列 — 用户认证表

| 表名 | schema | index | init_data | 说明 |
|---|---|---|---|---|
| `uni-id-users` | — | ✅ | ✅ | 用户账号 |
| `uni-id-roles` | — | ✅ | ✅ | 角色定义 |
| `uni-id-permissions` | — | ✅ | ✅ | 权限定义 |
| `uni-id-log` | — | ✅ | ✅ | 登录日志 |
| `uni-id-tag` | ✅ | ✅ | ✅ | 用户标签 |
| `uni-id-scores` | ✅ | — | ✅ | 用户积分 |
| `uni-id-device` | — | — | ✅ | 用户设备关联 |

### uni-stat 系列 — 统计数据表

| 表名 | schema | index | init_data | 说明 |
|---|---|---|---|---|
| `uni-stat-app-platforms` | ✅ | ✅ | ✅ | 应用平台定义 |
| `uni-stat-result` | ✅ | ✅ | ✅ | 统计结果 |

### uni-pay 系列 — 支付表

| 表名 | schema | index | init_data | 说明 |
|---|---|---|---|---|
| `uni-pay-orders` | ✅ | ✅ | ✅ | 支付订单 |

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
