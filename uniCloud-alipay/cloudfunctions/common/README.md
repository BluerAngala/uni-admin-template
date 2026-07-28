# common/

云函数公共模块目录。存放可被多个云函数共享引用的模块。

> ⚠️ HBuilderX 会将 uni_modules 自带的公共模块以快捷方式形式虚拟显示在此目录下（图标带小箭头）。文件实际在 `uni_modules/<id>/uniCloud/cloudfunctions/common/` 中。VSCode 无此功能。
> 详见 `docs/ai-agent-docs/cloud-dev.md`。

## 本目录模块

### uni-stat/

uni-stat 统计核心引擎，被 `uni-stat-cron` 和 `uni-stat-receiver` 共同引用。

```
uni-stat/
├── index.js            # 模块入口
├── package.json        # 模块元数据
├── shared/             # 共享工具
│   ├── create-api.js   # uniCloud API 创建器
│   ├── error.js        # 错误处理
│   ├── index.js        # 共享入口
│   └── utils.js        # 通用工具
└── stat/               # 统计主逻辑
    ├── stat.js         # 统计入口
    ├── receiver.js     # 数据接收处理
    ├── lib/            # 工具库
    │   ├── date.js     # 日期处理
    │   ├── index.js    # 工具入口
    │   └── uni-crypto.js # 加密工具
    └── mod/            # 各统计模块
        ├── index.js    # 模块注册入口
        ├── channel.js  # 渠道统计
        ├── device.js   # 设备统计
        ├── event.js    # 事件统计
        ├── loyalty.js  # 留存统计
        ├── page.js     # 页面统计
        ├── errorLog.js # 错误日志
        └── ...         # 其他统计维度
```

## 引用方式

在云函数的 `package.json` 中声明依赖：

```json
{
  "dependencies": {
    "uni-stat": "file:../common/uni-stat"
  }
}
```

云函数中通过 `require('uni-stat')` 引入。
