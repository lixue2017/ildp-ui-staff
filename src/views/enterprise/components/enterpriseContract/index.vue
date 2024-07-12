<template>
  <div>
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { customDialogCols } from "./model.js";
import {
  postAddContacts,
  putEditContacts,
} from "@/api/customerManage/customerList.js";

export default {
  props: {
    fileData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  data() {
    return {};
  },
  methods: {
    handleCustomDialog(row = {}, obj) {
      // console.log('fileData==', this.fileData)
      const { successFn } = obj || {};
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: customDialogCols(),
        formModel: {
          customerId: this.fileData.id,
          ...row,
          extensionYear: this.typeConversion(row.extensionYear) || "0",
          startCreateTime: row.contractStartTime
            ? [row.contractStartTime, row.contractEndTime]
            : [],
        },
        httpRequest: (param) => {
          const {
            startCreateTime,
            extensionYear,
            customerId,
            attachId,
            remark,
            contractNumber,
            id,
          } = param || {};
          // console.log('param==', startCreateTime, nParam)
          const [contractStartTime, contractEndTime] = startCreateTime;
          const opt = {
            customerId,
            attachId,
            remark,
            contractNumber,
            contractEndTime,
            contractStartTime,
            extensionYear: Number(extensionYear),
          };
          if (!row.id) {
            // 新增
            return postAddContacts(opt);
          } else {
            // 编辑
            return putEditContacts({
              ...opt,
              id,
            });
          }
        },
        successFunction: () => {
          successFn && successFn();
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
