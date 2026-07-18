<template>
  <view v-if="visible" class="app-toast" :class="`app-toast--${type}`">
    <uni-icons class="app-toast__icon" :type="iconType" size="16" />
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
      iconType() {
        return {
          success: 'checkmarkempty',
          error: 'closeempty',
          warning: 'info',
          info: 'info',
        }[this.type];
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
    top: var(--space-6);
    left: 50%;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    color: var(--color-text-primary);
    background-color: var(--color-surface-overlay);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    transform: translateX(-50%);
    z-index: 700;
    animation: toast-in var(--transition-normal) ease;
  }

  .app-toast--success .app-toast__icon {
    color: var(--color-success);
  }

  .app-toast--error .app-toast__icon {
    color: var(--color-error);
  }

  .app-toast--warning .app-toast__icon {
    color: var(--color-warning);
  }

  .app-toast--info .app-toast__icon {
    color: var(--color-accent);
  }

  .app-toast__text {
    font-size: var(--text-sm);
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
