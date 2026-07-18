# common/

全局样式资源。提供基础样式、主题变量和图标字体。

## 文件

| 文件 | 用途 |
|---|---|
| `uni.css` | uni-app 全局基础样式（reset、通用 class） |
| `theme.scss` | 主题切换样式 — 使用 `[data-theme='...']` mixin，覆盖 uni-ui 组件在不同主题下的表现 |
| `uni-icons.css` | uni-icons 图标字体样式 |
| `admin-icons.css` | admin 自定义图标字体样式 |

## 主题系统

1. `uni.scss` 中定义 `$themes` SCSS 变量（默认蓝 `#2979ff`、绿 `#42b983`）
2. `theme.scss` 通过 `@include theme('blue')` mixin 生成各主题的 CSS 变量覆盖
3. 运行时通过 `document.body.dataset.theme` 属性切换主题 class

## 引入方式

在 `App.vue` 中通过 `@import` 引入，全局生效。
