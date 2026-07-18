<template>
  <view class="stat-card">
    <view class="stat-card__label">{{ label }}</view>
    <view class="stat-card__value">{{ value }}</view>
    <view v-if="change !== undefined" class="stat-card__change" :class="changeClass">
      {{ change >= 0 ? '↑' : '↓' }} {{ Math.abs(change) }}%
    </view>
  </view>
</template>

<script>
  export default {
    name: 'AppStatCard',
    props: {
      label: { type: String, required: true },
      value: { type: [String, Number], required: true },
      change: { type: Number, default: undefined },
    },
    computed: {
      changeClass() {
        return this.change >= 0 ? 'stat-card__change--up' : 'stat-card__change--down';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .stat-card {
    background-color: var(--color-bg-elevated, #fff);
    border: 1px solid var(--color-border-subtle, #f0f1f3);
    border-radius: var(--radius-lg, 12px);
    padding: var(--space-5, 20px);
    transition: box-shadow 0.2s ease, transform 0.2s ease;

    &:hover {
      box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.06));
      transform: translateY(-1px);
    }
  }

  .stat-card__label {
    font-size: var(--text-sm, 13px);
    color: var(--color-text-tertiary, #9ca3af);
    margin-bottom: var(--space-2, 8px);
  }

  .stat-card__value {
    font-size: var(--text-2xl, 24px);
    font-weight: 700;
    color: var(--color-text-primary, #1a1a2e);
    line-height: 1.2;
  }

  .stat-card__change {
    font-size: var(--text-xs, 12px);
    font-weight: 500;
    margin-top: var(--space-1, 4px);

    &--up {
      color: var(--color-success, #10b981);
    }

    &--down {
      color: var(--color-error, #ef4444);
    }
  }
</style>
