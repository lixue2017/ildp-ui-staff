<template>
  <!-- 清关管理，海外派送计划-海外提派，海外入仓详情引用，pageType均为1 -->
  <div class="trajectory-outer">
    <OperateSidebarCard
      ref="sidebarCardRef"
      class="trajectory"
      :showBarTabArr="showBarTabArr"
    >
      <template v-slot:slideCard="{ showTabObj }">
        <div v-show="showTabObj.tabKey === 'OrderTrackBar'">
          <OperationButton
            :btnList="getShowBtn(1)"
            :nameArr="[]"
            :operateDetail="{
              ...formData,
            }"
            @handleBtnClick="handleBtnClick"
            v-if="[1].includes(pageType)"
          />
          <OperateFlowCard
            :formData="formData"
            :nodeFlowList="nodeFlowList"
            @handleFlowClick="handleNodeClick"
          />
        </div>
        <div v-show="showTabObj.tabKey === 'remarkBar'">
          <div class="operate-status">
            <span>{{ overseaLangObj.zt_status || "状态" }}</span>
            <div style="flex: 1; background-color: #f9f9f9; color: #a5a5a5">
              {{
                getDictObj(
                  dictionaryData[pageBasic[pageType]],
                  handleStatus()
                ) || handleStatus()
              }}
            </div>
          </div>
          <OperationButton
            :btnList="getShowBtn(2)"
            :nameArr="nameArr"
            :operateDetail="{
              ...formData,
            }"
            @handleBtnClick="handleBtnClick"
            v-if="[1].includes(pageType)"
          />
          <!-- <div class="operate-data" v-else>
            <div
              v-for="(item, index) in nameArr"
              :key="index"
              class="data-index"
            >
              <span class="operate-data-label">{{ item.label }}</span>
              <span class="operate-data-value">{{
                formData[item.nameKey]
              }}</span>
            </div>
          </div> -->
          <RemarkCard :formData="formData" :pageType="pageType" />
        </div>
      </template>
    </OperateSidebarCard>
    <!-- 更新下单信息 -->
    <PlaceOrderDialog
      ref="placeOrderRef"
      :tabType="pageType"
      :title="pageText[pageType]"
      @handleSuccess="handleSuccess"
    />
    <!-- 预计离港、预计到港 -->
    <ComCustomDialog ref="customDlgRef" />
    <!-- 预计派送、实际派送 -->
    <CustomsDispatch
      :activities="{
        id: formData.id,
        operationOrderNum: formData.nlCode,
        orderType: formData.settlementBusinessType,
        jobNo: formData.jobNo,
        pageType: pageType,
      }"
      ref="dispatchRef"
    />
    <!-- 清关登记 -->
    <RegistrationDialog ref="registrationRef" @handleSuccess="handleSuccess" />
    <!-- 航次离港，到港时间确认弹窗 -->
    <AirlineStatusDialog
      ref="airlineStatusRef"
      @handleSuccess="handleSuccess"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mixinOperable } from "_comp/ComOperate/mixins/operationBtnList.js";
