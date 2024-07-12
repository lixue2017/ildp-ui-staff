<template>
  <div class="remark-box">
    <ComForm ref="remarkRef" :formConfig="basicFormConfig" />
    <div class="base-flex-end">
      <el-button type="primary" @click="saveRemark" size="small" v-throttle>
        保存备注
      </el-button>
    </div>
  </div>
</template>

<script>
// import { PUTOperationOverseaRemark } from "@/api/order/overSeaOther.js";
import { httpDictRequest } from "@/api/performance/dictRecord.js";
import { formRemarksCols } from "./model.js";

export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      basicFormConfig: {
        formModel: {},
        labelPosition: "top",
        labelWidth: "90px",
        lists: formRemarksCols(),
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleFormSuccess, // 表单提交成功回调
      },
    };
  },
  mounted() {},
  methods: {
    saveRemark(formModel) {
      this.$refs.remarkRef?.submitForm();
      //保存操作备注
    },
    submitFormRequest(formModel) {
      const { id, operationRemark: remark } = formModel;
      // console.log("formModel", formModel);
      // const params = {
      //   id,
      //   remark,
      // };
      // return PUTOperationOverseaRemark(params);

      return httpDictRequest(
        {
          pageRemarkNameKey: "HWQGCZDBZ",
          requestKey: "postAddBusinessRemark",
        },
        {
          remark,
          businessId: id,
        }
      );
    },
    handleFormSuccess() {
      this.msgSuccess("备注保存成功");
    },
  },
  created() {
    const { orderRemark, businessRemark, operationRemark, id } =
      this.formData || {};
    // console.log("this.formData", this.formData);
    this.basicFormConfig.formModel = {
      ...this.basicFormConfig.formModel,
      id,
      orderRemark,
      businessRemark,
      operationRemark,
    };
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
  },
};
</script>

<style lang="scss" scoped>
.remark-box {
  margin-top: 44px;
}
</style>
