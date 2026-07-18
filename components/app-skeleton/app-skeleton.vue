<template>
  <view class="skeleton" :class="`skeleton--${variant}`">
    <view v-if="variant === 'card'" class="skeleton__card">
      <view class="skeleton__card-header"></view>
      <view class="skeleton__card-line"></view>
      <view class="skeleton__card-line skeleton__card-line--short"></view>
    </view>
    <view v-else-if="variant === 'row'" class="skeleton__row">
      <view class="skeleton__avatar"></view>
      <view class="skeleton__lines">
        <view class="skeleton__line"></view>
        <view class="skeleton__line skeleton__line--short"></view>
      </view>
    </view>
    <view v-else :class="`skeleton__${variant}`" :style="{ width: width }"></view>
  </view>
</template>

<script>
  export default {
    name: 'AppSkeleton',
    props: {
      variant: {
        type: String,
        default: 'text',
        validator: (value) => ['text', 'title', 'card', 'row'].includes(value),
      },
      width: {
        type: String,
        default: '100%',
      },
    },
  };
</script>

<style lang="scss" scoped>
  @keyframes skeleton-shimmer {
    from {
      background-position: 200% 0;
    }

    to {
      background-position: -200% 0;
    }
  }

  .skeleton__text,
  .skeleton__title,
  .skeleton__line,
  .skeleton__card-header,
  .skeleton__card-line,
  .skeleton__avatar {
    background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-bg-secondary) 50%, var(--color-bg-tertiary) 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.4s linear infinite;
  }

  .skeleton__text,
  .skeleton__line {
    height: 14px;
    margin-bottom: var(--space-2);
    border-radius: var(--radius-sm);
  }

  .skeleton__title {
    height: 20px;
    border-radius: var(--radius-sm);
  }

  .skeleton__card {
    width: 100%;
  }

  .skeleton__card-header {
    width: 36%;
    height: 16px;
    margin-bottom: var(--space-5);
    border-radius: var(--radius-sm);
  }

  .skeleton__card-line {
    width: 72%;
    height: 28px;
    margin-bottom: var(--space-3);
    border-radius: var(--radius-sm);
  }

  .skeleton__card-line--short,
  .skeleton__line--short {
    width: 46%;
  }

  .skeleton__row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .skeleton__avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  .skeleton__lines {
    flex: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton__text,
    .skeleton__title,
    .skeleton__line,
    .skeleton__card-header,
    .skeleton__card-line,
    .skeleton__avatar {
      animation: none;
    }
  }
</style>
