<template>
  <div>
    <ComForm
      ref="formRef"
      :formConfig="formConfig"
      :class="isDetail && 'detail-form'"
    >
      <template v-slot:msgTip>
        <el-tooltip
          effect="dark"
          content="未选择时，匹配所有物流产品"
          placement="bottom-end"
        >
          <i class="el-icon-warning primary-text-color tip"></i>
        </el-tooltip>
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
  },
  data() {
    const { lists, formRules } = formConfig(this.isDetail);
    return {
      formConfig: {
        formModel: this.formData, // 表单数据
        httpRequest: this.handleRequest,
        size: "small",
        labelWidth: "103px",
        lists,
        formRules,
      },
    };
  },
  methods: {
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
  .form-right {
    width: calc(100% - 390px);
  }
  .time-tip {
    .el-form-item__content {
      display: flex;
    }
    .tip {
      margin-left: 5px;
    }
  }
  .logisticsProductTip {
    .el-form-item__content {
      display: flex;
      align-items: center;

      & > div {
        flex: 1;
        margin-right: 10px;
      }
      & > span {
        margin-right: 10px;
      }
      .tip {
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
}
</style>
