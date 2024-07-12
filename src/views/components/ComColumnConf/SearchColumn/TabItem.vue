<template>
  <div @contextmenu.prevent="(e) => handleRightClick(e, sItem)">
    <span>{{ sItem.nameCn }}</span>
    <span class="state-num" v-if="sItem.countSum || sItem.countSum === 0">
      <!-- 已完结不显示 -->
      ({{ sItem.countSum }})
    </span>
  </div>
</template>

<script>
export default {
  props: {
    sItem: {
      type: Object,
      default: () => ({}),
    },
    handleRightClick: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
.state-num {
  color: #5094ff;
}
</style>
