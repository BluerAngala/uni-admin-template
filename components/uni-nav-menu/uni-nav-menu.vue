<template>
  <view class="uni-nav-menu" :style="{ 'background-color': backgroundColor }">
    <slot>
      <uni-menu-sidebar :data="data"></uni-menu-sidebar>
    </slot>
  </view>
</template>

<script>
  export default {
    name: 'uniNavMenu',
    props: {
      data: {
        type: Array,
        default() {
          return [];
        },
      },

      // 模式	可选值 horizontal / vertical
      mode: {
        type: String,
        default: 'vertical',
      },
      // 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
      collapse: {
        type: Boolean,
        default: false,
      },
      // 菜单的背景色
      backgroundColor: {
        type: String,
        default: 'transparent',
      },
      // 菜单的文字颜色
      textColor: {
        type: String,
        default: 'var(--color-text-secondary)',
      },
      // 当前激活菜单的文字颜色
      activeTextColor: {
        type: String,
        default: 'var(--color-accent)',
      },
      // 当前激活菜单的背景色
      activeBackgroundColor: {
        type: String,
        default: 'inherit',
      },
      // 如果 index 为 Object ，需要指定选中字段的名称
      activeKey: {
        type: String,
        default: 'id',
      },
      // 当前激活菜单的 index
      active: {
        type: String,
        default: '',
      },
      // 当前打开的 sub-menu 的 index 的数组
      defaultOpeneds: {
        type: Array,
        default() {
          return [];
        },
      },
      // 是否只保持一个子菜单的展开
      uniqueOpened: {
        type: Boolean,
        default: false,
      },
      // TODO 子菜单打开的触发方式(只在 mode 为 horizontal 时有效) ，可选值 	 hover / click
      menuTrigger: {
        type: String,
        default: 'hover',
      },
      router: {
        type: Boolean,
        default: false,
      },
      // 是否开启折叠动画
      collapseTransition: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        activeIndex: this.active,
      };
    },
    watch: {
      active(newVal) {
        this.activeIndex = newVal;
      },
      activeIndex(newVal, oldVal) {
        if (this.itemChildrens.length > 0) {
          // 重置所有菜单项激活状态，避免路由切换后残留旧高亮
          this.itemChildrens.forEach((item) => {
            item.active = false;
            item.indexPath = [];
          });
          this.closeAll();

          let matched = false;
          for (let i = 0; i < this.itemChildrens.length; i++) {
            const item = this.itemChildrens[i];
            if (this.isActive(item)) {
              matched = true;
              break;
            }
          }
        }
      },
    },
    created() {
      this.itemChildrens = [];
      this.subChildrens = [];
      // this.activeIndex = this.active
    },
    methods: {
      // menu 菜单激活回调
      select(key, keyPath) {
        this.$emit('select', key, keyPath);
      },
      // sub-menu 展开的回调
      open(key, keyPath) {
        this.$emit('open', key, keyPath);
      },
      // sub-menu 收起的回调
      close(key, keyPath) {
        this.$emit('close', key, keyPath);
      },
      // 判断当前选中，支持所有层级菜单项
      isActive(subItem) {
        let active = '';
        if (typeof subItem.index === 'object') {
          active = subItem.index[this.activeKey] || '';
        } else {
          active = subItem.index;
        }
        if (!subItem.index || !active) return false;

        // 标准化路径：去除末尾斜杠后比较，避免 /path 与 /path/ 不匹配
        const activePath = String(this.activeIndex || '').replace(/\/$/, '') || '/';
        const itemPath = String(active || '').replace(/\/$/, '') || '/';
        if (activePath !== itemPath) return false;

        // 展开所有父级子菜单，使当前项可见
        subItem.$subMenu.forEach((item) => {
          if (!item.disabled && !subItem.disabled) {
            item.isOpen = true;
          }
        });
        subItem.active = true;
        return true;
      },
      // 打开关闭 sunMenu
      selectMenu(subMenu) {
        // const subMenu = this.$menuParent
        this.subChildrens.forEach((item, index) => {
          if (item === subMenu) {
            subMenu.isOpen = !subMenu.isOpen;
            subMenu.indexPath.push(subMenu.index);
          } else {
            if (item.isOpen && this.uniqueOpened) item.isOpen = false;
          }
        });

        subMenu.$subMenu.forEach((sub, idx) => {
          sub.isOpen = true;
          subMenu.indexPath.unshift(sub.index);
        });
        if (subMenu.isOpen) {
          this.open(subMenu.indexPath[subMenu.indexPath.length - 1], subMenu.indexPath);
        } else {
          this.close(subMenu.indexPath[subMenu.indexPath.length - 1], subMenu.indexPath);
        }
        subMenu.indexPath = [];
      },
      // 关闭其他选中
      closeOtherActive(itemMenu) {
        // let parents = this.$menuParent
        itemMenu.indexPath = [];
        itemMenu.$subMenu.forEach((item) => {
          if (!item.disabled) {
            itemMenu.indexPath.push(item.index);
          }
        });
        this.itemChildrens.map((item) => {
          if (item.active) {
            item.active = false;
          }
          return item;
        });
      },
      // 关闭所有
      closeAll() {
        this.subChildrens.forEach((item) => {
          if (item.isOpen) {
            item.isOpen = false;
          }
        });
      },
    },
  };
</script>

<style lang="scss">
  .uni-nav-menu {
    width: 100%;
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
    background-color: transparent;
  }
</style>
