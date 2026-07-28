// ========================================
// 复杂模板 — 模块化云对象（入口文件）
// 用法：cp -r _template/complex my-co
//       改 my-co 下的业务逻辑
// ========================================

const { ERROR } = require('./common/error')
const { parsePage } = require('./common/utils')

// 从 module 目录导入各业务域方法
const { create, list, detail, remove } = require('./module/order/index')

module.exports = {
  _before() {
    const token = this.getUniIdToken()
    if (!token) throw { errCode: ERROR.NOT_LOGIN }
    this._uid = token.uid
  },
  _after(error, result) {
    if (error) {
      if (error.errCode) return { errCode: error.errCode, errMsg: error.errMsg || '' }
      throw error
    }
    return result
  },
  create, list, detail, remove
}
