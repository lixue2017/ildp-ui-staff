<template>
  <ComDialog
    ref="editDialogRef"
    :customDialog="editDialogConfig"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogFormRef"
        :formConfig="editFormConfig"
        class="dialog-form"
        v-if="$refs.editDialogRef && $refs.editDialogRef.dialogVisible"
      >
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import {
  saveCostPartitionScheme,
  getCostPartitionSchemeInfo,
} from "@/api/warehouse/basic";
import { editDlgFormCols, dlgFormRules } from "./model";
export default {
  data() {
    return {
      editDialogConfig: {
        width: "500px",
        title: "分区方案",
        footer: [
          {
            text: "保存",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogFormRef.submitForm();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.editDialogRef.handleClose();
            },
          },
        ],
      },
      editFormConfig: {
        formModel: {},
        labelWidth: "110px",
        httpRequest: this.editDlgRequest, // 表单提交接口
      },
    };
  },
  methods: {
    async editShow(row, { editSuccess }) {
      let rowInfo = {};
      if (row.id) {
        // 编辑时回显数据
        rowInfo = (await getCostPartitionSchemeInfo(row.id)).data || {};
      }
      if (row.webRowCopy === "btnCopy") {
        // 复制时，删除ID
        rowInfo.copyId = rowInfo.id;
        delete rowInfo.id;
      }
      this.editFormConfig = {
        ...this.editFormConfig,
        formModel: {
          ...rowInfo,
          type: row.type == 2 ? true : false,
        },
        formRules: dlgFormRules(),
        lists: editDlgFormCols(),
        successFunction: (res) => {
          editSuccess && editSuccess(res);
          this.msgSuccess("保存成功");
          this.$refs.editDialogRef.hide();
        },
      };
      this.$refs.editDialogRef.show();
    },
    editDlgRequest(formOpt) {
      const optArr = ["id", "type", "nameCn", "nameEn", "remark", "copyId"];
      const optObj = this.$refs.dialogFormRef.saveFormParams(optArr);
      optObj.type = optObj.type ? 2 : 1;
      return saveCostPartitionScheme(optObj);
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-form {
}
</style>
