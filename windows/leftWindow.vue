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
        return 'var(--color-text-secondary)';
      },
      menuActiveTextColor() {
        return 'var(--color-text-primary)';
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
    width: 260px;
    height: calc(100vh - 56px); /* H5 only */
    box-sizing: border-box;
    border-right: 1px solid var(--color-border-subtle);
    background-color: var(--color-sidebar-bg) !important;
    padding: var(--space-2) 0 var(--space-4);
    overflow-y: auto;
    transition:
      width var(--transition-slow) var(--ease-out-expo),
      background-color var(--transition-normal),
      border-color var(--transition-normal);
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
    gap: var(--space-2\.5);
    padding: var(--space-3) var(--space-4) var(--space-4);
    margin: 0 var(--space-3) var(--space-3);
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .sidebar__logo-img {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
  }

  .sidebar__logo-text {
    font-size: var(--text-lg);
    font-weight: 700;
    color: var(--color-text-primary);
    letter-spacing: var(--tracking-tight);
  }

  .uni-nav-menu {
    padding: 0 var(--space-3);
    background-color: transparent !important;
  }

  .uni-sub-menu__content {
    padding-left: var(--space-2);
  }
</style>
