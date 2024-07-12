<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="(tab, idx) in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchTabForm(idx)"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableTabConfig(idx)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getTableQueryParams"
              :isMountedRequest="false"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="getStatusBtnList"
            >
              <!-- <template v-slot:customRow="{ slotProps }">

              </template> -->
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="getWarehouseTableMixin" />
      </template>
    </ComTabs>

    <ComCustomDialog ref="customDialogRef" />
    <MovingGoods ref="movingRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  getWarehouseTrayList,
  postWarehouseTrayAdd,
  delWarehouseTray,
  printWarehouseTray,
  getDownShippingMark,
} from "@/api/warehouse/basic";
import { customMessageBox } from "@/utils/confirmBox.js";
import { searchColumns, tableColumns, customTrayDialogCols } from "./model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { pollingDownload } from "@/utils/download.js";

export default {
  name: "TrayManagement",
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: this.overseaLangObj.pallet_number("托盘号信息"),
            name: "1",
          },
        ],
        btnArr: [
          {
            table: this.overseaLangObj.pl_print(),
            disabled: true,
            showTabName: "1",
            handleClick: () => this.handlePrint(),
          },
          {
            table: this.overseaLangObj.xz_add("添加"),
            handleClick: () => this.handleAddOrEdit(),
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "120px" : "85px",
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        searchForm: true,
        // fold: true,
      },
      selectionRows: [],
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getWarehouseTrayList,
        statusBtnList: [
          {
            text: this.overseaLangObj.dy_print("打印"),
            statusBtnArr: [0, 1],
            handleClick: (r) => this.handlePrint([r]),
          },
          {
            text: this.overseaLangObj.yc_delete("删除"),
            color: "#FF6767",
            statusBtnArr: [0],
            handleClick: (r) => this.handleDelete(r),
          },
          {
            text: this.overseaLangObj.moving_goods("移货物"),
            statusBtnArr: [1],
            handleClick: (r) => this.handleMovingGoods(r),
          },
        ],
      },
    };
  },
  methods: {
    handleAddOrEdit() {
      this.$refs.customDialogRef.showCustomDialog({
        formModel: {
          warehouseId: this.curWarehouseObj.value,
          curWarehouseName: this.curWarehouseObj.label,
        },
        customFormConfig: customTrayDialogCols(),
        httpRequest: postWarehouseTrayAdd,
        successFunction: () => this.mixinkeepTable(),
      });
    },
    handleMovingGoods(row) {
      this.$refs.movingRef?.editShow(row, {
        editSuccess: () => {
          this.mixinkeepTable();
        },
      });
    },
    handlePrint(rows) {
      const printNumList = (rows || this.selectionRows).map((e) => e.trayNum);
      pollingDownload(
        this,
        printWarehouseTray,
        { printNumList },
        getDownShippingMark
      ).then(() => {
        this.mixinTimeResetSelection();
      });
    },
    handleDelete(row) {
      customMessageBox(
        this,
        {
          msgTitle: this.overseaLangObj.ts_tip("删除提示"),
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delWarehouseTray(row.id),
        },
        () => {
          this.msgSuccess(this.overseaLangObj.cg_tip("删除成功"));
          this.mixinkeepTable();
          if (this.selectionRows.some((e) => e.id === row.id)) {
            this.onTableSelectionChange();
          }
        }
      );
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = rows;
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    getTableList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      const [startCreateTime, endCreateTime] = createTime || [];
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        startCreateTime,
        endCreateTime,
      };
      this.mixinkeepTable(true);
    },
    getTableQueryParams() {
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
        warehouseId: this.curWarehouseObj.value,
      };
    },
    searchTabForm(index) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns,
      };
    },
    tableTabConfig() {
      return tableColumns();
    },
    getStatusBtnList(row) {
      return this.tableConfig.statusBtnList.filter((e) =>
        e.statusBtnArr.includes(row.useStatus || 0)
      );
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  watch: {
    "selectionRows.length"(sLen) {
      this.$set(this.tabsConfig.btnArr[0], "disabled", !sLen);
    },
  },
  created() {
    this["dictionary/getDictionary"](["trueOrFalse"]).then(() => {
      this.showSearchForm = true;
    });
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    MovingGoods: () => import("./movingGoods.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
