<template>
  <view class="app-page" :class="{ 'app-page--fluid': fluid }">
    <slot />
  </view>
</template>

<script>
  export default {
    name: 'AppPage',
    props: {
      fluid: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-page {
    max-width: 1440px;
    padding: var(--space-8);
    margin: 0 auto;
    box-sizing: border-box;
  }

  .app-page--fluid {
    max-width: none;
  }

  @media screen and (max-width: 767px) {
    .app-page {
      padding: var(--space-4);
    }
  }
</style>
