# 开发新页面

## 流程

1. 在 `pages.json` 中注册页面路径（主包或分包）
2. 创建 `.vue` 文件
3. 如需数据库操作，用 `<unicloud-db>` 组件
4. 如需菜单入口，在 `opendb-admin-menus` 表中添加记录

## 页面模板

所有管理页面遵循统一结构，参考 `pages/system/role/list.vue`：

```vue
<template>
  <fix-top-window>
    <template #header>
      <uni-stat-breadcrumb />
      <view class="uni-stat--btn-group">
        <button class="uni-stat--btn" @click="navigateTo('./add')">新增</button>
      </view>
    </template>
    <unicloud-db ref="udb" v-slot:default="{data, pagination, loading, error}"
      collection="集合名" field="字段1,字段2" :where="where"
      :orderby="orderby" :page-size="20">
      <uni-table :loading="loading" :border="true">
        <uni-tr>
          <uni-th>列名</uni-th>
          <uni-th>操作</uni-th>
        </uni-tr>
        <uni-tr v-for="item in data" :key="item._id">
          <uni-td>{{item.name}}</uni-td>
          <uni-td>
            <button @click="navigateTo('./edit?id=' + item._id)">编辑</button>
            <button @click="udb.remove(item._id)">删除</button>
          </uni-td>
        </uni-tr>
      </uni-table>
      <uni-pagination :current="pagination.current" :total="pagination.total" />
    </unicloud-db>
  </fix-top-window>
</template>
```

新增/编辑页：用 `<unicloud-db>` 的 `@submit` 方法直接写库，参考 `pages/system/role/add.vue`。

## uni-app 页面必须知道的

### 不用 HTML 标签

| ❌ Web | ✅ uni-app |
|---|---|
| `<div>` | `<view>` |
| `<span>` | `<text>` |
| `<a href="...">` | `<navigator url="...">` |
| `<img>` | `<image src="..." mode="aspectFit" />` |
| `<ul>` / `<li>` | `<view>` + `v-for` |
| `<input>` | `<input>`（样式差异大） |

### 不用 vue-router

```js
// ❌ 错误
this.$router.push({ path: '/user', query: { id: '123' } })
this.$route.query.id

// ✅ 正确
uni.navigateTo({ url: '/pages/system/user/edit?id=123' })
uni.switchTab({ url: '/pages/index/index' })  // tabBar 页面必须用这个
uni.navigateBack({ delta: 1 })
```

### 不用 DOM 操作

```js
// ❌ 错误
document.getElementById('box').style.display = 'none'
this.$refs.box.getBoundingClientRect()

// ✅ 正确 — 数据驱动
<view v-if="isVisible">...</view>

// ✅ 获取节点信息
const query = uni.createSelectorQuery()
query.select('.box').boundingClientRect(rect => {
  console.log(rect.width, rect.height)
}).exec()
```

### 页面生命周期

```js
export default {
  onLoad(options) {
    // 页面加载，路由参数在这里拿
    const id = options.id
  },
  onShow() {
    // 页面显示（从后台切回也会触发）
  },
  onReady() {
    // 首次渲染完成
  },
  onHide() {
    // 页面隐藏
  }
}
```

注意：页面用 `onLoad` 不是 `created`/`mounted`，路由参数在 `onLoad(options)` 里拿。

### CSS 用 rpx

```css
/* ❌ 错误 */
.container { width: 100vw; font-size: 1rem; }

/* ✅ 正确 — 750rpx = 屏幕宽度 */
.container { width: 750rpx; font-size: 28rpx; }
```

### 不用 localStorage

```js
// ❌ 错误
localStorage.setItem('key', value)
localStorage.getItem('key')

// ✅ 正确
uni.setStorageSync('key', value)
uni.getStorageSync('key')
```

## 新页面 checklist

- [ ] `pages.json` 中已注册路径
- [ ] 用 `<fix-top-window>` 包裹（管理页必须）
- [ ] 标签全部是 uni-app 标签（view/text/image/navigator）
- [ ] 跳转用 `uni.navigateTo`，不用 vue-router
- [ ] CSS 用 rpx，不用 rem/vh/vw
- [ ] 生命周期用 `onLoad`/`onShow`，不用 `mounted`
- [ ] 如需菜单入口，已添加到 `opendb-admin-menus`
