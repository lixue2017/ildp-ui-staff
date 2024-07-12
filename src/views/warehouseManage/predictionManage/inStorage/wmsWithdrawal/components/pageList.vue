<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig" v-if="showSearchForm">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig(tab.name)"
              @searchHeight="searchHeight"
              v-if="tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="
                    (cols) =>
                      setColumnMixinConf(cols, {
                        mountedNoRequest: ['tc_warehouse'].includes(pageType),
                      })
                  "
                /> </template
            ></ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="httpTableRequest(tab.name)"
              :getQueryParams="() => tableQueryParams(tab.name)"
              :extraConfig="{ multiline: tab.name === '1' }"
              :setColumnParams="mixinColumnSetParams"
              :isMountedRequest="['tc_order', 'tc_operate'].includes(pageType)"
              :selectionRow="selectionRowEvt"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="(r) => tableStatusList(r, tab.name)"
              @handleTableView="(r, col) => handleDetails(r, col)"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight v-if="['tc_warehouse'].includes(pageType)">
        <CurrentWhereWarehouse
          v-if="mixinInitTableCols"
          @setCurWarehouse="getWarehouseTableMixin"
        />
      </template>
    </ComTabs>

    <ComCustomDialog ref="mCustomDialogRef" />
  </div>
</template>

<script>
import {
  getReturnWmsOrderList,
  getReturnWmsPackageList,
  putReturnWmsOrderRepulse,
} from "@/api/warehouse/process";
// import { comSaveRepeatedRequest } from "@/api/common";
import { mapActions, mapState } from "vuex";
import { searchColumns, tableColumns, packageTableColumns } from "../model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinWmsListDetails } from "./mixinListDetails.js";
import { remarkDialogCols } from "_comp/ConfirmDialog/customFormDialog/model.js";
import { duplicateRemoval } from "@/utils/index";

