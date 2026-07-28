// ========================================
// 订单详情
// ========================================

const db = uniCloud.database()
const { ERROR } = require('../../common/error')

module.exports = async function ({ id } = {}) {
  if (!id) throw { errCode: ERROR.PARAM_REQUIRED, errMsg: '缺少 ID' }

  const res = await db.collection('orders').doc(id).get()
  if (!res.data.length) throw { errCode: ERROR.NOT_FOUND, errMsg: '订单不存在' }

  return res.data[0]
}
