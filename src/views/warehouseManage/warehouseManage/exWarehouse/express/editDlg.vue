<template>
  <ComDialog ref="editDialogRef" :customDialog="editDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogFormRef"
        :formConfig="editFormConfig"
        class="dialog-form"
        v-if="$refs && $refs.editDialogRef && $refs.editDialogRef.dialogVisible"
      >
        <template v-slot:markStatus="slotProps">
          <div class="base-flex-align ellipsis-text">
            <TooltipOver
              :content="`${slotProps.formModel.number || '--'}`"
              refName="tooltipOver"
              :style="{ width: 'calc(100% - 170px)', flex: 1 }"
            />
            <span class="tag-blue-color">{{
              slotProps.dicsData.nameCn || "--"
            }}</span>
          </div>
        </template>
        <template v-slot:name="slotProps">
          <el-input
            :placeholder="slotProps.fieldItem.placeholder"
            v-model="slotProps.formModel.name"
          />
        </template>
        <template v-slot:phone="slotProps">
          <el-input
            :placeholder="slotProps.fieldItem.placeholder"
            v-model="slotProps.formModel.phone"
          />
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>
<script>
import { exwarehousePost, getSelectExpressList, deliveryBatchPost } from "@/api/warehouse/manage";
import { editDlgFormCols } from "./model";
export default {
  data() {
    return {
      editDialogConfig: {},
      cancelFooter: [
        {
          text: "取消",
          plain: true,
          handleClick: () => {
            this.$refs.editDialogRef.handleClose();
          },
        },
      ],
      submitFooter: [
        {
          text: "保存",
          type: "primary",
          handleClick: () => {
            this.$refs.dialogFormRef.submitForm();
          },
        },
      ],
      editFormConfig: {
				labelWidth: "105px",
        formModel: {},
        isAttachFileId: true,
      },
    };
  },
  methods: {
    async editShow(row, { editSuccess, mode_type = 0 }) {
      const nRow = (await getSelectExpressList({ id: row.id })).rows || [];
      const {
        receivingWarehouse = {},
        // number,
        attachId,
        // type: markStatus,
        deliveryCode,
        address,
        name,
        phone,
        detailsAddr,
      } = nRow[0] || {};
      const { number, type } = row;
			
      this.editFormConfig = {
        ...this.editFormConfig,
        formModel: {
          orderId: row.id,
          number,
          status: 4, // 4-待出库 5-运输中  6-已完结
          type: 0, // 0 私人地址  1 FBA仓库  2三方仓库
          name,
          phone,
          address: detailsAddr,
          markStatus:type,
          deliveryCode,
          attachId,
          warehouseId: row.warehouseId,
					freightQuantity: row.productTotal
          // attachId: "11,12"
        },
				httpRequest: exwarehousePost, // 表单提交接口
      };
      this.showDialog(mode_type, editSuccess);
    },

		/** 派送与批量派送 */
		editDispatchShow(rows, { editSuccess, mode_type = 1 }) {
			this.editFormConfig = {
        ...this.editFormConfig,
        formModel: {
					number: (rows || []).map(e => e.number).join(", ")
				},
				httpRequest: (opt) => {
					const { mailTime, attachId } = opt;
					const optArr = rows.map((e) => {
						return {
							markStatus: e.markStatus,
							orderId: e.orderId,
							freightQuantity: e.freightQuantity,
							outboundTime: mailTime,
							attachPodId: attachId,
							status: 6,
						}
					});
					return deliveryBatchPost(optArr)
				}, // 表单提交接口
			}
			this.showDialog(mode_type, editSuccess);
		},

		showDialog(mType, editSuccessFn) {
			this.editDialogConfig = {
        useFooter: "footer",
        footer: [...this.submitFooter, ...this.cancelFooter],
        width: "506px",
        title: "快递信息",
      };
      const dlgFormConfig = editDlgFormCols(mType);
      this.editFormConfig = {
        ...this.editFormConfig,
				successFunction: (res) => {
          editSuccessFn && editSuccessFn(res);
          this.msgSuccess("保存成功");
          this.$refs.editDialogRef.hide();
        },
        formRules: dlgFormConfig.formRules,
        lists: dlgFormConfig.columns,
      };
      this.$refs.editDialogRef.show();
		}
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    TooltipOver: () => import("_comp/TooltipOver"),
    ComDialog: () => import("_comp/ComDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
</style>
