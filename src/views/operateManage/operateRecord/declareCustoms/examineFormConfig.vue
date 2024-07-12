<template>
  <ComDialog
    ref="examineDialog"
    :customDialog="examineDialogConfig"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <ComForm
        ref="examineForm"
        :formConfig="examineFormConfig"
        class="dialog-form"
        v-if="$refs && $refs.examineDialog && $refs.examineDialog.dialogVisible"
        @handleChange="handleFormChange"
      />
    </template>
  </ComDialog>
</template>

<script>
import { popCusUpdateStatus } from "@/api/performance/record"
import { examineFormCols } from "./model";
export default {
  data() {
    return {
      examineDialogConfig: {
        width: "506px",
        title: "审核查验",
        useFooter: "footer",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.examineDialog.handleClose();
            },
          },
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.$refs.examineForm.submitForm();
            },
          },
        ],
      },
      // 审核查验
      examineFormConfig: {
        formModel: {},
        httpRequest: this.examineRequest, // 表单提交接口
        size: "small",
        labelWidth: "110px",
        formRules: examineFormCols().formRules,
      },
    }
  },
  methods: {
    examineEvt(row, {
      examineSuccess
    }) {
      this.examineFormConfig = {
        ...this.examineFormConfig,
        formModel: {
          id: row.id, // 报关ID
          operationOrderId: row.operationOrderId // 操作单ID
        },
        successFunction: () => {
          examineSuccess && examineSuccess()
          this.msgSuccess('审核成功');
          this.$refs.examineDialog.hide();
        }
      }
      this.$set(this.examineFormConfig, 'lists', [
        {
          fieldList: [
            {
              rows: [
                {
                  cols: examineFormCols().columns,
                },
              ],
            },
          ],
        },
      ])
      this.$refs.examineDialog.show();
    },
    handleFormChange(e, type) {
      if (type === 'state') {
        this.$set(this.examineFormConfig.lists[0].fieldList[0].rows[0], 'cols', examineFormCols(e == 0).columns)
        if (e == 1) {
          this.$refs.examineForm?.$refs.myForm?.clearValidate("releaseTime");
        }
      }
    },
    examineRequest(formOpt) {
      const opt = {
        ...this.examineFormConfig.formModel,
        ...formOpt,
        status: formOpt.state == 1 ? 1 : 2,
      }
      return popCusUpdateStatus(opt)
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