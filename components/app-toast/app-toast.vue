<template>
  <view v-if="visible" class="app-toast" :class="`app-toast--${type}`">
    <text class="app-toast__icon">{{ iconMap[type] }}</text>
    <text class="app-toast__text">{{ message }}</text>
  </view>
</template>

<script>
  export default {
    name: 'AppToast',
    data() {
      return {
        visible: false,
        message: '',
        type: 'info',
        timer: null,
      };
    },
    computed: {
      iconMap() {
        return { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
      },
    },
    beforeDestroy() {
      if (this.timer) clearTimeout(this.timer);
    },
    methods: {
      show(message, type = 'info', duration = 3000) {
        this.message = message;
        this.type = type;
        this.visible = true;
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.visible = false;
        }, duration);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-toast {
    position: fixed;
    top: var(--space-6, 24px);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: var(--space-2, 8px);
    padding: var(--space-3, 12px) var(--space-4, 16px);
    border-radius: var(--radius-md, 8px);
    font-size: var(--text-sm, 13px);
    z-index: 700;
    box-shadow: var(--shadow-lg, 0 8px 24px rgba(0, 0, 0, 0.08));
    animation: toast-in 0.2s ease;
  }

  .app-toast--success {
    background-color: var(--color-success-subtle, rgba(16, 185, 129, 0.08));
    color: var(--color-success, #10b981);
    border: 1px solid var(--color-success, #10b981);
  }

  .app-toast--error {
    background-color: var(--color-error-subtle, rgba(239, 68, 68, 0.08));
    color: var(--color-error, #ef4444);
    border: 1px solid var(--color-error, #ef4444);
  }

  .app-toast--warning {
    background-color: var(--color-warning-subtle, rgba(245, 158, 11, 0.08));
    color: var(--color-warning, #f59e0b);
    border: 1px solid var(--color-warning, #f59e0b);
  }

  .app-toast--info {
    background-color: var(--color-bg-elevated, #fff);
    color: var(--color-text-primary, #1a1a2e);
    border: 1px solid var(--color-border-primary, #e5e7eb);
  }

  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>
