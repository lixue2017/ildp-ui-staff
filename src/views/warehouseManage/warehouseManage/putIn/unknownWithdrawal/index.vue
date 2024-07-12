<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchTabForm()"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="tabsConfig.activeName === tab.name"
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableTabConfig()"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              :isMountedRequest="false"
              :rowOperationBtnListFn="(r) => tableStatusList(r)"
              @handleTableView="(r) => handleDetails(r)"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="getWarehouseTableMixin" />
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  getUnKnownReturnList,
  putUnKnownReturnSubmit,
  delUnKnownReturnList,
} from "@/api/warehouse/manage";
import { customMessageBox } from "@/utils/confirmBox.js";
import { searchColumns, tableColumns } from "./model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "UnknownWithdrawal",
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "未知客户退仓",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => this.handleAddOrEdit(),
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        labelWidth: "80px",
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        },
        searchForm: true,
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getUnKnownReturnList,
      },
      tableBtnList: [
        {
          text: "提交",
          btnStatus: [0],
          handleClick: (r) => {
            putUnKnownReturnSubmit([r.id]).then(() => {
              this.msgSuccess("提交成功");
              this.mixinkeepTable();
            });
          },
        },
        {
          text: "编辑",
          btnStatus: [0],
          handleClick: (r) => this.handleAddOrEdit(r),
        },
        {
          text: "删除",
          color: "#FF6767",
          btnStatus: [0],
          handleClick: (r) => this.handleDelete(r),
        },
        // {
        //   text: "收货",
        //   btnStatus: [2],
        //   handleClick: (r) => {
        //     this.$router.push({
        //       path: "/warehouseManage/inStorage/predictionReceiving",
        //       query: {
        //         type: "2",
        //         search: r.trackSn,
        //       },
        //     });
        //   },
        // },
      ],
    };
  },
  methods: {
    handleAddOrEdit(row) {
      const { id } = row || {};
      this.$router.push({
        path: "/warehouseManage/putIn/unknownCustomerEdit",
        query: {
          id,
          warehouseId: !id ? this.curWarehouseObj.value : undefined,
          backPath: this.$route.path,
        },
      });
    },
    handleDetails(row) {
      const idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?.tableData.map((e) => e.id);
      this.$router.push({
        path: "/warehouseManage/putIn/withdrawalDetails",
        query: {
          id: row?.id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleDelete(row) {
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delUnKnownReturnList([row.id]),
        },
        () => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable();
        }
      );
    },
    getTableList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      const [warehousingTimeGe, warehousingTimeLe] = createTime || [];
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        warehousingTimeGe,
        warehousingTimeLe,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
        wmsId: this.curWarehouseObj.value,
      };
    },
    searchTabForm() {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(),
      };
    },
    tableStatusList(row) {
      return this.tableBtnList.filter((e) => e.btnStatus.includes(row.state));
    },
    tableTabConfig() {
      return tableColumns();
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["claimOrderState"]).then(() => {
      this.showSearchForm = true;
    });
  },
  components: {
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
