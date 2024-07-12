<template>
  <ComDialog
    ref="editDialogRef"
    :customDialog="editDialogConfig"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogFormRef"
        :formConfig="editFormConfig"
        class="dialog-form"
        v-if="$refs.editDialogRef && $refs.editDialogRef.dialogVisible"
      >
        <template v-slot:markStatus="slotProps">
          <div class="base-flex-align ellipsis-text">
            <TooltipOver
              :content="`${slotProps.formModel.code || '--'}`"
              refName="tooltipOver"
              :style="{ width: 'calc(100% - 170px)', flex: 1 }"
            />
            <span class="tag-blue-color">{{ slotProps.dicsData.nameCn || '--' }}</span>
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { truckSaveAttrch, truckSaveBoxAttrch, postSaveTruckPod } from "@/api/warehouse/process"
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
        isAttachFileId: true,
        httpRequest: this.editDlgRequest, // 表单提交接口
        size: "small",
      },
    }
  },
  methods: {
    async editShow(row, {
      editSuccess,
      // mode_type = 0
    }) {
      this.editFormConfig = {
        ...this.editFormConfig,
        labelWidth: "100px",
        uploadFormConfig: {
          limit: row.type === 10 ? 1 : 10, // 整箱与单个订单上传文件限制
        },
        formModel: {
          ...row,
          // attachId: "269"
        },
        successFunction: (res) => {
          editSuccess && editSuccess(res)
          this.msgSuccess('保存成功');
          this.$refs.editDialogRef.hide();
        }
      }
      this.editDialogConfig = {
        useFooter: "footer",
        footer: [...this.submitFooter, ...this.cancelFooter],
        width: "506px",
        title: "上传POD"
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
    editDlgRequest(formOpt) {
      // console.log('formOpt==', formOpt)
      // return new Promise((resolve, reject) => {
      //   resolve()
      // })
      const { code, type, truckId, attachId, ...nOpt } = formOpt;
			const paramObj = {
				podType: type / 10,
				truckId,
				attachId
			}
      if (type === 10) {
				// 整车
        return postSaveTruckPod(paramObj)
      }
      return postSaveTruckPod({
				...paramObj,
				...nOpt
			})
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
// @import "~@/assets/styles/variables.scss";

</style>