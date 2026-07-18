<template>
  <view class="skeleton" :class="`skeleton--${variant}`">
    <view v-if="variant === 'text'" class="skeleton__text" :style="{ width }"></view>
    <view v-else-if="variant === 'title'" class="skeleton__title"></view>
    <view v-else-if="variant === 'card'" class="skeleton__card">
      <view class="skeleton__card-header"></view>
      <view class="skeleton__card-line" style="width: 80%"></view>
      <view class="skeleton__card-line" style="width: 60%"></view>
    </view>
    <view v-else-if="variant === 'row'" class="skeleton__row">
      <view class="skeleton__avatar"></view>
      <view class="skeleton__lines">
        <view class="skeleton__line" style="width: 70%"></view>
        <view class="skeleton__line" style="width: 50%"></view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'AppSkeleton',
    props: {
      variant: { type: String, default: 'text', validator: (v) => ['text', 'title', 'card', 'row'].includes(v) },
      width: { type: String, default: '100%' },
    },
  };
</script>

<style lang="scss" scoped>
  @keyframes skeleton-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }

  .skeleton {
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  }

  .skeleton__text,
  .skeleton__line {
    height: 14px;
    border-radius: var(--radius-sm, 6px);
    background-color: var(--color-bg-tertiary, #f0f1f3);
    margin-bottom: var(--space-2, 8px);
  }

  .skeleton__title {
    height: 20px;
    width: 40%;
    border-radius: var(--radius-sm, 6px);
    background-color: var(--color-bg-tertiary, #f0f1f3);
    margin-bottom: var(--space-3, 12px);
  }

  .skeleton__card {
    background-color: var(--color-bg-elevated, #fff);
    border: 1px solid var(--color-border-subtle, #f0f1f3);
    border-radius: var(--radius-lg, 12px);
    padding: var(--space-5, 20px);
  }

  .skeleton__card-header {
    height: 16px;
    width: 30%;
    border-radius: var(--radius-sm, 6px);
    background-color: var(--color-bg-tertiary, #f0f1f3);
    margin-bottom: var(--space-4, 16px);
  }

  .skeleton__card-line {
    height: 14px;
    border-radius: var(--radius-sm, 6px);
    background-color: var(--color-bg-tertiary, #f0f1f3);
    margin-bottom: var(--space-2, 8px);
  }

  .skeleton__row {
    display: flex;
    align-items: center;
    gap: var(--space-3, 12px);
  }

  .skeleton__avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full, 9999px);
    background-color: var(--color-bg-tertiary, #f0f1f3);
    flex-shrink: 0;
  }

  .skeleton__lines {
    flex: 1;
  }
</style>
