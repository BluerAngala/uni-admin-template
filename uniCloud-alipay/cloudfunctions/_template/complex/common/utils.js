// ========================================
// 通用工具函数
// ========================================

function parsePage({ page = 1, pageSize = 20 } = {}) {
  return {
    page: Math.max(1, Number(page)),
    pageSize: Math.min(100, Math.max(1, Number(pageSize) || 20))
  }
}

module.exports = { parsePage }
