<template>
  <view class="error-page">
    <view class="error-container">
      <view class="error-code">404</view>
      <view class="error-title">页面未找到</view>
      <view class="error-msg" v-if="errMsg">{{ errMsg }}</view>
      <view class="error-action" @click="goHome">返回首页</view>
    </view>
    <!-- #ifndef H5 -->
    <fix-window />
    <!-- #endif -->
  </view>
</template>

<script>
  export default {
    data() {
      return {
        errMsg: '',
      };
    },
    onLoad(query) {
      this.errMsg = query.errMsg || '';
    },
    methods: {
      goHome() {
        uni.reLaunch({ url: '/pages/index/index' });
      },
    },
  };
</script>

<style scoped>
  page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: var(--color-bg-secondary, #f7f8fa);
  }

  .error-container {
    text-align: center;
    padding: 40px 20px;
  }

  .error-code {
    font-size: 120px;
    font-weight: 700;
    color: var(--color-accent, #5b8def);
    line-height: 1;
    margin-bottom: 20px;
  }

  .error-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-text-primary, #1a1a2e);
    margin-bottom: 12px;
  }

  .error-msg {
    font-size: 14px;
    color: var(--color-text-secondary, #6b7280);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .error-action {
    display: inline-block;
    padding: 10px 20px;
    background-color: var(--color-accent, #5b8def);
    color: #fff;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .error-action:hover {
    background-color: var(--color-accent-hover, #4a7de0);
  }
</style>
