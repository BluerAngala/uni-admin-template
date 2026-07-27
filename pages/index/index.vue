<template>
  <view class="fix-top-window">
    <app-page fluid>
      <view class="uni-container">
        <!-- ========== HERO ========== -->
        <view class="hero">
          <view class="hero__bg" />
          <view class="hero__mesh" />
          <view class="hero__content">
            <view class="hero__avatar">
              <text class="hero__avatar-letter">{{ avatarLetter }}</text>
            </view>
            <view class="hero__text">
              <text class="hero__greeting">{{ greeting }}</text>
              <text class="hero__name">{{ displayName }}</text>
              <text class="hero__date">{{ todayDate }}</text>
            </view>
          </view>
          <view class="hero__glow" />
        </view>

        <!-- ========== STATS - Bento Grid ========== -->
        <view class="bento-grid">
          <view class="bento-card bento-card--featured" v-if="stats[0]">
            <view class="bento-card__gradient bento-card__gradient--blue" />
            <view class="bento-card__icon">
              <text class="admin-icons-manager-user" />
            </view>
            <text class="bento-card__value" :data-target="stats[0].value">{{ displayValue(stats[0]) }}</text>
            <text class="bento-card__label">{{ stats[0].label }}</text>
            <view class="bento-card__bar">
              <view class="bento-card__bar-fill" />
            </view>
          </view>

          <view class="bento-card" v-for="(stat, i) in stats.slice(1)" :key="i">
            <view class="bento-card__glow" />
            <text class="bento-card__value" :data-target="stat.value">{{ displayValue(stat) }}</text>
            <text class="bento-card__label">{{ stat.label }}</text>
          </view>
        </view>

        <!-- ========== QUICK ACTIONS - Bento ========== -->
        <app-section title="">
          <text class="section-label">快捷入口</text>
          <view class="actions-grid">
            <view
              class="action"
              v-for="(action, i) in quickActions"
              :key="i"
              @click="navTo(action.url)"
              hover-class="action--hover"
            >
              <view class="action__bar" />
              <text :class="action.icon" />
              <text class="action__label">{{ action.label }}</text>
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
          { label: '系统用户', target: 0, current: 0 },
          { label: '应用总数', target: 0, current: 0 },
          { label: '角色数量', target: 0, current: 0 },
          { label: '菜单项', target: 0, current: 0 },
        ],
        quickActions: [
          { label: '用户管理', icon: 'admin-icons-manager-user', url: '/pages/system/user/list' },
          { label: '角色管理', icon: 'admin-icons-manager-role', url: '/pages/system/role/list' },
          { label: '权限管理', icon: 'admin-icons-manager-permission', url: '/pages/system/permission/list' },
          { label: '菜单管理', icon: 'admin-icons-manager-menu', url: '/pages/system/menu/list' },
          { label: '应用管理', icon: 'admin-icons-manager-app', url: '/pages/system/app/list' },
          { label: '标签管理', icon: 'admin-icons-manager-tag', url: '/pages/system/tag/list' },
        ],
      };
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
    created() {
      this.loadStats();
    },
    methods: {
      displayValue(stat) {
        if (stat.target === undefined || stat.target === null) return '—';
        return stat.target;
      },
      async loadStats() {
        try {
          const db = uniCloud.database();
          const [userRes, appRes, roleRes, menuRes] = await Promise.all([
            db.collection('uni-id-users').count(),
            db.collection('opendb-app-list').count(),
            db.collection('uni-id-roles').count(),
            db.collection('opendb-admin-menus').count(),
          ]);
          this.stats[0].target = userRes.result?.total ?? 0;
          this.stats[1].target = appRes.result?.total ?? 0;
          this.stats[2].target = roleRes.result?.total ?? 0;
          this.stats[3].target = menuRes.result?.total ?? 0;
          this.$nextTick(this.animateCounters);
        } catch (e) {
          console.warn('Stats load failed:', e);
        }
      },
      animateCounters() {
        this.stats.forEach((stat, index) => {
          const target = stat.target;
          if (!target) return;
          const duration = 1200;
          const steps = 30;
          const increment = target / steps;
          let current = 0;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), target);
            this.stats[index].current = current;
            if (step >= steps) {
              clearInterval(timer);
              this.stats[index].current = target;
            }
          }, duration / steps);
        });
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
  // ============================
  // HERO
  // ============================
  .hero {
    position: relative;
    margin-bottom: var(--space-8);
    padding: var(--space-12) var(--space-10);
    border-radius: var(--radius-2xl);
    overflow: hidden;
    min-height: 180px;
    display: flex;
    align-items: center;

    &__bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        var(--color-accent) 0%,
        #7c3aed 30%,
        #4338ca 60%,
        #1e40af 100%
      );
      background-size: 200% 200%;
      animation: heroGradient 8s ease infinite;
    }

    &__mesh {
      position: absolute;
      inset: 0;
      opacity: 0.15;
      background-image:
        radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
      pointer-events: none;
    }

    &__glow {
      position: absolute;
      top: -50%;
      right: -20%;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, transparent 70%);
      filter: blur(40px);
      pointer-events: none;
      animation: heroPulse 4s ease-in-out infinite;
    }

    &__content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: var(--space-6);
    }

    &__avatar {
      width: 72px;
      height: 72px;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(12px);
      border: 2px solid rgba(255, 255, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow:
        0 0 0 4px rgba(255, 255, 255, 0.08),
        0 8px 32px rgba(0, 0, 0, 0.12);

      &-letter {
        color: #fff;
        font-size: 28px;
        font-weight: 700;
      }
    }

    &__text {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    &__greeting {
      color: rgba(255, 255, 255, 0.65);
      font-size: var(--text-xs);
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    &__name {
      color: #fff;
      font-size: var(--text-3xl);
      font-weight: 800;
      letter-spacing: var(--tracking-tight);
      line-height: 1.15;
      background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0.8));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    &__date {
      color: rgba(255, 255, 255, 0.5);
      font-size: var(--text-sm);
    }
  }

  @keyframes heroGradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes heroPulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }

  // ============================
  // BENTO STATS GRID
  // ============================
  .bento-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }

  .bento-card {
    position: relative;
    padding: var(--space-6) var(--space-5);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);

    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg);
    }

    &--featured {
      grid-row: span 2;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      min-height: 180px;
    }

    &__gradient {
      position: absolute;
      inset: 0;
      opacity: 0.06;
      border-radius: inherit;

      &--blue {
        background: linear-gradient(135deg, var(--color-accent) 0%, #7c3aed 100%);
      }
    }

    &__glow {
      position: absolute;
      top: -20px;
      right: -20px;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99, 91, 255, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    &__icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      background: rgba(99, 91, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: var(--color-accent);
      margin-bottom: var(--space-4);
    }

    &__value {
      display: block;
      color: var(--color-text-primary);
      font-size: 32px;
      font-weight: 800;
      letter-spacing: var(--tracking-tight);
      line-height: 1;
      margin-bottom: var(--space-1);
      transition: all var(--transition-normal);
    }

    &--featured &__value {
      font-size: 42px;
    }

    &__label {
      display: block;
      color: var(--color-text-tertiary);
      font-size: var(--text-xs);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 600;
    }

    &__bar {
      margin-top: var(--space-4);
      height: 3px;
      background: rgba(99, 91, 255, 0.1);
      border-radius: var(--radius-full);
      overflow: hidden;

      &-fill {
        height: 100%;
        width: 72%;
        background: linear-gradient(90deg, var(--color-accent), #7c3aed);
        border-radius: var(--radius-full);
        animation: barShimmer 2s ease-in-out infinite;
      }
    }
  }

  @keyframes barShimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  // ============================
  // SECTION LABEL
  // ============================
  .section-label {
    display: block;
    color: var(--color-text-primary);
    font-size: var(--text-lg);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
    margin-bottom: var(--space-4);
  }

  // ============================
  // QUICK ACTIONS - Uniform Grid
  // ============================
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-4);
  }

  .action {
    position: relative;
    padding: var(--space-5);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-xl);
    cursor: pointer;
    overflow: hidden;
    transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);

    &--hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
      border-color: var(--color-accent);
    }

    &__bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--color-accent), #7c3aed, #a78bfa);
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    &:hover &__bar {
      opacity: 1;
    }

    & > [class^='admin-icons-'] {
      font-size: 22px;
      color: var(--color-accent);
      display: block;
      margin-bottom: var(--space-3);
    }

    &__label {
      display: block;
      color: var(--color-text-primary);
      font-size: var(--text-base);
      font-weight: 600;
    }
  }

  // ============================
  // SECTION LABEL
  // ============================
  @media screen and (max-width: 1023px) {
    .bento-grid {
      grid-template-columns: 1fr 1fr;
    }

    .bento-card--featured {
      grid-column: span 2;
      grid-row: auto;
      min-height: 120px;
    }

    .actions-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media screen and (max-width: 599px) {
    .hero {
      padding: var(--space-8) var(--space-5);
      min-height: 140px;

      &__content {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-4);
      }

      &__avatar {
        width: 52px;
        height: 52px;

        &-letter { font-size: 22px; }
      }

      &__name {
        font-size: var(--text-2xl);
      }

      &__glow {
        width: 200px;
        height: 200px;
      }
    }

    .bento-grid {
      grid-template-columns: 1fr;
    }

    .bento-card--featured {
      grid-column: auto;
      min-height: auto;
    }

    .actions-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
