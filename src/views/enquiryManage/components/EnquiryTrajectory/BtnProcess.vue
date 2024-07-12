<template>
  <div>
    <template v-for="item in nodeFlowList">
      <div class="business-item" :key="item.code">
        <el-button class="business-item-btn" plain>
          <span>{{ item.name }}</span>
          <i :class="statusList[item.state].icon"></i>
        </el-button>
        <!-- item.state &&  -->
        <ul
          class="business-item-ul"
          v-if="item.state && item.children && item.children.length"
        >
          <template v-for="child in item.children">
            <li :key="child.id">
              <span>{{ child.name }}</span>
              <span v-if="child.state === 3">{{ child.optTime }}</span>
              <span :style="{ color: statusList[child.state].color }" v-else>{{
                statusList[child.state].text
              }}</span>
            </li>
          </template>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    nodeFlowList: {
      type: Array,
      default: () => [],
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      statusList: {
        1: {
          text: "待处理",
          icon: "el-icon-video-play",
        },
        2: {
          text: "处理中",
          color: "#5094FF",
          icon: "icon-loading el-icon-time",
        },
        3: {
          text: "已处理",
          icon: "icon-success el-icon-circle-check",
        },
      },
    };
  },
  methods: {
    handleClick(row) {
      this.$emit("handleFlowClick", row);
    },
  },
  created() {},
  components: {},
};
</script>

<style lang="scss" scoped>
.business-item {
  margin-bottom: 8px;
  /deep/ .business-item-btn {
    width: 100%;
    color: #515151;
    padding: 6px 15px;
    & > span {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &:hover {
      color: #5094ff;
      box-shadow: 0px 0px 4px 0px rgba(176, 176, 176, 0.65);
    }
    i {
      font-size: 18px;
      &.icon-success {
        color: #35d06f;
      }
      &.icon-loading {
        color: #5094ff;
      }
      &.icon-suspend {
        color: #696969;
      }
    }
  }
  .business-item-ul {
    font-size: 12px;
    padding-left: 30px;
    margin-bottom: -8px;
    li {
      position: relative;
      line-height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 11px;
      color: #8b8b8b;
      &::before {
        position: absolute;
        left: 0px;
        content: "";
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #8b8b8b;
      }
      &:not(:last-child) {
        border-bottom: 1px solid #e2e2e2;
      }
      .el-button--text:hover,
      .el-button--text:focus {
        border-color: transparent;
      }
    }
  }
}
</style>
