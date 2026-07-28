# 开发云函数/云对象

## 先决定：云对象还是云函数？

| | 云对象（`.obj.js`） | 传统云函数（`index.js`） |
|---|---|---|
| 调用方式 | `uniCloud.importObject('name')` | `uniCloud.callFunction({ name })` |
| 代码结构 | 对象方法，天然分 action | switch/case 分发 action |
| 生命周期 | `_before()` / `_after()` 钩子 | 无内置钩子 |
| 本项目 | 新功能默认用**云对象** | 旧代码有的用传统云函数，保持不动 |

**判断依据：** 新功能用云对象，已有传统云函数就继续用传统方式，不需要迁移。

## 云对象开发（推荐，新功能默认用此方式）

### 推荐目录结构

参考 `uni_modules/uni-id-pages/uniCloud/cloudfunctions/uni-id-co` 的架构：

```
xxx-co/                          # 目录名 = 云对象名
├── index.obj.js                 # 入口文件（只组装，不写业务）
├── package.json                 # 云对象元数据
├── common/                      # 共享层
│   ├── constants.js             # 常量/枚举
│   ├── error.js                 # 错误码定义
│   └── utils.js                 # 通用工具函数
├── middleware/                   # 中间件（可选）
│   └── index.js                 # _before 中调用的拦截逻辑
└── module/                      # 业务模块
    ├── account/
    │   ├── index.js             # 桶文件：导出本域所有方法
    │   ├── list.js              # 每个方法一个文件
    │   └── update.js
    └── order/
        ├── index.js
        ├── create.js
        └── detail.js
```

### 三大规范

#### ① `index.obj.js` 只做导入导出，不写业务逻辑

```js
const { ERROR } = require('./common/error')
const { list, update } = require('./module/account/index')
const { create, detail, remove } = require('./module/order/index')

module.exports = {
  _before() {
    const token = this.getUniIdToken()
    if (!token) throw new Error('未登录')
  },
  _after(error, result) {
    if (error) {
      // _after 中 error 是原生 Error 对象，errCode 不会自动透传
      // 必须手动返回 { errCode, errMsg } 格式前端才能收到
      if (error.errCode) {
        return { errCode: error.errCode, errMsg: error.errMsg || '' }
      }
      throw error
    }
    return result
  },
  list, update, create, detail, remove
}
```

> **两种方法注册模式**：
> - **轻量模式**（推荐小项目用）：每个文件直接导出 async function，如上所示
> - **配置注册模式**（`uni-id-co` 的方式）：每个文件导出 `{ _config: { label, needUser, needPermission }, _handler: async function(){} }` 对象，统一注册器批量挂载并读取配置做权限控制。后续如需声明式权限可升级到此模式

**② 每个方法一个文件，不超过 150 行**

```js
// module/order/create.js
const { ERROR } = require('../../common/error')

/**
 * 创建订单
 * @param {Object} params
 * @param {String} params.title   订单标题
 * @param {Number} params.amount  金额
 */
module.exports = async function (params = {}) {
  // 参数校验
  if (!params.title || !params.amount) {
    throw { errCode: ERROR.PARAM_REQUIRED }
  }
  // 业务逻辑（通常 20-50 行）
  const db = uniCloud.database()
  return await db.collection('orders').add({
    title: params.title,
    amount: params.amount,
    create_date: Date.now()
  })
}
```

**③ 业务域桶文件汇总**

```js
// module/order/index.js
module.exports = {
  create: require('./create'),
  detail: require('./detail'),
  remove: require('./remove')
}
```

### 文件大小控制策略

| 当文件超过 150 行 | 怎么做 |
|---|---|
| `index.obj.js` 太长 | 逻辑移到 `module/` 下新子目录，`index.obj.js` 只保留 import/export |
| `module/x/foo.js` 太长 | 拆成 `foo.js` + `foo-helper.js`，或者把共用逻辑提到 `common/utils.js` |
| `_before()` 太长 | 拆到 `middleware/` 目录，`_before` 里逐行调用 |
| 错误码散落各处 | 集中到 `common/error.js`，用对象管理 |

> **AI 开发注意**：向 AI 描述需求时，明确要求**每个方法创建独立文件**到 `module/` 子目录，不要追加到 `index.obj.js`。`index.obj.js` 只做 import + export。

### 前端调用

```js
const xxxCo = uniCloud.importObject('xxx-co')
const list = await xxxCo.list({ page: 1, pageSize: 20 })
await xxxCo.create({ title: 'test', amount: 100 })
```

### 参考文件

| 模板 | 路径 | 适用场景 |
|---|---|---|
| **简单模板** | `uniCloud-alipay/cloudfunctions/template-simple/` | 单表 CRUD，一个文件搞定 |
| **复杂模板** | `uniCloud-alipay/cloudfunctions/template-complex/` | 多业务域、按模块拆文件 |
| **官方参考** | `uni_modules/uni-id-pages/uniCloud/cloudfunctions/uni-id-co/` | 官方最佳实践（配置注册模式） |

> 复制模板目录 → 改名为你的云对象名 → 修改业务逻辑即可。

