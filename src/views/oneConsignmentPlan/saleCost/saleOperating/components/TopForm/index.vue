<template>
  <div>
    <ComForm
      ref="formRef"
      :formConfig="formConfig"
      :class="isDetail && 'detail-form'"
      @handleChange="handleChange"
    />
  </div>
</template>

<script>
import { formConfig } from "./model.js";
import { getIsBindAllCustomer } from "@/api/oneConsignmentPlan/saleCost";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
  },
  data() {
    const { lists, formRules } = formConfig(this.isDetail);
    return {
      formConfig: {
        formModel: this.formData, // 表单数据
        httpRequest: this.handleRequest,
        size: "small",
        labelWidth: "80px",
        lists,
        formRules,
      },
    };
  },
  methods: {
    async handleChange(val, prop) {
      if (prop === "wmsId") {
        let bindAllCustomer = true;
        if (val) {
          const res = await getIsBindAllCustomer(val);
          bindAllCustomer = !!res.data;
        }
        this.$emit("reNewFormData", { bindAllCustomer, wmsId: val });
        this.$refs.formRef.setFormModel({
          bindAllCustomer,
        });
      }
    },
    handleSummit() {
      this.$refs.formRef.submitForm();
    },
    handleRequest(formData) {
      return new Promise((resolve, reject) => {
        this.$emit("getFormData", formData);
        resolve();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-form {
  /deep/ {
    .el-form-item--small.el-form-item {
      margin-bottom: 6px;
    }
  }
}
/deep/ {
  .el-form {
    margin-bottom: 17px;
  }
  .form-left {
    background: #f0f6ff;
    border-right: 3px solid #5094ff;
    padding-right: 42px;
    padding-top: 20px;
    padding-bottom: 10px;
  }
  .form-right {
    width: calc(100vw - 730px);
    padding-top: 20px;
  }
  .time-tip {
    .el-form-item__content {
      display: flex;
    }
    .tip {
      margin-left: 5px;
    }
  }
}
</style>
