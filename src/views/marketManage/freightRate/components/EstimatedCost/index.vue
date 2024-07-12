<template>
  <div class="estimated-cost">
    <div class="top">
      <span class="title"> 预估费用 </span>
      <span class="subtitle">
        <i class="el-icon-warning-outline"></i>
        <span>实际费用以最终账单为准，在操作单可调整</span>
      </span>
    </div>
    <ComForm
      ref="formFreightRateRef"
      :formConfig="formConfigFreightRate"
      v-if="showSelectFreight"
    >
      <template v-slot:freightRateId="slotProps">
        <AutoComplete
          ref="tempRef"
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            isBackAll: true,
            refreshRequest: freightRefreshRequest,
            handle: (val) => handleChange(val),
            disabled: !formData.routeNoManageId,
          }"
          :additionalParam="{
            routeNoManageId: formData.routeNoManageId,
            shippingMode: formData.shippingMode,
            isBookingSpace: 1,
            packingMode,
          }"
        />
      </template>
    </ComForm>
    <div
      class="surcharge-list"
      v-if="(formData.freightRateId || freightRateId) && orderId"
    >
      <ComTable
        ref="tableRef"
        :columnConfig="tableColumns[packingMode]"
        :columnData="[]"
        v-if="packingMode === 0"
      />
      <div class="total-surcharge total-setting" v-else-if="freightRateSetting">
        <span>
          <span class="label">{{ pricingTypeName }}：</span>
          <span class="value">{{ freightRateSetting.evaluationValue }}</span>
        </span>
        <span>
          <span class="label">费用：</span>
          <span class="value"
            >{{ freightRateSetting.totalPrice
            }}{{ freightRateSetting.currencyCode }}</span
          >
        </span>
      </div>
      <div class="total-surcharge" v-if="freightRateSurchargeList.length">
        <template v-for="item in freightRateSurchargeList">
          <span :key="item.costName">
            <span class="label">{{ item.costName }}：</span>
            <span class="value"
              >{{ item.costPrice }}{{ item.currencyCode }}</span
            >
          </span>
        </template>
      </div>
      <div class="total-cost" v-if="totalCostList.length">
        <span class="title"> 合计： </span>
        <template v-for="item in totalCostList">
          <span :key="item.currencyCode">
            <span class="label">{{ item.currencyCode }}：</span>
            <span class="value">{{ toFixedNum(item.totalPrice, 2) }}</span>
          </span>
        </template>
      </div>
    </div>
    <div class="no-data" v-else>
      <img :src="noDataImg" alt="" srcset="" width="150px" />
      <div>暂无内容</div>
    </div>
  </div>
</template>

<script>
import {
  tableColumnsFCL,
  tableColumnsLCL,
  formConfig,
  formConfigFreightRate,
} from "./model";
import { getBookingCost } from "@/api/marketManage/freightRate";
import { accumulationFn } from "@/utils/instructions";
import noDataImg from "@/assets/image/noData.png";
export default {
  props: {
    packingMode: {
      type: Number,
      default: 0,
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    showSelectFreight: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    let label = "";
    if (this.packingMode === 1) {
      if (this.formData.pricingType === 0) {
        label = "体积(CBM)";
      } else {
        label = "重量(KG)";
      }
    }
    return {
      noDataImg,
      tableColumns: {
        0: tableColumnsFCL,
        1: tableColumnsLCL(`单箱${label}`),
      },
      pricingTypeName: `单箱${label}`,
      formConfig,
      formConfigFreightRate,
      freightRateSetting: null,
      freightRateSurchargeList: [],
      totalCostList: [],
      freightRateId: 0,
      freightRefreshRequest: false,
      orderId: 0,
    };
  },
  methods: {
    renewList() {
      const { freightRateId, orderId, orderType } = this.formData;
      this.orderId = orderId;
      this.freightRateSurchargeList = [];
      this.totalCostList = [];
      this.freightRateSetting = null;
      this.$refs.tableRef?.setNewTableData([]);
      if ((freightRateId || this.freightRateId) && orderId && orderType) {
        getBookingCost({
          orderId,
          orderType,
          freightRateId: freightRateId || this.freightRateId,
        }).then((res) => {
          console.log(res);
          const { data = {} } = res;
          this.$refs.tableRef?.setNewTableData(
            data.freightRateSettingList || []
          );
          this.freightRateSetting = data.freightRateSettingList
            ? data.freightRateSettingList[0]
            : null;
          this.freightRateSurchargeList = data.freightRateSurchargeList || [];
          this.totalCostList = data.totalCostList || [];
        });
      }
    },
    renewFreight() {
      this.$refs.formFreightRateRef.setFormModel({ freightRateId: "" });
      this.freightRefreshRequest = !this.freightRefreshRequest;
      this.freightRateSurchargeList = [];
      this.totalCostList = [];
      this.freightRateSetting = null;
      this.freightRateId = 0;
      this.$refs.tableRef?.setNewTableData([]);
    },
    handleChange(row) {
      this.freightRateId = row.id;
      let label = "";
      console.log(row.pricingType);
      if (row.pricingType === 0) {
        label = "体积(CBM)";
      } else {
        label = "重量(KG)";
      }
      this.pricingTypeName = `单箱${label}`;
      this.renewList();
      this.$emit("handleChange", row.id);
    },
    getSurchargePrice(item) {
      const { price, boxModelMap, currencyCode } = item;
      let boxModelPrice = 0;
      if (!price && boxModelMap) {
        const totalNum = [];
        Object.keys(boxModelMap).forEach((key) =>
          totalNum.push(boxModelMap[key])
        );
        boxModelPrice = accumulationFn(totalNum, 2);
      }
      return price || boxModelPrice
        ? `${this.toFixedNum(price || boxModelPrice, 2)}${currencyCode}`
        : "--";
    },
    getEstimatedCost() {
      return this.$refs.formFreightRateRef.validateAll();
    },
  },
};
</script>
<style lang="scss" scoped>
.estimated-cost {
  margin-bottom: -22px;
}
.top {
  display: flex;
  line-height: 20px;
  margin-bottom: 20px;

  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .subtitle {
    i {
      font-size: 14px;
      color: #ff813d;
      margin: 0 2px 0 5px;
    }
    span {
      font-size: 12px;
      color: #bcbcbc;
    }
  }
}
.surcharge-list {
  border-left: 1px solid #e2e2e2;
  border-right: 1px solid #e2e2e2;
}
.total-cost {
  padding-left: 50px;
  line-height: 51px;
  background: rgba(80, 148, 255, 0.12);
  border-bottom: 1px solid #e2e2e2;
  .title {
    font-size: 15px;
    font-weight: bold;
  }
  .label {
    color: #8b8b8b;
  }
  .value {
    font-size: 15px;
    color: #ff813d;
    font-weight: bold;
    margin-right: 20px;
  }
}
.total-setting {
  border-top: 1px solid #e2e2e2;
}
.total-surcharge {
  padding-left: 50px;
  line-height: 51px;
  background: rgba(80, 148, 255, 0.06);
  border-bottom: 1px solid #e2e2e2;
  .label {
    color: #8b8b8b;
  }
  .value {
    font-size: 15px;
    font-weight: bold;
    margin-right: 20px;
  }
}
.no-data {
  text-align: center;

  div {
    color: #8b8b8b;
  }
}
</style>
