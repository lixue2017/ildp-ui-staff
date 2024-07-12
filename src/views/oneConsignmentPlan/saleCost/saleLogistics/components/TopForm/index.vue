<template>
  <div>
    <ComForm
      ref="formRef"
      :formConfig="formConfig"
      :class="isDetail && 'detail-form'"
      @handleChange="handleChange"
    >
      <template v-slot:costPartitionSchemeId="slotProps">
        <AutoComplete
          ref="schemeRef"
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            refreshRequest: schemeRefreshRequest,
            disabled: !slotProps.formModel.logisticsProductId,
            placeholder: !slotProps.formModel.logisticsProductId
              ? '请先选择物流产品'
              : slotProps.fieldItem.placeholder,
            handle: (val) => handleChange(val, 'costPartitionSchemeId'),
          }"
        />
        <!-- :additionalParam="{
            logisticsProductIdEq: slotProps.formModel.logisticsProductId,
          }" -->
      </template>
      <template v-slot:weightSectionTempId="slotProps">
        <AutoComplete
          ref="tempRef"
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            refreshRequest: tempRefreshRequest,
            disabled: !slotProps.formModel.wmsId,
            placeholder: !slotProps.formModel.wmsId
              ? '请先选择计费仓'
              : slotProps.fieldItem.placeholder,
            handle: (val) => handleChange(val, 'weightSectionTempId'),
          }"
          :additionalParam="{
            warehouseMainIdEq: slotProps.formModel.wmsId,
          }"
        />
      </template>
    </ComForm>
  </div>
</template>

<script>
import { formConfig } from "./model.js";
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
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    const { lists, formRules } = formConfig(this.isDetail);
    return {
      formConfig: {
        formModel: this.formData, // 表单数据
        httpRequest: this.handleRequest,
        size: "small",
        labelWidth: "110px",
        lists,
        formRules,
      },
      schemeRefreshRequest: false,
      tempRefreshRequest: false,
    };
  },
  methods: {
    handleChange(val, prop) {
      const params = {};
      switch (prop) {
        case "wmsId":
          this.tempRefreshRequest = !this.tempRefreshRequest;
          params.weightSectionTempId = "";
          params.weightSectionTempName = "";
          break;
        case "logisticsProductId":
          this.schemeRefreshRequest = !this.schemeRefreshRequest;
          params.costPartitionSchemeId = "";
          params.costPartitionSchemeName = "";
          break;
        case "costPartitionSchemeId":
        case "weightSectionTempId":
          const { costPartitionSchemeId, weightSectionTempId } =
            this.$refs.formRef.getFormParams();
          this.$emit("handleChangeParams", {
            costPartitionSchemeId,
            weightSectionTempId,
          });
          break;

        default:
          break;
      }
      if (Object.keys(params).length) {
        this.$refs.formRef.setFormModel(params);
        const { costPartitionSchemeId, weightSectionTempId } =
          this.$refs.formRef.getFormParams();
        this.$emit("handleChangeParams", {
          ...{
            costPartitionSchemeId,
            weightSectionTempId,
          },
          ...params,
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
  .form-class .el-input.is-disabled {
    .el-input__inner {
      &::placeholder,
      &::-webkit-input-placeholder,
      &::-moz-placeholder,
      &::-ms-input-placeholder {
        color: #fa7a7a;
      }
    }
  }
}
</style>
