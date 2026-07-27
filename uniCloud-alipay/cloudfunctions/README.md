# cloudfunctions/

云函数公共模块目录。云函数本体部署于 uniCloud 支付宝云服务空间，通过 HBuilderX 上传部署，本仓库仅跟踪公共模块。

## 公共模块

| 模块 | 路径 | 功能 |
|---|---|---|
| `uni-stat` | `common/uni-stat/` | uni-app 统计核心引擎 — 渠道、设备、用户、事件、页面、留存、错误日志等统计维度 |

### uni-stat 统计引擎

被多个云函数（`uni-stat-cron` 定时任务、`uni-stat-receiver` 数据接收器）共享引用：

```
common/uni-stat/
├── index.js            # 模块入口
├── package.json        # 模块元数据
├── shared/             # 共享工具（API 创建、错误处理、通用方法）
└── stat/               # 统计主逻辑
    ├── stat.js         # 统计入口
    ├── receiver.js     # 数据接收处理
    ├── lib/            # 工具库（日期处理、加密工具）
    └── mod/            # 各统计模块（渠道、设备、事件、留存、页面、错误日志等）
```

## 引用方式

在云函数的 `package.json` 中声明依赖：

```json
{
  "dependencies": {
    "uni-stat": "file:../common/uni-stat"
  }
}
```

云函数中通过 `require('uni-stat')` 引入。

## 部署方式

HBuilderX 中，在云函数目录或 uni_modules 中右键 → "上传部署到 uniCloud"。公共模块随引用它的云函数一同上传。
