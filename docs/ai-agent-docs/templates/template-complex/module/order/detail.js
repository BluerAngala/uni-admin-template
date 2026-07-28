// ========================================
// 订单详情
// ========================================

const db = uniCloud.database()
const { ERROR } = require('../../common/error')

/**
 * 订单详情
 * @param {Object} params
 * @param {String} params.id  订单 ID
 */
module.exports = async function (params = {}) {
  if (!params.id) throw { errCode: ERROR.PARAM_REQUIRED, errMsg: '缺少订单 ID' }

  const res = await db.collection('orders').doc(params.id).get()
  if (!res.data.length) throw { errCode: ERROR.ORDER_NOT_FOUND, errMsg: '订单不存在' }

  return res.data[0]
}
