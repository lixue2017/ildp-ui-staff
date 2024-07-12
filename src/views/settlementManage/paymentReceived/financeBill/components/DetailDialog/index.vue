<template>
  <ComDialog
    v-if="dialogShow"
    ref="myDialog"
    :customDialog="dialogConfig"
    @onClose="handleClose"
  >
    <template v-slot:content>
      <div class="content-padding-20">
        <ComForm
          :formConfig="formConfig"
          ref="myComForm"
          v-if="Object.keys(dictionary.dicsData).length"
        >
          <template v-slot:isIncludedTax>
            <div class="tax-item flex">
              <el-checkbox v-model="formConfig.formModel.isIncludedTax" />
              <span>含税 </span>
              <span> 税额：</span>
              <span>13%</span>
            </div>
          </template>
        </ComForm>
      </div>
    </template>
  </ComDialog>
</template>
<script>
import { config } from "./model";
import { mapState } from "vuex";
export default {
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  data() {
    return {
      dialogShow: false,
      dialogConfig: {
        title: "账单信息",
        width: "700px",
        footer: [
          {
            text: "关闭",
            plain: true,
            handleClick: () => {
              this.$refs.myDialog.hide();
              this.dialogShow = false;
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: () => {}, // 表单提交接口
        successFunction: () => {}, // 表单提交成功回调
        size: "small",
        labelWidth: "80px",
        lists: config.lists,
        formRules: {}, // 表单校验规则
      },
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  methods: {
    show(row) {
      this.formConfig.formModel = {
        ...row,
        type: this.typeConversion(row.type),
        prepaidCollect: this.typeConversion(row.prepaidCollect),
        isIncludeTax: row.isIncludeTax ? true : false,
      };
      this.dialogShow = true;
      setTimeout(() => {
        this.$refs.myDialog.show();
      });
    },
    handleClose() {
      this.dialogShow = false;
    },
    handleSave(row) {},
    submitSave() {},
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
.content-padding-20 {
  padding: 0 20px;
}
/deep/ {
  .el-form-item__label {
    padding-right: 0;
  }
  .el-tag.el-tag--mini {
    padding: 0 12px;
    border-radius: 12px;
    margin-left: 10px;
  }
  .el-radio-group {
    white-space: nowrap;
    .el-radio {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
      .el-radio__label {
        padding-left: 2px;
      }
    }
  }
  .el-checkbox__label {
    padding-left: 2px;
  }
  .form-class {
    .el-checkbox {
      margin-right: 7px;
    }
  }
  .tax-item {
    .el-input--suffix .el-input__inner {
      padding-right: 0;
    }
  }
}
</style>
