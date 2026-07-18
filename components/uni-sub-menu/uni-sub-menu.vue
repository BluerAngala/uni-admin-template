<template>
  <view class="uni-sub-menu">
    <view class="uni-sub-menu__title" :class="{ 'is-disabled': disabled }" :style="{ paddingLeft: paddingLeft }" @click="select">
      <view class="uni-sub-menu__title-sub" :class="{ 'uni-sub-menu__title-sub--disabled': disabled }">
        <slot name="title"></slot>
      </view>
      <uni-icons class="uni-sub-menu__icon" :class="{ transition: isOpen }" type="down" color="var(--color-text-tertiary)" size="14"></uni-icons>
    </view>
    <view class="uni-sub-menu__content" :class="{ 'uni-sub-menu--close': !isOpen }" :style="{ 'background-color': backgroundColor }">
      <view id="content--hook">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script>
  import rootParent from '../uni-nav-menu/mixins/rootParent.js';
  export default {
    name: 'uniSubMenu',
    mixins: [rootParent],
    props: {
      // 唯一标识
      index: {
        type: [String, Object],
        default() {
          return '';
        },
      },
      // TODO 自定义类名
      popperClass: {
        type: String,
        default: '',
      },
      // TODO 是否禁用
      disabled: {
        type: Boolean,
        default: false,
      },
      // 展开菜单的背景色
      backgroundColor: {
        type: String,
        default: 'transparent',
      },
    },
    data() {
      return {
        height: 0,
        oldheight: 0,
        isOpen: false,
        textColor: '',
      };
    },
    computed: {
      paddingLeft() {
        let subMenu = (this.rootMenu && this.rootMenu.SubMenu && this.rootMenu.SubMenu.length) || 0;
        return 16 + 16 * subMenu + 'px';
      },
    },
    created() {
      this.init();
    },
    destroyed() {
      // 销毁页面后，将当前页面实例从数据中删除
      if (this.$menuParent) {
        const menuIndex = this.$menuParent.subChildrens.findIndex((item) => item === this);
        this.$menuParent.subChildrens.splice(menuIndex, 1);
      }
    },
    methods: {
      init() {
        // 所有父元素
        this.rootMenu = {
          NavMenu: [],
          SubMenu: [],
        };
        this.childrens = [];
        this.indexPath = [];
        // 获取直系的所有父元素实例
        this.getParentAll('SubMenu', this);
        // 获取最外层父元素实例
        this.$menuParent = this.getParent('uniNavMenu', this);
        this.textColor = this.$menuParent.textColor;
        // 直系父元素 SubMenu
        this.$subMenu = this.rootMenu.SubMenu;

        // 将当前插入到menu数组中
        if (this.$menuParent) {
          this.$menuParent.subChildrens.push(this);
        }
      },
      select() {
        if (this.disabled) return;
        // 手动开关 sunMenu
        this.$menuParent.selectMenu(this);
      },
      open() {
        this.isOpen = true;
      },
      close() {
        this.isOpen = false;
      },
    },
  };
</script>

<style lang="scss">
  .uni-sub-menu {
    position: relative;
  }

  .uni-sub-menu__title {
    display: flex;
    align-items: center;
    min-height: 44px;
    padding-right: var(--space-3);
    margin: var(--space-0\.5) var(--space-2);
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
    font-weight: 500;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast);
  }

  .uni-sub-menu__title:hover {
    color: var(--color-text-primary);
    background-color: var(--color-menu-hover);
    outline: none;
  }

  .uni-sub-menu__title-sub {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .uni-sub-menu__title-sub--disabled {
    color: var(--color-text-tertiary);
  }

  .uni-sub-menu--close {
    height: 0;
    /* transition: all 0.3s; */
  }

  .uni-sub-menu__content {
    overflow: hidden;
  }

  .uni-sub-menu__icon {
    color: var(--color-text-tertiary);
    transition: transform var(--transition-fast);
  }

  .uni-sub-menu__title:hover .uni-sub-menu__icon {
    color: var(--color-text-secondary);
  }

  .transition {
    transform: rotate(-180deg);
  }

  .is-disabled {
    opacity: 0.48;
    cursor: not-allowed;
  }

  .uni-sub-menu__title.is-disabled:hover {
    color: var(--color-text-secondary);
    background-color: transparent;
  }
</style>
