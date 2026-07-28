// ========================================
// 创建订单
// 每个方法一个文件，不超过 150 行
// ========================================

const db = uniCloud.database()
const { ERROR } = require('../../common/error')

module.exports = async function (params = {}) {
  if (!params.title) throw { errCode: ERROR.PARAM_REQUIRED, errMsg: '缺少标题' }

  return await db.collection('orders').add({
    title: params.title,
    amount: params.amount || 0,
    status: 0,
    create_date: Date.now()
  })
}
