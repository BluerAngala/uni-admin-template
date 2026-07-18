<template>
  <scroll-view class="sidebar" scroll-y="true">
    <view class="sidebar__logo">
      <image class="sidebar__logo-img" src="/static/logo.png" mode="aspectFit" />
      <text class="sidebar__logo-text">uni-admin</text>
    </view>
    <uni-data-menu
      ref="menu"
      :value="currentMenu"
      :staticMenu="staticMenu"
      :backgroundColor="menuBackgroundColor"
      :textColor="menuTextColor"
      :activeTextColor="menuActiveTextColor"
      collection="opendb-admin-menus"
      :page-size="500"
      :field="field"
      where="enable==true"
      orderby="sort asc"
      @select="select"
    />
  </scroll-view>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import config from '@/admin.config.js';

  export default {
    data() {
      return {
        ...config.sideBar,
        field: 'url as value, name as text, menu_id, parent_id, sort, icon, permission',
        currentMenu: '/',
      };
    },
    computed: {
      ...mapState('app', ['inited', 'navMenu', 'active', 'theme']),
      userInfo() {
        return this.$uniIdPagesStore.store.userInfo;
      },
      menuBackgroundColor() {
        return 'transparent';
      },
      menuTextColor() {
        return this.theme === 'dark' ? '#a1a1aa' : '#6b7280';
      },
      menuActiveTextColor() {
        return this.theme === 'dark' ? '#fafafa' : '#111827';
      },
    },
    watch: {
      // #ifdef H5
      $route: {
        immediate: true,
        handler(newRoute) {
          const path = newRoute.fullPath;
          if (path) {
            this.currentMenu = this.splitFullPath(path);
          }
        },
      },
      // #endif
      userInfo: {
        handler(newVal) {
          if (newVal) {
            this.$nextTick(function () {
              this.$refs.menu.load();
            });
          }
        },
      },
    },
    methods: {
      ...mapActions({
        setRoutes: 'app/setRoutes',
      }),
      select(e, routes) {
        let url = e.value;
        if (!url) {
          url = this.active;
        }
        this.clickMenuItem(url);
        this.setRoutes(routes);
        // #ifdef H5
        // #ifdef VUE3
        uni.hideLeftWindow();
        // #endif
        // #endif
      },
      clickMenuItem(url) {
        // #ifdef H5
        if (url.indexOf('http') === 0) {
          return window.open(url);
        }
        // #endif
        if (url[0] !== '/' && url.indexOf('http') !== 0) {
          url = '/' + url;
        }
        // #ifndef H5
        if (url === '/') {
          url = config.index.url;
        }
        // #endif
        uni.redirectTo({
          url,
          fail: () => {
            uni.showModal({
              title: '提示',
              content: '页面 ' + url + ' 跳转失败',
              showCancel: false,
            });
          },
        });
      },
      splitFullPath(path) {
        if (!path) path = '/';
        return path.split('?')[0];
      },
    },
  };
</script>

<style lang="scss">
  /* ============================================
     侧栏容器
     ============================================ */
  .sidebar {
    position: fixed;
    width: 240px;
    height: calc(100vh - 56px);
    box-sizing: border-box;
    border-right: 1px solid var(--color-border-subtle, #f3f4f6);
    background-color: var(--color-bg-primary, #fff);
    padding: 12px 0;
    overflow-y: auto;
    transition: background-color 0.2s, border-color 0.2s;
  }

  /* #ifdef H5 */
  .sidebar::-webkit-scrollbar {
    display: none;
  }
  /* #endif */

  /* Logo 区域 */
  .sidebar__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 20px 20px;
    border-bottom: 1px solid var(--color-border-subtle, #f3f4f6);
    margin-bottom: 8px;
  }

  .sidebar__logo-img {
    width: 28px;
    height: 28px;
    border-radius: 6px;
  }

  .sidebar__logo-text {
    font-size: 15px;
    font-weight: 700;
    color: var(--color-text-primary, #111827);
    letter-spacing: -0.02em;
  }

  /* ============================================
     菜单项覆盖 — 让 uni-menu-item 变现代
     ============================================ */
  .uni-nav-menu {
    background-color: transparent !important;
    padding: 0 8px;
  }

  .uni-menu-item {
    height: 36px !important;
    line-height: 36px !important;
    padding: 0 12px !important;
    margin: 2px 0;
    border-radius: 6px !important;
    font-size: 13px !important;
    font-weight: 500;
    transition: all 0.15s ease !important;
    position: relative;
  }

  .uni-menu-item:hover {
    background-color: var(--color-bg-tertiary, #f3f4f6) !important;
  }

  .uni-menu-item.is-active {
    background-color: var(--color-accent-subtle, rgba(59, 130, 246, 0.08)) !important;
    color: var(--color-accent, #3b82f6) !important;
    font-weight: 600;
  }

  /* ============================================
     子菜单覆盖
     ============================================ */
  .uni-sub-menu__title {
    height: 36px !important;
    line-height: 36px !important;
    padding: 0 12px !important;
    margin: 2px 0;
    border-radius: 6px !important;
    font-size: 13px !important;
    font-weight: 500;
    color: var(--color-text-secondary, #6b7280) !important;
    transition: all 0.15s ease !important;
  }

  .uni-sub-menu__title:hover {
    background-color: var(--color-bg-tertiary, #f3f4f6) !important;
    color: var(--color-text-primary, #111827) !important;
  }

  .uni-sub-menu__icon {
    color: var(--color-text-tertiary, #9ca3af) !important;
  }

  /* 子菜单内容区缩进 */
  .uni-sub-menu__content {
    padding-left: 12px;
  }
</style>
