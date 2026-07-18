# 修改样式与主题

## CSS 必知

### 单位

```css
/* ✅ rpx — 响应式，750rpx = 屏幕宽度 */
.container { width: 750rpx; padding: 20rpx; font-size: 28rpx; }

/* ✅ px — 固定像素，不随屏幕缩放 */
.border { border-width: 1px; }

/* ❌ 不要用 */
.rem { font-size: 1rem; }
.vh { height: 100vh; }
.vw { width: 100vw; }
```

rpx 换算：设计稿 750px 宽 → 1px = 1rpx；设计稿 375px 宽 → 1px = 2rpx。

### 选择器限制

```css
/* ✅ 支持 */
.class { }
#id { }
.class .child { }
.class > .child { }

/* ❌ 不支持 */
.class::before { }    /* 伪元素部分平台不支持 */
.class:nth-child() { } /* 部分小程序不支持 */
```

### 不操作 DOM 样式

```js
// ❌ 错误
document.getElementById('box').classList.add('active')
document.querySelector('.box').style.display = 'none'

// ✅ 数据驱动
<view :class="{ active: isActive }">...</view>
<view v-if="isVisible">...</view>
<view :style="{ color: textColor }">...</view>
```

## 主题系统

本项目使用 `data-theme` 属性切换主题。

### 全局变量（uni.scss）

```scss
// uni.scss 中定义
$themes: (
  default: (
    primary: #2979ff,
    primary-light: #e8f0fe,
    success: #18bc37,
    warning: #f3a73f,
    danger: #e43d33,
    info: #8f939c,
  ),
  green: (
    primary: #42b983,
    primary-light: #e8f8f0,
    success: #18bc37,
    warning: #f3a73f,
    danger: #e43d33,
    info: #8f939c,
  ),
);
```

### 组件中使用主题

```scss
// common/theme.scss 提供了 themeify mixin
// 在组件的 <style lang="scss"> 中：

.my-button {
  @include themeify {
    background-color: themed('primary');
    color: themed('primary-light');
  }
}

// 直接用 uni.scss 变量（不随主题切换）
.box {
  border: 1px solid $uni-border-color;
}
```

### 运行时切换

```js
// store/modules/app.js 中的 SET_THEME mutation
document.body.dataset.theme = theme  // 触发 CSS 变量切换
uni.setStorageSync('theme', theme)    // 持久化
```

## 全局样式文件

| 文件 | 用途 |
|---|---|
| `uni.scss` | 全局 SCSS 变量（颜色、字号、间距、主题映射） |
| `common/theme.scss` | 主题 mixin（`themeify`、`themed`），覆盖所有 uni-ui 组件 |
| `common/uni.css` | 全局布局样式（容器、表格、表单、导航、分页） |
| `common/admin-icons.css` | 管理后台图标字体 |

## 样式 checklist

- [ ] 用 rpx 不用 rem/vh/vw
- [ ] 颜色用 `uni.scss` 变量或 `themed()`，不硬编码
- [ ] 不操作 DOM 的 class/style，用数据驱动
- [ ] 新增主题色：在 `uni.scss` 的 `$themes` 中添加对应值
