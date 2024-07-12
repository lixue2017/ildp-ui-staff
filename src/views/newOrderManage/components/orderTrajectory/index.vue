<template>
  <!-- 此组件目前仅电商/传统/其他订单详情侧边栏引用 -->
  <div style="height: 100%">
    <OperateSidebarCard :showBarTabArr="showBarTabArr">
      <template v-slot:slideCard>
        <template>
          <div class="operate-status">
            <span>{{ overseaLangObj.zt_status || "状态" }}</span>
            <div style="flex: 1; background-color: #f9f9f9; color: #a5a5a5">
              {{
                getDictObj(dictOrderState, formData.status) || formData.status
              }}
            </div>
          </div>

          <div class="operate-btn">
            <!-- <div class="title">您可以操作</div>
          <el-button size="small" @click="handleMaintain()" plain
            >维护货物</el-button
          > -->
            <OperationButton
              :btnList="getOperableBtnArr(formData)"
              :operateDetail="formData"
              :nameArr="[]"
              @handleBtnClick="handleBtnClick"
              v-if="getOperableBtnArr(formData).length"
            >
              <template v-slot:printWarehouseList="{ btnItem }">
                <div class="preview-btn">
                  <PreviewOrDownload
                    :btnTxt="btnItem.text"
                    :btnConf="{ btnType: 'primary', plain: true }"
                    :previewDownloadConf="getPreviewConfig()"
                  />
                </div>
              </template>
            </OperationButton>
            <div class="operate-data">
              <div class="operate-data-item">
                <span class="label">业务员：</span>
                <span class="value">{{ formData.salesmanName || "--" }}</span>
              </div>
              <div class="operate-data-item">
                <span class="label">业务归属：</span>
                <span class="value">{{
                  formData.operateMainName || "--"
                }}</span>
              </div>
            </div>
            <MaintainGoods
              ref="MaintainGoods"
              :type="2"
              @handleChange="handleMaintainGoods"
            />
          </div>
        </template>
        <div class="trajectory-tit">物流轨迹</div>
        <TrajectoryTimeline
          class="trajectory-line"
          :timeList="trajectoryList"
        />
      </template>
    </OperateSidebarCard>
    <!-- 更改内容 -->
    <ChangeOperateContent ref="contentRef" />
    <!-- 收发通人员更换 -->
    <ChangeOperateContacts ref="contactRef" />
    <!-- 打印唛头 -->
    <ComPrint
      ref="comPrintRef"
      :formData="{
        ...formData,
        webPrintSource: 'order_bar_print', // 订单打印不做限制
      }"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getLogisticsTypeList } from "@/api/trandition/oceanModel";