export default {
  mixins: [curWarehouseMixin, mixinColsConf, mixinWmsListDetails],
  props: {
    pageType: {
      type: String,
      default: () => "",
    },
    withdrawalTableConfig: {
      type: Object,
      default: () => ({
        filterState: ["0", "11"], // 过滤字典词草稿与打回
      }),
    },
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.initMixinColumnConf();
        },
        tabs: [
          {
            label: "WMS退仓入库",
            name: "1",
          },
        ],
        btnArr: [],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (searchVal) => {
          return new Promise((resolve) => {
            this.getSearchList(searchVal);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        searchColsHeight: true,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "123px" : "85px",
      },
      searchState: {},
      tableBtnList: [
        {
          text: "接单",
          viewType: ["tc_order"],
          btnStatus: [1],
          handleClick: (row) => {
            this.handleWmsMixinReceiving(row, () => {
              this.mixinkeepTable();
            });
          },
        },
        {
          text: "打回",
          color: "#FF6767",
          viewType: ["tc_order"],
          btnStatus: [1],
          handleClick: (row) => this.handleRepulse(row),
        },
        {
          text: "收货",
          viewType: ["tc_warehouse"],
          btnStatus: [2],
          btnShowTabs: ["2"],
          handleClick: (r) => this.handleReceivingPage(r.trackSn),
        },
      ],
      selectionRows: [],
      mixinTableColArr: [tableColumns(this.pageType), packageTableColumns()],
    };
  },
  methods: {
    handleRepulse({ id }) {
      this.$refs.mCustomDialogRef?.showCustomDialog({
        customFormConfig: remarkDialogCols({ maxlength: 200 }),
        httpRequest: ({ remark }) =>
          putReturnWmsOrderRepulse({
            id,
            repulseRemark: remark,
          }),
        successFunction: () => this.mixinkeepTable(),
      });
    },
    getSearchList(searchFrom) {
      const { beginTime, ...searchObj } = searchFrom || {};
      const [createTimeGe, createTimeLe] = beginTime || [];
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        createTimeGe,
        createTimeLe,
      };
      this.mixinkeepTable(true);
    },
    httpTableRequest(tName) {
      return [getReturnWmsOrderList, getReturnWmsPackageList][tName - 1];
    },
    tableQueryParams(tName) {
      let { stateList, ...nSearchFrom } = this.searchFromData[tName] || {};
      const powerObj = {
        tc_order: 1,
        tc_operate: 2,
      };
      const { stateList: paramsStateList } = this.searchFromData;
      if (paramsStateList) {
        !this.searchFromData[tName] && (this.searchFromData[tName] = {});
        this.searchFromData[tName].stateList = paramsStateList;
        stateList = paramsStateList;
        delete this.searchFromData.stateList;
      }
      return {
        ...nSearchFrom,
        stateList: stateList?.length
          ? stateList
          : this.searchState[tName] || [],
        wmsId: ["tc_warehouse"].includes(this.pageType)
          ? this.curWarehouseObj.value
          : nSearchFrom.wmsId,
        power: powerObj[this.pageType], // 权限
      };
    },
    handleDetails(row, col) {
      const { activeName } = this.tabsConfig;
      if (activeName === "2" && col.prop === "orderSn") {
        // 包裹的退仓单号
        const rowIds = this.$refs[`tableRef${activeName}`][0].tableData.map(
          (e) => e.rwoId
        );
        this.handleView({
          path: "/warehouseManage/inStorage/wmsWithdrawalDetails",
          id: row.rwoId,
          pageSign: duplicateRemoval(rowIds).join(","),
        });
        return;
      }
      const pathObj = {
        tc_operate:
          "/operateManage/overSeaWarehouse/wmsWithdrawalOperateDetails", // 操作单
        tc_warehouse: `/warehouseManage/inStorage/${
          activeName === "1"
            ? "wmsWithdrawalDetails"
            : "wmsWithdrawalPackageDetails"
        }`, // 海外仓入库预报
        tc_order:
          "/newOrderManage/overseaWarehousing/wmsWithdrawalOrderDetails", // 订单
      };
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (r) => r.id
      );
      this.handleView({
        path: pathObj[this.pageType],
        id: row.id,
        pageSign: idList.join(","), // 详情显示上一页/下一页
      });
    },
    handleView({ path, ...query }) {
      this.$router.push({
        path,
        query: {
          ...query,
          backPath: this.$route.path,
        },
      });
    },
    handleReceivingPage(search) {
      this.$router.push({
        path: "/warehouseManage/inStorage/predictionReceiving",
        query: {
          type: this.tabsConfig.activeName,
          search,
        },
      });
    },
    getSearchFormConfig(tName) {
      return {
        ...this.searchFormConfig,
        residueCols: tName === "1" ? [2] : null,
        lists: searchColumns(this.pageType, tName), // 表单渲染列表
      };
    },
    onTableSelectionChange(rows) {
      // this.selectionRows = (rows || []).filter((e) =>
      //   [2].includes(e.orderState)
      // );
      // this.$refs[
      //   `tableRef${this.tabsConfig.activeName}`
      // ][0]?._toggleRowSelectionMixin({
      //   newCheckRows: this.selectionRows,
      // });
    },
    selectionRowEvt(row) {
      // if (![2].includes(row.orderState)) {
      //   return false;
      // }
      return true;
    },
    tableStatusList(row, tName) {
      return this.tableBtnList.filter(
        (e) =>
          e.viewType.includes(this.pageType) &&
          e.btnStatus.includes(row.state) &&
          (e.btnShowTabs ? e.btnShowTabs.includes(tName) && row.trackSn : true)
      );
    },
  },
  created() {
    if (["tc_warehouse"].includes(this.pageType)) {
      this.tabsConfig.tabs.push({
        label: "WMS退仓包裹",
        name: "2",
      });
      this.tabsConfig.btnArr = [
        {
          table: "收 货",
          handleClick: () => this.handleReceivingPage(),
        },
      ];
    }
    this["dictionary/getDictionary"]([
      "returnWmsOrderState",
      "returnType",
      "returnWmsOrderPackageState",
    ]).then(() => {
      const { filterState = [] } = this.withdrawalTableConfig;
      this.searchState["1"] = this.dictWmsOrderState
        .map((e) => e.value)
        .filter((v) => !filterState.includes(v));
      this.searchState["2"] = this.dictWmsPackageState
        .map((e) => e.value)
        .filter((v) => !["0", "1", "11"].includes(v)); // 海外退仓包裹
      this.showSearchForm = true;
    });
  },
  watch: {
    "selectionRows.length"(sLen) {
      // this.$set(this.tabsConfig.btnArr[0], "disabled", !sLen);
    },
  },
  computed: {
    ...mapState({
      dictWmsOrderState: (state) =>
        state.dictionary.dicsData.returnWmsOrderState,
      dictWmsPackageState: (state) =>
        state.dictionary.dicsData.returnWmsOrderPackageState,
    }),
  },
  components: {
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
