<template>
  <view class="app-section">
    <view v-if="title || description || $slots.actions" class="app-section__header">
      <view class="app-section__copy">
        <text v-if="title" class="app-section__title">{{ title }}</text>
        <text v-if="description" class="app-section__description">{{ description }}</text>
      </view>
      <view v-if="$slots.actions" class="app-section__actions">
        <slot name="actions" />
      </view>
    </view>
    <slot />
  </view>
</template>

<script>
  export default {
    name: 'AppSection',
    props: {
      title: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-section {
    margin-bottom: var(--space-8);
  }

  .app-section__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .app-section__copy {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .app-section__title {
    color: var(--color-text-primary);
    font-size: var(--text-lg);
    font-weight: 650;
    letter-spacing: var(--tracking-tight);
  }

  .app-section__description {
    color: var(--color-text-tertiary);
    font-size: var(--text-sm);
  }

  .app-section__actions {
    display: flex;
    flex-shrink: 0;
    gap: var(--space-2);
  }

  @media screen and (max-width: 767px) {
    .app-section__header {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
