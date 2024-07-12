<template>
  <!-- 一件代发出库详情侧边栏 -->
  <div style="height: 100%">
    <OperateSidebarCard :showBarTabArr="showBarTabArr" class="customs-bar-box">
      <template v-slot:slideCard="{ showTabObj }">
        <div v-show="showTabObj.tabKey === 'remarkBar'">
          <RemarksBarCard viewSource="wholeSale" :formData="formData" />
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
    <!-- <ComCustomDialog ref="customDlgRef" /> -->
  </div>
</template>

<script>
// import { orderClearanceLogistics } from "@/api/operateManage/common";
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
    handleNodeClick(row) {},
  },
  created() {
    const { id, webPageSource } = this.formData;
    // if (webPageSource === 'webOperationOutbound') {
    // 操作单一件代发出库详情
    this.showBarTabArr = [
      {
        isTabShow: false,
        tabKey: "remarkBar",
        name: "备注",
      },
    ];
  },
  components: {
    OperateSidebarCard: () => import("../components/operateCard"),
    OperateFlowCard: () =>
      import("_comp/ComOperate/components/operateCard/operationFlow.vue"), // 业务流程节点
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
