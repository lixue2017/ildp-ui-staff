<template>
  <!-- 清关详情侧边栏,目前只有国内清关详情用到 -->
  <div style="height: 100%">
    <OperateSidebarCard :showBarTabArr="showBarTabArr" class="customs-bar-box">
      <template v-slot:slideCard="{ showTabObj }">
        <div v-show="showTabObj.tabKey === 'remarkBar'">
          <RemarksBarCard
            :formData="formData"
            :nameArr="nameArr"
            :btnList="handleButtons('remark')"
            @handleBtnClick="handleBtnClick"
          />
        </div>

        <div v-show="showTabObj.tabKey === 'stateBar'">
          <div class="operate-status">
            <span>{{ overseaLangObj.zt_status || "状态" }}</span>
            <div style="flex: 1; background-color: #f9f9f9; color: #a5a5a5">
              {{
                getDictObj(clearanceStatus, formData.status) || formData.status
              }}
            </div>
          </div>
          <OperationButton
            :btnList="handleButtons('trajectory')"
            :nameArr="[]"
            :operateDetail="{
              ...formData,
              id: formData.joinOrderId,
              viewSource: 'customsClearance',
            }"
            @handleBtnClick="handleCustomsBtnClick"
          />
          <!-- <div class="flow-card-title">业务相关信息</div> -->
          <OperateFlowCard
            :formData="formData"
            :nodeFlowList="nodeFlowList"
            @handleFlowClick="handleNodeClick"
          />
        </div>
      </template>
    </OperateSidebarCard>

    <!-- 自定义弹窗 -->
    <ComCustomDialog ref="customDlgRef" />
    <!-- 预约派送 -->
    <CustomsDispatch
      :activities="{
        id: formData.joinOrderId,
        operationOrderNum: formData.operationOrderNo,
      }"
      ref="dispatchRef"
    />
    <!-- 航次离港，到港时间确认弹窗 -->
    <AirlineStatusDialog
      ref="airlineStatusRef"
      @handleSuccess="handleSuccess"
    />
    <!-- 清关申报 -->
    <DeclareCustomsClearance
      ref="customsClearanceRef"
      @handleSuccess="handleSuccess"
    />
    <!-- 业务配置 -->
    <ServiceConfigDialog
      ref="ServiceConfigDialogRef"
      @handleSuccess="handleSuccess"
    />
    <editDialogForm ref="dialogFormRef" @handleSuccess="handleSuccess" />
  </div>
</template>

<script>
import { orderClearanceLogistics } from "@/api/operateManage/common";
import { postCopyJoinBrief } from "@/api/operateRecord/customsClearance";
import { handleCopyText } from "@/utils/confirmBox.js";
import { customsButtons, clearanceButtons } from "./model.js";
import { mixinOperable } from "../mixins/operationBtnList.js";
import { mixinNodeOperable } from "../mixins/nodeOperate.js";
import { mapState } from "vuex";

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
      clearanceButtons,
      nameArr: [
        {
          nameKey: "overseasOperatorName",
          label: `${this.overseaLangObj.hw_operator || "海外操作员"}：`,
        },
        {
          nameKey: "csOperatorName",
          label: `${this.overseaLangObj.cs_operator || "长沙操作员"}：`,
        },
        {
          nameKey: "operatorName",
          label: `${this.overseaLangObj.jj_operator || "交接操作员"}：`,
        },
      ],
      nodeFlowList: [],
      estimatedNode: [],
    };
  },
  computed: {
    ...mapState({
      clearanceStatus: (state) => state.dictionary.dicsData.clearanceStatus,
    }),
  },
  methods: {
    handleButtons(type) {
      const { status, warehouseStatus, orderType, freightType, isMainBill } =
        this.formData;
      const BtnLists = {
        trajectory: customsButtons,
        remark: clearanceButtons,
      }[type];
      return BtnLists({
        status,
        warehouseStatus,
        orderType,
        freightType: isMainBill == 1 ? 0 : freightType,
        isMainBill,
      });
    },
    handleCustomsBtnClick(btn) {
      switch (btn.id) {
        case "copyCustoms":
          const { isOverseaOrders } = this.formData || {};
          postCopyJoinBrief({
            isOverseaOrders,
            businessId: this.formData.joinOrderId,
          }).then((res) => {
            res.data && handleCopyText(res.data);
          });
          break;
        default:
          this.handleBtnClick(btn); // 方法在mixins中
          break;
      }
    },
    handleNodeClick(row) {
      if (row.isAlert) {
        // 时间确认弹窗
        switch (row.nodeId) {
          case 17: // 航次离港
            this.handleAirlineStatus(
              this.formData.airLineId,
              2,
              this.formData.joinOrderId
            );
            break;
          case 23: // 航次到港
            this.handleAirlineStatus(
              this.formData.airLineId,
              3,
              this.formData.joinOrderId
            );
        }
      } else {
        switch (row.nodeId) {
          case 28: // 清关申报
          case 33: // 审核查验
          case 61: // 预计提拆柜
            this.examineCustomsClearance(row, this.formData.joinOrderId);
            break;
          case 62: // 实际提拆柜
            this.onStripping(this.formData.joinOrderId);
            break;
        }
      }
    },
  },
  created() {
    const { joinOrderId } = this.formData;
    this.operateDetail = {
      id: joinOrderId, // 操作单ID-按钮与节点参数值
    };
    orderClearanceLogistics(joinOrderId).then((res) => {
      this.nodeFlowList = res.data || [];
    });
  },
  components: {
    OperateSidebarCard: () => import("../components/operateCard"),
    OperationButton: () =>
      import("_comp/ComOperate/components/operateCard/operationButton.vue"), // 操作按钮
    OperateFlowCard: () =>
      import("_comp/ComOperate/components/operateCard/operationFlow.vue"), // 业务流程节点
    CustomsDispatch: () => import("_comp/ComLogistTrack/components/dispatch"),
    RemarksBarCard: () => import("../components/remarks/CustomsRemark"),
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
</style>
