<template>
  <view class="pointer">
    <block v-for="(item, index) in data" :key="index">
      <template v-if="!item.children || !item.children.length">
        <uni-menu-item :index="item">
          <view :class="item.icon" :title="item.text"></view>
          <text :class="{ title: item.icon }">{{ item.text }}</text>
        </uni-menu-item>
      </template>
      <uni-sub-menu v-else :index="item">
        <template v-slot:title>
          <view :class="item.icon" :title="item.text"></view>
          <text :class="{ title: item.icon }">{{ item.text }}</text>
        </template>
        <uni-menu-sidebar class="item-bg" :data="item.children" :key="item._id" />
      </uni-sub-menu>
    </block>
  </view>
</template>

<script>
  export default {
    name: 'uniMenuSidebar',
    props: {
      data: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {};
    },
    computed: {},
    methods: {},
  };
</script>

<style lang="scss">
  .title {
    margin-left: var(--space-3);
  }

  [class*='admin-icons-'],
  [class^='admin-icons-'] {
    width: 18px;
    color: inherit;
    font-size: 18px;
    text-align: center;
  }
</style>
