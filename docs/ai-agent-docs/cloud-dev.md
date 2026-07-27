# 开发云函数/云对象

## 先决定：云对象还是云函数？

| | 云对象（`.obj.js`） | 传统云函数（`index.js`） |
|---|---|---|
| 调用方式 | `uniCloud.importObject('name')` | `uniCloud.callFunction({ name })` |
| 代码结构 | 对象方法，天然分 action | switch/case 分发 action |
| 生命周期 | `_before()` / `_after()` 钩子 | 无内置钩子 |
| 本项目中 | 新功能推荐用这个 | 历史代码用这个 |

**判断依据：** 新功能用云对象，已有传统云函数就继续用传统方式，不需要迁移。

## 云对象开发

### 文件结构

```
uniCloud-alipay/cloudfunctions/
└── xxx-co/                    # 目录名 = 云对象名
    └── xxx-co.obj.js          # 文件名 = 云对象名.obj.js
```

### 模板

```js
const db = uniCloud.database()
const dbCmd = db.command

module.exports = {
  _before() {
    // 每次方法调用前执行
    // 权限校验、参数预处理
    const token = this.getUniIdToken()
    if (!token) throw new Error('未登录')
  },

  _after(error, result) {
    if (error) throw error
    return result
  },

  async list({ page = 1, pageSize = 20, where = '' } = {}) {
    let query = db.collection('collection_name')
    if (where) query = query.where(where)
    const res = await query.skip((page - 1) * pageSize)
      .limit(pageSize).orderBy('create_date', 'desc').get()
    return res.data
  },

  async add(data) {
    return await db.collection('collection_name').add(data)
  },

  async update(id, data) {
    return await db.collection('collection_name').doc(id).update(data)
  },

  async remove(id) {
    return await db.collection('collection_name').doc(id).remove()
  }
}
```

### 前端调用

```js
const xxxCo = uniCloud.importObject('xxx-co')
const list = await xxxCo.list({ page: 1, pageSize: 20 })
await xxxCo.add({ name: 'test' })
```

### 参考文件

`uniCloud-alipay/cloudfunctions/uni-sms-co/` — 完整的云对象示例

## 传统云函数开发

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

- [ ] 确定用云对象还是云函数
- [ ] 文件名和目录名一致（云对象必须 `.obj.js` 后缀）
- [ ] `_before()` 中做了权限校验（云对象）
- [ ] 数据库操作前检查参数合法性
- [ ] 云函数/数据库表名不与 uni_modules 冲突
- [ ] 错误信息对前端友好（用户能看懂）
- [ ] 如需定时触发，在 `uniCloud` 控制台配置定时器
