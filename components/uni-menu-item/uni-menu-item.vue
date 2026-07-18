<template>
  <view class="uni-menu-item" :class="{ 'is-active': active, 'is-disabled': disabled }" :style="{ paddingLeft: paddingLeft }" @click="onClickItem">
    <slot />
  </view>
</template>

<script>
  import rootParent from '../uni-nav-menu/mixins/rootParent.js';

  export default {
    name: 'uniMenuItem',
    mixins: [rootParent],
    props: {
      index: {
        type: [String, Object],
        default() {
          return '';
        },
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        active: false,
        activeTextColor: '',
        textColor: '',
        activeBackgroundColor: '',
      };
    },
    computed: {
      paddingLeft() {
        const subMenu = (this.rootMenu && this.rootMenu.SubMenu && this.rootMenu.SubMenu.length) || 0;
        return 16 + 16 * subMenu + 'px';
      },
    },
    created() {
      this.init();
    },
    destroyed() {
      if (this.$menuParent) {
        const menuIndex = this.$menuParent.itemChildrens.findIndex((item) => item === this);
        this.$menuParent.itemChildrens.splice(menuIndex, 1);
      }
    },
    methods: {
      init() {
        this.rootMenu = {
          NavMenu: [],
          SubMenu: [],
        };
        this.indexPath = [];
        this.getParentAll('SubMenu', this);
        this.$menuParent = this.getParent('uniNavMenu', this);
        this.$subMenu = this.rootMenu.SubMenu;
        this.activeTextColor = this.$menuParent.activeTextColor;
        this.textColor = this.$menuParent.textColor;
        this.activeBackgroundColor = this.$menuParent.activeBackgroundColor;
        if (this.$menuParent) {
          this.$menuParent.itemChildrens.push(this);
          this.$menuParent.isActive(this);
        }
      },
      onClickItem(event) {
        if (this.disabled) return;
        this.$menuParent.closeOtherActive(this);
        this.active = true;
        this.indexPath.unshift(this.index);
        this.indexPath.reverse();
        if (event !== 'init') {
          this.$menuParent.select(this.index, this.indexPath);
        }
      },
    },
  };
</script>

<style lang="scss">
  .uni-menu-item {
    position: relative;
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
      background-color var(--transition-fast),
      transform var(--transition-fast),
      padding-left var(--transition-fast);
  }

  .uni-menu-item:hover {
    color: var(--color-text-primary);
    background-color: var(--color-menu-hover);
  }

  .uni-menu-item.is-active {
    color: var(--color-accent);
    font-weight: 650;
    background-color: var(--color-menu-active);
  }

  .uni-menu-item.is-active::before {
    position: absolute;
    top: 12px;
    left: 0;
    width: 3px;
    height: 20px;
    content: '';
    background-color: var(--color-sidebar-active-indicator);
    border-radius: 0 var(--radius-full) var(--radius-full) 0;
  }

  .uni-menu-item.is-disabled {
    opacity: 0.48;
    cursor: not-allowed;
  }

  .uni-menu-item.is-disabled:hover {
    color: var(--color-text-secondary);
    background-color: transparent;
  }
</style>
