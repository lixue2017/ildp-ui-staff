<template>
  <ComCustomDialog ref="customDialogRef" />
</template>

<script>
import { postPodTruckAttach } from "@/api/warehouse/process"
import { podDlgFormCols } from "./model";
export default {
  data() {
    return {
			
    }
  },
  methods: {
    async editShow(row, {
      editSuccess,
    }) {
			this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: podDlgFormCols(),
        formModel: {
					...row
				},
				uploadFormConfig: {
          limit: row.type === '1' ? 1 : 20, // 整箱与单个订单上传文件限制
        },
        httpRequest: (param) => {
					// console.log('param==', param)
					const { attachId, type, distributionInfoId, distributionPlanId } = param;
					return postPodTruckAttach({
						attachIdList: attachId ? attachId.split(",") : [],
						type,
						distributionInfoId,
						distributionPlanId,
						distributionType: 1, // 1=卡车，2=快递，3=自提
					})
				},
        successFunction: () => {
					this.msgSuccess('保存成功');
          editSuccess && editSuccess();
        },
      });
    },
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
// @import "~@/assets/styles/variables.scss";

</style>