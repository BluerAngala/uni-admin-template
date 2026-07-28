// ========================================
// 删除订单
// ========================================

const db = uniCloud.database()
const { ERROR } = require('../../common/error')

module.exports = async function ({ id } = {}) {
  if (!id) throw { errCode: ERROR.PARAM_REQUIRED, errMsg: '缺少 ID' }
  return await db.collection('orders').doc(id).remove()
}
