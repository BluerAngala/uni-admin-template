# js_sdk/uni-id-pages/

认证 SDK。管理登录状态、用户信息、Token 刷新等，与 `uni_modules/uni-id-pages/` 的页面配合使用。

## 文件

| 文件 | 职责 |
|---|---|
| `store.js` | 响应式认证 Store — 登录状态、用户信息、Token 管理 |

## 工作方式

1. 用户通过 `uni_modules/uni-id-pages/pages/login/` 页面完成登录
2. 登录成功后 Token 存入本地存储
3. `store.js` 提供 `$uniIdPagesStore` 响应式对象，页面可通过 `this.$uniIdPagesStore` 访问
4. `plugin.js` 将 store 挂载到 `Vue.prototype.$uniIdPagesStore`

## 关联文件

- `pages.json` 中 `uniIdRouter` 配置了登录页和需要登录的路由规则
- `js_sdk/uni-admin/embed.js` 处理 iframe 嵌入模式下的 Token 注入
