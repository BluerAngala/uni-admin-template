// ========================================
// 复杂模板 — 模块化云对象
// 适用：多业务域、复杂逻辑、多方法
// 文件结构见 README.md
// ========================================

const { ERROR } = require('./common/error')
const { getClientInfo } = require('./common/utils')

// 从 module 目录导入各业务域的方法
const { create, list, detail } = require('./module/order/index')

module.exports = {

  _before() {
    // ---- 权限校验 ----
    const token = this.getUniIdToken()
    if (!token) throw { errCode: ERROR.NOT_LOGIN }

    // ---- 客户端信息 ----
    const clientInfo = this.getClientInfo()
    this._clientInfo = clientInfo
    this._uid = token.uid

    // ---- 中间件 ----
    // 如果 middleware/ 目录逻辑复杂，可在这里逐行调用
    // require('./middleware/access-control').call(this)
  },

  _after(error, result) {
    if (error) {
      // 统一错误格式：{ errCode, errMsg } 前端才能收到
      if (error.errCode) {
        return {
          errCode: error.errCode,
          errMsg: error.errMsg || ''
        }
      }
      // 非标准错误直接抛（返回 HTTP 500）
      throw error
    }
    return result
  },

  // ---- 业务方法 ----
  create,
  list,
  detail
}
