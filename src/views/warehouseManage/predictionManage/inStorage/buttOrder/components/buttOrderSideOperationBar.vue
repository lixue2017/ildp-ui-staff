<template>
  <!-- 入库电商头程详情侧边栏 -->
  <div style="height: 100%">
    <OperateSidebarCard :showBarTabArr="showBarTabArr" class="customs-bar-box">
      <template v-slot:slideCard="{ showTabObj }">
        <div v-show="showTabObj.tabKey === 'remarkBar'">
          <div class="operate-status" v-if="!formData.id">
            <span>{{ overseaLangObj.zt_status || "状态" }}</span>
            <div style="flex: 1; background-color: #f9f9f9; color: #a5a5a5">
              {{
                getDictObj(inStorageStatus, formData.warehouseStatus) ||
                formData.warehouseStatus
              }}
            </div>
          </div>
          <RemarkCard :formData="formData" />
        </div>
        <div v-show="showTabObj.tabKey === 'stateBar'">
          <div class="operate-status">
            <span>{{ overseaLangObj.zt_status || "状态" }}</span>
            <div style="flex: 1; background-color: #f9f9f9; color: #a5a5a5">
              {{
                getDictObj(inStorageStatus, formData.warehouseStatus) ||
                formData.warehouseStatus
              }}
            </div>
          </div>
          <OperationButton
            :btnList="ectrajectoryBtn"
            :nameArr="[]"
            :operateDetail="{
              ...formData,
              id: formData.operationOrderId,
            }"
            @handleBtnClick="handleBtnClick"
          />
          <OperateFlowCard
            :formData="formData"
            :nodeFlowList="nodeFlowList"
            @handleFlowClick="handleNodeClick"
          />
        </div>
      </template>
    </OperateSidebarCard>
    <!-- 预约派送 -->
    <CustomsDispatch
      :activities="{
        id: formData.operationOrderId,
        operationOrderNum: formData.number,
      }"
      ref="dispatchRef"
    />
  </div>
</template>

<script>
import { mixinOperable } from "_comp/ComOperate/mixins/operationBtnList.js";
import { orderWarehouseLogistics } from "@/api/operateManage/common";
import { ectrajectoryBtn } from "./model.js";
import { mapState } from "vuex";
export default {
  mixins: [mixinOperable],
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      ectrajectoryBtn,
      showBarTabArr: [
        {
          isTabShow: false,
          tabKey: "stateBar",
          name: this.overseaLangObj.gj_trajectory() || "轨迹",
        },
        {
          name: this.overseaLangObj.bz_remark() || "备注",
          tabKey: "remarkBar",
          isTabShow: false,
          className: "remarks-bar",
        },
      ],
      nodeFlowList: [],
    };
  },
  computed: {
    ...mapState({
      inStorageStatus: (state) => state.dictionary.dicsData.inStorageStatus,
    }),
  },
  methods: {
    handleNodeClick(row) {
      // const { id } = this.formData;
      if (!row.isAlert) {
        switch (row.nodeId) {
          case 28: // 清关登记
            break;
          case 33: // 清关放行
            break;
          default:
            break;
        }
      }
    },
  },
  created() {
    //先取清关的
    const { id, operationOrderId } = this.formData;
    if (!id) {
      // 子单
      this.showBarTabArr = [
        {
          name: this.overseaLangObj.bz_remark() || "备注",
          tabKey: "remarkBar",
          isTabShow: false,
          // className: "remarks-bar",
        },
      ];
    }
    orderWarehouseLogistics(operationOrderId).then((res) => {
      this.nodeFlowList = res.data || [];
    });
  },
  components: {
    OperateSidebarCard: () => import("_comp/ComOperate/components/operateCard"),
    RemarkCard: () => import("./remark.vue"),
    OperateFlowCard: () =>
      import("_comp/ComOperate/components/operateCard/operationFlow.vue"), // 业务流程节点
    CustomsDispatch: () => import("_comp/ComLogistTrack/components/dispatch"),
    OperationButton: () =>
      import("_comp/ComOperate/components/operateCard/operationButton.vue"), // 操作按钮
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
}
</style>
