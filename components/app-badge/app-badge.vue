<template>
  <view class="app-badge" :class="`app-badge--${type}`">
    <slot />
  </view>
</template>

<script>
  export default {
    name: 'AppBadge',
    props: {
      type: { type: String, default: 'default', validator: (v) => ['default', 'success', 'warning', 'error', 'info'].includes(v) },
    },
  };
</script>

<style lang="scss" scoped>
  .app-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px var(--space-2\.5);
    font-size: var(--text-xs);
    font-weight: 500;
    letter-spacing: var(--tracking-wide);
    border-radius: var(--radius-full);
    line-height: var(--leading-normal);
  }

  .app-badge--default {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-secondary);
  }

  .app-badge--success {
    background-color: var(--color-success-subtle);
    color: var(--color-success);
  }

  .app-badge--warning {
    background-color: var(--color-warning-subtle);
    color: var(--color-warning);
  }

  .app-badge--error {
    background-color: var(--color-error-subtle);
    color: var(--color-error);
  }

  .app-badge--info {
    background-color: var(--color-accent-subtle);
    color: var(--color-accent);
  }
</style>
