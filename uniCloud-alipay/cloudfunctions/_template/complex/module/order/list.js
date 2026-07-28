// ========================================
// 订单列表（分页查询）
// ========================================

const db = uniCloud.database()
const { parsePage } = require('../../common/utils')

module.exports = async function (params = {}) {
  const { page, pageSize } = parsePage(params)

  const res = await db.collection('orders')
    .where(params.where || {})
    .skip((page - 1) * pageSize).limit(pageSize)
    .orderBy('create_date', 'desc').get()

  const { total } = await db.collection('orders')
    .where(params.where || {}).count()

  return { data: res.data, total, page, pageSize }
}
