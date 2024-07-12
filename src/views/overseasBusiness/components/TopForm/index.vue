<template>
  <div class="top-from">
    <Card :config="getCardConfig()" :formData="formData" />
    <ComForm
      ref="formRef"
      :formConfig="{
        ...formConfig,
        formModel: handleFormData(),
      }"
    >
    </ComForm>
  </div>
</template>

<script>
import { cardConfig, basicForm, overSeaCardConfig } from "./model";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    pageType: {
      // 1：海外直清
      // 2：海外提派
      // 3：海外入仓
      type: Number,
      default: 1,
    },
  },
  components: {
    Card: () => import("@/views/overseasBusiness/components/Card"),
    ComForm: () => import("_comp/ComForm"),
  },
  data() {
    const { overseaBusinessTypes,freightType } = this.formData;
    let types = [this.pageType];
    if (overseaBusinessTypes.length > 1)
      types = [
        this.pageType,
        ...overseaBusinessTypes.filter((i) => i != this.pageType),
      ];
    return {
      cardConfig,
      formConfig: {
        labelWidth: this.overseaLangObj.yu_yan_lang === "en-us" ? "142px" : "95px",
        lists: basicForm({
          pageType: this.pageType,
          types,
          isBasic: true,
          freightType
        }),
        formRules: {},
      },
    };
  },
  methods: {
    handleFormData() {
      const {
        deliveryClearanceOrderDeatail,
        directClearanceOrderDetail,
        warehouseOrderDetailVo,
        freightType,
        ...data
      } = this.formData;
      const { agentName, customsBrokerName } = directClearanceOrderDetail || {};
      const { delivertAgentType, deliverAgentName } =
        deliveryClearanceOrderDeatail || {};
      const { warehouseName } = warehouseOrderDetailVo || {};
      const params = {
        ...data,
        freightType: this.typeConversion(freightType),
        agentName,
        customsBrokerName,
        warehouseName,
        deliverAgentName,
        delivertAgentType,
      };
      deliveryClearanceOrderDeatail &&
        Object.keys(deliveryClearanceOrderDeatail).forEach(
          (k) =>
            (params[`deliveryClearanceOrderDeatail_${k}`] =
              deliveryClearanceOrderDeatail[k])
        );
      directClearanceOrderDetail &&
        Object.keys(directClearanceOrderDetail).forEach(
          (k) =>
            (params[`directClearanceOrderDetail_${k}`] =
              directClearanceOrderDetail[k])
        );
      warehouseOrderDetailVo &&
        Object.keys(warehouseOrderDetailVo).forEach(
          (k) =>
            (params[`warehouseOrderDetailVo_${k}`] = warehouseOrderDetailVo[k])
        );
      return params;
    },
    getCardConfig() {
      const headCard = {
        1: cardConfig, //海外清关
        2: cardConfig, //海外提派
        3: overSeaCardConfig, //海外入仓
      };
      return headCard[this.pageType];
    },
  },
};
</script>

<style lang="scss" scoped>
.top-from {
  padding-bottom: 20px;
  // border-bottom: 1px solid #e2e2e2;
}
/deep/ {
  .el-form-item {
    margin-bottom: 5px;
  }
  .form-class .border-top-solid::before {
    margin-top: 0px;
  }
  .form-rows-box {
    margin-top: 10px;
  }
}
</style>
