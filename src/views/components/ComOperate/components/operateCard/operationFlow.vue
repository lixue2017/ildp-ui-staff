<template>
  <div>
    <div class="node-title">
      <div class="title">{{ overseaLangObj.yw_xg_xx || "业务相关信息" }}</div>
      <div class="expand-btn" @click="toggleExpand">
        <template v-if="isExpandAll">
          <span>{{ overseaLangObj.qb_sq || "全部收起" }}</span>
          <i class="el-icon-arrow-up"></i>
        </template>
        <template v-else>
          <span>{{ overseaLangObj.qb_zk || "全部展开" }}</span>
          <i class="el-icon-arrow-down"></i>
        </template>
      </div>
    </div>
    <template v-for="item in nodeFlowList">
      <div class="business-item" :key="item.id">
        <el-button
          class="business-item-btn"
          @click="() => toggleExpandChild(item.id)"
          plain
        >
          <span>{{ item.name }}</span>
          <i :class="statusList[item.state] && statusList[item.state].icon"></i>
        </el-button>
        <ul
          class="business-item-ul"
          v-if="
            item.state &&
            item.smallNodeList &&
            item.smallNodeList.length &&
            expandList[item.id]
          "
        >
          <template v-for="(child, index) in item.smallNodeList">
            <li :key="child.id">
              <span>{{ child.name }}</span>
              <span v-if="child.state === 3">{{
                child.nodeId === 2 ? child.effectivenessTime : child.finishTime
              }}</span>
              <el-button
                v-else-if="child.state !== 3 && !disable"
                type="text"
                size="mini"
                v-throttle
                @click="handleClick(child)"
                :disabled="
                  (![111, 112, 113].includes(child.nodeId) &&
                    index &&
                    item.smallNodeList[index - 1].state !== 3) ||
                  child.state === -1 /** 状态为-1不可操作 */
                    ? true
                    : false
                "
                >{{ overseaLangObj.to_cl || "去处理" }}</el-button
              >
              <span v-else>{{ overseaLangObj.to_cl || "去处理" }}</span>
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
    formData: {
      type: Object,
      default: () => {},
    },
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
        0: {
          text: "待激活",
          icon: "iconfont xinxizhuangtai4",
        },
        1: {
          text: "已激活",
          icon: "el-icon-video-play",
        },
        2: {
          text: "进行中",
          icon: "icon-loading el-icon-time",
        },
        3: {
          text: "已完成",
          icon: "icon-success el-icon-circle-check",
        },
      },
      isExpandAll: true,
      expandList: {},
    };
  },
  watch: {
    nodeFlowList: {
      deep: true,
      handler: function (newVal, oldVal) {
        newVal.forEach((item) => {
          this.$set(this.expandList, item.id, this.isExpandAll);
        });
      },
    },
  },
  methods: {
    handleClick(row) {
      this.$emit("handleFlowClick", row);
    },
    toggleExpand() {
      this.isExpandAll = !this.isExpandAll;
      Object.keys(this.expandList).forEach((key) => {
        this.$set(this.expandList, key, this.isExpandAll);
      });
    },
    toggleExpandChild(key) {
      console.log(key);
      console.log(this.expandList);
      this.$set(this.expandList, key, !this.expandList[key]);
      console.log(this.expandList[key]);
    },
  },
  created() {},
  components: {},
};
</script>

<style lang="scss" scoped>
.node-title {
  display: flex;
  justify-content: space-between;
  margin: 30px 0 20px;
  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .expand-btn {
    color: #5094ff;
    cursor: pointer;
  }
}
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
