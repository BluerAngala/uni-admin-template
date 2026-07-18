<template>
  <view class="topbar">
    <view class="topbar__left">
      <view class="topbar__menu-btn pointer" @click="toggleSidebar">
        <text class="topbar__menu-icon">☰</text>
      </view>
      <text class="topbar__title">{{ navigationBarTitleText }}</text>
    </view>
    <view class="topbar__right">
      <!-- 错误日志 -->
      <!-- #ifdef H5 -->
      <view v-if="logs.length" class="topbar__action pointer" @click="showErrorLogs">
        <text class="topbar__action-icon">🐛</text>
        <text class="topbar__action-badge">{{ logs.length }}</text>
      </view>
      <!-- #endif -->
      <!-- 主题切换 -->
      <view class="topbar__action pointer" @click="toggleThemeMenu">
        <text class="topbar__action-icon">{{ theme === 'dark' ? '☀️' : '🌙' }}</text>
      </view>
      <!-- 用户菜单 -->
      <view class="topbar__user pointer" @click="togglePopupMenu">
        <view class="topbar__avatar">{{ displayName.charAt(0).toUpperCase() }}</view>
        <text class="topbar__username">{{ displayName }}</text>
        <text class="topbar__arrow">▾</text>
      </view>
      <!-- 用户下拉 -->
      <view v-if="popupMenuOpened" class="topbar__dropdown">
        <view class="topbar__dropdown-item" @click="showPasswordPopup">
          <text>修改密码</text>
        </view>
        <view class="topbar__dropdown-item topbar__dropdown-item--danger" @click="logout">
          <text>退出登录</text>
        </view>
      </view>
      <!-- 主题下拉 -->
      <view v-if="themeMenuOpened" class="topbar__dropdown">
        <view
          v-for="(t, i) in themes"
          :key="i"
          class="topbar__dropdown-item"
          :class="{ 'topbar__dropdown-item--active': t.value === theme }"
          @click="changeTheme(i)"
        >
          <text>{{ t.text }}</text>
        </view>
      </view>
    </view>
    <!-- 错误日志弹窗 -->
    <uni-popup ref="errorLogsPopup" type="center">
      <view class="modal">
        <view class="modal-header">错误日志</view>
        <view class="modal-content">
          <error-log />
        </view>
      </view>
    </uni-popup>
    <!-- 修改密码弹窗 -->
    <uni-popup ref="passwordPopup" type="center">
      <view class="modal">
        <view class="modal-header">修改密码</view>
        <view class="modal-content">
          <uni-forms>
            <uni-forms-item label="旧密码">
              <uni-easyinput type="password" v-model="oldPassword" placeholder="请输入旧密码" />
            </uni-forms-item>
            <uni-forms-item label="新密码">
              <uni-easyinput type="password" v-model="newPassword" placeholder="请输入新密码" />
            </uni-forms-item>
          </uni-forms>
        </view>
        <view class="modal-footer">
          <button type="default" size="mini" @click="$refs.passwordPopup.close()">取消</button>
          <button type="primary" size="mini" @click="changePassword">确认</button>
        </view>
      </view>
    </uni-popup>
    <!-- #ifdef H5 -->
    <uni-datetime-picker type="date" v-show="false"></uni-datetime-picker>
    <!-- #endif -->
  </view>
