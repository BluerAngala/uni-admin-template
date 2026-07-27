# uniCloud-alipay/

uniCloud 支付宝云服务空间配置。

## 目录结构

```
uniCloud-alipay/
├── cloudfunctions/     # 项目自有云函数/公共模块（本仓库跟踪）
│   └── common/
│       └── uni-stat/   # 统计核心引擎
└── database/           # 项目自有表 schema/索引/初始数据（本仓库跟踪）
```

> ⚠️ **HBuilderX vs VSCode 目录差异**：
> uni_modules 自带的 uniCloud 内容（云函数、数据库 schema）在 HBuilderX 中会以**快捷方式**虚拟合并显示到本项目目录下，VSCode 不做此处理。详见下方说明。

## 数据库

### 本目录管理的表（10 个）

| 表名 | 说明 |
|---|---|
| `opendb-admin-menus` | 管理后台菜单树 |
| `opendb-app-list` | 应用列表 |
| `opendb-app-versions` | 应用版本 |
| `uni-id-users` | 用户账号 |
| `uni-id-roles` | 角色定义 |
| `uni-id-permissions` | 权限定义 |
| `uni-id-tag` | 用户标签 |
| `uni-id-log` | 登录日志 |
| `uni-stat-app-platforms` | 应用平台定义 |
| `uni-stat-result` | 统计结果 |

### uni_modules 自动创建的表（不在此目录）

以下表由 uni_modules 自带 schema 定义，部署到云端时自动创建：

| 来源 | 表 |
|---|---|
| `uni_modules/uni-id-pages` | `opendb-department`、`opendb-device`、`opendb-frv-logs`、`uni-id-device` |
| `uni_modules/uni-captcha` | `opendb-verify-codes` |
| `uni_modules/uni-open-bridge-common` | `opendb-open-data` |

> 本目录只管理项目自定义表的定义文件。uni_modules 的表由对应模块管理，删除本地文件不会阻止云端创建。

## 云函数

### 本仓库跟踪的公共模块

| 路径 | 说明 |
|---|---|
| `cloudfunctions/common/uni-stat/` | 统计核心引擎，被 `uni-stat-cron`、`uni-stat-receiver` 引用 |

### uni_modules 贡献的云函数/公共模块（不在本目录）

| 来源 | 内容 |
|---|---|
| `uni_modules/uni-id-pages` | `uni-id-co` — 用户认证云对象 |
| `uni_modules/uni-captcha` | `uni-captcha-co` + `common/uni-captcha` |
| `uni_modules/uni-id-common` | `common/uni-id-common` |
| `uni_modules/uni-config-center` | `common/uni-config-center` |
| `uni_modules/uni-cloud-s2s` | `common/uni-cloud-s2s` |
| `uni_modules/uni-open-bridge-common` | `common/uni-open-bridge-common` |

> 项目实际部署到云端的云函数 = 本目录 `cloudfunctions/` + uni_modules 贡献的，由 HBuilderX 在上传时自动合并。

## ⚠️ uni_modules 虚拟合并机制

uni_modules 的 `uniCloud/` 目录内容会被**虚拟合并**到项目 `uniCloud-alipay/` 中。这是理解本目录"为什么看起来空"的关键。

| IDE | 表现 |
|---|---|
| **HBuilderX** | uni_modules 内的云函数和 schema 以**快捷方式图标**显示在 `uniCloud-alipay/` 下，文件左下角有小箭头指示 |
| **VSCode** | 只显示真实文件系统，uni_modules 内容不会虚拟显示，`uniCloud-alipay/` 目录看起来内容较少 |

### 开发注意事项

1. **不要创建和 uni_modules 同名的云函数/数据库表**，否则部署时冲突
2. 新建项目云函数 → 放在 `uniCloud-alipay/cloudfunctions/` 下，起唯一名字
3. 新建项目数据库表 schema → 放在 `uniCloud-alipay/database/` 下，集合名不与 uni_modules 冲突
4. 具体冲突清单见 `docs/ai-agent-docs/cloud-dev.md`
5. 部署时通过 HBuilderX 上传，它自动合并项目文件 + uni_modules 文件
