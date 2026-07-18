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
    padding: 2px var(--space-2\.5, 10px);
    font-size: var(--text-xs, 12px);
    font-weight: 500;
    border-radius: var(--radius-full, 9999px);
    line-height: var(--leading-normal, 1.5);
  }

  .app-badge--default {
    background-color: var(--color-bg-tertiary, #f0f1f3);
    color: var(--color-text-secondary, #6b7280);
  }

  .app-badge--success {
    background-color: var(--color-success-subtle, rgba(16, 185, 129, 0.08));
    color: var(--color-success, #10b981);
  }

  .app-badge--warning {
    background-color: var(--color-warning-subtle, rgba(245, 158, 11, 0.08));
    color: var(--color-warning, #f59e0b);
  }

  .app-badge--error {
    background-color: var(--color-error-subtle, rgba(239, 68, 68, 0.08));
    color: var(--color-error, #ef4444);
  }

  .app-badge--info {
    background-color: var(--color-accent-subtle, rgba(91, 141, 239, 0.08));
    color: var(--color-accent, #5b8def);
  }
</style>
