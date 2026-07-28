# 云对象开发模板

新建云对象时直接复制使用，不要直接在此目录修改。

## 使用方式

```bash
# 简单 CRUD（单文件）
cp -r _template/simple.obj.js my-co/index.obj.js

# 模块化（多文件）
cp -r _template/complex my-co
```

## 模板说明

### simple.obj.js

单表 CRUD 模板，所有方法写在一个文件里。适用于：

- 简单的增删改查
- 不需要拆 module 的小业务

方法：`list` / `create` / `detail` / `update` / `remove`

### complex/

模块化模板，每个方法一个文件，适用于：

- 业务逻辑复杂、方法多
- 需要拆分成多个业务域

```
complex/
├── index.obj.js            # 入口（只 import/export）
├── package.json
├── common/
│   ├── error.js            # 错误码定义
│   └── utils.js            # 工具函数
└── module/
    └── order/              # 示例：订单模块
        ├── index.js        # 桶文件
        ├── create.js       # 每个方法一个文件
        ├── list.js
        ├── detail.js
        └── remove.js
```

## ⚠️ 注意

- 简单模板复制单文件即可，无需 `package.json`
- 复杂模板复制整个 `complex/` 目录，改名为你的云对象名
- 修改 `collection_name` 和字段为你实际的表名和字段
- 新建的云函数/数据库表名不要和 uni_modules 已有的冲突（详见 `docs/ai-agent-docs/cloud-dev.md`）
