// ========================================
// 桶文件 — 导出 order 域所有方法
// 新增方法时在这里加一行
// ========================================

module.exports = {
  create: require('./create'),
  list: require('./list'),
  detail: require('./detail'),
  remove: require('./remove')
}
