<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="(tab, idx) in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
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
              :rowOperationBtnListFn="getStatusBtnList"
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
import { pkSearchColumns, pkTableColumns } from "./model";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { getInventoryList, delInventoryPlan } from "@/api/warehouse/process";
import { customMessageBox } from "@/utils/confirmBox.js";
import { getStreamFileDownload } from "@/utils/zipdownload";

export default {
  name: "InventoryPlan",
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "排库计划",
            name: "1",
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
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getInventoryList,
      },
      tableBtnList: [
        {
          text: "预排库",
          statusBtnArr: [0, 1],
          handleClick: this.onInventoryScheduling,
        },
        {
          text: "排库信息",
          statusBtnArr: [2],
          handleClick: this.onInventoryScheduling,
        },
        {
          text: "托盘标打印",
          statusBtnArr: [0, 1, 2],
          handleClick: ({ shelvePlanId }) => {
            getStreamFileDownload(
              `/shelvePlan/exportTrayLabel`,
              {
                shelvePlanId,
              },
              {
                method: "post",
              }
            );
          },
        },
        {
          text: this.overseaLangObj.yc_delete("删除"),
          color: "#FF6767",
          statusBtnArr: [0, 1],
          handleClick: this.handleDelete,
        },
      ],
    };
  },
  methods: {
    onInventoryScheduling(row) {
      this.$router.push({
        path: "/warehouseManage/expectedReceipt",
        query: {
          planId: row.shelvePlanId,
          backPath: this.$route.fullPath,
        },
      });
    },
    handleDelete(row) {
      customMessageBox(
        this,
        {
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delInventoryPlan(row.shelvePlanId),
        },
        () => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable();
        }
      );
    },
    getTableList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
      };
      this.mixinkeepTable(true);
    },
    getTableQueryParams() {
      return {
        ...this.searchFromData[this.tabsConfig.activeName],
        rkcId: this.curWarehouseObj.value,
      };
    },
    searchTabForm() {
      return {
        ...this.searchFormConfig,
        lists: pkSearchColumns(),
      };
    },
    tableTabConfig() {
      return pkTableColumns();
    },
    getStatusBtnList(row) {
      return this.tableBtnList.filter((e) =>
        e.statusBtnArr.includes(row.state || 0)
      );
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["shelvePlanState"]).then(() => {
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
