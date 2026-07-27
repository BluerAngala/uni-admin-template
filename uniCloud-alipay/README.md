# uniCloud-alipay/

uniCloud 支付宝云服务空间配置。包含数据库 schema、云函数公共模块。

## 目录结构

```
uniCloud-alipay/
├── cloudfunctions/     # 云函数公共模块
│   └── common/         # uni-stat 统计引擎公共模块
└── database/           # 数据库 schema、索引、初始数据
```

## 数据库

共约 30 个表，按功能分三类：

| 前缀 | 分类 | 数量 |
|---|---|---|
| `opendb-*` | DCloud 标准表（菜单、应用、版本等） | 13 |
| `uni-id-*` | 用户认证表（用户、角色、权限、标签、日志等） | 9 |
| `uni-stat-*` | 统计数据表（平台、统计结果） | 2 |
| `uni-pay-*` | 支付订单表 | 1 |
| 其他 | 临时数据、人脸识别等 | 4 |

具体表结构见 `database/` 目录下的 `.schema.json`（字段定义 + JQL 权限规则）、`.index.json`（索引）、`.init_data.json`（初始数据）。

## 云函数

项目云函数部署在 uniCloud 支付宝云服务空间，通过 HBuilderX 上传部署。本仓库仅跟踪公共模块：

- `cloudfunctions/common/uni-stat/` — 统计核心引擎（被 `uni-stat-cron`、`uni-stat-receiver` 等云函数共享引用）

其余云函数（`uni-id-co`、`uni-captcha-co`、`uni-sms-co`、`uni-stat-cron`、`uni-stat-receiver`、`uni-upgrade-center`、`ext-storage-co`、`uni-portal`等）来源于 uni_modules 或直接部署在云端，不在本仓库中跟踪。
