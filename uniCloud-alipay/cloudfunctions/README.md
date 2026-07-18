# cloudfunctions/

云函数和云对象目录。所有云函数部署到 uniCloud 支付云服务空间。

## 云函数/云对象

| 名称 | 类型 | 功能 |
|---|---|---|
| `ext-storage-co` | 云对象 | 扩展存储服务 — 文件上传/下载管理 |
| `uni-analyse-searchhot` | 云函数 | 热搜分析 — 统计搜索热词 |
| `uni-portal` | 云函数 | 门户发布 — 生成发布页 HTML（含 `createPublishHtml/` 模板渲染子目录） |
| `uni-sms-co` | 云对象 | 短信发送 — 模板管理、条件发送、多平台适配 |
| `uni-stat-cron` | 云函数 | 统计定时任务 — 定时聚合统计数据 |
| `uni-stat-receiver` | 云对象 | 统计数据接收器 — 接收客户端上报的统计数据 |
| `uni-upgrade-center` | 云函数 | 应用升级中心 — 版本检查、下载地址生成 |

## 公共模块

`common/uni-stat/` — 统计核心引擎，被多个云函数共享引用：
- `stat/stat.js` — 主统计逻辑
- `stat/mod/` — 各统计模块（渠道、设备、用户、事件、页面、支付、错误、留存等）
- `stat/lib/` — 工具库（日期、加密、通用方法）
- `shared/` — 共享工具（API 创建、错误处理）

## 部署方式

HBuilderX 右键点击云函数目录 → "上传部署到 uniCloud"。
