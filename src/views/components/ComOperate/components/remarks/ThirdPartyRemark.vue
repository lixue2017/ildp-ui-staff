<template>
  <div class="remark-box">
    <ComForm
			ref="remarkRef"
			:formConfig="basicFormConfig"
		/>
		<div class="base-flex-end">
			<el-button type="primary" @click="saveRemark" size="small" v-throttle>
        {{overseaLangObj.bc_bz || "保存备注"}}
      </el-button>
		</div>
  </div>
</template>

<script>

import { postThirdPartyRemark } from "@/api/warehouse/prediction";
import { formRemarksCols } from "./model";

export default {
	props: {
		formData: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			basicFormConfig: {
				formModel: {},
				labelPosition: "top",
				labelWidth: "90px",
      },
		}
	},
	methods: {
		saveRemark() {
			//保存操作备注
      const { id, webPageSource, webOrderSource } = this.formData;
      const { operationOrderRemark, warehouseOrderRemark } = this.$refs.remarkRef?.getFormModelVal();
			this.comRepeatedRequest(this, postThirdPartyRemark, {
				id,
				remark: webPageSource === 'operationReceiving' ? operationOrderRemark: warehouseOrderRemark,
				orderSource: webOrderSource
			}).then(() => {
				this.msgSuccess(this.overseaLangObj.cz_cg || '备注保存成功')
			})
		},
	},
	created() {
		const { customersType, webPageSource } = this.formData
		this.basicFormConfig.formModel = {
			...this.formData
		}
		this.basicFormConfig.lists = formRemarksCols({
			colsKey: webPageSource,
			isOperationWarehouseRemark: customersType !== 'direct' // 判断直接客户与间接客户
		})
	},
	components: {
    ComForm: () => import("_comp/ComForm"),
  },
}
</script>

<style lang="scss" scoped>
	.remark-box {
		margin-top: 44px;
	}
</style>
