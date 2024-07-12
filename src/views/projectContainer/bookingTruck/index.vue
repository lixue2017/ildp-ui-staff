<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="setSearchFormConf(tab.name)"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="setColumnMixinConf"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${
                extraHeight + formHeight + (tab.name === '1' ? 48 : 0)
              }px)`"
              :columnConfig="mixinTableColArr[tab.name - 1]"
              :setColumnParams="mixinColumnSetParams"
              :httpRequest="tableConfig.httpRequest[tab.name - 1]"
              :getQueryParams="() => getTableQueryParams(tab.name)"
              :selectionRow="selectionRowEvt"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="(r) => tableStatusList(r)"
              @handleTableView="(r) => handleDetails(r, '0')"
            >
              <template v-slot:bottomTotal>
                <div class="grand-total" v-if="tab.name === '1'">
                  <span>合计：</span>
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
    </ComTabs>
  </div>
</template>

<script>
import {
  getNotReservationCarList,
  getOrderReservationCarList,
  cancelReservationCar,
} from "@/api/order/dispatchVehicles.js";
import { mapActions, mapState } from "vuex";
import { customMessageBox, handleCopyText } from "@/utils/confirmBox.js";
import { searchColumns, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { accumulationFn } from "@/utils/instructions";

export default {
  name: "BookingTruck",
  mixins: [mixinColsConf],
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
            label: "待约车",
            name: "1",
          },
          {
            label: "已约车",
            name: "2",
          },
        ],
        btnArr: [
          {
            table: "批量约车",
            showTabName: "1",
            disabled: true,
            handleClick: () => this.handleBatch(),
          },
          {
            table: "复制约车链接",
            showTabName: "2",
            handleClick: () => {
              handleCopyText("https://h5.baosencloud.com/", this);
            },
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        labelWidth: "99px",
        residueCols: [2],
        searchColsHeight: true,
      },
      tableConfig: {
        httpRequest: [getNotReservationCarList, getOrderReservationCarList],
        statusBtnList: [
          {
            text: "编辑",
            showStatus: [0],
            handleClick: (row) => this.handleRowEdit(row),
          },
          {
            text: "取消",
            color: "#FF6767",
            showStatus: [0],
            handleClick: this.handleDelete,
          },
        ],
      },
      mixinTableColArr: [tableColumns("1"), tableColumns("2")],
      selectionRows: [],
      tableSubtotal: [],
    };
  },
  created() {
    this.calcNumTotal();
    this["dictionary/getDictionary"]([
      "headTransportMode",
      "outWarehouseWay",
      "orderReservationCarState",
      "orderReserveCarClassify",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    handleDetails({ id }, pType = "1") {},
    handleDelete(row) {
      customMessageBox(
        this,
        {
          msgTitle: "取消提示",
          msgTxt1: "取消不可逆",
          httpMsgRequest: () => cancelReservationCar({ id: row.id }),
        },
        () => {
          this.msgSuccess("取消成功");
          this.mixinkeepTable();
        }
      );
    },
    handleBatch() {
      this.$router.push({
        path: "/projectContainer/editBookingTruck",
        query: {
          orderEcIds: this.selectionRows.map((e) => e.id).join(","),
          backPath: this.$route.path,
        },
      });
    },
    handleRowEdit(r) {
      this.$router.push({
        path: "/projectContainer/editBookingTruck",
        query: {
          id: r.id,
          backPath: this.$route.path,
        },
      });
    },
    getTableList(searchFrom = {}) {
      const { beginTime, ...nSearchFrom } = searchFrom || {};
      const [startDate, endDate] = beginTime || [];
      this.searchFromData[this.tabsConfig.activeName] = {
        ...nSearchFrom,
        startDate,
        endDate,
      };
      this.mixinkeepTable(true);
    },
    setSearchFormConf(tName) {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(tName), // 表单渲染列表
      };
    },
    onTableSelectionChange(rows = []) {
      const row = rows[0] || {};
      this.selectionRows = rows.filter(
        (e) => e.transactionWarehouse === row.transactionWarehouse
      );
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    selectionRowEvt(row) {
      const rSome = this.selectionRows.some(
        (e) => e.transactionWarehouse === row.transactionWarehouse // 交货仓一致
      );
      if (this.selectionRows.length && !rSome) {
        return false;
      }
      return true;
    },
    tableStatusList(r) {
      return this.tableConfig.statusBtnList.filter((e) =>
        e.showStatus.includes(r.state)
      );
    },
    calcNumTotal() {
      const arr = this.selectionRows || [];
      this.tableSubtotal = [
        {
          totalLabel: "数据行",
          totalNum: arr.length,
        },
        {
          totalLabel: "总箱数/件数",
          totalNum: accumulationFn(arr.map((e) => e.totalQuantity)),
        },
        {
          totalLabel: "总重量(KG)",
          totalNum: accumulationFn(
            arr.map((e) => e.totalWeight),
            2
          ),
        },
        {
          totalLabel: "总方数(CBM)",
          totalNum: accumulationFn(
            arr.map((e) => e.totalVolume),
            2
          ),
        },
      ];
    },
    getTableQueryParams(tName) {
      return this.searchFromData[tName] || {};
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  watch: {
    "selectionRows.length"(sLen) {
      this.$set(this.tabsConfig.btnArr[0], "disabled", !sLen);
      this.calcNumTotal();
    },
  },
  components: {
    ComColumnConf: () => import("_comp/ComColumnConf"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
