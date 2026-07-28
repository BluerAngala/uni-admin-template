// ========================================
// 错误码定义
// 集中管理，避免散落在各方法文件中
// ========================================

module.exports = {
  // 通用
  SUCCESS: 0,
  UNKNOWN: 'UNKNOWN_ERROR',
  NOT_LOGIN: 'uni-id-token-expired',     // 借用 uni-id 的 token 过期错误码
  PARAM_REQUIRED: 'PARAM_REQUIRED',
  PARAM_INVALID: 'PARAM_INVALID',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',

  // 业务（按需扩展）
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  ORDER_STATUS_INVALID: 'ORDER_STATUS_INVALID'
}
