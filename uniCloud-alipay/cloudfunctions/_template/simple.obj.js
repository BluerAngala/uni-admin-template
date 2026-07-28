// ========================================
// 简单模板 — 单表 CRUD
// 适用：简单的增删改查
// 用法：复制此文件到你的云对象目录，改名 + 改 collection_name
// ========================================

const db = uniCloud.database()

module.exports = {
  _before() {
    const token = this.getUniIdToken()
    if (!token) throw new Error('未登录')
  },
  _after(error, result) {
    if (error) {
      if (error.errCode) return { errCode: error.errCode, errMsg: error.errMsg || '' }
      throw error
    }
    return result
  },

  /** 分页列表 */
  async list({ page = 1, pageSize = 20, where = {} } = {}) {
    const res = await db.collection('collection_name')
      .where(where)
      .skip((page - 1) * pageSize).limit(pageSize)
      .orderBy('create_date', 'desc').get()
    const countRes = await db.collection('collection_name').where(where).count()
    return { data: res.data, total: countRes.total, page, pageSize }
  },

  /** 新增 */
  async create(data) {
    return await db.collection('collection_name').add(data)
  },

  /** 详情 */
  async detail(id) {
    const res = await db.collection('collection_name').doc(id).get()
    if (!res.data.length) throw { errCode: 'NOT_FOUND', errMsg: '记录不存在' }
    return res.data[0]
  },

  /** 更新 */
  async update(id, data) {
    return await db.collection('collection_name').doc(id).update(data)
  },

  /** 删除 */
  async remove(id) {
    return await db.collection('collection_name').doc(id).remove()
  }
}
