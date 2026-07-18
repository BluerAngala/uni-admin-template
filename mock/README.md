# mock/

Mock 数据目录。用于 `pages/uni-stat/` 统计页面的本地开发和调试，模拟 uniCloud 数据库返回的统计数据。

## 结构

```
mock/
└── uni-stat/
    ├── db.js           # Mock 数据库查询入口（拦截 uniCloud.database() 调用）
    ├── appOverview.json    # 应用概览数据
    ├── appsDetail.json     # 应用详情数据
    ├── event.json          # 事件统计数据
    ├── pageContent.json    # 页面内容统计
    ├── pageEnt.json        # 入口页统计
    ├── pageRes.json        # 受访页统计
    └── pageRule.json       # 页面规则数据
```

## 使用方式

在开发环境中，`db.js` 拦截 uniCloud 数据库查询，返回对应的 JSON mock 数据。生产环境不加载此模块。
