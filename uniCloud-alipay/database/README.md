# database/

数据库 Schema 目录。定义数据集合的字段结构、索引和初始数据。

## 文件规范

每个数据集合由最多 3 个文件组成：

| 文件 | 用途 |
|---|---|
| `*.schema.json` | 字段定义（名称、类型、必填、默认值）+ JQL 权限规则 |
| `*.index.json` | 索引定义（单字段/复合索引、排序方向） |
| `*.init_data.json` | 初始数据（安装或初始化时导入的默认记录） |

## 表清单

### 后台管理核心表

| 表名 | schema | index | init_data | 说明 |
|---|---|---|---|---|
| `opendb-admin-menus` | ✅ | ✅ | ✅ 2.9KB | 管理后台菜单树 |
| `opendb-app-list` | ✅ | ✅ | — | 应用列表 |
| `opendb-app-versions` | ✅ | ✅ | — | 应用版本（应用管理页写入） |
| `uni-id-users` | — | ✅ | ✅ 264B | 用户账号 |
| `uni-id-roles` | — | ✅ | ✅ 167B | 角色定义 |
| `uni-id-permissions` | — | ✅ | — | 权限定义 |
| `uni-id-tag` | ✅ | ✅ | — | 用户标签 |
| `uni-id-log` | — | ✅ | — | 登录日志 |

### 统计表

| 表名 | schema | index | init_data | 说明 |
|---|---|---|---|---|
| `uni-stat-app-platforms` | ✅ | ✅ | ✅ 2.1KB | 应用平台定义 |
| `uni-stat-result` | ✅ | ✅ | — | 统计结果 |

### uni_modules 自动创建的表

以下表由 uni_modules 自带 schema 定义，部署时自动创建到云端。它们**不在此目录中**，在 HBuilderX 中以快捷方式显示，VSCode 不显示：

| 来源 | 表 |
|---|---|
| `uni_modules/uni-id-pages` | `opendb-department`、`opendb-device`、`opendb-frv-logs`、`uni-id-device` |
| `uni_modules/uni-captcha` | `opendb-verify-codes` |
| `uni_modules/uni-open-bridge-common` | `opendb-open-data` |

## 云端 vs 本地差异

本目录仅管理表的**定义文件**。以下情况会导致云端表比本地多：

- **uni_modules 贡献**：上表中的表由 uni_modules 负责，不受本目录控制
- **历史部署**：已部署到云端的表，删除本地文件不会删除云端数据
- **云端直接创建**：通过 uniCloud 控制台或 JQL 运行工具手动创建的表

如需清理云端多余表，请在 [uniCloud 控制台](https://unicloud.dcloud.net.cn) 数据库管理中手动删除。

## ⚠️ 命名冲突警告

**新建 schema 时，集合名不能和 uni_modules 已有的表重名**，否则部署时冲突。完整冲突清单见 `docs/ai-agent-docs/cloud-dev.md`。

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

权限基于 `auth.permission` 数组，通过 `uni-id-permissions` 表配置角色权限。
