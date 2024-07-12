<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchTabForm(tab.name)"
              @searchHeight="getSearchHeight"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            />
          </keep-alive>
          <keep-alive>
            <ComTable
              :ref="`tableConfig${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :httpRequest="tableConfig.httpRequest"
              :columnConfig="tableConfig.columnConfig[tab.name]"
              :getQueryParams="() => tableConfig.getQueryParams(tab.name)"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'operationOrderNum'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row)"
                  >
                    {{ slotProps.row.operationOrderNum }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'isBookingSpace'">
                  <span>
                    {{ slotProps.row.isBookingSpace === 0 ? "否" : "是" }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'isHomeDelivery'">
                  <span>
                    {{ slotProps.row.isHomeDelivery === 0 ? "否" : "是" }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'orderStatus'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'operation'">
                  <MoreBtn
                    :data="slotProps.row"
                    @handleSuccess="keepTableList"
                    v-if="
                      [2, 3, 4, 5, 6, 7].includes(
                        slotProps.row.operationOrderStatus
                      )
                    "
                  />
                  <span v-else>--</span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { getOperationList } from "@/api/operateManage/common";
import { FullscreenLoading } from "@/utils/loading.js";
import { mapActions, mapState } from "vuex";
import {
  searchColumns,
  tableColumns,
  ecTableColumns,
  tdTableColumns,
} from "./model";
export default {
  name: "AirTransOperate",
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    MoreBtn: () => import("../components/MoreBtn"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      fullscreenLoading: new FullscreenLoading(),
      dataRouteType: [],
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.keepTableList(false);
          });
        },
        tabs: [
          {
            label: "空运操作单",
            name: "1",
          },
          {
            label: "电商头程",
            name: "2",
          },
          {
            label: "传统操作单",
            name: "3",
          },
        ],
      },
      searchFromData: {
        1: {
          operationOrderType: 1,
        },
        2: {
          operationOrderType: 1,
          orderType: 2,
        },
        3: {
          operationOrderType: 1,
          orderType: 3,
        },
      },
      showSearchForm: false,
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        size: "small",
        labelWidth: "92px",
        searchNum: searchColumns.length,
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getOperationList,
        columnConfig: {
          1: tableColumns,
          2: ecTableColumns,
          3: tdTableColumns,
        },
        getQueryParams: this.getQueryParams,
      },
      addVisible: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("operateList").then(() => {
      this.showSearchForm = true;
    });
  },
  activated() {
    this.keepTableList(false);
  },

  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchHeight(height) {
      this.tableConfig.tableHeight = `calc(100vh - ${height + 210}px)`;
    },
    getSearchList(searchFrom = {}) {
      this.searchFromData[+this.tabsConfig.activeName] = {
        operationOrderType:
          this.searchFromData[+this.tabsConfig.activeName].operationOrderType,
        orderType: this.searchFromData[+this.tabsConfig.activeName].orderType,
        ...searchFrom,
        statusSearch:
          searchFrom.statusSearch && searchFrom.statusSearch.join(","),
        tradeClauseSearch:
          searchFrom.tradeClauseSearch &&
          searchFrom.tradeClauseSearch.join(","),
        orderBusinessTypeSearch:
          searchFrom.orderBusinessTypeSearch &&
          searchFrom.orderBusinessTypeSearch.join(","),
        beginTime: searchFrom.beginTime && searchFrom.beginTime.join("@"),
      };
      this.$refs[`tableConfig${+this.tabsConfig.activeName}`][0].refreshTable(
        true
      );
    },
    getQueryParams(key) {
      return {
        ...this.searchFromData[key],
        isDataFil: 1,
      };
    },
    handleView(row) {
      const list =
        this.$refs[`tableConfig${+this.tabsConfig.activeName}`][0].tableData;
      localStorage.setItem("airTransList", JSON.stringify(list));
      this.$router.push(`/operateManage/airTransDetails?id=${row.orderId}`);
    },
    keepTableList(isRefreshPage = true) {
      const { activeName } = this.tabsConfig;
      this.$refs[`tableConfig${activeName}`] &&
        this.$refs[`tableConfig${activeName}`][0]?.refreshKeepTable(
          isRefreshPage,
          activeName
        );
    },
    searchTabForm(tName) {
      return {
        ...this.searchFormConfig,
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols:
                      tName !== "1"
                        ? searchColumns
                        : searchColumns.filter((e) => e.id !== "freightType"), // 空运不显示装箱方式
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
      };
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-form {
  padding-right: 30px;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
.historical-records {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .historical-records-title {
    font-size: 16px;
    margin-right: 21px;
    color: #1f1f1f;
  }

  .historical-records-sub {
    color: #666;

    i {
      margin-right: 10px;
    }
  }
}
</style>