import {
  updateExpectPortTime,
  addExamine,
  clearanceRelease,
  postCopyJoinBrief,
} from "@/api/operateRecord/customsClearance";
import { handleCopyText } from "@/utils/confirmBox.js";
import { formDlgCols, examineFormConfig, barTabObj } from "./model";
import { getLogisticsByOrder } from "@/api/operateManage/common";
import { releaseFormConfig } from "../model";
export default {
  mixins: [mixinOperable],
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    pageType: {
      type: Number,
      default: 1,
    },
  },
  components: {
    OperateSidebarCard: () => import("_comp/ComOperate/components/operateCard"),
    OperationButton: () =>
      import("_comp/ComOperate/components/operateCard/operationButton.vue"), // 操作按钮
    PlaceOrderDialog: () =>
      import("@/views/overseasBusiness/components/PlaceOrderDialog"),
    CustomsDispatch: () => import("_comp/ComLogistTrack/components/dispatch"),
    RegistrationDialog: () =>
      import("@/views/overseasBusiness/components/RegistrationDialog"),
    RemarkCard: () => import("./remark.vue"),
    OperateFlowCard: () =>
      import("_comp/ComOperate/components/operateCard/operationFlow.vue"), // 业务流程节点
    AirlineStatusDialog: () =>
      import(
        "@/views/marketManage/airlineFlight/components/AirlineStatusDialog"
      ), // 航次到港离港时间确认弹窗
  },
  data() {
    const pageText = {
      1: "清关信息",
      2: "派送信息",
      3: "入仓信息",
    };
    const showBarTabArr = barTabObj[this.pageType]; //右侧操作栏定义
    return {
      showBarTabArr,
      nameArr: [
        {
          nameKey: "salesmanName",
          label: "业务员：",
        },
        {
          nameKey: "overseasOperatorName",
          label: "海外操作员：",
        },
      ],
      trajectoryList: [],
      pageText,

      pageBasic: {
        1: "clearanceStatus",
        // 2: "orderState",
        2: "clearanceDeliveryStatus",
        3: "inWarehouseStatus",
      },
      customsButtons: [
        {
          // statusArr: [0],
          id: "registration",
          span: 24,
          text: "清关登记",
          showType: [1],
          type: [2],
        },
        {
          id: "customsInfo",
          span: 24,
          text: pageText[this.pageType],
          showType: [2, 3],
          type: [2],
        },
        {
          id: "copyCustoms",
          span: 24,
          text: "复制清关信息",
          showType: [1],
          type: [1],
        },
        {
          id: "ETD",
          span: 12,
          text: "预计离港",
          showType: [1],
          type: [1],
        },
        {
          id: "ETA",
          span: 12,
          text: "预计到港",
          showType: [1],
          type: [1],
        },
        {
          id: "customsExamineInfo",
          span: 24,
          text: "清关查验",
          showType: [1],
          type: [2],
        },
        {
          id: "customsEstimate",
          span: 12,
          text: "预约派送",
          showType: [1],
          btnType: "estimate",
          showBusinessType: true,
        },
        {
          id: "customsActual",
          span: 12,
          text: "实际派送",
          showType: [1],
          btnType: "actual",
          showBusinessType: true,
        },
      ],
      nodeFlowList: [],
    };
  },
  computed: {
    ...mapState({
      dictionaryData: (state) => state.dictionary.dicsData,
    }),
  },
  created() {
    const { id } = this.formData;
    getLogisticsByOrder({ id, orderType: 50 }).then((res) => {
      this.nodeFlowList = res.data || [];
    });
  },
  methods: {
    updQuotationUser() {
      this.$emit("updQuotationUser");
    },
    handleStatus() {
      const {
        deliveryClearanceOrderDeatail,
        directClearanceOrderDetail,
        warehouseOrderDetailVo,
      } = this.formData;
      return {
        1: directClearanceOrderDetail?.status,
        2: deliveryClearanceOrderDeatail?.devlieryStatus,
        3: warehouseOrderDetailVo?.warehouseStatus,
      }[this.pageType];
    },
    getShowBtn(type) {
      const { overseaBusinessTypes = [] } = this.formData;
      const arr = this.customsButtons.filter((e) => {
        const { showType, showBusinessType, statusArr } = e;
        return (
          (e.type ? e.type.includes(type) : true) &&
          (showType ? showType.includes(this.pageType) : true) &&
          (showBusinessType
            ? overseaBusinessTypes.includes(1) &&
              overseaBusinessTypes.includes(2)
            : true) &&
          (!statusArr || (statusArr && statusArr.includes(this.handleStatus())))
        );
      });
      return arr;
    },
    handleBtnClick(row) {
      console.log(row);
      this.$emit("handleBtnClick", row);
      switch (row.id) {
        case "registration": // 清关登记
          this.$refs.registrationRef?.show(this.formData);
          break;
        case "customsInfo":
          this.$refs.placeOrderRef?.show({
            ...this.formData,
            types: this.formData.overseaBusinessTypes,
          });
          break;
        case "ETA":
        case "ETD":
          // console.log('nodeConfig=', '预计到港')
          this.$refs.customDlgRef?.showCustomDialog({
            httpRequest: ({ expectPortTime }) => {
              return updateExpectPortTime({
                expectPortTime,
                type: row.id === "ETA" ? 2 : 1, // 离港-1；到港-2
                id: this.formData.id,
              });
            },
            successFunction: this.handleSuccess,
            customFormConfig: formDlgCols({ modelType: row.id }),
          });
          break;
        case "customsEstimate": // 预约、实际派送
        case "customsActual":
          this.$refs.dispatchRef?.dispatchDialog(row.btnType, {
            successFunction: this.handleSuccess,
          });
          break;
        case "customsExamineInfo":
          this.$refs.customDlgRef?.showCustomDialog({
            httpRequest: (formData) => {
              const { examineNo = this.formData.nlCode, ...params } = formData;
              return addExamine({
                ...params,
                clearanceId: this.formData.id,
                examineNo,
              });
            },
            successFunction: this.handleSuccess,
            customFormConfig: examineFormConfig(),
          });
          break;
        case "copyCustoms":
          postCopyJoinBrief({
            isOverseaOrders: 1, // 海外
            businessId: this.formData.id,
          }).then((res) => {
            res.data && handleCopyText(res.data);
          });
          break;
        default:
          break;
      }
    },
    handleSuccess() {
      this.$emit("handleChange");
    },
    handleNodeClick(row) {
      // console.log(row, this.formData);
      const { id } = this.formData;
      if (!row.isAlert) {
        switch (row.nodeId) {
          case 28: // 清关登记
            this.$refs.registrationRef?.show(this.formData);
            break;
          case 33: // 清关放行
            this.$refs.customDlgRef?.showCustomDialog({
              httpRequest: (formData) => {
                return clearanceRelease({
                  ...formData,
                  id,
                });
              },
              successFunction: this.handleSuccess,
              customFormConfig: releaseFormConfig,
            });
            break;
          default:
            break;
        }
      } else {
        // 时间确认弹窗
        switch (row.nodeId) {
          case 23: // 到港
            this.$refs.airlineStatusRef?.show(undefined, 3, {
              operationOrderId: this.formData.id,
              orderType: 50, // 海外清关没有订舱ID
            });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.trajectory-outer {
  height: 100%;
}
.operate-data {
  padding: 10px 0 30px;
  .data-index {
    margin-bottom: 10px;
  }
  .operate-data-label {
    color: #8b8b8b;
    font-size: 13px;
  }
  .operate-data-value {
    color: #515151;
    font-size: 13px;
  }
}
.trajectory {
  &.status-bar-box {
    /deep/ {
      .com-operate {
        margin-left: 0;
        &.com-operate-width {
          padding: 0 20px 20px;
        }
      }
    }
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
.title {
  font-size: 14px;
  font-weight: bold;
  margin: 25px 0 10px;
  color: #515151;
}

.operate-btn {
  border-bottom: 1px solid #e2e2e2;
  .title {
    font-size: 14px;
    font-weight: 700;
    margin: 25px 0 10px;
    color: #515151;
  }
  .el-button {
    width: 100%;
    margin-bottom: 10px;
    color: #515151;
    border-color: transparent;
    box-shadow: 0px 0px 3px 0px rgba(203, 203, 203, 0.7);
    border-radius: 4px;
    &:hover {
      color: #5094ff;
      border-color: #5094ff;
    }
  }

  .operate-data {
    padding: 7px 0 18px;
    line-height: 23px;
    .operate-data-item:not(:last-child) {
      margin-bottom: 5px;
    }
    .label {
      color: #8b8b8b;
    }
    .label-item {
      color: #515151;
    }
  }
}

.line-trajectory {
  padding: 30px 0;
  /deep/ {
    .el-timeline-item__node--normal {
      width: 8px;
      height: 8px;
    }
    .el-timeline-item__tail {
      left: 3px;
      border-left: 1px dashed #bcbcbc;
    }
    .el-timeline-item__wrapper {
      padding-left: 21px;
      top: -4px;
    }
  }
  .node {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .name {
      white-space: nowrap;
      font-weight: bold;
    }
    .time {
      white-space: nowrap;
      color: #8b8b8b;
    }
  }
  .remark {
    padding-top: 8px;
    line-height: 18px;
    color: #ff6767;
  }
}
</style>
