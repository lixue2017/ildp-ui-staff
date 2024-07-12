<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig(tab.name)"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:locationId="slotProps">
                <AutoComplete
                  ref="agentRef"
                  :formModel="slotProps.formModel"
                  :fieldItem="slotProps.fieldItem"
                  :additionalParam="{
                    warehouseId: curWarehouseObj.value,
                  }"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${48 + extraHeight + formHeight}px)`"
              :columnConfig="tableConfig.columnConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
              :rowOperationBtnListFn="(r) => tableStatusList(r)"
              :isMountedRequest="false"
              @handleTableView="(r) => handleChangeRoute(r, tab.name)"
            >
              <template v-slot:bottomTotal>
                <div class="grand-total">
                  <template v-for="(tItem, i) in tableSubtotal">
                    <span :key="`t_${i}`">
                      <span>{{ tItem.totalLabel }}：</span>
                      <span>{{ tItem.totalNum }}</span>
                    </span>
                  </template>
                </div>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="changeCurWarehouseTable" />
      </template>
    </ComTabs>
    <ComCustomDialog
      ref="customDialogRef"
      :slotDlgFormIds="['targetLocationId', 'tableSlot']"
    >
      <template v-slot:targetLocationId="slotProps">
        <AutoComplete
          ref="autoSelectRef"
          :formModel="slotProps.formModel"
          :fieldItem="slotProps.fieldItem"
          :additionalParam="{
            warehouseId: curWarehouseObj.value,
            dataStatus: 0, // 可用
            filterIds: slotProps.formModel.locationId,
          }"
        />
      </template>
      <template v-slot:tableSlot>
        <template>
          <div>* 托盘上存在以下货物</div>
          <ComTable
            :columnConfig="tableGoodsConfig.columnConfig"
            :columnData="tableGoodsConfig.columnData"
          />
        </template>
      </template>
    </ComCustomDialog>
  </div>
</template>

<script>
import {
  getBatchStockLogList,
  postMoveLocation,
  postAdjustStock,
  exportBatchInventory,
  getBatchStockPageSum,
} from "@/api/goodsShelf/batchInventory";
import { getTrayIdGoods } from "@/api/warehouse/prediction";
import { mapActions } from "vuex";
import {
  searchColumns,
  tableColumns,
  inventoryAdjustmentCols,
  relocationCols,
} from "./model";
import { tableTrayMovingColumns } from "@/views/warehouseManage/predictionManage/inStorage/components/bindingTray/model.js";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "BatchInventory",
  components: {
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        // handleTabsClick: this.initMixinColumnConf,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.mixinkeepTable();
            this.handleWarehouseStockTotal();
          });
        },
        tabs: [
          {
            label: this.overseaLangObj.sku_pc_kc || "SKU批次库存",
            name: "1",
          },
          {
            label: this.overseaLangObj.ax_pc_kc,
            name: "2",
          },
        ],
        btnArr: [
          {
            table: this.overseaLangObj.dc_export("导出"),
            icon: "iconfont daochu",
            handleClick: () => {
              comFileDownload(
                this,
                exportBatchInventory,
                this.getQueryParams(this.tabsConfig.activeName)
              );
            },
          },
        ],
      },
      searchFromData: {
        1: {},
        2: {},
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        searchColsHeight: true,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "118px" : "95px",
      },
      tableConfig: {
        httpRequest: getBatchStockLogList,
        columnConfig: tableColumns,
        statusBtnList: [
          {
            text: this.overseaLangObj.tz_kc || "调库存",
            handleClick: (row) => {
              getTrayIdGoods(row.trayId).then((tRes) => {
                const { goodsList } = tRes.data || {};
                this.tableGoodsConfig.columnData = goodsList || [];
                this.handleInventoryAdjustment(row);
              });
            },
          },
          {
            text: this.overseaLangObj.yd_kw || "移库位",
            handleClick: (row) => this.handleRelocation(row),
          },
        ],
      },
      tableGoodsConfig: {
        columnConfig: tableTrayMovingColumns(),
        columnData: [],
      },
      mixinTableColArr: [tableColumns("1"), tableColumns("2")],
      tableSubtotal: [],
    };
  },
  created() {
    const { stockId, tName = "1" } = this.$route.query;
    this.tabsConfig.activeName = tName;
    this.searchFromData[tName] = this.searchFormConfig.formModel = {
      stockId,
    };
    this["dictionary/getDictionary"]([
      "pickingFreightType",
      "warehousingSource",
      "stockAdjustReason",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    changeCurWarehouseTable(curObj) {
      this.getWarehouseTableMixin(curObj);
      this.handleWarehouseStockTotal();
      this.$refs.agentRef && this.$refs.agentRef[0]?.changeFocusRequest();
    },
    handleWarehouseStockTotal() {
      const tOpt = this.getQueryParams(this.tabsConfig.activeName);
      getBatchStockPageSum(tOpt).then((res) => {
        this.tableSubtotal = [
          {
            totalLabel: this.overseaLangObj.dq_kc_zs || "当前库存总数",
            totalNum: res.data?.surplusNumSum || 0,
          },
        ];
      });
    },
    getSearchFormConfig(tName) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(tName),
      };
    },
    getList(searchFrom = {}) {
      const { activeName } = this.tabsConfig;
      const { createTime, orderTypes, isZero, ...searchObj } = searchFrom;
      this.searchFromData[activeName] = {
        ...searchObj,
        orderTypes: orderTypes && orderTypes.join(","),
        pushBeginTime: createTime && createTime[0],
        pushEndTime: createTime && createTime[1],
        isZero: isZero && isZero[0],
      };
      this.keepTableListMixin(true);
      this.handleWarehouseStockTotal();
    },
    handleChangeRoute(row, tName) {
      const { storageId, traySn } = row;
      this.$router.push({
        path: "/warehouseManage/goodsShelfManage/batchLog",
        query: {
          storageId,
          traySn,
          tName,
        },
      });
    },
    handleInventoryAdjustment(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: inventoryAdjustmentCols(),
        formModel: { ...row },
        httpRequest: (opt) => {
          const { adjustReason, applyRemark, applyResultNum, reviewedUserId } =
            opt;
          return postAdjustStock({
            applyData: row,
            adjustReason,
            applyRemark,
            applyResultNum,
            // reviewedUserId,
            wmsId: this.curWarehouseObj.value,
            receiptType: [2, 1][this.tabsConfig.activeName - 1],
          });
        },
        successFunction: () => this.mixinkeepTable(),
      });
    },
    handleRelocation(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: relocationCols(),
        formModel: row,
        httpRequest: (opt) => {
          const { refId, targetLocationId, wriIds, remark } = opt;
          return postMoveLocation({
            refId,
            wriIds,
            targetLocationId,
            remark,
          });
        },
        successFunction: () => this.mixinkeepTable(),
      });
    },
    getQueryParams(tab) {
      return {
        ...this.searchFromData[tab],
        warehouseId: this.curWarehouseObj.value,
        receiptType: [2, 1][tab - 1],
      };
    },
    tableStatusList(row) {
      if (row.hideOptBtn) {
        return [];
      }
      return this.tableConfig.statusBtnList;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
