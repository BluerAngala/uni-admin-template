# cloudfunctions/

项目自有云函数、公共模块目录。

## 本目录内容

| 模块 | 路径 | 说明 |
|---|---|---|
| `uni-stat` | `common/uni-stat/` | 统计核心引擎 — 渠道、设备、用户、事件、页面、留存、错误日志 |

## uni_modules 贡献的云函数

以下云函数/公共模块实际位于 `uni_modules/` 下，部署时自动合并到云端：

| 来源 | 内容 |
|---|---|
| `uni_modules/uni-id-pages` | `uni-id-co` — 用户认证云对象（登录、注册、Token 等） |
| `uni_modules/uni-captcha` | `uni-captcha-co` + `common/uni-captcha` — 验证码 |
| `uni_modules/uni-id-common` | `common/uni-id-common` — uni-id 公共模块（Token 校验） |
| `uni_modules/uni-config-center` | `common/uni-config-center` — 配置中心 |
| `uni_modules/uni-cloud-s2s` | `common/uni-cloud-s2s` — 服务端通信 |
| `uni_modules/uni-open-bridge-common` | `common/uni-open-bridge-common` — 开放平台桥接 |

> 在 HBuilderX 中，以上 uni_modules 内容会以**快捷方式图标**显示在本目录下。VSCode 无此功能，所以本目录看起来"空"。

## ⚠️ 命名冲突警告

**新建云函数时，名字不能和 uni_modules 贡献的云函数重名**，否则部署时相互覆盖。完整清单见 `docs/ai-agent-docs/cloud-dev.md`。

## 引用公共模块

在云函数的 `package.json` 中声明依赖：

```json
{
  "dependencies": {
    "uni-stat": "file:../common/uni-stat"
  }
}
```

云函数中通过 `require('uni-stat')` 引入。
