<template>
  <!-- 订单/操作单直清直派侧边栏 -->
  <div style="height: 100%">
    <OperateSidebarCard :showBarTabArr="showBarTabArr" class="customs-bar-box">
      <template v-slot:slideCard="{ showTabObj }">
        <template v-if="showBarTabArr.some((e) => e.tabKey === 'stateBar')">
          <div v-show="showTabObj.tabKey === 'stateBar'">
            <ComLogistTrack
              ref="myLogistTrack"
              :activities="activities"
              isNoDrawer
              :orderType = "pageType == 1 ? 50 : 45"
            >
              <template v-slot:title="slotProps">
                <span class="orange-bg"> {{ slotProps.activity.name }}</span>
              </template>
              <template v-slot:operationDate="slotProps">
                <span> {{ slotProps.activity.trajectoryTime }}</span>
              </template>
              <template v-slot:operationContent="slotProps">
                <span> {{ slotProps.activity.msg }}</span>
              </template>
            </ComLogistTrack>
          </div>
          <div v-show="showTabObj.tabKey === 'remarkBar'" v-if="menuType=='operation'">
            <div class="operate-status" v-if="Object.keys(dictionaryData).length">
            <span>状态</span>
            <el-select :value="formData.overallStatus" size="small" disabled>
              <template
                v-for="item in dictionaryData['nlOverAllStatus'] || []"
              >
                <el-option
                  :key="+item.value"
                  :label="item.nameCn"
                  :value="+item.value"
                  disabled
                ></el-option>
              </template>
            </el-select>
          </div>
          <LogistrackRemark :formData="formData" />

        </div>
        </template>
      </template>
    </OperateSidebarCard>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {barTabConfig} from "./model.js"
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    menuType: {
      type: String,
      required: true
    },
    pageType: {
      type: Number,
      default: 1,//1清关   2提派
    },
  },
  data() {
    const showBarTabArr=barTabConfig({menuType:this.menuType})
    return {
      activities: {
        title: "物流轨迹",
        id: this.formData.id,
      },
      showBarTabArr,
      timeList: [],
    };
  },
  computed: {
    ...mapState({
      dictionaryData: (state) => state.dictionary.dicsData,
    }),
  },
  components: {
    OperateSidebarCard: () => import("_comp/ComOperate/components/operateCard"),
    ComLogistTrack: () => import("_comp/ComLogistTrack"),
    LogistrackRemark: () => import("./remark"),
  },
  methods: {
    reloadLogisticsNodes() {
      this.$refs.myLogistTrack.getLogisticsNodes();
    },
  },
};
</script>

<style lang="scss" scoped>
.customs-bar-box {
  .flow-card-title {
    font-size: 14px;
    font-weight: bold;
    margin: 25px 0 10px;
    color: #515151;
  }
  .operate-status {
  display: flex;
  font-size: 14px;
  height: 34px;
  line-height: 34px;
  border-radius: 4px;
  border: 1px solid #5094ff;
  margin-top: 44px;
  text-align: center;
  overflow: hidden;

  & > span:nth-child(1) {
    width: 74px;
    height: 34px;
    line-height: 34px;
    background: #5094ff;
    color: #fff;
  }
  /deep/ .el-select {
    .el-input__inner {
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-color: transparent;
    }
  }
}
  .title {
    font-size: 15px;
    font-weight: bold;
    color: #515151;
    line-height: 30px;
    margin: 15px 0;
  }
  /deep/ {
    .track {
      margin: 15px 0;
      .track-title {
        font-size: 15px;
        font-weight: bold;
        color: #515151;
      }
    }
    .el-timeline {
      .title {
        font-size: 14px;
        font-weight: 500;
        color: #515151;
        line-height: 30px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e2e2e2;
      }
    }
    .com-operate-width {
      // height: auto !important;
      min-height: calc(100vh - 284px);
    }
  }
  .logistic-track {
    /deep/ {
      .timeline {
        .operation-time {
          font-size: 13px;
          color: #515151;
          margin-bottom: 3px;
          line-height: 18px;
        }
        .operation span {
          font-size: 13px;
          color: #bcbcbc;
          line-height: 18px;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
