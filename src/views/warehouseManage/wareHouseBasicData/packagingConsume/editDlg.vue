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
        v-if="$refs && $refs.editDialogRef && $refs.editDialogRef.dialogVisible"
      >
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>

import { packagingConsumePost, packagingConsumePut } from "@/api/warehouse/basic"
import { editFormCols } from "./model";
export default {
  data() {
    return {
      editDialogConfig: {
        useFooter: "footer",
        footer: [{
          text: "确定",
          type: "primary",
          handleClick: () => {
            this.$refs.dialogFormRef.submitForm();
          },
        }, {
          text: "取消",
          plain: true,
          handleClick: () => {
            this.$refs.editDialogRef.handleClose();
          },
        }]
      },
      editFormConfig: {
        formModel: {},
        httpRequest: this.editRequest, // 表单提交接口
        size: "small"
      }
    }
  },
  methods: {
    editShow(row, {
      mode_type = 0,
      editSuccess
    }) {
      const titArr = ['包材补货']
      const dlgWidth = ['506px']
      this.editDialogConfig = {
        ...this.editDialogConfig,
        title: titArr[mode_type],
        width: dlgWidth[mode_type]
      }

      const dlgFormConfig = [editFormCols()][mode_type]
      this.editFormConfig = {
        ...this.editFormConfig,
        labelWidth: ["95px"][mode_type],
        formModel: {
          // id: row.id,
          ...row
        },
        successFunction: () => {
          editSuccess && editSuccess()
          this.$refs.editDialogRef.hide();
        },
        lists: [{
          className: `edit-dlg-form_${mode_type}`,
          fieldList: [{
            rows: [{
              cols: dlgFormConfig.columns
            }]
          }]
        }],
        formRules: dlgFormConfig.formRules || {}
      }
      this.$refs.editDialogRef.show();
    },
    editRequest(formOpt) {
      const opt = {
        ...this.editFormConfig.formModel,
        ...formOpt,
        // packingMaterialsId: 11,
        // type: 0
      }
      // console.log('opt==', opt)
      if (opt.id) {
        return packagingConsumePut(opt)
      }
      return packagingConsumePost(opt)
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog")
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>