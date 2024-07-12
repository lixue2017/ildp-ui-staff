<template>
  <!-- FAB出库详情侧边栏 -->
  <div style="height: 100%">
    <OperateSidebarCard :showBarTabArr="showBarTabArr" class="customs-bar-box">
      <template v-slot:slideCard="{ showTabObj }">
        <div v-show="showTabObj.tabKey === 'remarkBar'">
          <RemarksBarCard :formData="formData" />
        </div>

        <template v-if="showBarTabArr.some((e) => e.tabKey === 'stateBar')">
          <div v-show="showTabObj.tabKey === 'stateBar'">
            <!-- <div class="flow-card-title">业务相关信息</div> -->
            <OperateFlowCard
              :formData="formData"
              :nodeFlowList="nodeFlowList"
              @handleFlowClick="handleNodeClick"
            />
          </div>
        </template>
      </template>
    </OperateSidebarCard>

    <!-- 自定义弹窗 -->
    <ComCustomDialog ref="customDlgRef" />
  </div>
</template>

<script>
import { orderClearanceLogistics } from "@/api/operateManage/common";
import { mixinOperable } from "../mixins/operationBtnList.js";
import { mixinNodeOperable } from "../mixins/nodeOperate.js";

export default {
  mixins: [mixinOperable, mixinNodeOperable],
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      nodeFlowList: [],
    };
  },
  methods: {
    handleNodeClick(row) {
      // if (row.isAlert) {
      //   // 时间确认弹窗
      //   switch (row.nodeId) {
      //     case 23: // 航次到港
      //       this.handleAirlineStatus(this.formData.airLineId, 3, this.formData.joinOrderId);
      //   }
      // } else {
      //   switch (row.nodeId) {
      // 		case 28: // 清关申报
      //     case 33: // 审核查验
      //     case 61: // 预计提拆柜
      //       this.examineCustomsClearance(row, this.formData.joinOrderId);
      //       break;
      // 		case 62: // 实际提拆柜
      //       this.onStripping(this.formData.joinOrderId);
      //       break;
      // 	}
      // }
    },
  },
  created() {
    const { id, webPageSource } = this.formData;
    // if (webPageSource === 'webOperationOutbound') {
    // 操作单FAB出库详情
    this.showBarTabArr = [
      {
        isTabShow: false,
        tabKey: "remarkBar",
        name: "备注",
      },
    ];
    // }
    // this.operateDetail = {
    // 	id // 操作单ID-按钮与节点参数值
    // }
    // orderClearanceLogistics(id).then(res => {
    // 	this.nodeFlowList = res.data || [];
    // });
  },
  components: {
    OperateSidebarCard: () => import("../components/operateCard"),
    // OperationButton: () => import("_comp/ComOperate/components/operateCard/operationButton.vue"), // 操作按钮
    OperateFlowCard: () =>
      import("_comp/ComOperate/components/operateCard/operationFlow.vue"), // 业务流程节点
    // CustomsDispatch: () => import("_comp/ComLogistTrack/components/dispatch"),
    RemarksBarCard: () => import("../components/remarks/FbaRemarkCard"),
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
}
</style>
