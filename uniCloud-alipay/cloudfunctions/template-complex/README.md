# 复杂模板 — 模块化云对象

适用于业务逻辑复杂的场景，按模块拆分文件。

## 目录结构

```
template-complex/
├── index.obj.js           # 入口：组装模块 + 生命周期
├── package.json
├── common/
│   ├── error.js           # 错误码定义
│   └── utils.js           # 通用工具函数
└── module/                # 按业务域分组
    └── order/             # 示例：订单模块
        ├── index.js       # 桶文件
        ├── create.js      # 每个方法一个文件
        ├── list.js
        └── detail.js
```

## 用法

复制整个 `template-complex/` 目录，改名为你的云对象名，替换 `module/` 下的业务文件。
