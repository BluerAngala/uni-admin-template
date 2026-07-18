# uniCloud-alipay/

uniCloud 支付云服务空间配置。包含云函数、数据库 schema 和公共模块。

## 目录结构

```
uniCloud-alipay/
├── cloudfunctions/     # 云函数和云对象
│   ├── common/         # 公共模块（uni-stat 统计引擎）
│   ├── ext-storage-co/ # 扩展存储云对象
│   ├── uni-analyse-searchhot/ # 热搜分析云函数
│   ├── uni-portal/     # 门户发布云函数
│   ├── uni-sms-co/     # 短信发送云对象
│   ├── uni-stat-cron/  # 统计定时任务云函数
│   ├── uni-stat-receiver/ # 统计数据接收云对象
│   └── uni-upgrade-center/ # 应用升级中心云函数
└── database/           # opendb 数据库 schema（~140 个表）
```

## 云函数类型

- **云对象**（`.obj.js`）：通过 `uniCloud.importObject()` 调用，有 `_before`/`_after` 生命周期
- **传统云函数**：`exports.main(event, context)`，按 `action` 字段分发

## 数据库规范

每个数据集合包含 3 个文件：
- `.schema.json` — 字段定义 + JQL 权限规则
- `.index.json` — 索引定义
- `.init_data.json` — 初始数据

命名规范：`opendb-*`（DCloud 标准表）、`uni-id-*`（认证表）、`uni-stat-*`（统计表）。
