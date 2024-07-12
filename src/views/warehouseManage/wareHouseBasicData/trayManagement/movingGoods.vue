<template>
  <ComCustomDialog ref="customDialogRef" :slotDlgFormIds="['tableSlot']">
    <template v-slot:tableSlot>
      <div class="tip-txt">*如不选择托盘号，则默认移动到新托盘上</div>
      <div class="base-flex-between" style="padding: 12px 0 5px">
        <div></div>
        <div>
          <el-button plain size="small" @click="handleNumReset"
            >数量重置</el-button
          >
          <el-button type="primary" size="small" @click="handleNumClear"
            >数量清零</el-button
          >
        </div>
      </div>
      <ComTable
        ref="yTableRef"
        :tableHeight="tableAutoHeight"
        :columnConfig="tableConfig.columnConfig"
        :columnData="tableConfig.columnData"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="['movingNum'].includes(slotProps.prop)">
            <el-input-number
              size="mini"
              v-model="slotProps.row['movingNum']"
              v-input-number-limit="slotProps.column.decimal"
              :placeholder="slotProps.column.label"
              :controls="false"
              :min="0"
              :max="slotProps.row['optNum']"
            />
          </template>
        </template>
      </ComTable>
    </template>
  </ComCustomDialog>
</template>

<script>
import {
  getWarehouseTrayGoods,
  postTrayMovingGoods,
} from "@/api/warehouse/basic";
import { movingDlgFormCols, tableMovingColumns } from "./model";
export default {
  data() {
    return {
      tableConfig: {
        columnConfig: tableMovingColumns(),
        columnData: [],
      },
    };
  },
  methods: {
    async editShow(row, { editSuccess }) {
      const { goodsList, ...rData } = (await getWarehouseTrayGoods(row.id))
        .data;
      // console.log("托盘==", goodsList);
      this.tableConfig.columnData = (goodsList || []).map((e) => ({
        ...e,
        tempMovingNum: e.movingNum,
      }));
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: movingDlgFormCols(rData.trayId),
        formModel: {
          ...rData,
        },
        httpRequest: (param) => {
          const { newTrayId, remark } = param;
          const opt = {
            newTrayId: newTrayId || -1,
            remark,
            oldTrayId: rData.trayId,
            movingGoodsInfoParamList: this.tableConfig.columnData
              .filter((e) => e.movingNum)
              .map((ele) => ({
                storageId: ele.storageId,
                movingNum: ele.movingNum,
              })),
          };
          // console.log("param==", param, opt);
          return postTrayMovingGoods(opt);
        },
        successFunction: () => {
          this.msgSuccess("保存成功");
          editSuccess && editSuccess();
        },
      });
    },
    handleNumReset() {
      this.tableConfig.columnData.forEach((e) => {
        e.movingNum = e.tempMovingNum;
      });
      this.$refs.yTableRef?.setNewTableData(this.tableConfig.columnData);
    },
    handleNumClear() {
      this.tableConfig.columnData.forEach((e) => {
        e.movingNum = 0;
      });
      this.$refs.yTableRef?.setNewTableData(this.tableConfig.columnData);
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
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tip-txt {
  text-align: right;
  color: #5094ff;
  margin-top: -20px;
}
</style>
