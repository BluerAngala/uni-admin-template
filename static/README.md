# static/

静态资源目录。存放不会被构建工具处理的文件（字体、图片等）。

## 文件

| 文件 | 用途 |
|---|---|
| `admin-icons.ttf` | admin 自定义图标字体文件（配合 `common/admin-icons.css` 使用） |
| `logo.png` | 应用 Logo 图片（显示在 topWindow 导航栏） |

## 注意

`static/` 下的文件在 HBuilderX 构建时会原样复制到产出目录，不做编译或压缩处理。
