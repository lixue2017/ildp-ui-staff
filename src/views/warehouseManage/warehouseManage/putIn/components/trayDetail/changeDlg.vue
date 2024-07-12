<template>
  <ComCustomDialog ref="customDialogRef" :slotDlgFormIds="['tableSlot']">
    <template v-slot:tableSlot>
      <ComTable
        ref="tableRef"
        :tableHeight="tableAutoHeight"
        :columnConfig="tableNumDialogCols()"
        :columnData="tableColumnData"
      />
    </template>
  </ComCustomDialog>
</template>

<script>
import {
  getStorageSameBatchGoods,
  postStorageSameBatchGoods,
} from "@/api/warehouse/manage";
import { tableNumDialogCols, customDialogCols } from "./model";

export default {
  data() {
    return {
      tableNumDialogCols,
      tableColumnData: [],
    };
  },
  methods: {
    async twsShow(row, { successFn }) {
      this.tableColumnData =
        (await getStorageSameBatchGoods(row.storageId)).data || [];

      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: customDialogCols(),
        httpRequest: (params) => {
          const { shipmentId, targetWmsId } = params;
          return postStorageSameBatchGoods({
            shipmentId,
            targetWmsId,
            twsId: row.storageId,
          });
        },
        successFunction: () => {
          successFn && successFn();
        },
      });
    },
  },
  computed: {
    tableAutoHeight() {
      const tableLen = this.tableColumnData.length;
      return tableLen > 8 ? `${9 * 39 + 54}px` : undefined;
    },
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
