<template>
  <CustomDialog ref="confirmDlgRef" />
</template>

<script>
import {
  orderRelated,
  overseaOrderRelated,
} from "@/api/enquiryManage/customerQuotation";
import { relatedQuotationConfig } from "./model";
export default {
  props: {
    orderType: {
      // 海外其他订单传订单类型
      type: Number,
      default: undefined,
    },
  },
  components: {
    CustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  methods: {
    show(row) {
      const {
        id,
        freightType,
        transportMode,
        operationOrderId,
        orderType,
        customerId,
        shippingMode,
      } = row;
      this.$refs.confirmDlgRef?.showCustomDialog({
        formModel: {
          quotationSheetId: "",
        },
        httpRequest: (opt) => {
          if (!this.orderType) {
            // 电商、传统订单
            const { quotationSheetId } = opt;
            return orderRelated({ operationOrderId, quotationSheetId });
          } else {
            // 海外其他订单
            const { quotationSheetId } = opt;
            return overseaOrderRelated({
              orderId: id,
              quotationSheetId,
              orderType: this.orderType,
            });
          }
        },
        successFunction: () => {
          this.$emit("handleSuccess");
        },
        customFormConfig: relatedQuotationConfig({
          quotedPriceStateEq: 7,
          packingModeEq: freightType,
          shippingModeEq:
            shippingMode || orderType === 2
              ? [1, 2][transportMode === 3 ? 1 : 0]
              : [1, 2][orderType - 3],
          customerIdEq: customerId,
          inquirySheetType: this.orderType ? 2 : undefined, // 海外其他订单过滤询价单类型为国内
        }),
      });
    },
  },
};
</script>
