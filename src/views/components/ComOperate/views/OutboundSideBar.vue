<template>
  <!-- 海外出库详情侧边栏 -->
  <div style="height: 100%">
    <OperateSidebarCard :showBarTabArr="showBarTabArr" class="customs-bar-box">
      <template v-slot:slideCard="{ showTabObj }">
        <div v-if="showTabObj.tabKey === 'remarkBar'">
          <div class="operate-status">
            <!-- && !/inStoragePredic|outStoragePredic/.test(source) -->
            <span>{{ overseaLangObj.zt_status || "状态" }}</span>
            <div style="flex: 1; background-color: #f9f9f9; color: #a5a5a5">
              {{
                getDictObj(dictOutStorageStatus, formData.status) ||
                formData.status
              }}
            </div>
          </div>
          <RemarksBarCard viewSource="wholeSale" :formData="formData" />
        </div>

        <template v-if="showBarTabArr.some((e) => e.tabKey === 'stateBar')">
          <div v-show="showTabObj.tabKey === 'stateBar'">
            <div class="operate-status" v-if="showBarTabArr.length === 1">
              <!-- && !/inStoragePredic|outStoragePredic/.test(source) -->
              <span>{{ overseaLangObj.zt_status || "状态" }}</span>
              <div style="flex: 1; background-color: #f9f9f9; color: #a5a5a5">
                {{
                  getDictObj(dictOutStorageStatus, formData.status) ||
                  formData.status
                }}
              </div>
            </div>
            <template v-if="activities.id">
              <template
                v-if="formData.webPageSource === 'webWarehouseOutbound'"
              >
                <div class="operate-btn" v-if="formData.pickId">
                  <div class="title">
                    {{ overseaLangObj.nky_cz || "您可以操作" }}
                  </div>
                  <PreviewOrDownload
                    btnTxt="打印拣货单"
                    :btnConf="{
                      btnType: 'primary',
                      plain: true,
                    }"
                    :previewDownloadConf="previewDownloadConfig(formData)"
                    @handleSuccess="handlePickingComp"
                  />
                </div>
                <OperateFlowCard
                  :formData="formData"
                  :nodeFlowList="nodeFlowList"
                  @handleFlowClick="handleNodeClick"
                />
              </template>

              <ComLogistTrack
                ref="myLogistTrack"
                :activities="activities"
                :orderType="viewSource === 'wholeSale' ? 35 : 30"
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
    <ComCustomDialog ref="customDialogRef" />
    <EditTruckRecordDlg ref="editTruckRecordRef" />
  </div>
</template>

