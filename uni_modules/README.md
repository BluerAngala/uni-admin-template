# uni_modules/

uni_modules 插件市场模块。通过 HBuilderX 插件机制管理，所有依赖通过此目录内置，无需 npm 安装。

## 核心模块

| 模块 | 用途 |
|---|---|
| `uni-id-pages` | 认证页面套件（登录/注册/找回密码/用户信息）+ 云对象 `uni-id-co` |
| `uni-id-common` | uni-id 公共云函数模块 |
| `uni-upgrade-center` | 应用升级中心（页面 + 云函数） |
| `uni-cloud-router` | 云函数路由 |
| `uni-cloud-s2s` | 服务端到服务端通信 |
| `uni-config-center` | 配置中心（各模块配置 JSON 集中管理） |

## UI 组件模块

| 模块 | 说明 |
|---|---|
| `uni-forms` | 表单组件（含校验） |
| `uni-table` | 表格组件 |
| `uni-pagination` | 分页 |
| `uni-data-picker` | 数据选择器（级联） |
| `uni-data-select` | 数据下拉选择 |
| `uni-data-checkbox` | 数据多选 |
| `uni-easyinput` | 增强输入框 |
| `uni-datetime-picker` | 日期时间选择 |
| `uni-file-picker` | 文件选择/上传 |
| `uni-popup` | 弹出层 |
| `uni-icons` | 图标字体 |
| `uni-badge` | 角标 |
| `uni-tag` | 标签 |
| `uni-card` | 卡片 |
| `uni-list` | 列表 |
| `uni-drawer` | 抽屉 |
| `uni-fab` | 悬浮按钮 |
| `uni-link` | 超链接 |
| `uni-notice-bar` | 通知栏 |
| `uni-segmented-control` | 分段控制器 |
| `uni-tooltip` | 提示工具 |
| `uni-transition` | 过渡动画 |
| `uni-load-more` | 加载更多 |
| `uni-number-box` | 数字输入 |
| `uni-combox` | 下拉选择 |
| `uni-breadcrumb` | 面包屑 |
| `uni-group` | 分组容器 |
| `uni-dateformat` | 日期格式化 |

## 其他模块

| 模块 | 说明 |
|---|---|
| `qiun-data-charts` | 图表组件（基于 u-charts/echarts） |
| `uni-scss` | SCSS 公共样式变量 |
| `uni-captcha` | 验证码 |
| `uni-feedback` | 反馈模块 |
| `uni-sign-in` | 签到模块 |
| `uni-open-bridge-common` | 开放平台桥接 |

## 注意事项

- 不要手动修改 `uni_modules/` 下的文件，通过 HBuilderX 插件市场更新
- 如需扩展模块行为，使用 `uni_modules/` 的扩展机制（如 `easycom` 自动注册）
