<template>
  <view class="app-page-header">
    <view v-if="$slots.breadcrumb" class="app-page-header__breadcrumb">
      <slot name="breadcrumb" />
    </view>
    <view class="app-page-header__content">
      <view class="app-page-header__copy">
        <text v-if="title" class="app-page-header__title">{{ title }}</text>
        <text v-if="description" class="app-page-header__description">{{ description }}</text>
        <slot />
      </view>
      <view v-if="$slots.actions" class="app-page-header__actions">
        <slot name="actions" />
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'AppPageHeader',
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
  .app-page-header {
    margin-bottom: var(--space-8);
  }

  .app-page-header__breadcrumb {
    margin-bottom: var(--space-3);
  }

  .app-page-header__content,
  .app-page-header__actions {
    display: flex;
    align-items: center;
  }

  .app-page-header__content {
    justify-content: space-between;
    gap: var(--space-4);
  }

  .app-page-header__copy {
    display: flex;
    flex-direction: column;
    gap: var(--space-1\.5);
    min-width: 0;
  }

  .app-page-header__title {
    color: var(--color-text-primary);
    font-size: var(--text-2xl);
    font-weight: 700;
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
  }

  .app-page-header__description {
    color: var(--color-text-tertiary);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-normal);
  }

  .app-page-header__actions {
    flex-shrink: 0;
    gap: var(--space-2);
  }

  @media screen and (max-width: 767px) {
    .app-page-header__content {
      align-items: flex-start;
      flex-direction: column;
    }

    .app-page-header__actions {
      width: 100%;
    }
  }
</style>
