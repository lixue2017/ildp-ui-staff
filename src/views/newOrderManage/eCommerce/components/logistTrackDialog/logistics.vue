<template>
  <div>
    <ComDrawer
      ref="myDrawer"
      :customDrawer="drawerConfig"
      :confirmClose="false"
      v-if="!isNoDrawer"
    >
      <template v-slot:content>
        <TrajectoryTimeline class="trajectory-line" :timeList="list" />
      </template>
    </ComDrawer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getLogisticsTypeList } from "@/api/trandition/oceanModel.js";
import commonMixin from "@/utils/mixin";

export default {
  mixins: [commonMixin],
  props: {
    activities: {
      type: Object,
      default: () => {},
    },
    isNoDrawer: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    TrajectoryTimeline: () => import("_comp/ComLogistTrack/timeline.vue"),
  },
  data() {
    return {
      drawerConfig: {
        title: "物流轨迹",
        width: "550px",
      },
      list: [],
    };
  },
  methods: {
    show(id, type = 1) {
      // 订单id
      getLogisticsTypeList(id, type).then((res) => {
        this.list = res.rows;
        this.$refs.myDrawer.show();
      });
    },
    hide() {
      this.$refs.myDrawer.hide();
    },
    getLogisticsStatus(status) {
      return this.dictionary.dicsData?.orderStatus[status].nameCn;
    },
  },
  computed: {
    ...mapState(["dictionary"]),
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";
.sn-info {
  @include spaceBetween;
  color: #515151;
  font-size: 14px;
}
.desti-info {
  @include spaceBetween;
  padding: 0 24px;
  margin-top: 32px;
  .depart-arrive {
    font-size: 30px;
    font-weight: 500;
    color: #333333;
    align-self: center;
  }
  .by-way {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 25px;
    .arrows {
      width: 216px;
      height: 2px;
      background: #ff813d;
      margin: 6px 0 20px;
    }
    .icon-chuanbo,
    .time-consume {
      align-self: center;
    }
    .icon-chuanbo {
      font-size: 28px;
      color: $orange;
    }
  }
}
.track {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 30px;
  .track-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
.el-timeline {
  margin-top: 4px;
  padding-left: 9px;
}

/deep/.orange-bg {
  line-height: 30px;
  background: rgba($color: $orange, $alpha: 0.1);
  border-radius: 25px;
  color: $orange;
  padding: 0 10px;
  font-size: 14px;
}
.business-item {
  margin-bottom: 8px;
  /deep/ .business-item-btn {
    width: 100%;
    color: #515151;
    padding: 6px 15px;
    cursor: initial;
    &.is-plain:hover,
    &.is-plain:focus {
      border-color: #c6c8cb;
    }
    & > span {
      line-height: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    i {
      font-size: 18px;
      &.icon-success {
        color: #35d06f;
      }
      &.icon-loading {
        color: #ff813d;
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
      .processing {
        font-size: 14px;
        color: #ff813d;
      }
    }
  }
}
</style>
