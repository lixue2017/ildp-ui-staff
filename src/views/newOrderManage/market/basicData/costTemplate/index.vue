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
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="mixinTableColArr[tab.name - 1]"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getTableQueryParams"
              :rowOperationBtnListFn="() => tableConfig.statusBtnList"
              @handleTableView="(r) => handleDetails(r, '0')"
            />
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import {
  getCostTempList,
  delCostTempList,
} from "@/api/settlementManage/feeSet";
import { mapActions, mapState } from "vuex";
import { customMessageBox } from "@/utils/confirmBox.js";
import { searchColumns, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";

export default {
  name: "CostTemplate",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "费用模板",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            showTabName: "1",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => this.handleDetails({}),
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
        // fold: true,
        labelWidth: "85px",
        searchColsHeight: true,
      },
      tableConfig: {
        httpRequest: getCostTempList,
        statusBtnList: [
          {
            text: "编辑",
            showStatus: [0],
            handleClick: (row) => this.handleDetails(row),
          },
          {
            text: "删除",
            color: "#FF6767",
            showStatus: [0],
            handleClick: this.handleDelete,
          },
        ],
      },
      mixinTableColArr: [tableColumns("1")],
    };
  },
  created() {
    // this["dictionary/getDictionary"](["status"]).then(() => {
    this.showSearchForm = true;
    // });
  },
  methods: {
    handleDetails({ id }, pType = "1") {
      let query = {
        id,
        pageType: pType,
        backPath: this.$route.path,
      };
      if (pType === "0") {
        // 查看详情
        const idList = this.$refs[
          `tableRef${this.tabsConfig.activeName}`
        ][0].tableData.map((e) => e.id);
        query.pageSign = idList.join(","); // 详情显示上一页/下一页
      }
      this.$router.push({
        path: `/newOrderManage/market/editCostTemplate`,
        query,
      });
    },
    handleDelete(row) {
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delCostTempList(row.id),
        },
        () => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable();
        }
      );
    },
    getTableList(searchFrom = {}) {
      this.searchFromData = {
        ...searchFrom,
      };
      this.mixinkeepTable(true);
    },
    setSearchFormConf() {
      return {
        ...this.searchFormConfig,
        lists: searchColumns(), // 表单渲染列表
      };
    },
    getTableQueryParams() {
      return {
        business: 1,
        ...this.searchFromData,
      };
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
