<template>
  <!-- 列表发送draft -->
  <ComDialog
    ref="customDialog"
    :customDialog="customDialogConfig"
    class="airline-dialog"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
      >
      </ComForm>
    </template>
  </ComDialog>
</template>


<script>
import { mapState } from "vuex";
import { orderReceivingConfirmForm } from "./model.js";
import {
  operateSubmitGather,
  operateById,
} from "@/api/order/firstTransport.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  // props: {
  //   appendToBody: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      customDialogConfig: {
        title: "操作接单",
        width: "500px",
        dataStatus: 0,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "确 认",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: this.hide,
          },
        ],
        type: "",
      },
      formConfig: {
        formModel: {},
        httpRequest: this.editPopBill, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "85px",
        lists: orderReceivingConfirmForm.lists, // 表单渲染列表
        formRules: orderReceivingConfirmForm.formRules, // 表单校验规则
      },
      paramsData: {},
    };
  },
  created() {},
  mounted() {},
  methods: {
    hide() {
      this.$refs.customDialog.hide();
    },
    show(row, type, orderType = undefined) {
      this.paramsData = row;
			this.formConfig.formModel = {
				id: row.id,
				orderType: orderType !== undefined ? orderType : row.orderType
			}
      this.$refs.customDialog.show();
    },
		/** 操作单批量接单 */
		handleBatchFormDialog({
			formModel,
			httpRequest,
			successFunction
		}) {
			this.formConfig = {
				...this.formConfig,
				formModel,
				httpRequest,
				successFunction: () => {
          this.$refs.customDialog.hide();
          successFunction && successFunction();
        },
			}
      this.$refs.customDialog.show();
    },
    editPopBill(form) {
      //确认
      const { id, state } = form;
      const { operationRemark } = this.paramsData;
      let obj = {
        auditRemark: form.remark,
        operationRemark: operationRemark || "",
      };
      const { isOperation } = this.paramsData;
      if (isOperation == 1) {
        return operateById(id, state, obj);
      } else {
        return operateSubmitGather(form.orderType, form.id, form.state, obj); // 订单操作提单
      }
    },
    handleSuccess(res = {}) {
      this.$emit("handleSuccess", res.data);
      this.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
