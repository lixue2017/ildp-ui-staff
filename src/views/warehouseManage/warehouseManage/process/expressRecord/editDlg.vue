<template>
  <ComDialog
    ref="editDialogRef"
    :customDialog="editDialogConfig"
    :confirmClose="modeType !== 0"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogFormRef"
        :formConfig="editFormConfig"
        class="dialog-form"
        v-if="$refs && $refs.editDialogRef && $refs.editDialogRef.dialogVisible"
      />
    </template>
  </ComDialog>
</template>

<script>

import { editDlgFormCols } from "./model";
export default {
  data() {
    return {
      editDialogConfig: {},
      cancelFooter: [{
        text: "取消",
        plain: true,
        handleClick: () => {
          this.$refs.editDialogRef.hide();
        },
      }],
      editFormConfig: {
        formModel: {},
        isAttachFileId: true,
        size: "small",
      },
      modeType: 0
    }
  },
  methods: {
    editShow(row) {
      console.log(row)
      console.log(this.editFormConfig)
      this.editFormConfig = {
        ...this.editFormConfig,
        labelWidth: "105px",
        formModel: {
          ...row,
          // attachId: "1190,1191"
        }
      }
      this.editDialogConfig = {
        useFooter: "footer",
        footer: this.cancelFooter,
        width: "800px",
        title: "快递信息"
      }
      const dlgFormConfig =  editDlgFormCols()
      this.editFormConfig = {
        ...this.editFormConfig,
        formRules: dlgFormConfig.formRules,
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: dlgFormConfig.columns,
                  },
                ],
              },
            ],
          },
        ]
      }
      this.$refs.editDialogRef.show();
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    TooltipOver: () => import("_comp/TooltipOver"),
    ComDialog: () => import("_comp/ComDialog")
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

</style>
