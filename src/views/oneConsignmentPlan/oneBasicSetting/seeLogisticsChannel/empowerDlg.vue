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
				<template v-slot:attrSlot="slotProps">
					<span>{{ slotProps.fieldItem.labelTxt }}</span>
				</template>
				<template v-slot:msgSlot="slotProps">
					<span>{{ slotProps.fieldItem.labelTxt }}</span>
				</template>
				<template v-slot:remarkSlot>
					<p class="remark-txt-p">是否将volumeWeight重量传给服务商weightInKG字段；</p>
					<p class="remark-txt-p">是：Y，否：N，默认否，默认传order/weight + order/bda</p>
				</template>
				<template v-slot:weightInSlot>
					<p class="remark-txt-p">weightInKG字段取值选择产品仓库属性重量/产品净重；</p>
					<p class="remark-txt-p">默认产品仓库属性重量，"1":"产品仓库属性重量","2":"产品净重"</p>
				</template>
				<template v-slot:tagSlot>
					<p class="remark-txt-p">标签尺寸 A4：普通标签激光打印A4普通纸；</p>
					<p class="remark-txt-p">910-300-700：普通标签激光打印105 x 205 mm（910-300-700）；</p>
					<p class="remark-txt-p">910-300-600：普通标签热敏打印103 x 199（910-300-600）；</p>
					<p class="remark-txt-p">910-300-710：普通标签激光打印105 x 208 mm（910-300-710）；</p>
					<p class="remark-txt-p">100x100mm：100x100mm（仅适用于 Warenpost）100*150mm；</p>
				</template>
			</ComForm>
    </template>
  </ComDialog>
</template>

<script>

import { basicChannelPost, basicChannelPut } from "@/api/priceSystem/provider.js";
import { editDlgFormCols, dlgFormRules } from "./model";
export default {
  data() {
    return {
      editDialogConfig: {
				width: "900px",
        title: "API授权",
				footer: [{
					text: "保存",
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
				labelWidth: "130px",
        httpRequest: this.editDlgRequest, // 表单提交接口
      },
    }
  },
  methods: {
    editShow(row, {
      editSuccess
    }) {
      this.editFormConfig = {
        ...this.editFormConfig,
        formModel: {
          ...row,
          // outWarehouseWay: this.typeConversion(row.outWarehouseWay),
        },
				formRules: dlgFormRules(),
        lists: editDlgFormCols(),
        successFunction: (res) => {
          editSuccess && editSuccess(res)
          this.msgSuccess('保存成功');
          this.$refs.editDialogRef.hide();
        }
      }
      this.$refs.editDialogRef.show();
    },
    editDlgRequest(formOpt) {
      const opt = {
        ...formOpt,
      }
      if (opt.id) {
        return basicChannelPut(opt)
      }
      return basicChannelPost(opt)
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog")
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-form {
	/deep/ .el-col.title-attr {
		background: #f4f4f4;
		margin-bottom: 8px;
		& > .el-form-item {
			margin: 5px 0;
			font-weight: 600;
			& > label {
				padding-right: 10px;
				color: #515151;
				font-weight: 600;
			}
		}
	}
	.remark-txt-p {
		line-height: 22px;
	}
}
</style>