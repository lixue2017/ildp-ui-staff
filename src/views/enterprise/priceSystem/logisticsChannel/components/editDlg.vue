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
        v-if="$refs.editDialogRef && $refs.editDialogRef.dialogVisible"
      />
    </template>
  </ComDialog>
</template>

<script>

import { postLogisticsChannel, getLogisticsInfo } from "@/api/priceSystem/provider.js";
import { editDlgFormCols, dlgFormRules } from "../model";
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
        text: "暂存",
        type: "primary",
        handleClick: () => {
					this.btnStatus = 0
          this.$refs.dialogFormRef.submitForm();
        },
      }, {
        text: "保存并启用",
        type: "primary",
        handleClick: () => {
          this.btnStatus = 1
          this.$refs.dialogFormRef.submitForm();
        },
      }],
      editFormConfig: {
        formModel: {},
        httpRequest: this.editDlgRequest, // 表单提交接口
      },
      btnStatus: 0,
      modeType: 0
    }
  },
  methods: {
    async editShow(row, {
      editSuccess,
      mode_type = 0 // 0: 新增/修改 1：查看
    }) {
			let nRow = row;
			if (row.webBtnType === 'edit') {
				// 列表编辑
				nRow = (await this.comRepeatedRequest(this, getLogisticsInfo, row.id)).data || {};
			}
      this.modeType = mode_type;
      this.editFormConfig = {
        ...this.editFormConfig,
        labelWidth: "105px",
        formModel: {
          ...nRow,
          outWarehouseMethod: this.typeConversion(nRow.outWarehouseMethod),
					tagType: this.typeConversion(nRow.tagType)
        },
				formRules: dlgFormRules(mode_type),
        lists: editDlgFormCols(mode_type),
        successFunction: (res) => {
          editSuccess && editSuccess(res)
          this.msgSuccess('保存成功');
          this.$refs.editDialogRef.hide();
        }
      }
      let nFooter = this.cancelFooter
      if (mode_type === 1 && nRow.state === 0) {
        // 草稿状态查看，可点击修改
        nFooter = [{
          text: "修改",
          type: "primary",
          handleClick: () => {
            this.$refs.editDialogRef.hide();
            this.$nextTick(() => {
              this.editShow(nRow, {
                mode_type: 0, // 0: 新增/修改 1：查看
                editSuccess
              })
            })
          },
        },
        ...this.cancelFooter]
      }
      this.editDialogConfig = {
        useFooter: "footer",
        footer: mode_type === 1 ? nFooter : [...this.submitFooter, ...this.cancelFooter],
        width: "800px",
        title: "物流渠道"
      }
      this.$refs.editDialogRef.show();
    },
    editDlgRequest() {
			const keyArr = ['id', 'code', 'nameCn', 'nameEn', 'outWarehouseMethod', 'packAndShipImmediately',
				'serviceId', 'remark', 'tagShowShot', 'tagType', 'traceable']
			const sFormData = this.$refs.dialogFormRef?.saveFormParams(keyArr);
			const opt = {
				state: this.btnStatus, // 0=草稿；1=启用
				...sFormData
			}
      return postLogisticsChannel(opt);
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