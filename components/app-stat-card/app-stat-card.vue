<template>
  <view class="app-stat-card" :class="{ 'app-stat-card--loading': loading }">
    <app-skeleton v-if="loading" variant="card" />
    <template v-else>
      <view class="app-stat-card__header">
        <text class="app-stat-card__label">{{ label }}</text>
        <slot name="header" />
      </view>
      <text class="app-stat-card__value">{{ value }}</text>
      <view v-if="$slots.meta || change !== undefined" class="app-stat-card__meta">
        <slot name="meta">
          <text class="app-stat-card__change" :class="changeClass">{{ changeText }}</text>
        </slot>
      </view>
    </template>
  </view>
</template>

<script>
  import AppSkeleton from '@/components/app-skeleton/app-skeleton.vue';

  export default {
    name: 'AppStatCard',
    components: {
      AppSkeleton,
    },
    props: {
      label: {
        type: String,
        required: true,
      },
      value: {
        type: [String, Number],
        required: true,
      },
      change: {
        type: Number,
        default: undefined,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      changeClass() {
        if (this.change === 0) return 'app-stat-card__change--neutral';
        return this.change > 0 ? 'app-stat-card__change--up' : 'app-stat-card__change--down';
      },
      changeText() {
        if (this.change === undefined) return '';
        return `较昨日 ${this.change >= 0 ? '+' : ''}${this.change}%`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-stat-card {
    min-height: 132px;
    padding: var(--space-5) var(--space-6);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xs);
    transition: border-color var(--transition-normal), box-shadow var(--transition-slow), transform var(--transition-spring);
  }

  .app-stat-card:hover {
    border-color: var(--color-border-strong);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .app-stat-card--loading {
    display: flex;
    align-items: stretch;
  }

  .app-stat-card--loading ::v-deep .skeleton {
    width: 100%;
  }

  .app-stat-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 20px;
    gap: var(--space-2);
  }

  .app-stat-card__label {
    color: var(--color-text-tertiary);
    font-size: var(--text-sm);
    font-weight: 500;
    letter-spacing: var(--tracking-wide);
  }

  .app-stat-card__value {
    display: block;
    margin-top: var(--space-4);
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    font-size: var(--text-3xl);
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
    line-height: 1;
  }

  .app-stat-card__meta {
    min-height: 18px;
    margin-top: var(--space-3);
  }

  .app-stat-card__change {
    font-size: var(--text-xs);
    font-weight: 600;
  }

  .app-stat-card__change--up {
    color: var(--color-success);
  }

  .app-stat-card__change--down {
    color: var(--color-error);
  }

  .app-stat-card__change--neutral {
    color: var(--color-text-tertiary);
  }
</style>
