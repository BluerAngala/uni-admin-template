// ========================================
// 创建订单
// 每个方法一个文件，一个文件不超过 150 行
// ========================================

const db = uniCloud.database()
const { ERROR } = require('../../common/error')

/**
 * 创建订单
 * @param {Object} params
 * @param {String} params.title    订单标题
 * @param {Number} params.amount   金额
 * @param {String} params.remark   备注（可选）
 */
module.exports = async function (params = {}) {
  // ---- 参数校验 ----
  if (!params.title) throw { errCode: ERROR.PARAM_REQUIRED, errMsg: '缺少订单标题' }
  if (!params.amount || params.amount <= 0) throw { errCode: ERROR.PARAM_INVALID, errMsg: '金额不合法' }

  // ---- 业务处理 ----
  const data = {
    title: params.title,
    amount: params.amount,
    remark: params.remark || '',
    status: 0,
    // 从 _before 中获取的上下文
    // uid: this._uid,
    create_date: Date.now(),
    update_date: Date.now()
  }

  const res = await db.collection('orders').add(data)
  return { _id: res.id, ...data }
}
