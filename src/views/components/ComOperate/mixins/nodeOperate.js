// 节点操作事件
import { realityCabinetCols } from "@/views/warehouseManage/devanning/model.js";
import { stripping } from "@/api/warehouse/prediction";
import { popClearanceDetail } from "@/api/performance/record";

export const mixinNodeOperable = {
  data() {
    return {

    }
  },
  methods: {
		// 航次状态（17：离港-status: 2, 23：到港-status: 3）
    handleAirlineStatus(aId, status, oId) {
			if (!aId) {
				return this.$message.error("请先订舱！");
			}
			this.$refs.airlineStatusRef?.show(aId, status, { operationOrderId: oId });
    },
		// 清关审核（清关登记-nodeId-28、清关审核-nodeId-33、入仓登记-nodeId-34）
    examineCustomsClearance(row, cId) {
      const type_num = {
        28: 0, // 清关登记
        33: 2, // 清关审核
        // 43: 1, // 入仓登记
        61: 1 // 预计提拆柜
      };
      const new_com_opt = {
        type_num: type_num[row.nodeId], // 区分弹窗不同模板
        operationOrderId: cId
      };
      if ([0, 1, 2].includes(type_num[row.nodeId])) {
        this.$refs.customsClearanceRef?.show(new_com_opt);
      }
    },
		// 62 - 实际提拆柜
		async onStripping(sId) {
			const { salesman, warehouseId, putWarehousing } = (await popClearanceDetail(sId)).data || {};
      this.$refs.customDlgRef?.showCustomDialog({
        customFormConfig: realityCabinetCols({ salesman }),
				formModel: {
					warehouseId,
					putWarehousing,
        },
        httpRequest: obj => {
          return stripping({
            id: sId,
            boxStatus: 1,
            ...obj
          });
        },
        successFunction: this.handleSuccess
      });
    },
  },
  created() {

  },
  activated() {
  },
  deactivated() {

  },
	components: {
		AirlineStatusDialog: () =>
      import(
        "@/views/marketManage/airlineFlight/components/AirlineStatusDialog"
      ), // 航次到港离港时间确认弹窗
		DeclareCustomsClearance: () =>
      import(
        "@/views/operateManage/operateRecord/customsClearance/editDialog.vue"
      ), // 清关申报、审核
    ServiceConfigDialog: () =>
      import(
        "@/views/operateManage/operateRecord/customsClearance/components/serviceConfigDialog/index.vue"
      ), // 业务配置
	}
}
