# pages/uni-stat/

uni-stat 数据统计分析子包。提供设备、用户、页面、事件、错误、支付等多维度统计功能。

## 模块清单

| 目录 | 功能 | 说明 |
|---|---|---|
| `device/` | 设备统计 | overview、trend、retention、stickiness、activity、comparison |
| `user/` | 用户统计 | 结构与 device/ 对称（overview、trend、retention 等） |
| `pay-order/` | 支付订单 | overview（概览）、list（明细）、ranking（排行）、funnel（漏斗） |
| `error/` | 错误监控 | app（原生错误）、js（JS 错误/Sourcemap/上传任务） |
| `event/` | 事件统计 | 事件与转化分析 |
| `channel/` | 渠道分析 | App 渠道归因 |
| `scene/` | 场景分析 | 小程序场景值统计 |
| `page-res/` | 受访页 | 页面资源分析 |
| `page-ent/` | 入口页 | 页面入口分析 |
| `page-content/` | 内容统计 | 页面内容维度统计 |
| `page-rule/` | 页面规则 | 页面规则配置 |

## 数据来源

所有统计数据来自 `uni-stat-receiver` 云对象接收 → `uni-stat-cron` 定时任务聚合 → 写入 `uni-stat-*` 系列数据集合。

## 组件模式

每个统计页面通常包含：
- `*FieldsMap.js` — 字段映射配置（定义表格列、筛选条件、查询字段）
- 主页面 `.vue` — 使用 `uni-stat-panel` / `uni-stat-tabs` / `uni-stat-table` 组件展示数据
