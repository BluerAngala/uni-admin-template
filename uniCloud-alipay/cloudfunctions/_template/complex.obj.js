// ========================================
// 复杂模板 — 模块化云对象
// 适用：多业务域、逻辑复杂、方法多
// 用法：复制文件 + 拆 module/ 目录
// 参考: uni_modules/uni-id-pages/uniCloud/cloudfunctions/uni-id-co
// ========================================

const { ERROR } = require('./common/error')
const { parsePage } = require('./common/utils')

module.exports = {
  _before() {
    const token = this.getUniIdToken()
    if (!token) throw { errCode: ERROR.NOT_LOGIN }
    this._uid = token.uid
  },
  _after(error, result) {
    if (error) {
      if (error.errCode) return { errCode: error.errCode, errMsg: error.errMsg || '' }
      throw error
    }
    return result
  },

  // ---- 方法入口（每个方法可拆到 module/ 下独立文件） ----

  async create(params) {
    if (!params.title) throw { errCode: ERROR.PARAM_REQUIRED, errMsg: '缺少标题' }
    const db = uniCloud.database()
    return await db.collection('collection_name').add({
      ...params,
      create_date: Date.now(),
      uid: this._uid
    })
  },

  async list(params) {
    const { page, pageSize } = parsePage(params)
    const db = uniCloud.database()
    const res = await db.collection('collection_name')
      .where(params.where || {})
      .skip((page - 1) * pageSize).limit(pageSize)
      .orderBy('create_date', 'desc').get()
    const countRes = await db.collection('collection_name').where(params.where || {}).count()
    return { data: res.data, total: countRes.total, page, pageSize }
  },

  async detail({ id } = {}) {
    if (!id) throw { errCode: ERROR.PARAM_REQUIRED, errMsg: '缺少 ID' }
    const db = uniCloud.database()
    const res = await db.collection('collection_name').doc(id).get()
    if (!res.data.length) throw { errCode: ERROR.NOT_FOUND, errMsg: '记录不存在' }
    return res.data[0]
  },

  async update({ id, data } = {}) {
    if (!id) throw { errCode: ERROR.PARAM_REQUIRED, errMsg: '缺少 ID' }
    const db = uniCloud.database()
    return await db.collection('collection_name').doc(id).update(data)
  },

  async remove({ id } = {}) {
    if (!id) throw { errCode: ERROR.PARAM_REQUIRED, errMsg: '缺少 ID' }
    const db = uniCloud.database()
    return await db.collection('collection_name').doc(id).remove()
  }
}
