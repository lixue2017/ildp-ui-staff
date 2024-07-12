<template>
  <div class="details">
    <div class="content-box">
      <ComDetailTop
        :title="/* 入库核实 */ `电商头程运输(${initInfo.customerShortName})`"
        ref="detailTopRef"
        :formModel="initInfo"
        @handleClick="handleTopClick"
      />
      <div class="content" v-if="isInitRes">
        <div class="detail-card">
          <div
            :style="`background-color: ${card.bgColor};flex:${card.flex}`"
            v-for="(card, index) in cardConfig"
            :key="index"
          >
            <div
              :class="`iconfont ${card.icon}`"
              :style="`color: ${card.valueColor}`"
            ></div>
            <div v-if="card.type !== 'slot'">
              <div class="label" :style="`color: ${card.labelColor}`">
                {{ card.label }}
              </div>

              <div v-if="card.prop == 'operationOrderNum'">
                <div
                  class="value primary-text-btn"
                  @click="handleViewOperation"
                  :style="`color: ${card.valueColor}`"
                >
                  {{ initInfo[card.prop] || "--" }}
                </div>
              </div>
              <div v-else class="value" :style="`color: ${card.valueColor}`">
                {{ initInfo[card.prop] || "--" }}
              </div>
            </div>
            <div class="card-addr" v-else>
              <template v-if="card.prop === 'addr'">
                <div class="label" :style="`color: ${card.labelColor}`">
                  {{ initInfo.headTransportModeName }}-{{
                    initInfo.outWarehouseWayName
                  }}
                </div>
                <div class="value" :style="`color: ${card.valueColor}`">
                  <span>{{
                    initInfo.startPortName ? initInfo.startPortName : "暂无"
                  }}</span>
                  <span>--</span>
                  <span>{{
                    initInfo.endPortName ? initInfo.endPortName : "暂无"
                  }}</span>
                </div>
              </template>
              <template v-if="card.prop === 'transportType'">
                <div class="label" :style="`color: ${card.labelColor}`">
                  运输方式
                </div>
                <div class="value" :style="`color: ${card.valueColor}`">
                  {{ initInfo.headTransportModeName }}-{{
                    initInfo.outWarehouseWayName
                  }}
                </div>
              </template>
            </div>
          </div>
        </div>
        <EcTableInfo
          ref="tableRef"
          :formModel="{ ...initInfo, operationOrderId: initInfo.id }"
          :disabled="true"
          :showTable="showTable"
          @onForecastGoodsList="handleForecastGoodsList"
        />
      </div>
    </div>
    <div class="order-footer">
      <PreviewOrDownload
        btnTxt="打印入库单"
        :btnConf="{
          btnType: 'primary',
        }"
        class="ft-btn-preview"
        :previewDownloadConf="getPreviewConfig()"
      />
      <el-button type="primary" @click="showPrint"> 打印唛头 </el-button>
      <template v-if="initInfo.warehousingStatus < 2">
        <el-button type="primary" @click="handleUpdate"> 收货核实 </el-button>
      </template>
      <el-button @click="reBack()"> 关 闭 </el-button>
    </div>
    <WarehousingDialog
      ref="warehousingDialog"
      @handleSuccess="handleSuccess"
      :againVerify="againVerify"
    />
    <!-- 打印唛头 -->
    <ComPrint
      ref="comPrintRef"
      :formData="initInfo"
      source="inStorage"
      v-if="initInfo.id"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { goodsTableColumns, cardConfig } from "./model";
