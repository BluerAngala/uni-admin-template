// ========================================
// 订单列表（分页查询）
// ========================================

const db = uniCloud.database()
const { ERROR } = require('../../common/error')
const { parsePage } = require('../../common/utils')

/**
 * 订单列表
 * @param {Object} params
 * @param {Number} params.page       页码（默认 1）
 * @param {Number} params.pageSize   每页条数（默认 20）
 * @param {Object} params.where      查询条件
 */
module.exports = async function (params = {}) {
  const { page, pageSize } = parsePage(params)
  const where = params.where || {}

  const res = await db.collection('orders')
    .where(where)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .orderBy('create_date', 'desc')
    .get()

  const countRes = await db.collection('orders').where(where).count()

  return {
    data: res.data,
    total: countRes.total,
    page,
    pageSize
  }
}
