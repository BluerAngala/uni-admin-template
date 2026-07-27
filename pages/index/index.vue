<template>
  <view class="fix-top-window">
    <app-page fluid>
      <view class="uni-container">
        <!-- Hero Greeting -->
        <view class="welcome-hero">
          <view class="welcome-hero__bg" />
          <view class="welcome-hero__content">
            <view class="welcome-hero__avatar">
              <text class="welcome-hero__avatar-text">{{ avatarLetter }}</text>
            </view>
            <view class="welcome-hero__text">
              <text class="welcome-hero__greeting">{{ greeting }}</text>
              <text class="welcome-hero__name">{{ displayName }}</text>
              <text class="welcome-hero__date">{{ todayDate }}</text>
            </view>
          </view>
        </view>

        <!-- Quick Stats -->
        <view class="stats-grid">
          <view class="stat-card" v-for="(stat, i) in stats" :key="i">
            <view class="stat-card__icon" :style="{ backgroundColor: stat.bg }">
              <text :class="stat.icon" />
            </view>
            <view class="stat-card__info">
              <text class="stat-card__value">{{ stat.value }}</text>
              <text class="stat-card__label">{{ stat.label }}</text>
            </view>
          </view>
        </view>

        <!-- Quick Actions -->
        <app-section title="快捷入口">
          <view class="actions-grid">
            <view
              class="action-card"
              v-for="(action, i) in quickActions"
              :key="i"
              @click="navTo(action.url)"
              hover-class="action-card--hover"
            >
              <view class="action-card__icon" :style="{ backgroundColor: action.bg }">
                <text :class="action.icon" />
              </view>
              <text class="action-card__label">{{ action.label }}</text>
              <text class="action-card__arrow">→</text>
            </view>
          </view>
        </app-section>

        <!-- System Info -->
        <app-section title="系统信息">
          <view class="card-wrapper">
            <view class="sys-info">
              <view class="sys-info__row" v-for="(info, i) in systemInfo" :key="i">
                <text class="sys-info__label">{{ info.label }}</text>
                <text class="sys-info__value">{{ info.value }}</text>
              </view>
            </view>
          </view>
        </app-section>
      </view>
    </app-page>

    <!-- #ifndef H5 -->
    <fix-window />
    <!-- #endif -->
  </view>
</template>

