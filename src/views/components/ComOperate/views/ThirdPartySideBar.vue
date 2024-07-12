<template>
  <!-- 第三方入库详情侧边栏 -->
  <div style="height: 100%">
    <OperateSidebarCard :showBarTabArr="showBarTabArr" class="customs-bar-box">
      <template v-slot:slideCard="{ showTabObj }">
        <div v-if="showTabObj.tabKey === 'remarkBar'">
          <div class="operate-status">
            <!-- && !/inStoragePredic|outStoragePredic/.test(source) -->
            <span>{{ overseaLangObj.zt_status || "状态" }}</span>
            <div style="flex: 1; background-color: #f9f9f9; color: #a5a5a5">
              {{
                getDictObj(dictOrderState, formData.orderState) ||
                formData.orderState
              }}
            </div>
          </div>
          <RemarksBarCard :formData="formData" />
        </div>

        <template v-if="showBarTabArr.some((e) => e.tabKey === 'stateBar')">
          <OperationButton
            :nameArr="[]"
            :btnList="thirdPartyBtn(formData)"
            @handleBtnClick="handleBtnClick"
          />
          <div v-show="showTabObj.tabKey === 'stateBar'">
            <div class="operate-status" v-if="showBarTabArr.length === 1">
              <!-- && !/inStoragePredic|outStoragePredic/.test(source) -->
              <span>{{ overseaLangObj.zt_status || "状态" }}</span>
              <div style="flex: 1; background-color: #f9f9f9; color: #a5a5a5">
                {{
                  getDictObj(dictOrderState, formData.orderState) ||
                  formData.orderState
                }}
              </div>
            </div>
            <template v-if="activities.id">
              <OperateFlowCard
                :formData="formData"
                :nodeFlowList="nodeFlowList"
                :disable="formData.isNodeDisable"
                @handleFlowClick="handleNodeClick"
                v-if="formData.webPageSource === 'warehouseReceiving'"
              />
              <ComLogistTrack
                ref="myLogistTrack"
                :activities="activities"
                :orderType="20"
                isNoDrawer
                v-else
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
            </template>
          </div>
        </template>
      </template>
    </OperateSidebarCard>

    <!-- 自定义弹窗 -->
    <ComCustomDialog ref="customDlgRef" />
  </div>
</template>

<script>
import { getLogisticsByOrder } from "@/api/operateManage/common";
import { mixinOperable } from "../mixins/operationBtnList.js";
import { mixinNodeOperable } from "../mixins/nodeOperate.js";
import { putThirdPartyReceiptOk } from "@/api/warehouse/prediction";
import { mapActions, mapState } from "vuex";
import { msgBox } from "@/utils/confirmBox.js";
import { pollingDownload, comFileDownload } from "@/utils/download.js";
import {
  thirdPartyBtn,
  customPrintDialogCols,
  printSkuDialogCols,
  customPrintSkuDialogCols,
} from "./model";
import {
  getDownShippingMark,
  POSTThirdUploadPrintSku,
  GETThirdDownPrintSku,
  printWarehouseThird,
  getWarehousingPrint,
  getCollectPrint,
  getWarehousingBoxPrint,
} from "@/api/warehouse/basic";

