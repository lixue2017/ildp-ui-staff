<template>
  <ComDialog
    ref="batchDlgRef"
    :customDialog="editDialogConfig"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <ComTable
        v-if="$refs.batchDlgRef && $refs.batchDlgRef.dialogVisible"
        ref="tableRef"
        :tableHeight="tableAutoHeight"
        :columnConfig="tableBatchColumn(batchObj.typeIn)"
        :columnData="tableColumnData"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'locationSlot'">
            <AutoComplete
              :formModel="slotProps.row"
              :fieldItem="slotProps.column.fieldItem"
              :additionalParam="{
                warehouseId: batchObj.warehouseId,
                // typeIn: batchObj.typeIn,
              }"
            />
          </template>
        </template>
      </ComTable>
    </template>
  </ComDialog>
</template>

<script>
import { mapActions } from "vuex";
import {
  postLocationBatchPushShelf,
  postTransferBatchPushShelf,
} from "@/api/warehouse/manage";
import { tableBatchColumn } from "./model";

export default {
  data() {
    return {
      tableBatchColumn,
      editDialogConfig: {
        width: "905px",
        title: "",
        useFooter: "footer",
        footer: [
          {
            text: this.overseaLangObj.qr_confirm() || "确定",
            type: "primary",
            handleClick: () => {
              this.handleSave();
            },
          },
          {
            text: this.overseaLangObj.qx_cancel() || "取消",
            plain: true,
            handleClick: () => {
              this.$refs.batchDlgRef.handleClose();
            },
          },
        ],
      },
      tableColumnData: [],
      batchObj: {},
    };
  },
  methods: {
    show(list, obj) {
      this.tableColumnData = list;
      this.batchObj = obj;
      this.editDialogConfig.title = `${this.overseaLangObj.put_away() || '上架'}(${
        obj.typeIn === "4" ? this.overseaLangObj.large_cargo_transit : this.overseaLangObj.cc_storage
      })`;
      this.$refs.batchDlgRef.show();
    },
    handleSave() {
      const rIdx = this.tableColumnData.findIndex((e) => !e.locationId);
      if (rIdx > -1) {
        return this.msgError(`序号${rIdx + 1}行请选择上架库位`);
      }
      const { typeIn, successFn } = this.batchObj;
      let checkList = [];
      let errList = [];
      const opt = this.tableColumnData.map((ele, i) => {
        if (!checkList.includes(ele.locationId)) {
          checkList.push(ele.locationId);
        } else {
          errList.push(i + 1);
        }
        let param = {
          locationId: ele.locationId,
        };
        if (typeIn === "4") {
          // 大货中转
          // param.wtblrIds = ele.wtblrIds;
					param.trayId = ele.trayId;
        } else {
          // 存仓上架
          param.trayInfoParamList = [{ traySn: ele.traySn }];
        }
        return param;
      });
      if (checkList.length !== this.tableColumnData.length) {
        return this.msgError(
          `第${errList.join(", ")}行上架库位重复，请重新选择上架库位`
        );
      }
      const httpSave =
        typeIn === "4"
          ? postTransferBatchPushShelf
          : postLocationBatchPushShelf;
      httpSave(opt).then(() => {
        successFn && successFn();
        this.$refs.batchDlgRef.hide();
      });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["warehousePartitionType"]);
  },
  computed: {
    tableAutoHeight() {
      const tableLen = this.tableColumnData.length;
      return tableLen > 8 ? `${9 * 39 + 54}px` : undefined;
    },
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComDialog: () => import("_comp/ComDialog"),
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
