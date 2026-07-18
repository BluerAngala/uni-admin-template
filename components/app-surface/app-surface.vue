<template>
  <view class="app-surface" :class="[`app-surface--${variant}`, `app-surface--padding-${padding}`]">
    <slot />
  </view>
</template>

<script>
  export default {
    name: 'AppSurface',
    props: {
      variant: {
        type: String,
        default: 'standard',
        validator: (value) => ['standard', 'raised', 'inset'].includes(value),
      },
      padding: {
        type: String,
        default: 'default',
        validator: (value) => ['none', 'compact', 'default'].includes(value),
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-surface {
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-xl);
  }

  .app-surface--standard {
    background-color: var(--color-surface);
  }

  .app-surface--raised {
    background-color: var(--color-surface-raised);
    box-shadow: var(--shadow-sm);
  }

  .app-surface--inset {
    background-color: var(--color-surface-inset);
  }

  .app-surface--padding-none {
    padding: 0;
  }

  .app-surface--padding-compact {
    padding: var(--space-4);
  }

  .app-surface--padding-default {
    padding: var(--space-5);
  }
</style>
