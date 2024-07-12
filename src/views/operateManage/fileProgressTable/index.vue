<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig" v-if="tabsConfig.activeName">
      <template v-for="tab in stateSearchSumList(1)">
        <el-tab-pane
          :label="tab.nameCn"
          :name="`${tab.countType}`"
          :key="`${tab.countType}`"
        >
          <template slot="label">
            <TabItem :sItem="tab" />
          </template>
          <keep-alive>
            <ComForm
              :formConfig="{
                ...searchFormConfig,
                ...searchConfig(tab.countType, routeList),
              }"
              v-if="showSearchForm && tabsConfig.activeName == tab.countType"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.countType)"
                  :tName="`${tab.countType}`"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.countType}`"
              v-if="tabsConfig.activeName == tab.countType && showSearchForm"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.countType)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.countType)"
              :span-method="handleSpanMethod"
            >
              <template v-slot:customRow="{ slotProps }">
                <template
                  v-if="
                    ['registerNo', 'fileRemark', 'routeManageName'].includes(
                      slotProps.prop
                    )
                  "
                >
                  <div
                    class="custom_tooltip"
                    @dblclick="
                      handleClick(`${slotProps.prop}_${slotProps.rowIndex}`)
                    "
                    v-if="
                      `${slotProps.prop}_${slotProps.rowIndex}` !== currSelect
                    "
                  >
                    <TooltipOver
                      :content="slotProps.row[slotProps.prop] || '--'"
                      :style="{ width: '100%' }"
                      refName="tooltipOverTit"
                    />
                  </div>
                  <FormSingle
                    :ref="`${slotProps.prop}_${slotProps.rowIndex}`"
                    :key="`${slotProps.prop}_${slotProps.rowIndex}`"
                    :formData="slotProps.row"
                    :fieldItem="{
                      id:
                        slotProps.column.fieldItem.id || slotProps.column.prop,
                      ...slotProps.column.fieldItem,
                    }"
                    size="small"
                    @handleChange="
                      (val) => handleChange(val, slotProps.prop, slotProps.row)
                    "
                    v-else
                  />
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
import {
  getFileProgressChartPage,
  updateFileProgressChart,
  exportFileProgressChart,
} from "@/api/operateManage/fileProgressTable.js";
import { mapActions, mapState } from "vuex";
import { searchConfig, tableColumns, tableColumnsOther } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinConfSearch } from "_comp/ComColumnConf/SearchColumn/mixinConfSearch.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
import { comFileDownload } from "@/utils/download.js";
import { getRouteGroup } from "@/api/common";
export default {
  name: "StatementAccount",
  mixins: [mixinColsConf, mixinConfSearch],
  components: {
    TabSearchColumn: () => import("_comp/ComColumnConf/SearchColumn"),
    TabItem: () => import("_comp/ComColumnConf/SearchColumn/TabItem"),
    TooltipOver: () => import("_comp/TooltipOver"),
    FormSingle: () => import("_comp/ComTable/FormSingle"),
  },
  data() {
    return {
      searchFromData: {},
      searchConfig,
      searchFormConfig: {
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        residueCols: [2],
        isGetSearchAll: true,
        expansion: false,
        labelWidth: "92px",
      },
      tableConfig: {
        tableHeight: "calc(100vh - 270px)",
        httpRequest: this.getFileProgressChartPage,
        tableColumns: {
          380: tableColumns,
          390: tableColumnsOther,
          400: tableColumnsOther,
          410: tableColumnsOther,
          420: tableColumnsOther,
          430: tableColumnsOther,
        },
      },
      mergeObj: {},
      mixinTableColArr: {
        379: tableColumns(),
        389: tableColumnsOther,
        399: tableColumnsOther,
        409: tableColumnsOther,
        419: tableColumnsOther,
        429: tableColumnsOther,
      },
      mergeColumnObj: {}, // 合并行第一行
      mergeColumnArr: [], // 合并行后面行
      currSelect: "",
      routeObj: {},
    };
  },
  created() {
    // const tabBtnArr = [
    //   {
    //     table: "导出",
    //     icon: "iconfont daochu",
    //     hasPermission: ["settlementManage:paymentReceived:export"],
    //     handleClick: this.handleExport,
    //   },
    // ];
    // const btnArr = tabBtnArr.filter((e) => {
    //   const { hasPermission } = e;
    //   return hasPermission ? hasBtnPermits(hasPermission) : true;
    // });
    this.tabsConfig.btnArr = [
      {
        table: "导出",
        icon: "iconfont daochu",
        handleClick: this.handleExport,
      },
    ];

    Promise.all([
      this["dictionary/getDictionary"]([
        "orderBusinessType",
        "bookingQueryStatus",
        "operationQueryNodeStatus",
        "reportCustomsWay",
        "headTransportMode",
        "outWarehouseWay",
      ]),
      getRouteGroup({ status: 1 }),
    ]).then(([_, routeRes]) => {
      const { rows } = routeRes;
      const list = [];
      this.routeObj = {};
      this.routeList = (rows || []).map(({ id, name }) => {
        list.push({
          value: id,
          nameCn: name,
        });
        this.routeObj[id] = name;
        return {
          value: id,
          label: name,
        };
      });
      this.mixinTableColArr[379] = tableColumns(list);
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getFileProgressChartPage(params) {
      this.mergeColumnObj = {};
      this.mergeColumnArr = [];
      return new Promise((resolve, reject) => {
        getFileProgressChartPage(params)
          .then((res) => {
            const { data } = res;
            if (data && data.length) {
              const obj = {};
              const arr = [];
              data.forEach(({ startRow, endRow }) => {
                const num = endRow - startRow + 1; // 合并行数
                obj[startRow] = num;
                for (let i = 1; i < num; i++) {
                  arr.push(startRow + i);
                }
              });
              this.mergeColumnObj = obj;
              this.mergeColumnArr = arr;
            }
            resolve(res);
          })
          .catch(() => {
            reject();
          });
      });
    },
    getList(searchFrom = {}) {
      //模糊搜索
      const { webAllSearchFormData, ...searchObj } = searchFrom;
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
      };
      this.mixinkeepTable(true, {
        isTableSearch: true,
        webAllSearchFormData,
      });
      this.handleRouteStateCount();
    },
    getQueryParams(tabName) {
      return {
        ...(this.mixinSearchConfParams || {}),
        ...(this.searchFromData[tabName] || {}),
        operationOrderType: 2,
      };
    },
    handleSpanMethod({ row, column, rowIndex, columnIndex }) {
      const { mergeColumnObj, mergeColumnArr } = this;
      const { property } = column;
      if (
        mergeColumnArr.length &&
        ["flightName", "atdTime", "etaTime"].includes(property)
      ) {
        const num = mergeColumnObj[rowIndex];
        if (num) {
          return {
            rowspan: num,
            colspan: 1,
          };
        }
        if (mergeColumnArr.includes(rowIndex)) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      return {
        rowspan: 1,
        colspan: 1,
      };
    },
    handleClick(name) {
      this.currSelect = name;
    },
    handleChange(e, type, row) {
      console.log(e, type, row);
      if (["registerNo", "routeManageName", "fileRemark"].includes(type)) {
        updateFileProgressChart({
          id: row.id,
          routeManageId: row.routeManageId,
          fileRemark: row.fileRemark,
          registerNo: row.registerNo,
        }).then(() => {
          if (type === "routeManageName") {
            row.routeManageName = this.routeObj[e];
            const { routeManageId } =
              this.searchFromData[this.tabsConfig.activeName] || {};
            if (routeManageId) {
              this.mixinkeepTable(true);
            }
            this.handleRouteStateCount();
          }
          this.currSelect = "";
        });
      }
    },
    handleExport() {
      const { activeName, tabs } = this.tabsConfig;
      const params = {
        ...this.getQueryParams(activeName),
      };
      comFileDownload(this, exportFileProgressChart, params);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ {
  .tableData .el-table--border td.border-right-td {
    border-right: 1px solid #e2e2e2;
  }
  .com-tabs .el-tabs__item {
    padding: 6px;
  }
  .padding_0 {
    padding: 0;
  }
}
.custom_tooltip {
  cursor: pointer;
  line-height: 49px;
}
</style>
