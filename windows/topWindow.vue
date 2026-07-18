<template>
  <view class="topbar">
    <view class="topbar__left">
      <view class="topbar__menu-btn pointer" @click="toggleSidebar">
        <uni-icons class="topbar__menu-icon" type="bars" size="18" />
      </view>
      <text class="topbar__title hide-on-phone">{{ navigationBarTitleText }}</text>
    </view>

    <view class="topbar__right">
      <!-- #ifdef H5 -->
      <view v-if="logs.length" class="topbar__action pointer" @click="showErrorLogs">
        <uni-icons class="topbar__action-icon" type="info-filled" size="16" />
        <text class="topbar__action-badge">{{ logs.length }}</text>
      </view>
      <!-- #endif -->

      <view class="topbar__theme-control hide-on-phone">
        <view
          v-for="(item, index) in themes"
          :key="item.value"
          class="topbar__theme-option pointer"
          :class="{ 'topbar__theme-option--active': item.value === theme }"
          @click="changeTheme(index)"
        >
          <text>{{ item.text }}</text>
        </view>
      </view>

      <view class="topbar__action pointer" @click="toggleLangMenu">
        <uni-icons class="topbar__action-icon" type="world" size="17" />
      </view>

      <view class="topbar__user pointer" @click="togglePopupMenu">
        <view class="topbar__avatar">{{ displayName.charAt(0).toUpperCase() }}</view>
        <text class="topbar__username hide-on-phone">{{ displayName }}</text>
        <uni-icons class="topbar__arrow hide-on-phone" type="bottom" size="12" />
      </view>

      <view v-if="popupMenuOpened" class="topbar__dropdown topbar__dropdown--user">
        <view class="topbar__dropdown-item" @click="showPasswordPopup">
          <text>{{ $t('topwindow.text.changePwd') }}</text>
        </view>
        <view class="topbar__dropdown-item topbar__dropdown-item--danger" @click="logout">
          <text>{{ $t('topwindow.text.signOut') }}</text>
        </view>
      </view>

      <view v-if="langMenuOpened" class="topbar__dropdown topbar__dropdown--language">
        <view
          v-for="(item, index) in langs"
          :key="item.lang"
          class="topbar__dropdown-item"
          :class="{ 'topbar__dropdown-item--active': index === langIndex }"
          @click="changeLanguage(index)"
        >
          <text>{{ item.text }}</text>
        </view>
      </view>
    </view>

    <uni-popup ref="errorLogsPopup" type="center">
      <view class="modal">
        <view class="modal-header">错误日志</view>
        <view class="modal-content">
          <error-log />
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="passwordPopup" type="center">
      <view class="modal">
        <view class="modal-header">{{ $t('topwindow.text.changePwd') }}</view>
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
        default: '',
      },
      matchLeftWindow: {
        type: Boolean,
        default: false,
      },
      showLeftWindow: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        ...config.navBar,
        popupMenuOpened: false,
        langMenuOpened: false,
        langIndex: 0,
      };
    },
    computed: {
      ...mapState('app', ['appName', 'theme']),
      ...mapState('error', ['logs']),
      brandName() {
        return this.appName || 'uni-admin';
      },
      displayName() {
        const user = this.$uniIdPagesStore.store.userInfo || {};
        return user.nickname || user.username || user.mobile || user.email || 'Admin';
      },
    },
    mounted() {
      // #ifdef H5
      const locale = uni.getLocale();
      const index = this.langs.findIndex((item) => item.lang === locale);
      this.langIndex = index >= 0 ? index : 0;
      // #endif
    },
    methods: {
      ...mapMutations('app', ['SET_THEME']),
      showErrorLogs() {
        this.closeMenus();
        this.$refs.errorLogsPopup.open();
      },
      showPasswordPopup() {
        this.popupMenuOpened = false;
        this.$refs.passwordPopup.open();
      },
      logout() {
        this.popupMenuOpened = false;
        this.$uniIdPagesStore.mutations.logout();
      },
      toggleSidebar() {
        if (this.showLeftWindow) {
          uni.hideLeftWindow();
        } else {
          uni.showLeftWindow();
        }
      },
      togglePopupMenu() {
        this.popupMenuOpened = !this.popupMenuOpened;
        if (this.popupMenuOpened) this.langMenuOpened = false;
      },
      toggleLangMenu() {
        this.langMenuOpened = !this.langMenuOpened;
        if (this.langMenuOpened) this.popupMenuOpened = false;
      },
      closeMenus() {
        this.popupMenuOpened = false;
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
        const item = this.langs[index] || this.langs[0];
        if (!this.$i18n || !item) return;
        this.$i18n.locale = item.lang;
        this.langIndex = index;
        this.langMenuOpened = false;
        uni.setLocale(item.lang);
      },
      changeTheme(index) {
        const item = this.themes[index];
        if (item && item.value !== this.theme) this.SET_THEME(item.value);
      },
    },
  };
