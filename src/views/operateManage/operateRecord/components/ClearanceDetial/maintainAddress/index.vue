<template>
  <ComCustomDialog
    ref="customDialogRef"
    :slotDlgFormIds="['titleTxtLabel', 'tableSlot']"
  >
    <template v-slot:titleTxtLabel="slotProps">
      <div class="label-txt">{{ slotProps.fieldItem.label }}</div>
    </template>
    <template v-slot:tableSlot>
      <ComTable
        :tableHeight="tableAutoHeight"
        :columnConfig="tableConfig.columnConfig"
        :columnData="tableConfig.columnData"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="['wmsCode'].includes(slotProps.prop)">
            <AutoComplete
              :formModel="slotProps.row"
              :fieldItem="slotProps.column.fieldItem"
            />
          </template>
        </template>
      </ComTable>
    </template>
  </ComCustomDialog>
</template>

<script>
import {
  getOrderTransportationGoods,
  putOrderGoodsAddress,
} from "@/api/performance/record.js";
import { addressDialogCols, tableAddressColumns } from "./model";
export default {
  data() {
    return {
      tableConfig: {
        columnData: [],
      },
    };
  },
  methods: {
    async editShow(row, { editSuccess }) {
      const { itemList, ...rData } = (
        await getOrderTransportationGoods(row.operationOrderId, row.importType)
      ).data;
      this.tableConfig = {
        columnData: itemList || [],
        columnConfig: tableAddressColumns({
          ...rData,
          customerId: row.customerId,
          countryId: row.countryId,
        }),
      };
      let wmsObj = {};
      if (rData.freightType === 1) {
        // LCL一个收货地，FCL多个收货地
        const { wmsCode, wmsName, wmsSonId } = itemList[0] || {};
        wmsObj = { wmsCode, wmsName, wmsSonId };
      }
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: addressDialogCols({
          ...rData,
          customerId: row.customerId,
          countryId: row.countryId,
        }),
        formModel: {
          ...rData,
          ...wmsObj,
          titleTxt: " ",
        },
        confirmCheckFunction: (callBack) => {
          if (rData.freightType === 0) {
            const rIndex = this.tableConfig.columnData.findIndex(
              (e) => !e.wmsSonId
            );
            if (rIndex > -1) {
              return this.msgError(`序号${rIndex + 1}行，请选择收货地`);
            }
          }
          callBack && callBack();
        },
        httpRequest: (param) => {
          const opt = this.tableConfig.columnData.map((e) => {
            return {
              toogId: e.toogId,
              wmsSonId: rData.freightType === 1 ? param.wmsSonId : e.wmsSonId,
            };
          });
          const params = {
            operationOrderId: row.operationOrderId,
            addressList: opt,
            importType: row.importType,
          };
          return putOrderGoodsAddress(params);
        },
        successFunction: () => {
          this.msgSuccess("保存成功");
          editSuccess && editSuccess();
        },
      });
    },
  },
  computed: {
    tableAutoHeight() {
      const tableLen = this.tableConfig.columnData.length;
      return tableLen > 5 ? `${6 * 39 + 54}px` : undefined;
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.label-txt {
  color: #515151;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
}
</style>
