/** 海外仓订单列表 @/views/warehouseManage/components/orderOverseasBusiness/overseasOrder.js */

import { postOverseasBusinessRepulse } from "@/api/warehouse/prediction";
import { customOverseasDialogCols } from "./model.js";
// 此文件已废弃
export const mixinOrderListOverseas = {
	data() {
		return {}
	},
	methods: {
		handleMixinCustomDialog(row) {
			// 打回
			const { id, type, orderNum } = row || {};
			this.$refs.mCustomDialogRef?.showCustomDialog({
				customFormConfig: customOverseasDialogCols(),
				formModel: {
					id,
					type, // 7: 第三方入库单 8: 一件代发 9: FBA订单
					orderNum
				},
				httpRequest: postOverseasBusinessRepulse,
				successFunction: () => {
					this.mixinkeepTable();
				},
			})
		},
	},
	components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
}