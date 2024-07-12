<template>
  <div>
    <ComForm
      ref="formRef"
      :formConfig="{
        ...formConfig,
        ...(!isView
          ? formConfigModel({
              shippingMode: formData.shippingMode,
              packingMode: formData.packingMode,
              proxyType: formConfig.formModel.proxyType,
              routeNoManageId: formConfig.formModel.routeNoManageId,
            })
          : detailFormConfigModel({
              shippingMode: formData.shippingMode,
              packingMode: formData.packingMode,
              proxyType: formConfig.formModel.proxyType,
              routeNoManageId: formConfig.formModel.routeNoManageId,
              remark: formConfig.formModel.remark,
            })),
      }"
      @handleChange="handleChange"
    >
      <template v-slot:routeNoManageId="slotProps">
        <AutoComplete
          ref="routeRef"
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            handle: (val) => handleChange(val, 'routeNoManageId'),
            refreshRequest: refreshRequestRoute,
          }"
          :additionalParam="{
            startPortIds: formData.startPortId,
            endPortIds: formData.endPortId,
            freightType: formData.packingMode,
            // ...(formData.shippingMode == 1
            //  ? { proxyType: slotProps.formModel.proxyType }
            //  : {}),
          }"
        />
      </template>
      <template v-slot:cabinProxyId="slotProps">
        <AutoComplete
          key="proxy"
          ref="proxyRef"
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
          }"
          :additionalParam="{ ids: proxyIds }"
        />
      </template>
    </ComForm>
  </div>
</template>

<script>
import { formConfig, detailFormConfig } from "./model";
import { timeConversionAdd } from "@/utils/index.js"
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    isView: {
      type: Boolean,
      default: false,
    },
    proxyIds: {
      type: String,
      default: "",
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    const {
      shippingMode,
      packingMode,
      proxyType: currProxyType,
      startPricePeriodValidity,
      endPricePeriodValidity,
      ...param
    } = this.formData;
    let proxyType = "0";
    if (shippingMode == 1 && packingMode == 1) {
      proxyType = "1";
    } else if (shippingMode == 2) {
      proxyType = this.typeConversion(currProxyType || 0);
    }
    return {
      formConfig: {
        formModel: {
          shippingMode,
          packingMode,
          proxyType,
          routeNoManageId: "",
          airShipCompanyName: "",
          cabinProxyCode: "",
          sameIndustryProxyCode: "",
          cabinProxyName: "",
          sameIndustryProxyName: "",
          routeName: "",
          pricePeriodValidity:
            startPricePeriodValidity && endPricePeriodValidity
              ? [startPricePeriodValidity, endPricePeriodValidity]
              : undefined,
          ...param,
        },
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.reBack, // 表单提交成功回调
        size: "small",
        labelWidth: "95px",
      },
      formConfigModel: formConfig,
      detailFormConfigModel: detailFormConfig,
      refreshRequestRoute: false,
    };
  },
  watch: {
    isView(val) {
      const { proxyType, routeNoManageId, remark } =
        this.$refs.formRef?.getFormParams() || {};
      this.formConfig.formModel.proxyType = proxyType;
      this.formConfig.formModel.routeNoManageId = routeNoManageId;
      this.formConfig.formModel.remark = remark;
      this.$nextTick(() => {
        this.$refs.formRef.renewForm();
      });
    },
  },
  methods: {
    handleChange(val, prop) {
      const {sailingSchedule,sailOpenTime}=this.$refs.formRef?.getFormParams()||{}
      switch (prop) {
        case "proxyType":
          this.formConfig.formModel.proxyType = val;
          this.$nextTick(() => {
            this.$refs.formRef.renewForm();
          });
          break;
        case "routeNoManageId":
          this.formConfig.formModel.routeNoManageId = val;
          if (val) {
            const {
              flightName,
              name: voyageNumber,
              cabinProxyId,
              cabinProxyName,
              routeId,
              routeCode,
              transfer: transferPortId,
              transferName: transferPortCode,
              shipCompanyId: airShipCompanyId,
              shipCompany: airShipCompanyName,
              cabinOpenTime,
              sailOpenTime,
              voyage: sailingSchedule,
              cutGateTime,
              etaTime,
              sameIndustryProxyId,
              sameIndustryProxyName,
              proxyType,
            } = val;
            this.$refs.formRef.setFormModel({
              flightName,
              voyageNumber,
              cabinProxyId,
              cabinProxyName,
              routeId,
              routeCode,
              transferPortId,
              transferPortCode,
              airShipCompanyId,
              airShipCompanyName,
              cabinOpenTime,
              sailOpenTime,
              voyage: sailingSchedule,
              cutGateTime,
              etaTime,
              sameIndustryProxyId,
              sameIndustryProxyName,
              proxyType,
            });
            this.formConfig.formModel.proxyType = proxyType;
          }
          this.$nextTick(() => {
            this.$refs.formRef.renewForm();
          });
          break;
        case "sailingSchedule":
        case sailOpenTime:
        case "sailOpenTime":
          const selectTime = prop == "sailingSchedule" ? sailOpenTime : val;
          const addTime = prop == "sailingSchedule" ? val : sailingSchedule;
          if (selectTime && addTime) {
            const etaTime = timeConversionAdd({
              selectTime,
              addTime,
            });
            this.$refs.formRef.setFormModel({
              etaTime,
            });
          }
          break
        default:
          break;
      }
    },
    formRefFn() {
      return this.$refs.formRef;
    },
    handleRefreshRequest() {
      this.refreshRequestRoute = !this.refreshRequestRoute;
      this.formConfig.formModel.routeNoManageId = "";
      this.$refs.formRef.setFormModel({
        routeNoManageId: "",
        routeNoManageName: "",
        routeNoManageCode: "",
      });
      this.$nextTick(() => {
        this.$refs.formRef.renewForm();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .form-class {
    padding: 0 44px 0 15px;
    .first-row {
      margin-top: -42px;
    }
    .detail-row {
      padding: 7px 0;
      .el-form-item--small {
        &.el-form-item {
          margin-bottom: 0px;
        }
        .el-form-item__label {
          height: 26px;
          line-height: 26px;
        }
        .el-form-item__content {
          height: 26px;
          line-height: 26px;
        }
      }
    }
    .el-input.is-disabled .el-input__inner {
      padding: 0 15px;
    }
  }
}
</style>
