# js_sdk/ext-storage/

扩展存储上传工具。封装 uniCloud 扩展存储的文件上传能力，供 `App.vue` 在启动时配置上传服务。

## 文件

| 文件 | 职责 |
|---|---|
| `uploadFileForExtStorage.js` | 文件上传工具 — 将本地文件上传到 uniCloud 扩展存储空间 |

## 使用场景

`App.vue` 中引入此模块，配置扩展存储的上传参数（如 bucket、region），用于 Logo 等静态资源的云端存储。
