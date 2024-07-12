<template>
  <div>
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { dlgExchangeMemoCols } from "./model";
import { postBxReceiptVerification } from "@/api/settlementManage/paymentReceived.js";

export default {
  data() {
    return {};
  },
  methods: {
    handleCustomDialog(row = {}, { successFn }) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: dlgExchangeMemoCols({
          handle: (val) => this.changeWaterBill(val),
        }),
        uploadFormConfig: {
          type: "picture-card",
          className: "card-uploader",
          limit: 5,
          accept: ".jpg,.png",
        },
        formModel: {
          payType: "0", // 应付
        },
        httpRequest: (obj) => {
          const { receiptPaymentObj, currencyName, ...param } = obj || {};
          const opt = {
            ...param,
            currencyId: receiptPaymentObj.currencyId,
            receiptPaymentAccount: receiptPaymentObj.value,
          };
          return postBxReceiptVerification(opt);
        },
        successFunction: () => {
          successFn && successFn();
        },
      });
    },
    changeWaterBill(e) {
      this.$refs.customDialogRef?.setDlgFormModel({
        currencyName: `${e.code}[${e.currencyName}]`,
      });
    },
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
</script>