import {
  getTakeOrders,
  getOperationDetailExtend,
  getPrintWarehousingPreview,
} from "@/api/operateManage/common";
import { duplicateRemoval } from "@/utils/index";
import {
  getFreightList,
  getEcFreightList,
} from "@/api/order/firstTransport.js";
export default {
  components: {
    ComUpload: () => import("_comp/ComUpload"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    WarehousingDialog: () =>
      import("_comp/ComOperate/components/WarehousingDialog"), // 入仓（散货）核实
    // EcTableInfo: () => import("./components/EcTableInfo"),
    EcTableInfo: () => import("@/views/operateManage/components/EcTableInfo"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    ComPrint: () => import("_comp/ComOperate/components/ComPrint"), // 打印唛头
  },
  // computed: {
  //   ...mapState(["dictionary"]),
  // },
  data() {
    return {
      initInfo: {},
      cardConfig,
      goodsTable: {
        httpRequest: this.getGoodsList,
        columnConfig: goodsTableColumns.columns,
        grossTotal: goodsTableColumns.grossTotal,
      },
      grossTotal: {},
      isInitRes: false,
      againVerify: false,
      showTable: [1, 2],
      forecastPreviewObj: {},
    };
  },
  created() {
    this["dictionary/getDictionary"]("predictionManage");
    const { id } = this.$route.query;
    if (!id) {
      this.reBack();
      return;
    }
    this.getDetails(id);
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getQueryParams() {
      return {
        orderEcId: this.initInfo.orderId,
      };
    },
    getGoodsList(params) {
      return new Promise((resolve) => {
        getFreightList({
          ...params,
          pageSize: 999,
        }).then((res) => {
          this.grossTotal = res;
          return resolve(res);
        });
      });
    },
    getDetails(id) {
      this.isInitRes = false;
      getTakeOrders(id).then((res) => {
        this.initInfo = res.data;
        if (res.data.isMainBill === 5) {
          this.showTable = [1];
        }
        this.isInitRes = true;
      });
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetails(id);
      }
    },
    getRepeatNum(list) {
      return list.reduce((prev, next) => {
        prev[next] = prev[next] + 1 || 1;
        return prev;
      }, {});
    },
    getResult() {
      if (this.grossTotal.code === 200) {
        this.goodsTable.grossTotal.map((item) => {
          let totalTop = 0;
          let totalBtm = 0;
          let total = 0;
          this.grossTotal.rows.map((result) => {
            if (item.compute) {
              totalTop +=
                result[item.factor[0].propTop] * result[item.factor[1].propTop];
              totalBtm +=
                result[item.factor[0].propBtm] * result[item.factor[1].propBtm];
              total +=
                result[item.factor[0].prop] * result[item.factor[1].prop];
            } else {
              totalTop += result[item.propTop];
              totalBtm += result[item.propBtm];
              total += result[item.prop];
            }
          });
          this.$set(item, "totalTop", totalTop);
          this.$set(item, "totalBtm", totalBtm);
          this.$set(item, "total", total);
          let count = 0;
          const propList = this.grossTotal.rows.map((eles) => eles[item.prop]);
          if (propList.length) {
            const propObj = this.getRepeatNum(propList);
            count = Object.keys(propObj).length;
          }
          this.$set(item, "count", `${count}${item.util}`);
        });
      }
    },
    // 打印唛头
    showPrint() {
      this.$refs.comPrintRef.show({
        type: 2,
      });
    },
    async handleUpdate() {
      const {
        customerName: bailorPeople,
        id: operationOrderId,
        operationOrderNum,
        createTime,
        orderId,
        warehousingStatus,
        headTransportModeName,
        outWarehouseWayName,
        isMainBill,
      } = this.initInfo;
      if (warehousingStatus > 0) {
        this.againVerify = true;
      } else {
        this.againVerify = false;
      }
      let res = {};
      if (warehousingStatus === 1) {
        res = await getEcFreightList({
          operationOrderId,
          isVerified: 1,
          isCheckGoods: 1,
        });
      } else {
        res = await getFreightList({
          orderEcId: orderId,
        });
      }
      const params = {
        operationId: operationOrderId,
        orderId,
        orderType: 2,
        freightType: 1,
        operationOrderNum,
        bailorPeople,
        createTime,
        headTransportModeName,
        outWarehouseWayName,
        isMainBill,
        lists: res,
      };
      this.$refs.warehousingDialog.show(params, "inStorage", true);
    },
    handleForecastGoodsList(res) {
      let productAllIds = [];
      (res.rows || []).forEach((ele) => {
        productAllIds.push(...(ele.cusProducts || []).map((e) => e.id));
      });
      this.forecastPreviewObj = {
        sum: res.totalBoxCount,
        cbm: res.totalVolume,
        weight: res.totalWeight,
        productIds: duplicateRemoval(productAllIds),
      };
    },
    getPreviewConfig() {
      const {
        operationOrderNum: inWarehouseNum,
        orderId,
        customerName: customer,
        customerId,
        putWarehouseTime: inWarehouseTime,
        cusConsignee,
        warehouseId,
        remark,
        customerNo,
        countryName,
      } = this.initInfo;
      return {
        previewParam: {
          inWarehouseNum,
          id: orderId,
          customer,
          customerId,
          inWarehouseTime,
          appointmentTime: inWarehouseTime,
          aimCountry: countryName || cusConsignee?.countryName,
          warehouseId,
          remark,
          customerNo,
          ...this.forecastPreviewObj,
        },
        previewHttp: getPrintWarehousingPreview,
      };
    },
    handleViewOperation() {
      const { id, operationOrderType, isMainBill } = this.initInfo; //operationOrderType 0-海运 1-空运
      const route = {
        0: "/operateManage/seaTransDetails",
        1: "/operateManage/airTransDetails",
      };
      let extend = "";
      if (isMainBill === 5) {
        extend = "/extend";
      }
      this.$router.push({
        path: `${route[operationOrderType]}${extend}`,
        query: {
          id: id, // 操作单ID
          backPath: this.$route.fullPath,
        },
      });
    },
    handleSuccess() {
      this.getDetails(this.$route.query.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.details {
  background: #f9f9f9;
  padding: 11px 0 20px;
  /deep/ {
    .goods-table {
      .el-table td {
        vertical-align: top;
      }
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .border-top-solid::before {
      margin-top: 15px;
    }
    .goods-info {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      .title {
        font-size: 14px;
        color: #515151;
        font-weight: bold;
      }
    }
  }
  .content-box {
    min-height: calc(100vh - 108px);
    margin: 10px;
    margin-bottom: 108px;
    background: #fff;
    .sub-title {
      color: #00adb2;
    }
    .edit-form {
      margin-top: 15px;
      padding: 0 20px;
    }
    .detail-card {
      display: flex;
      padding-bottom: 14px;
      justify-content: space-between;
      margin-bottom: 14px;

      & > div {
        display: flex;
        align-items: center;
        flex: 1;
        padding: 19px 20px;
        margin-right: 20px;
        .iconfont {
          font-size: 42px;
          margin-right: 16px;
        }
        .label {
          font-size: 14px;
          margin-bottom: 6px;
        }
        .value {
          font-size: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .card-addr {
        flex: 1;

        .value {
          display: flex;
          width: 100%;
          // justify-content: space-between;
          justify-content: flex-start;
          align-items: center;
        }
        .line {
          flex: 1;
          border-bottom: 1px #5094ff dashed;
        }
      }
    }
    .content {
      padding: 0 20px;
    }
  }
}
</style>