<script>
  import AppPage from '@/components/app-page/app-page.vue';
  import AppSection from '@/components/app-section/app-section.vue';

  export default {
    components: {
      AppPage,
      AppSection,
    },
    data() {
      return {
        stats: [
          { label: '系统用户', value: '—', icon: 'admin-icons-manager-user', bg: 'var(--color-accent-subtle)' },
          { label: '应用总数', value: '—', icon: 'admin-icons-manager-app', bg: 'var(--color-success-subtle)' },
          { label: '角色数量', value: '—', icon: 'admin-icons-manager-role', bg: 'var(--color-warning-subtle)' },
          { label: '菜单项', value: '—', icon: 'admin-icons-manager-menu', bg: 'var(--color-error-subtle)' },
        ],
        quickActions: [
          { label: '用户管理', icon: 'admin-icons-manager-user', url: '/pages/system/user/list', bg: 'var(--color-accent-subtle)' },
          { label: '角色管理', icon: 'admin-icons-manager-role', url: '/pages/system/role/list', bg: 'var(--color-success-subtle)' },
          { label: '权限管理', icon: 'admin-icons-manager-permission', url: '/pages/system/permission/list', bg: 'var(--color-warning-subtle)' },
          { label: '菜单管理', icon: 'admin-icons-manager-menu', url: '/pages/system/menu/list', bg: 'var(--color-error-subtle)' },
          { label: '应用管理', icon: 'admin-icons-manager-app', url: '/pages/system/app/list', bg: '#e0e7ff' },
          { label: '标签管理', icon: 'admin-icons-manager-tag', url: '/pages/system/tag/list', bg: '#fce7f3' },
        ],
        systemInfo: [
          { label: '框架版本', value: 'uni-admin v1.0.0' },
          { label: '运行环境', value: 'uni-app 5.15 (vue3)' },
          { label: '云服务空间', value: 'env-00jxubueh0z4' },
          { label: '布局模式', value: '三窗口（顶栏 + 侧栏 + 内容）' },
        ],
      };
    },
    created() {
      this.loadStats();
    },
    computed: {
      displayName() {
        const u = this.$uniIdPagesStore?.store?.userInfo || {};
        return u.nickname || u.username || u.mobile || u.email || 'Admin';
      },
      avatarLetter() {
        return (this.displayName || 'A')[0].toUpperCase();
      },
      greeting() {
        const h = new Date().getHours();
        if (h < 6) return '夜深了';
        if (h < 9) return '早上好';
        if (h < 12) return '上午好';
        if (h < 14) return '中午好';
        if (h < 18) return '下午好';
        return '晚上好';
      },
      todayDate() {
        const d = new Date();
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${weekdays[d.getDay()]}`;
      },
    },
    methods: {
      async loadStats() {
        try {
          const db = uniCloud.database();
          const [userRes, appRes, roleRes, menuRes] = await Promise.all([
            db.collection('uni-id-users').count(),
            db.collection('opendb-app-list').count(),
            db.collection('uni-id-roles').count(),
            db.collection('opendb-admin-menus').count(),
          ]);
          this.stats[0].value = String(userRes.result?.total ?? '—');
          this.stats[1].value = String(appRes.result?.total ?? '—');
          this.stats[2].value = String(roleRes.result?.total ?? '—');
          this.stats[3].value = String(menuRes.result?.total ?? '—');
        } catch (e) {
          console.warn('Stats load failed:', e);
        }
      },
      navTo(url) {
        if (url.indexOf('http') === 0) {
          // #ifdef H5
          window.open(url);
          // #endif
        } else {
          uni.navigateTo({ url });
        }
      },
    },
  };
</script>

<style lang="scss">
  // ========================
  // Hero Section
  // ========================
  .welcome-hero {
    position: relative;
    margin-bottom: var(--space-8);
    padding: var(--space-10) var(--space-8);
    border-radius: var(--radius-2xl);
    overflow: hidden;
    background: linear-gradient(135deg, var(--color-accent) 0%, #4338ca 50%, #312e81 100%);
    min-height: 140px;
    display: flex;
    align-items: center;

    &__bg {
      position: absolute;
      inset: 0;
      opacity: 0.1;
      background-image:
        radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    &__content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: var(--space-6);
    }

    &__avatar {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &-text {
        color: #fff;
        font-size: var(--text-2xl);
        font-weight: 700;
        letter-spacing: var(--tracking-tight);
      }
    }

    &__text {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    &__greeting {
      color: rgba(255, 255, 255, 0.7);
      font-size: var(--text-sm);
      font-weight: 500;
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
    }

    &__name {
      color: #fff;
      font-size: var(--text-2xl);
      font-weight: 700;
      letter-spacing: var(--tracking-tight);
    }

    &__date {
      color: rgba(255, 255, 255, 0.6);
      font-size: var(--text-sm);
    }
  }

  // ========================
  // Stats Grid
  // ========================
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-5);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-xl);
    transition: box-shadow var(--transition-fast), transform var(--transition-fast);

    &:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    &__icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 20px;
      color: var(--color-accent);
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__value {
      color: var(--color-text-primary);
      font-size: var(--text-xl);
      font-weight: 700;
      letter-spacing: var(--tracking-tight);
    }

    &__label {
      color: var(--color-text-tertiary);
      font-size: var(--text-xs);
      letter-spacing: var(--tracking-wide);
    }
  }

  // ========================
  // Quick Actions
  // ========================
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-4);
  }

  .action-card {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-xl);
    cursor: pointer;
    transition: box-shadow var(--transition-fast), transform var(--transition-fast), border-color var(--transition-fast);

    &--hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
      border-color: var(--color-accent);
    }

    &__icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 16px;
      color: var(--color-accent);
    }

    &__label {
      flex: 1;
      color: var(--color-text-primary);
      font-size: var(--text-base);
      font-weight: 500;
    }

    &__arrow {
      color: var(--color-text-tertiary);
      font-size: var(--text-lg);
      transition: transform var(--transition-fast);
    }

    &:hover &__arrow {
      transform: translateX(4px);
      color: var(--color-accent);
    }
  }

  // ========================
  // System Info
  // ========================
  .sys-info {
    padding: var(--space-2) 0;

    &__row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-3) var(--space-5);
      border-bottom: 1px solid var(--color-border-subtle);

      &:last-child {
        border-bottom: none;
      }
    }

    &__label {
      color: var(--color-text-tertiary);
      font-size: var(--text-sm);
    }

    &__value {
      color: var(--color-text-primary);
      font-size: var(--text-sm);
      font-weight: 500;
      text-align: right;
    }
  }

  // ========================
  // Responsive
  // ========================
  @media screen and (max-width: 1023px) {
    .stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .actions-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media screen and (max-width: 599px) {
    .welcome-hero {
      padding: var(--space-6) var(--space-5);
      min-height: 120px;

      &__avatar {
        width: 48px;
        height: 48px;

        &-text {
          font-size: var(--text-xl);
        }
      }

      &__name {
        font-size: var(--text-xl);
      }
    }

    .stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-3);
    }

    .stat-card {
      padding: var(--space-4);

      &__icon {
        width: 36px;
        height: 36px;
      }

      &__value {
        font-size: var(--text-lg);
      }
    }

    .actions-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
