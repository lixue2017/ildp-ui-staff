<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchTabForm"
              :formConfig="searchFormConfig"
              v-if="showSearchForm"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              :rowOperationBtnListFn="(row) => getBtnLists(row)"
              v-if="tabsConfig.activeName == tab.name && showSearchForm"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <CurrentWhereWarehouse @setCurWarehouse="getWarehouseTableMixin" />
      </template>
    </ComTabs>
    <ReturnGoodsDialog
      ref="returnGoodsDialogRef"
      @handleSuccess="mixinkeepTable(true)"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { searchForm, tableColumns } from "./model.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import curWarehouseMixin from "@/views/warehouseManage/components/currentWarehouse/mixin";
import {
  getReturnGoodsGetList,
  PUTReturnGoodsOver,
  getReturnGoodsPintById
} from "@/api/warehouse/manage.js";
import { getStreamFileDownload } from "@/utils/zipdownload";
import { msgBox } from "@/utils/confirmBox.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "ReturnGoods",
  mixins: [curWarehouseMixin, mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "还货信息",
            name: "1",
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        labelWidth: "95px",
        lists: searchForm,
      },
      tableConfig: {
        tableHeight: "calc(100vh - 320px)",
        columnConfig: tableColumns,
        httpRequest: getReturnGoodsGetList,
      },
      showSearchForm: false,
      searchFromData: {},
      statusList: [
        {
          text: "还货",
          showStatus: [10],
          handleClick: (row) => {
            this.handleReturnGoods(row);
          },
        },
        {
          text: "打印还货单",
          showStatus: [20,30],
          handleClick: (row) => {
            this.handlePrint(row);
          },
        },
        {
          text: "还货完成",
          showStatus: [20],
          handleClick: (row) => {
            this.handleReturnGoodsOver(row);
          },
        },
      ],
    };
  },
  mounted() {},
  created() {
    this["dictionary/getDictionary"]([
      "returnGoodsStatus",
      "labelingBusinessType",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchList(searchFrom = {}) {
      const { cancelTime, returnTime, ...searchObj } = searchFrom;
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchObj,
        startReturnTime: returnTime && returnTime[0],
        endReturnTime: returnTime && returnTime[1],
        startCancelTime: cancelTime && cancelTime[0],
        endCancelTime: cancelTime && cancelTime[1],
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const { activeName } = this.tabsConfig;
      const { value = undefined } = this.curWarehouseObj;
      console.log("value", value);
      return {
        ...this.searchFromData[activeName],
        warehouseId: value,
        ...this.mixinSearchConfParams,
      };
    },
    handleWarehouseTableMixin(row = {}, type) {
      const { warehouseMainId } = row;
      this.curWarehouseObj = {
        ...row,
      };
      this.tabsConfig.searchColumnParams = {
        warehouseId: warehouseMainId,
      };
      if (type == "WEB_HANDLESET") {
        this.mixinkeepTable(true, {
          isTableSearch: true,
        });
      }
    },
    getBtnLists(row) {
      const { status } = row;
      const arr = this.statusList.filter((e) => e.showStatus.includes(status));
      return arr;
    },
    handleReturnGoods(row = {}) {
      const { value: warehouseId } = this.curWarehouseObj;
      this.$refs.returnGoodsDialogRef?.show({ ...row, warehouseId });
    },
    handlePrint(row) {
      const { id } = row;
      comFileDownload(this, getReturnGoodsPintById, id);
    },
    handleReturnGoodsOver(row) {
      const { id } = row;
      const title = "确认提示";
      const className = "el-icon-warning text-warning";
      const msg = "完成还货操作不可逆！";
      msgBox(this, { title, className, msg, showCancelButton: true }, () => {
        PUTReturnGoodsOver(id).then((res) => {
          this.mixinkeepTable(true);
        });
      });
    },
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    CurrentWhereWarehouse: () =>
      import("@/views/warehouseManage/components/currentWarehouse"),
    ReturnGoodsDialog: () => import("./components/dialog"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
</script>

<style lang="scss" scoped></style>
