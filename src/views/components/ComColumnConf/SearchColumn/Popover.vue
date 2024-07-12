<template>
  <el-popover placement="bottom" width="212" v-model="config.cVisible">
    <!-- <p>是否设置为默认搜索条件？</p>
		<div style="text-align: right; margin: 0">
			<el-button size="mini" type="text" @click="() => handleDefaultState()"
				>确定</el-button
			>
		</div> -->
    <div class="right-click-content">
      <div class="menu-li" @click="() => handleDefaultState()">
        设置为默认搜索条件
      </div>
      <div
        class="menu-li"
        v-if="
          config.stateSearchList[routeKey] &&
          config.stateSearchList[routeKey][0].id !== config.tabState.id
        "
        @click="() => handleHideState()"
      >
        隐藏页签
      </div>
    </div>
    <div
      slot="reference"
      class="context-menu"
      :style="{
        top: `${config.contextMenuY}px`,
        left: `${config.contextMenuX}px`,
      }"
    ></div>
  </el-popover>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      default: () => ({
        cVisible: false,
        contextMenuY: 0,
        contextMenuX: 0,
        tabState: {},
        stateSearchList: {},
      }),
    },
    handleDefaultState: {
      type: Function,
      default: () => {},
    },
    handleHideState: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      routeKey: this.$route.path,
    };
  },
};
</script>

<style lang="scss" scoped>
.context-menu {
  position: fixed;
  z-index: -1;
  background: #ffffff;
  opacity: 0;
}
.right-click-content {
  .menu-li {
    line-height: 30px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: #eef4ff;
      color: #73a9ff;
    }
  }
}
</style>
