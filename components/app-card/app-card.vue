<template>
  <view class="app-card" :class="{ 'app-card--hover': hoverable }">
    <view v-if="$slots.header || title" class="app-card__header">
      <slot name="header">
        <text class="app-card__title">{{ title }}</text>
      </slot>
    </view>
    <view class="app-card__body">
      <slot />
    </view>
  </view>
</template>

<script>
  export default {
    name: 'AppCard',
    props: {
      title: { type: String, default: '' },
      hoverable: { type: Boolean, default: false },
    },
  };
</script>

<style lang="scss" scoped>
  .app-card {
    background-color: var(--color-bg-elevated, #fff);
    border: 1px solid var(--color-border-subtle, #f0f1f3);
    border-radius: var(--radius-lg, 12px);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  .app-card--hover:hover {
    box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.06));
    transform: translateY(-1px);
  }

  .app-card__header {
    padding: var(--space-4, 16px) var(--space-5, 20px);
    border-bottom: 1px solid var(--color-border-subtle, #f0f1f3);
  }

  .app-card__title {
    font-size: var(--text-base, 14px);
    font-weight: 600;
    color: var(--color-text-primary, #1a1a2e);
  }

  .app-card__body {
    padding: var(--space-5, 20px);
  }
</style>
