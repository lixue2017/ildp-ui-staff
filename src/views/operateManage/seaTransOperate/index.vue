<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="tabsConfig.activeName === tab.name && showSearchForm"
            >
              <template v-slot:form-submit>
                <ComColumnConf :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :httpRequest="tableConfig.httpRequest"
              :columnConfig="tableMixinConfig(tab.name)"
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
                    @handleSuccess="mixinkeepTable"
                    v-if="
                      [2, 3, 4, 5, 6].includes(
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
import { DateCompute } from "@/utils/index.js";
import { getOperationList, updateOperation } from "@/api/operateManage/common";
import { FullscreenLoading } from "@/utils/loading.js";
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  searchColumns,
  tableColumns,
  ecTableColumns,
  tdTableColumns,
} from "./model";
export default {
  name: "SeaTransOperate",
  mixins: [mixinColsConf],
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
        handleTabsClick: this.initMixinColumnConf,
        tabs: [
          {
            label: "全部海运单",
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
          operationOrderType: 0,
        },
        2: {
          operationOrderType: 0,
          orderType: 2,
        },
        3: {
          operationOrderType: 0,
          orderType: 3,
        },
      },
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
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 247px)",
        httpRequest: getOperationList,
        getQueryParams: this.getQueryParams,
      },
      mixinTableColArr: [tableColumns, ecTableColumns, tdTableColumns],
      addVisible: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("operateList").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
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
      this.$refs[`tableRef${+this.tabsConfig.activeName}`][0].refreshTable();
    },
    getQueryParams(key) {
      return {
        ...this.searchFromData[key],
        isDataFil: 1,
      };
    },
    handleView(row) {
      const idList =
        this.$refs[`tableRef${this.tabsConfig.activeName}`][0].tableData.map((e) => e.id);
      this.$router.push({
        path: "/operateManage/seaTransDetails",
        query: {
          id: row.id, // 操作单ID
          backPath: this.$route.fullPath,
          pageSign: idList.join(','), // 详情显示上一页/下一页
        }
      })
    },
    handleUpdate(row, status) {
      // console.log(row);
      // console.log(status);
      const { id, bookingPeople, cusService, salesAssistant } = row;
      updateOperation({
        id,
        bookingPeople,
        cusService,
        salesAssistant,
        operationOrderStatus: status,
      }).then(() => {
        row.operationOrderStatus = status;
      });
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
