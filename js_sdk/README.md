# js_sdk/

项目核心 SDK 目录。所有自定义 JS 模块按功能领域分子目录存放，通过 `main.js` 统一挂载到 Vue 原型。

## 模块清单

| 目录 | 用途 | 挂载方式 |
|---|---|---|
| `uni-admin/` | Admin 框架核心（plugin、权限、请求、拦截器、嵌入模式） | `Vue.prototype.$request`、`$hasPermission` 等 |
| `uni-id-pages/` | 认证 SDK（登录/注册/Token/Store） | `$uniIdPagesStore` |
| `uni-stat/` | 统计工具（查询构建、数据格式化） | 按需 import |
| `validator/` | 数据集合校验器（`enumConverter`、`filterToWhere`） | 按需 import |
| `ext-storage/` | 扩展存储上传工具 | 按需 import |

## 全局助手（plugin.js 注入）

```js
Vue.prototype.$request          // 统一云函数/云对象请求
Vue.prototype.$hasPermission()  // 权限检查
Vue.prototype.$hasRole()        // 角色检查
Vue.prototype.$uniIdPagesStore  // 认证 Store
Vue.prototype.$formatDate()     // 日期格式化
Vue.prototype.$formatBytes()    // 文件大小格式化
```