## 传统云函数（旧代码，新功能不用此方式）

### 文件结构

```
uniCloud-alipay/cloudfunctions/
└── xxx/                # 目录名 = 云函数名
    └── index.js        # 入口文件
```

### 模板

```js
const db = uniCloud.database()

exports.main = async (event, context) => {
  const { action, params } = event

  switch (action) {
    case 'list':
      return await db.collection('xxx').get()
    case 'add':
      return await db.collection('xxx').add(params)
    case 'update':
      return await db.collection('xxx').doc(params.id).update(params.data)
    case 'remove':
      return await db.collection('xxx').doc(params.id).remove()
    default:
      return { code: 404, msg: '未知操作' }
  }
}
```

### 前端调用

```js
const res = await uniCloud.callFunction({
  name: 'xxx',
  data: { action: 'list', params: { page: 1 } }
})
```

### 参考文件

`uniCloud-alipay/cloudfunctions/uni-upgrade-center/` — 完整的传统云函数示例

## uniCloud 数据库操作速查

```js
const db = uniCloud.database()
const dbCmd = db.command

// 查询
await db.collection('xxx').where({ status: 1 }).get()
await db.collection('xxx').doc('id').get()

// 新增
await db.collection('xxx').add({ name: 'test' })

// 更新
await db.collection('xxx').doc('id').update({ name: 'new' })

// 删除
await db.collection('xxx').doc('id').remove()

// 条件
.where({ age: dbCmd.gt(18) })           // age > 18
.where({ status: dbCmd.in([0, 1]) })    // status in [0, 1]
.where({ name: dbCmd.like('%张%') })    // 模糊查询

// 联表（JQL 语法，unicloud-db 组件中使用）
// field 中用外键关联：field="name,role_id{name}"
```

## 依赖管理

云函数/云对象的依赖放在 `cloudfunctions/common/` 或通过 `uni_modules` 引入：

```js
// 使用公共模块
const uniId = require('uni-id-common')

// 使用 uni_modules
const uniPay = require('uni-pay')
```

## ⚠️ uni_modules 与虚拟合并机制

uni_modules 可以包含自己的 `uniCloud/` 目录（云函数 + 数据库 schema）。

**HBuilderX** 会将 uni_modules 内的 uniCloud 内容以**快捷方式**形式，虚拟显示到项目 `uniCloud-alipay/` 目录下（图标带小箭头）。文件实际物理位置在 `uni_modules/<id>/uniCloud/`。

**VSCode** 不做虚拟合并，只显示真实文件系统。因此 `uniCloud-alipay/` 目录下看起来"空"——不代表云端没有，只是文件在 uni_modules 里。

### 已有 uni_modules 云函数/公共模块

| 来源 | 内容 |
|---|---|
| `uni_modules/uni-id-pages` | `cloudfunctions/uni-id-co` — 用户认证云对象 |
| `uni_modules/uni-captcha` | `cloudfunctions/uni-captcha-co` + `common/uni-captcha` — 验证码 |
| `uni_modules/uni-id-common` | `common/uni-id-common` — uni-id 公共模块 |
| `uni_modules/uni-config-center` | `common/uni-config-center` — 配置中心 |
| `uni_modules/uni-cloud-s2s` | `common/uni-cloud-s2s` — 服务端通信 |
| `uni_modules/uni-open-bridge-common` | `common/uni-open-bridge-common` — 开放平台桥接 |

### 已有 uni_modules 数据库 schema

| 来源 | 表 |
|---|---|
| `uni_modules/uni-id-pages` | `opendb-department`、`opendb-device`、`opendb-frv-logs`、`uni-id-device`、`uni-id-log` |
| `uni_modules/uni-captcha` | `opendb-verify-codes` |
| `uni_modules/uni-open-bridge-common` | `opendb-open-data` |

### 命名冲突规则

| 新建内容 | 风险 | 结论 |
|---|---|---|
| 新建云函数/云对象，名字不跟上面表格重复 | 无冲突 | ✅ 安全 |
| 新建数据库 schema，集合名不跟上面表格重复 | 无冲突 | ✅ 安全 |
| 新建的叫 `uni-id-co` 或 `opendb-department` | 会与 uni_modules 冲突，部署时相互覆盖 | ❌ 禁止 |

**开发前先查上表，避免重名。**

## 开发 checklist

- [ ] 确定用云对象还是云函数（新功能默认云对象）
- [ ] 目录名 = 云对象名，文件名 = `xxx.obj.js`（云对象必须 `.obj.js` 后缀）
- [ ] `_before()` 中做了权限校验（云对象）
- [ ] `index.obj.js` 只做 import/export，不写业务
- [ ] 每个方法一个文件，不超过 150 行
- [ ] 共用逻辑提到 `common/` 目录
- [ ] 错误码统一放在 `common/error.js`
- [ ] 数据库操作前检查参数合法性
- [ ] 云函数/数据库表名不与 uni_modules 冲突
- [ ] 错误信息对前端友好（用户能看懂）
- [ ] 如需定时触发，在 `uniCloud` 控制台配置定时器