<script>
import { getLogisticsByOrder } from "@/api/operateManage/common";
import { mixinOperable } from "../mixins/operationBtnList.js";
import { mixinNodeOperable } from "../mixins/nodeOperate.js";
import { putThirdPartyReceiptOk } from "@/api/warehouse/prediction";
import { uploadPickingBill } from "@/api/common.js";
import { pickingPut } from "@/api/warehouse/manage";
import { mapActions, mapState } from "vuex";
import { simpleTimeCols } from "_comp/ConfirmDialog/customFormDialog/model.js";
import {
  putTruckRegistration,
  getTruckCheckOrderState,
  postTruckCheck,
} from "@/api/warehouse/process";

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
    viewSource: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
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
      btnList: [
        {
          span: 24,
          text: "打印拣货单",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      dictOutStorageStatus: (state) =>
        state.dictionary.dicsData.outStorageStatus,
    }),
  },
  methods: {
    ...mapActions(["tagsView/delView"]),
    handleNodeClick(row) {
      console.log(row);
      switch (row.nodeId) {
        case 64: // 拣货下架
          this.updatePicking(3);
          break;
        case 65: // 拣货完成
          this.handlePickingComp("completed");
          break;
        case 67: // 派车登记
          this.handleRegistration(this.formData);
          break;
        case 70: // 上传POD
          this.handleUpload();
          break;
      }
    },
    updatePicking(pStatus) {
      const { pickId: id, orderType } = this.formData;
      pickingPut({
        id,
        orderType,
        pickingStatus: pStatus, // 1-待拣货，2-拣货中，3-已拣货
      }).then(() => {
        this.msgSuccess(this.overseaLangObj.cz_cg || "更新成功");
        this.$emit("handleSuccess");
      });
    },
    async handleRegistration(row) {
      await getTruckCheckOrderState({
        type: 1,
        idList: [row.deliveryChannelId],
      });
      await postTruckCheck({
        truckId: row.deliveryChannelId,
        pcCheck: true,
      });
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: simpleTimeCols({
          title: "出发登记",
          label: "实际出发时间：",
          isRemark: true,
        }),
        formModel: {},
        httpRequest: (param) => {
          return putTruckRegistration({
            id: row.deliveryChannelId,
            actualTime: param.time,
            remark: param.remark,
          });
        },
        successFunction: () => {
          this.$emit("handleSuccess");
        },
      });
    },
    handleUpload(mode_type = 0) {
      const {
        code,
        deliveryChannelId: distributionInfoId,
        attachList,
      } = this.formData;
      const opt = {
        code,
        type: "1", // 1-整箱POD 2-订单POD
        distributionInfoId,
        attachList,
      };
      this.$refs.editTruckRecordRef.editShow(opt, {
        mode_type,
        editSuccess: () => {
          this.$emit("handleSuccess");
        },
      });
    },
    previewDownloadConfig(row) {
      const {
        pickId,
        orderType,
        pickingNumber,
        pickingUserName: userName,
      } = row;
      return {
        previewParam: {
          id: pickId,
          orderType,
          pickingNumber,
          userName,
        },
        previewHttp: uploadPickingBill,
      };
    },
    handlePickingComp(type) {
      const { pickingStatus, pickId: id, orderType } = this.formData;
      const params = {
        id,
        orderType,
        pickingStatus:
          pickingStatus == 1 ? 2 : pickingStatus == 3 ? 4 : undefined,
      };
      if ((type == "download" && pickingStatus == 1) || type == "completed") {
        return pickingPut(params).then((e) => {
          this.$emit("handleSuccess");
        });
      }
    },
  },
  created() {
    const { id, webPageSource } = this.formData;
    this.activities.id = id;
    if (webPageSource === "webWarehouseOutbound") {
      // 海外仓出库详情 orderType: FBA出库=30 一件代发=35
      getLogisticsByOrder({
        id,
        orderType: this.viewSource === "wholeSale" ? 35 : 30,
      }).then((res) => {
        this.nodeFlowList = res.data || [];
      });
    }
  },
  components: {
    OperateSidebarCard: () => import("../components/operateCard"),
    // OperationButton: () =>
    //   import("_comp/ComOperate/components/operateCard/operationButton.vue"), // 操作按钮
    OperateFlowCard: () =>
      import("_comp/ComOperate/components/operateCard/operationFlow.vue"), // 业务流程节点
    // CustomsDispatch: () => import("_comp/ComLogistTrack/components/dispatch"),
    RemarksBarCard: () => import("../components/remarks/FbaRemarkCard"),
    ComLogistTrack: () => import("_comp/ComLogistTrack"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
    EditTruckRecordDlg: () =>
      import(
        "@/views/warehouseManage/warehouseManage/outboundRecords/truckRecord/editDlg"
      ),
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
  /deep/ .track {
    margin: 15px 0;
    .track-title {
      font-size: 15px;
      font-weight: bold;
      color: #515151;
    }
  }
  .operate-btn {
    border-bottom: 1px solid #e2e2e2;
    .title {
      font-size: 14px;
      font-weight: 700;
      margin: 25px 0 10px;
      color: #515151;
    }
    /deep/ .el-button {
      width: 100%;
      margin-bottom: 10px;
      color: #515151;
      border-color: transparent;
      box-shadow: 0px 0px 3px 0px rgba(203, 203, 203, 0.7);
      border-radius: 4px;
      &:hover {
        color: #5094ff;
        border-color: #5094ff;
        background: transparent;
      }
    }
  }
}
</style>
