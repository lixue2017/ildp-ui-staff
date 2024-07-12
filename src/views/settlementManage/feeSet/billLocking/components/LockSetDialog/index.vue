<template>
  <ComDialog
    v-if="dialogShow"
    ref="myDialog"
    :customDialog="dialogConfig"
    @onClose="handleClose"
  >
    <template v-slot:content>
      <div class="">
        <ComForm :formConfig="formConfig" ref="myComForm" />
      </div>
    </template>
  </ComDialog>
</template>
<script>
import {
  addSettleAccountLock,
  editSettleAccountLock,
} from "@/api/settlementManage/feeSet";
import { config } from "./model";
export default {
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    DiffMark: () => import("_comp/DiffMark"),
  },
  data() {
    return {
      dialogShow: false,
      dialogConfig: {
        title: "锁定设置",
        width: "450px",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.myDialog.hide();
              this.dialogShow = false;
            },
          },
          {
            text: "确定",
            type: "primary",
            handleClick: this.submitSave,
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: (formModel) => {
          if (formModel.id) {
            return editSettleAccountLock(formModel);
          } else {
            return addSettleAccountLock(formModel);
          }
        }, // 表单提交接口
        successFunction: () => {
          this.handleClose();
          this.$emit("handleSuccess");
        }, // 表单提交成功回调
        size: "small",
        labelWidth: "120px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: config.lists,
                  },
                ],
              },
            ],
          },
        ],
        formRules: config.formRules, // 表单校验规则
      },
    };
  },
  methods: {
    show(row) {
      if (row) {
        this.formConfig.formModel = { ...row };
      } else {
        const oData = new Date();
        this.formConfig.formModel = {
          lockMonth: `${oData.getFullYear()}-${oData.getMonth() + 1}`,
        };
      }
      this.dialogShow = true;
      setTimeout(() => {
        this.$refs.myDialog.show();
      });
    },
    handleClose() {
      this.dialogShow = false;
    },
    handleSave(row) {},
    submitSave() {
      this.$refs.myComForm.submitForm();
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-bottom: 30px;
}
</style>