import { btnList } from "./model.js";
import {
  putOperationContactsStaff,
  putOperationContentStaff,
  getPrintWarehousingPreview,
} from "@/api/operateManage/common.js";
import { duplicateRemoval } from "@/utils/index";
import { getFreightList } from "@/api/order/firstTransport.js";
import qs from "qs";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    OperateSidebarCard: () => import("_comp/ComOperate/components/operateCard"),
    TrajectoryTimeline: () => import("_comp/ComLogistTrack/timeline.vue"),
    // OrderRightTrajectory: () => import("@/views/newOrderManage/components/orderTrajectory/index.vue"),
    OperationButton: () =>
      import("_comp/ComOperate/components/operateCard/operationButton.vue"), // 操作按钮
    MaintainGoods: () => import("_comp/ECMaintainGoods"), // 维护货物
    ChangeOperateContacts: () =>
      import(
        "@/views/components/ComOperate/components/contentChange/contacts.vue"
      ),
    ChangeOperateContent: () =>
      import(
        "@/views/components/ComOperate/components/contentChange/content.vue"
      ),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    ComPrint: () => import("_comp/ComOperate/components/ComPrint"),
  },
  data() {
    return {
      showBarTabArr: [
        {
          isTabShow: false,
          tabKey: "OrderTrackBar",
          name: "订单轨迹",
        },
      ],
      trajectoryList: [],
    };
  },
  computed: {
    ...mapState({
      dictOrderState: (state) => state.dictionary.dicsData.orderStatus,
    }),
  },
  methods: {
    // 订单管理详情物流轨迹
    logisticsTrajectory() {
      const { id, orderType } = this.formData;
      getLogisticsTypeList(id, orderType).then((res) => {
        this.trajectoryList = res.rows || [];
      });
    },
    handleMaintain() {
      const { id } = this.formData;
      this.$refs.MaintainGoods.show(this.formData);
    },
    handleMaintainGoods() {
      this.$emit("handleMaintainGoods");
    },
    getOperableBtnArr(row) {
      return btnList(row);
    },
    showPrint() {
      this.$refs.comPrintRef.show({
        type: 2,
      });
    },
    handleDispatchVehicles() {
      this.$router.push({
        path: "/newOrderManage/dispatchVehicles",
        query: {
          orderId: this.formData.id,
        },
      });
    },
    handleBtnClick(row) {
      const { id } = row;
      const { operationOrderId, orderType, id: orderId } = this.formData;
      switch (id) {
        case "maintainGoods": //维护货物
          this.handleMaintain();
          break;
        case "dispatchVehicles": // 约车
          this.handleDispatchVehicles();
          break;
        case "sofaTownChange": //收发通更换
          this.$refs.contactRef?.show(operationOrderId, {
            orderType,
            isStaff: 1,
            httpRequest: putOperationContactsStaff,
            successFunction: this.handleSuccess,
          });
          break;
        case "contentChange": //内容更换
          this.$refs.contentRef?.show(operationOrderId, {
            isStaff: 1,
            httpRequest: putOperationContentStaff,
            successFunction: this.handleSuccess,
          });
          break;
        case "printMarks":
          this.showPrint();
          break;
        case "quickOrdering":
          this.$router.push({
            path: "/newOrderManage/eCPerfectOrder",
            query: {
              id: orderId,
              backPath: this.$route.path,
              data: encodeURI(qs.stringify(this.$route.query)),
            },
          });
          break;
        default:
          break;
      }
    },
    handleSuccess() {
      this.$emit("handleSuccess");
    },

    getPreviewConfig() {
      const {
        number: inWarehouseNum,
        id,
        customerName: customer,
        customerId,
        putWarehouseTime: inWarehouseTime,
        cusConsignee,
        warehouseId,
        remark,
        customerNo,
        country,
      } = this.formData;
      return {
        previewParam: {
          inWarehouseNum,
          id,
          customer,
          customerId,
          inWarehouseTime,
          appointmentTime: inWarehouseTime,
          aimCountry: country || cusConsignee?.countryName || "",
          warehouseId,
          remark,
          customerNo,
        },
        previewHttp: getPrintWarehousingPreview,
        asyncRequestParams: async () => {
          const { totalBoxCount, totalVolume, totalWeight, rows } =
            await getFreightList({
              orderEcId: id,
              pageNum: 1,
              pageSize: 99991,
            });
          let productAllIds = [];
          (rows || []).forEach((ele) => {
            productAllIds.push(...(ele.cusProducts || []).map((e) => e.id));
          });
          return {
            sum: totalBoxCount,
            cbm: totalVolume,
            weight: totalWeight,
            productIds: duplicateRemoval(productAllIds),
          };
        },
      };
    },
  },
  created() {
    console.log("formData", this.formData);
    this.logisticsTrajectory();
  },
};
</script>

<style lang="scss" scoped>
.status-bar-box {
  .trajectory-tit {
    font-size: 15px;
    font-weight: bold;
    color: #515151;
    margin: 15px 0;
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
  .preview-btn {
    /deep/ .el-button {
      width: 100%;
      margin-bottom: 10px;
      color: #515151;
      border-color: transparent;
      box-shadow: 0px 0px 3px 0px rgba(203, 203, 203, 0.7);
      border-radius: 4px;
      &:hover {
        background: #fff;
        color: #5094ff;
        border-color: #5094ff;
      }
    }
  }

  .operate-data {
    padding: 10px 0 30px;
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
</style>