</template>
<script>
  import { mapState, mapMutations } from 'vuex';

  import errorLog from '@/windows/components/error-log.vue';
  import config from '@/admin.config.js';

  export default {
    components: {
      errorLog,
    },
    props: {
      navigationBarTitleText: {
        type: String,
      },
      matchLeftWindow: {
        type: Boolean,
      },
      showLeftWindow: {
        type: Boolean,
      },
    },
    data() {
      return {
        ...config.navBar,
        popupMenuOpened: false,
        themeMenuOpened: false,
        langMenuOpened: false,
        mpCapsule: 0,
        langIndex: 0,
      };
    },
    computed: {
      ...mapState('app', ['appName', 'routes', 'theme']),
      ...mapState('error', ['logs']),
      displayName() {
        const u = this.$uniIdPagesStore.store.userInfo || {};
        return u.nickname || u.username || u.mobile || u.email || 'Admin';
      },

      userInfo() {
        return this.$uniIdPagesStore.store.userInfo;
      },
      themeIndex() {
        let i = 0;
        this.themes.forEach((theme, index) => {
          if (theme.value === this.theme) i = index;
        });
        return i;
      },
    },
    mounted() {
      // #ifdef MP
      let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
      this.mpCapsule = menuButtonInfo.width;
      // #endif

      // #ifdef H5
      let locale = uni.getLocale();
      this.$nextTick(() => {
        let index = this.langs.findIndex((item) => {
          return item.lang === locale;
        });
        this.changeLanguage(index);
      });
      // #endif
    },
    methods: {
      ...mapMutations('app', ['SET_THEME']),
      showErrorLogs() {
        if (this.popupMenuOpened) {
          this.popupMenuOpened = false;
        }
        this.$refs.errorLogsPopup.open();
      },
      showPasswordPopup() {
        if (this.popupMenuOpened) {
          this.popupMenuOpened = false;
        }
        this.$refs.passwordPopup.open();
      },
      logout() {
        this.popupMenuOpened = false;
        this.$uniIdPagesStore.mutations.logout();
      },
      toggleSidebar() {
        if (!this.showLeftWindow) {
          uni.showLeftWindow();
        } else {
          uni.hideLeftWindow();
        }
      },
      togglePopupMenu() {
        this.popupMenuOpened = !this.popupMenuOpened;
        // 关闭其他菜单
        if (this.popupMenuOpened) {
          this.themeMenuOpened = false;
          this.langMenuOpened = false;
        }
      },
      toggleThemeMenu() {
        this.themeMenuOpened = !this.themeMenuOpened;
        // 关闭其他菜单
        if (this.themeMenuOpened) {
          this.popupMenuOpened = false;
          this.langMenuOpened = false;
        }
      },
      toggleLangMenu() {
        this.langMenuOpened = !this.langMenuOpened;
        // 关闭其他菜单
        if (this.langMenuOpened) {
          this.popupMenuOpened = false;
          this.themeMenuOpened = false;
        }
      },
      closeThemeMenu() {
        this.themeMenuOpened = false;
      },
      closeLangMenu() {
        this.langMenuOpened = false;
      },
      changePassword() {
        uni.navigateTo({
          url: '/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd',
          complete: () => {
            this.popupMenuOpened = false;
          },
        });
      },
      changeLanguage(index) {
        if (!index || index < 0) index = 0;
        const lang = this.langs[index].lang || 'zh-Hans';
        if (!this.$i18n) {
          uni.showToast({
            icon: 'error',
            title: '暂不支持',
            duration: 2000,
          });
          return;
        }
        this.$i18n.locale = lang;
        this.langIndex = index;
        this.langMenuOpened = false;
        uni.setLocale(lang);
      },
      linkTo() {
        uni.reLaunch({
          url: '/',
        });
      },
      changeTheme(index) {
        const theme = this.themes[index].value || 'default';
        if (this.theme !== theme) this.SET_THEME(theme);
        this.themeMenuOpened = false;
      },
    },
  };
</script>

<style lang="scss">
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 20px;
    background-color: var(--color-bg-primary, #fff);
    border-bottom: 1px solid var(--color-border-subtle, #f3f4f6);
    transition: background-color 0.2s, border-color 0.2s;
  }

  .topbar__left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .topbar__menu-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: background-color 0.15s;
  }

  .topbar__menu-btn:hover {
    background-color: var(--color-bg-tertiary, #f3f4f6);
  }

  .topbar__menu-icon {
    font-size: 18px;
    color: var(--color-text-secondary, #6b7280);
  }

  .topbar__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-primary, #111827);
  }

  .topbar__right {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
  }

  .topbar__action {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: background-color 0.15s;
    position: relative;
  }

  .topbar__action:hover {
    background-color: var(--color-bg-tertiary, #f3f4f6);
  }

  .topbar__action-icon {
    font-size: 16px;
  }

  .topbar__action-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    font-size: 10px;
    background-color: var(--color-error, #ef4444);
    color: #fff;
    border-radius: 9999px;
    min-width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }

  .topbar__user {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background-color 0.15s;
  }

  .topbar__user:hover {
    background-color: var(--color-bg-tertiary, #f3f4f6);
  }

  .topbar__avatar {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background-color: var(--color-accent, #3b82f6);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .topbar__username {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-primary, #111827);
  }

  .topbar__arrow {
    font-size: 10px;
    color: var(--color-text-tertiary, #9ca3af);
  }

  .topbar__dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    min-width: 160px;
    background-color: var(--color-bg-primary, #fff);
    border: 1px solid var(--color-border-primary, #e5e7eb);
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    z-index: 100;
    padding: 4px;
  }

  .topbar__dropdown-item {
    padding: 8px 12px;
    font-size: 13px;
    color: var(--color-text-primary, #111827);
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .topbar__dropdown-item:hover {
    background-color: var(--color-bg-tertiary, #f3f4f6);
  }

  .topbar__dropdown-item--active {
    color: var(--color-accent, #3b82f6);
    font-weight: 500;
  }

  .topbar__dropdown-item--danger {
    color: var(--color-error, #ef4444);
  }

  .topbar__dropdown-item--danger:hover {
    background-color: var(--color-error-subtle, rgba(239, 68, 68, 0.08));
  }
</style>
