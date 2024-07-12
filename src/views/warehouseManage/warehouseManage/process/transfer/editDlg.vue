<template>
  <ComDialog
    ref="editDialogRef"
    :customDialog="editDialogConfig"
    :confirmClose="modeType !== 1"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogFormRef"
        :formConfig="editFormConfig"
        class="dialog-form"
        v-if="$refs && $refs.editDialogRef && $refs.editDialogRef.dialogVisible"
      >
        <template v-slot:slotYwdh="slotProps">
          <div class="base-flex-align ellipsis-text">
            <TooltipOver
              :content="`${slotProps.formModel.aimCountry || 'ZBT-220718-0004'}`"
              refName="tooltipOver"
              :style="{ width: 'calc(100% - 80px)', flex: 1 }"
            />
            <span class="tag-blue-color">{{'一件代发'}}</span>
          </div>
        </template>

      </ComForm>
    </template>
  </ComDialog>
</template>

<script>


import { popCusUpdateStatus } from "@/api/performance/record"
import { httpLocationSelect } from '@/comModel/warehouse'
import { editDlgFormCols } from "./model";
export default {
  data() {
    return {
      editDialogConfig: {},
      cancelFooter: [{
        text: "取消",
        plain: true,
        handleClick: () => {
          this.$refs.editDialogRef.handleClose();
        },
      }],
      submitFooter: [{
        text: "保存",
        type: "primary",
        handleClick: () => {
          this.$refs.dialogFormRef.submitForm();
        },
      }],
      editFormConfig: {
        formModel: {},
        httpRequest: this.editDlgRequest, // 表单提交接口
        size: "small",
      },
      modeType: 0
    }
  },
  methods: {
    editShow(row, {
      editSuccess,
      mode_type = 0
    }) {
      this.modeType = mode_type
      this.editFormConfig = {
        ...this.editFormConfig,
        labelWidth: ["105px", "80px"][mode_type],
        formModel: {
          ...row
          // id: row.id,
        },
        successFunction: (res) => {
          editSuccess && editSuccess(res)
          this.msgSuccess('保存成功');
          this.$refs.editDialogRef.hide();
        }
      }
      this.editDialogConfig = {
        useFooter: "footer",
        useFooter: "footer",
        footer: mode_type === 1 ? this.cancelFooter : [...this.submitFooter, ...this.cancelFooter],
        width: ["506px", "800px"][mode_type],
        title: ["移库信息", "移库信息"][mode_type]
      }
      const dlgFormConfig =  editDlgFormCols(mode_type)
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
    editDlgRequest(formOpt) {
      const opt = {
        ...this.editFormConfig.formModel,
        ...formOpt,
      }
      return new Promise((resolve, reject) => {
        resolve()
      })
      // return popCusUpdateStatus(opt)
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