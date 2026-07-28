// ========================================
// 简单模板 — 单表 CRUD
// 适用：简单的增删改查，不需要复杂权限
// 复制此目录 + 改名为你的云对象
// ========================================

const db = uniCloud.database()

// ---------- 公共方法 ----------

/** 通用分页查询 */
async function list({ page = 1, pageSize = 20, where = {} } = {}) {
  const res = await db.collection('collection_name')
    .where(where)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .orderBy('create_date', 'desc')
    .get()
  const countRes = await db.collection('collection_name').where(where).count()
  return {
    data: res.data,
    total: countRes.total,
    page,
    pageSize
  }
}

/** 新增 */
async function create(data) {
  return await db.collection('collection_name').add(data)
}

/** 根据 ID 查询详情 */
async function detail(id) {
  const res = await db.collection('collection_name').doc(id).get()
  if (!res.data.length) throw { errCode: 'NOT_FOUND', errMsg: '记录不存在' }
  return res.data[0]
}

/** 更新 */
async function update(id, data) {
  return await db.collection('collection_name').doc(id).update(data)
}

/** 删除 */
async function remove(id) {
  return await db.collection('collection_name').doc(id).remove()
}

// ---------- 导出 ----------

module.exports = {
  _before() {
    // 权限校验
    const token = this.getUniIdToken()
    if (!token) throw new Error('未登录')
  },
  _after(error, result) {
    if (error) {
      // _after 中 error 是原生 Error，errCode 不会自动透传
      if (error.errCode) {
        return { errCode: error.errCode, errMsg: error.errMsg || '' }
      }
      throw error
    }
    return result
  },
  list,
  create,
  detail,
  update,
  remove
}
