# database/

opendb 数据库 Schema 目录。定义所有数据集合的字段结构、索引和初始数据，共约 140 张表。

## 文件规范

每个数据集合由 3 个文件组成：

| 文件 | 用途 |
|---|---|
| `*.schema.json` | 字段定义（名称、类型、必填、默认值）+ JQL 权限规则（auth 表达式） |
| `*.index.json` | 索引定义（单字段/复合索引、排序方向） |
| `*.init_data.json` | 初始数据（安装时自动导入的默认记录） |

额外扩展：部分集合有 `*.schema.ext.js` 用于 schema 扩展逻辑。

## 表命名规范

| 前缀 | 分类 | 示例 |
|---|---|---|
| `opendb-*` | DCloud 标准表 | `opendb-admin-menus`、`opendb-app-list` |
| `uni-id-*` | 用户认证表 | `uni-id-users`、`uni-id-roles`、`uni-id-log` |
| `uni-stat-*` | 统计数据表 | `uni-stat-active-users`、`uni-stat-app-channels` |
| `uni-pay-*` | 支付订单表 | `uni-pay-orders` |
| `uni-sms-*` | 短信相关表 | `uni-sms-log`、`uni-sms-task` |
| `read-*` | 阅读日志表 | `read-news-log` |

## JQL 权限规则

Schema 中的 `auth` 字段定义数据访问权限，格式示例：
```json
"auth": {
  "read": true,
  "create": "auth.uid == doc.user_id",
  "update": "doc.user_id == auth.uid || admin"
}
```
