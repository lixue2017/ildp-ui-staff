<template>
  <div class="top-from">
    <ComForm
      ref="formRef"
      :formConfig="{
        ...formConfig,
        ...handleFormData(),
      }"
    >
    </ComForm>
  </div>
</template>

<script>
import { basicForm } from "@/views/overseasBusiness/components/TopForm/model";
export default {
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
    ComForm: () => import("_comp/ComForm"),
  },
  data() {
    return {
      formConfig: {
        labelWidth: this.overseaLangObj.yu_yan_lang === "en-us" ? "135px" : "95px",
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
        ...data
      } = this.formData;
      const params = {
        ...data,
      };
      const types = [];
      if (directClearanceOrderDetail) {
        types.push(1);
        Object.keys(directClearanceOrderDetail).forEach(
          (k) =>
            (params[`directClearanceOrderDetail_${k}`] =
              directClearanceOrderDetail[k])
        );
      }
      if (deliveryClearanceOrderDeatail) {
        this.pageType !== 2 && types.push(2);
        Object.keys(deliveryClearanceOrderDeatail).forEach(
          (k) =>
            (params[`deliveryClearanceOrderDeatail_${k}`] =
              deliveryClearanceOrderDeatail[k])
        );
      }
      if (warehouseOrderDetailVo) {
        this.pageType !== 3 && types.push(3);
        Object.keys(warehouseOrderDetailVo).forEach(
          (k) =>
            (params[`warehouseOrderDetailVo_${k}`] = warehouseOrderDetailVo[k])
        );
      }
      return {
        formModel: params,
        lists: basicForm({ pageType: this.pageType, types }),
      };
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
  .form-title {
    border: none;
    padding-left: 0;
    margin: 14px 0;
  }
  .form-column-list {
    & > div > div:not(:last-child) {
      border-bottom: 1px solid #e2e2e2;
    }
  }
  .form-rows-box {
    margin-top: 10px;
  }
}
</style>
