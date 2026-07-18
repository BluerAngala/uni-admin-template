<template>
  <view class="app-empty">
    <view class="app-empty__icon">📭</view>
    <view class="app-empty__text">{{ text || '暂无数据' }}</view>
    <view v-if="$slots.action" class="app-empty__action">
      <slot name="action" />
    </view>
  </view>
</template>

<script>
  export default {
    name: 'AppEmpty',
    props: {
      text: { type: String, default: '' },
    },
  };
</script>

<style lang="scss" scoped>
  .app-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-12, 48px) var(--space-6, 24px);
  }

  .app-empty__icon {
    font-size: 48px;
    margin-bottom: var(--space-4, 16px);
  }

  .app-empty__text {
    font-size: var(--text-sm, 13px);
    color: var(--color-text-tertiary, #9ca3af);
  }

  .app-empty__action {
    margin-top: var(--space-4, 16px);
  }
</style>