export default {
  mixins: [mixinOperable, mixinNodeOperable],
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    remarkHide: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      thirdPartyBtn,
      nodeFlowList: [],
      activities: {
        title: this.overseaLangObj.logistics_trajectory || "物流轨迹",
      },
      showBarTabArr: [
        {
          isTabShow: false,
          tabKey: "stateBar",
          name: this.overseaLangObj.gj_trajectory() || "轨迹",
        },
        ...(!this.remarkHide
          ? [
              {
                isTabShow: false,
                tabKey: "remarkBar",
                name: this.overseaLangObj.bz_remark() || "备注",
                className: "remarks-bar",
              },
            ]
          : []),
      ],
    };
  },
  computed: {
    ...mapState({
      dictOrderState: (state) => state.dictionary.dicsData.orderState,
    }),
  },
  methods: {
    ...mapActions(["tagsView/delView", "settings/actionRepeatedClick"]),
    handleNodeClick(row) {
      console.log(row);
      const {
        id,
        orderSn,
        targetWarehouseId: warehouseId,
        isBox,
      } = this.formData;
      if (!row.isAlert) {
        switch (row.nodeId) {
          case 64: // 收货
            this["tagsView/delView"](this.$route).then(() => {
              // 返回时关闭当前页面，防止反复保存
              this.$router.replace({
                path: "/warehouseManage/inStorage/receiptPage",
                query: {
                  id,
                  modelType: "wms",
                  backPath: this.$route.fullPath,
                },
              });
            });
            break;
          case 65: // 收货完成
            this.finishStorage(id);
            break;
          case 67: // 上架
            this["tagsView/delView"](this.$route).then(() => {
              // 返回时关闭当前页面，防止反复保存
              this.$router.replace({
                path: "/warehouseManage/putIn/storageShelving",
                query: {
                  params: JSON.stringify({
                    orderSn,
                    warehouseId,
                    activeName: isBox ? "2" : "1",
                  }),
                },
              });
            });
            break;
        }
      }
    },
    finishStorage(id) {
      const title = "提示";
      const className = "el-icon-warning text-warning";
      const msg = "是否收货完成？确认后不可修改收货数据!";
      msgBox(this, { title, className, msg, showCancelButton: true }, () => {
        this.comRepeatedRequest(this, putThirdPartyReceiptOk, { id }).then(
          () => {
            this.msgSuccess("收货完成");
            this.$emit("handleSuccess");
          }
        );
      });
    },
    handleBtnClick(bItem) {
      const { id: oId } = bItem || {};
      switch (oId) {
        case "printMarks":
          this.showPrint();
          break;
        case "printWarehouseList":
          this.warehousingEntryPrint();
          break;
        case "printSku":
          this.handlePrintSku();
          break;
        case "printBoxWarehouseList":
          comFileDownload(this, getWarehousingBoxPrint, this.formData.id);
          break;
        default:
          break;
      }
    },
    showPrint() {
      this.$refs.customDlgRef.showCustomDialog({
        customFormConfig: customPrintDialogCols(),
        formModel: {
          ...this.formData,
          isShowSku: true,
          isSign: 3,
        },
        httpRequest: (params) => {
          const opt = {
            printType: 1, // 第三方
            number: params.orderSn,
            isShowSku: params.isShowSku,
            isSign: params.isSign,
            warehouseCode: params.warehouseCode,
          };
          return pollingDownload(
            this,
            printWarehouseThird,
            opt,
            getDownShippingMark
          );
        },
        successFunction: () => {},
      });
    },
    warehousingEntryPrint() {
      this.$refs.customDlgRef.showCustomDialog({
        customFormConfig: customPrintSkuDialogCols(),
        formModel: {
          isShowSku: 1,
        },
        httpRequest: (params) => {
          this["settings/actionRepeatedClick"](true);
          if (params.isShowSku == 1) {
            return comFileDownload(this, getCollectPrint, this.formData.id);
          } else {
            return comFileDownload(this, getWarehousingPrint, this.formData.id);
          }
        },
        successFunction: () => {
          this["settings/actionRepeatedClick"](false);
        },
        errorFunction: () => {
          this["settings/actionRepeatedClick"](false);
        },
      });
    },
    handlePrintSku() {
      this.$refs.customDlgRef.showCustomDialog({
        customFormConfig: printSkuDialogCols(),
        formModel: {
          ...this.formData,
          isShowSku: true,
          isSign: 3,
        },
        httpRequest: (formModel) => {
          const { id } = formModel;
          const params = {
            id,
          };
          return pollingDownload(
            this,
            POSTThirdUploadPrintSku,
            params,
            GETThirdDownPrintSku
          );
        },
        successFunction: () => {},
      });
    },
  },
  created() {
    const { id, webPageSource } = this.formData;
    this.activities.id = id;
    // if (webPageSource === 'operationReceiving') {
    // 操作单第三方入库详情
    // this.showBarTabArr = [
    //   {
    //     isTabShow: false,
    //     tabKey: "remarkBar",
    //     name: "备注",
    //   },
    // ];
    // }
    // this.operateDetail = {
    // 	id // 操作单ID-按钮与节点参数值
    // }
    if (webPageSource === "warehouseReceiving") {
      getLogisticsByOrder({ id, orderType: 20 }).then((res) => {
        this.nodeFlowList = res.data || [];
      });
    }
  },
  components: {
    OperateSidebarCard: () => import("../components/operateCard"),
    OperationButton: () =>
      import("_comp/ComOperate/components/operateCard/operationButton.vue"), // 操作按钮
    OperateFlowCard: () =>
      import("_comp/ComOperate/components/operateCard/operationFlow.vue"), // 业务流程节点
    // CustomsDispatch: () => import("_comp/ComLogistTrack/components/dispatch"),
    RemarksBarCard: () => import("../components/remarks/ThirdPartyRemark"),
    ComLogistTrack: () => import("_comp/ComLogistTrack"),
  },
};
</script>

<style lang="scss" scoped>
.customs-bar-box {
  /deep/ {
    .com-operate {
      &.com-operate-width {
        width: 325px !important;
      }
    }
  }
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
    margin-top: 24px;
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
  /deep/ .track {
    margin: 15px 0;
    .track-title {
      font-size: 15px;
      font-weight: bold;
      color: #515151;
    }
  }
}
</style>
