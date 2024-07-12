<template>
  <div>
    <div class="quotation-scheme">
      <div class="index">
        <el-checkbox :checked="checked" @change="handleSelect" />
        <span>{{ index + 1 }}</span>
      </div>
      <RouteInfo
        :formData="schemeConfig.formModel"
        :isCopyPage="true"
        :isOverseasToDoor="isOverseasToDoor"
        :proxyType="proxyType"
      />
    </div>
    <CostTable
      ref="costTableRef"
      :isFcl="isFcl"
      :isOverseasToDoor="isOverseasToDoor"
      :columnData="quotationSchemeInfo.quotationSchemeDetailInfoVOList || []"
      :cabinetList="formData.cabinetList"
    />
    <!-- :webViewSource="{sharePage:true}" -->
    <div
      class="grand-total"
      v-if="
        quotationSchemeInfo.totalCostList &&
        quotationSchemeInfo.totalCostList.length
      "
    >
      <span>合计：</span>
      <template v-for="(item, index) in quotationSchemeInfo.totalCostList">
        <span :key="index">
          <span class="label">{{ item.name }}：</span>
          <span class="value">{{ item.value }}</span>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 1,
    },
    quotationSchemeInfo: {
      type: Object,
      default: () => {},
    },
    // 是否海外方案
    isOverseasToDoor: {
      type: Boolean,
      default: false,
    },
    // 是否整柜
    isFcl: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => ({
        cabinetList: [],
      }),
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CostTable: () => import("./CostTable"),
    RouteInfo: () => import("./RouteInfo"),
  },
  data() {
    const {
      startPricePeriodValidity,
      endPricePeriodValidity,
      airShipCompanyId,
      airShipCompanyName,
    } = this.quotationSchemeInfo;
    const proxyType =
      this.formData.packingMode == 1
        ? this.typeConversion(this.quotationSchemeInfo.proxyType || 0)
        : undefined;
    const pricePeriodValidity =
      startPricePeriodValidity && endPricePeriodValidity
        ? [startPricePeriodValidity, endPricePeriodValidity]
        : [];
    return {
      proxyType,
      schemeConfig: {
        formModel: {
          ...this.quotationSchemeInfo,
          pricePeriodValidity,
          airShipCompany: airShipCompanyId
            ? {
                id: airShipCompanyId,
                label: airShipCompanyName,
              }
            : "",
        }, // 表单数据
        labelWidth: "95px",
      },
    };
  },
  methods: {
    handleSelect(val) {
      // console.log(val);
      const { id } = this.quotationSchemeInfo;
      this.$emit("handleSelect", {
        id,
        bol: val,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.quotation-scheme {
  display: flex;
  align-items: center;
  min-height: 95px;
  background: #f6f6f6;

  .index {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    text-align: center;
    span {
      font-size: 20px;
      margin-left: 10px;
    }
  }
  .scheme-form {
    flex: 1;
    padding-top: 15px;
    /deep/ {
      .el-form-item--small.el-form-item {
        margin-bottom: 15px;
      }
      .el-form-item__error {
        z-index: 1;
      }
      // .el-form-item.scheme-remark {
      //   margin-top: 15px;
      // }
    }
  }
  .operation-content-btn {
    width: 288px;
    justify-content: flex-end;
    padding-right: 30px;
    .operate-icon.el-button {
      margin-left: 30px;
    }
  }
  .quotation-state {
    margin-right: 10px;
  }
}
.scheme-detail-form {
  border-top: 1px solid #e2e2e2;
  padding: 7px 0 7px 52px;
  /deep/ {
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__label,
    .el-form-item__content {
      line-height: 26px;
    }
    .el-form-item--small .el-form-item__content {
      min-height: 26px;
    }
  }
}
.grand-total > span {
  &:nth-child(2) {
    padding-left: 10px;
  }
}
</style>
