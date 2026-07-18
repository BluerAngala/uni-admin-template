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
      title: {
        type: String,
        default: '',
      },
      hoverable: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-card {
    overflow: hidden;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xs);
  }

  .app-card--hover {
    transition: border-color var(--transition-normal), box-shadow var(--transition-slow), transform var(--transition-spring);
  }

  .app-card--hover:hover {
    border-color: var(--color-border-strong);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .app-card__header {
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .app-card__title {
    color: var(--color-text-primary);
    font-size: var(--text-base);
    font-weight: 650;
    letter-spacing: var(--tracking-tight);
  }

  .app-card__body {
    padding: var(--space-5);
  }
</style>
