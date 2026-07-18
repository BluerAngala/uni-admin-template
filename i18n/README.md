# i18n/

国际化资源。基于 `vue-i18n`，支持简体中文、繁体中文和英文三种语言。

## 文件

| 文件 | 语言 |
|---|---|
| `zh-Hans.json` | 简体中文（默认） |
| `zh-Hant.json` | 繁体中文 |
| `en.json` | 英文 |
| `index.js` | i18n 实例初始化 — 加载语言包，导出 i18n 实例 |

## 使用方式

```js
// 组件中
this.$t('keyName')

// 模板中
{{ $t('keyName') }}
```

## 切换语言

通过 `topWindow.vue` 中的语言切换按钮，修改 Vuex `app` 模块中的 `locale` 状态。

## 添加新语言

1. 在 `i18n/` 下新建 `xx.json` 语言包文件
2. 在 `index.js` 中 import 并注册到 messages
3. 在 `topWindow.vue` 的语言切换菜单中添加选项
