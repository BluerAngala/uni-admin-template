# 系统管理功能开发

本文档覆盖用户/角色/权限/菜单/应用/标签等管理后台 CRUD 功能的开发规范。

## 核心概念

### 权限模型

```
用户 (uni-id-users)
  └─ 角色 (uni-id-roles)        ← 一个用户可有多个角色
       └─ 权限 (uni-id-permissions) ← 一个角色可有多个权限
```

- `admin` 角色跳过所有权限检查
- `$hasPermission('permission_name')` — 检查当前用户是否有某权限
- `$hasRole('role_name')` — 检查当前用户是否有某角色

### 菜单系统

菜单存储在 `opendb-admin-menus` 集合，树形结构：

```json
{
  "menu_id": "system_user",
  "name": "用户管理",
  "icon": "person",
  "url": "/pages/system/user/list",
  "parent_id": "system",       // 父菜单 _id，顶级为空
  "sort": 1,
  "permission": ["system_user_list"]  // 需要的权限
}
```

- `windows/leftWindow.vue` 中的 `uni-data-menu` 组件自动加载并按权限过滤
- 新增页面必须在此表中添加记录才能出现在侧边栏

### 数据库 Schema（opendb 规范）

每个数据集合 3 个文件：

```
uniCloud-alipay/database/opendb-xxx/
├── opendb-xxx.schema.json      # 字段 + 权限
├── opendb-xxx.index.json       # 索引
└── opendb-xxx.init_data.json   # 初始数据（通常 []）
```

**schema 权限规则写法（JQL auth）：**

```json
{
  "permission": {
    "read": true,
    "create": "auth.uid != null",
    "update": "auth.uid == doc.user_id || auth.role.includes('admin')",
    "delete": "auth.role.includes('admin')"
  }
}
```

## CRUD 页面开发

### 列表页

参考 `pages/system/role/list.vue`：

```vue
<template>
  <fix-top-window>
    <template #header>
      <uni-stat-breadcrumb />
      <view class="uni-stat--btn-group">
        <button @click="navigateTo('./add')">新增</button>
      </view>
    </template>
    <unicloud-db ref="udb" v-slot:default="{data, pagination, loading}"
      collection="opendb-xxx" field="name,status,create_date"
      :where="where" :page-size="20">
      <uni-table :loading="loading" :border="true">
        <uni-tr>
          <uni-th>名称</uni-th>
          <uni-th>状态</uni-th>
          <uni-th>操作</uni-th>
        </uni-tr>
        <uni-tr v-for="item in data" :key="item._id">
          <uni-td>{{item.name}}</uni-td>
          <uni-td>{{item.status === 1 ? '启用' : '禁用'}}</uni-td>
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

**关键点：**
- `<unicloud-db>` 绑定集合名（不是 API URL）
- `v-slot:default="{data, pagination, loading}"` 拿数据
- 删除直接调 `udb.remove(id)`
- 筛选用 `:where` 绑定字符串条件

### 新增页

参考 `pages/system/role/add.vue`：

```vue
<template>
  <fix-top-window>
    <template #header>
      <uni-stat-breadcrumb />
    </template>
    <uni-forms ref="form" :model="formData" :rules="rules">
      <uni-forms-item label="名称" name="name" required>
        <uni-easyinput v-model="formData.name" />
      </uni-forms-item>
    </uni-forms>
    <button @click="submit">提交</button>
  </fix-top-window>
</template>

<script>
export default {
  data() {
    return {
      formData: { name: '' },
      rules: { name: { rules: [{ required: true, errorMessage: '请输入名称' }] } }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate().then(() => {
        // 通过 unicloud-db 的 add 方法写库
        // 或直接用云对象
      })
    }
  }
}
</script>
```

### 编辑页

参考 `pages/system/role/edit.vue`：

- `onLoad(options)` 中接收 `id` 参数
- 用 `<unicloud-db>` 的 `:where` 条件加载单条记录
- `@submit` 提交更新

## 表单校验

使用 `uni-forms` + `uni-forms-item`：

```vue
<uni-forms ref="form" :model="formData" :rules="rules">
  <uni-forms-item label="名称" name="name" required>
    <uni-easyinput v-model="formData.name" />
  </uni-forms-item>
</uni-forms>
```

校验规则定义：

```js
rules: {
  name: {
    rules: [
      { required: true, errorMessage: '请输入名称' },
      { minLength: 2, maxLength: 20, errorMessage: '名称长度2-20个字符' }
    ]
  }
}
```

## validator 文件

`js_sdk/validator/` 下按集合名提供 `enumConverter`（枚举值转显示文本）和 `filterToWhere`（筛选条件转 JQL where），供列表页筛选使用。

参考：`js_sdk/validator/opendb-admin-menus.js`

## 新增管理功能 checklist

- [ ] 数据库 schema 3 文件已创建（schema + index + init_data）
- [ ] schema 中 permission 已配置（特别是 delete 限制 admin）
- [ ] 列表/新增/编辑页面已创建
- [ ] `pages.json` 中已注册所有新页面路径
- [ ] `opendb-admin-menus` 中已添加菜单记录
- [ ] 如需自定义权限，在 `uni-id-permissions` 中添加
- [ ] 如需筛选功能，`js_sdk/validator/` 中添加对应 validator