</script>

<style lang="scss">
  .topbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 var(--space-6);
    background-color: var(--color-topbar-bg);
    border-bottom: 1px solid var(--color-topbar-border);
    /* #ifdef H5 */
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    /* #endif */
    z-index: var(--z-sticky);
  }

  .topbar__left,
  .topbar__right,
  .topbar__theme-control,
  .topbar__user,
  .topbar__action,
  .topbar__menu-btn {
    display: flex;
    align-items: center;
  }

  .topbar__left,
  .topbar__right {
    gap: var(--space-2);
  }

  .topbar__title {
    color: var(--color-text-primary);
    font-size: var(--text-sm);
    font-weight: 650;
    letter-spacing: var(--tracking-tight);
  }

  .topbar__menu-btn,
  .topbar__action {
    width: 34px;
    height: 34px;
    justify-content: center;
    color: var(--color-text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast),
      transform var(--transition-spring);
  }

  .topbar__menu-btn:hover,
  .topbar__action:hover,
  .topbar__user:hover {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-primary);
  }

  .topbar__menu-btn:active,
  .topbar__action:active,
  .topbar__user:active {
    transform: scale(0.94);
  }

  .topbar__theme-control {
    gap: 3px;
    padding: 3px;
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-lg);
  }

  .topbar__theme-option {
    padding: 5px 10px;
    color: var(--color-text-tertiary);
    font-size: var(--text-xs);
    font-weight: 500;
    letter-spacing: var(--tracking-wide);
    border-radius: var(--radius-md);
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast),
      box-shadow var(--transition-fast);
  }

  .topbar__theme-option--active {
    color: var(--color-accent);
    font-weight: 600;
    background-color: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }

  .topbar__user {
    gap: var(--space-2);
    padding: 4px 6px 4px 4px;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      transform var(--transition-spring);
  }

  .topbar__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    color: var(--color-text-inverse);
    font-size: var(--text-xs);
    font-weight: 600;
    background: linear-gradient(135deg, var(--color-accent), #8b5cf6);
    border-radius: var(--radius-full);
  }

  .topbar__username {
    color: var(--color-text-primary);
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .topbar__arrow {
    color: var(--color-text-tertiary);
  }

  .topbar__action-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    color: var(--color-text-inverse);
    font-size: 10px;
    background-color: var(--color-error);
    border-radius: var(--radius-full);
  }

  .topbar__dropdown {
    position: absolute;
    top: 52px;
    min-width: 160px;
    padding: var(--space-1\.5);
    background-color: var(--color-surface-overlay);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    z-index: var(--z-dropdown);
    /* #ifdef H5 */
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    /* #endif */
  }

  .topbar__dropdown--user {
    right: var(--space-5);
  }

  .topbar__dropdown--language {
    right: 100px;
  }

  .topbar__dropdown-item {
    padding: var(--space-2) var(--space-3);
    color: var(--color-text-primary);
    font-size: var(--text-sm);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      transform var(--transition-fast);
  }

  .topbar__dropdown-item:hover {
    background-color: var(--color-bg-tertiary);
  }

  .topbar__dropdown-item--active {
    color: var(--color-accent);
    font-weight: 650;
    background-color: var(--color-accent-subtle);
  }

  .topbar__dropdown-item--danger {
    color: var(--color-error);
    font-weight: 500;
  }

  .topbar__dropdown-item--danger:hover {
    background-color: var(--color-error-subtle);
  }

  @media screen and (max-width: 767px) {
    .topbar {
      padding: 0 var(--space-3);
    }

    .topbar__title {
      display: none;
    }

    .topbar__dropdown--user {
      right: var(--space-3);
    }

    .topbar__dropdown--language {
      right: 52px;
    }
  }
</style>
