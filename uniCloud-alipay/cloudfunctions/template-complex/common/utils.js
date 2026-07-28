// ========================================
// 通用工具函数
// ========================================

/** 获取客户端信息 */
function getClientInfo() {
  try {
    return this.getClientInfo()
  } catch (e) {
    return {}
  }
}

/** 分页参数标准化 */
function parsePage({ page = 1, pageSize = 20 } = {}) {
  return {
    page: Math.max(1, Number(page)),
    pageSize: Math.min(100, Math.max(1, Number(pageSize) || 20))
  }
}

module.exports = {
  getClientInfo,
  parsePage
}
