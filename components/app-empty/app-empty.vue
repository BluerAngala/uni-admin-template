<template>
  <view class="app-empty">
    <uni-icons class="app-empty__icon" type="info" size="32" />
    <text class="app-empty__text">{{ text || '暂无数据' }}</text>
    <view v-if="$slots.action" class="app-empty__action">
      <slot name="action" />
    </view>
  </view>
</template>

<script>
  export default {
    name: 'AppEmpty',
    props: {
      text: {
        type: String,
        default: '',
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 180px;
    padding: var(--space-10) var(--space-6);
    text-align: center;
  }

  .app-empty__icon {
    margin-bottom: var(--space-3);
    color: var(--color-text-tertiary);
  }

  .app-empty__text {
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
  }

  .app-empty__action {
    margin-top: var(--space-4);
  }
</style>
