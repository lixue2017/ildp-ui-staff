<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig" v-if="tabsConfig.activeName">
      <template v-for="(tab, index) in stateSearchSumList(1)">
        <el-tab-pane
          :label="tab.nameCn"
          :name="`${tab.countType}`"
          :key="`${tab.countType}`"
        >
          <template slot="label">
            <TabItem :sItem="tab" :handleRightClick="handleRightClick" />
            <template v-if="index === stateSearchSumList(1).length - 1">
              <SearchDropdown
                v-if="tabsConfig.searchTabShow === tabsConfig.activeName"
                :curCustomSearch="curCustomSearch"
                :searchFormData="mixinSearchFormData"
                :stateSearchHideList="stateSearchSumList(2)"
                :stateSearchVal="tab.id"
                tabName="1"
                @onDropdownChangeState="
                  (r) => handleStateChangeSearch(r, false)
                "
                @onClearCurSearch="
                  () => {
                    curCustomSearch = {};
                  }
                "
              />
            </template>
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
              :httpRequest="
                (params) => getDsSortBoxOrder(params, tab.countType)
              "
              :getQueryParams="() => getQueryParams(tab.countType)"
              :span-method="handleSpanMethod"
              @handleChange="handleChange"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'table_xx_27'">
                  <template v-if="slotProps.row.sortBoxId">
                    <div>{{ slotProps.row.wholeCabinetSn || "--" }}</div>
                    <div>{{ slotProps.row.presentTime || "--" }}</div>
                    <div>
                      {{ slotProps.row.startPortName || "--" }}/{{
                        slotProps.row.endPortName || "--"
                      }}
                    </div>
                  </template>
                  <FormSingle
                    :formData="slotProps.row"
                    :fieldItem="{
                      id: 'operationRemark',
                      placeholder: '操作备注',
                      type: 'text',
                    }"
                    @handleChange="handleChange"
                    v-else
                  />
                </template>
                <template v-if="slotProps.prop === 'table_xx_28'">
                  <div>{{ slotProps.row.soNo || "--" }}</div>
                  <div>柜号：{{ slotProps.row.ontainerSno || "--" }}</div>
                  <div>封条：{{ slotProps.row.sealingStripSno || "--" }}</div>
                  <div>SI：{{ slotProps.row.SI || "--" }}</div>
                  <div>CV：{{ slotProps.row.cv || "--" }}</div>
                </template>
                <template v-if="slotProps.prop === 'table_xx_29'">
                  <div>
                    {{ slotProps.row.declareCusName || "--" }}
                    {{ slotProps.row.declareReleaseTime || "--" }}
                  </div>
                  <div>{{ slotProps.row.shipCustomerName || "--" }}</div>
                  <div>
                    {{ slotProps.row.shipName || "--" }}/{{
                      slotProps.row.shipNumber || "--"
                    }}
                  </div>
                </template>

                <template
                  v-if="
                    ['operationRemark', 'routeManageName'].includes(
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
                      id: slotProps.column.fieldItem.id || slotProps.prop,
                      ...slotProps.column.fieldItem,
                    }"
                    size="small"
                    @handleChange="
                      (val) =>
                        handleChange(
                          val,
                          slotProps.column.fieldItem.id || slotProps.prop,
                          slotProps.row
                        )
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
    <Popover
      :config="{
        cVisible,
        contextMenuY,
        contextMenuX,
        tabState,
        stateSearchList,
      }"
      :handleDefaultState="handleDefaultState"
      :handleHideState="handleHideState"
    />
  </div>
</template>

<script>
import {
  getDsSortBoxPage,
  getDsSortBoxFclOrLclPage,
  exportDsSortBoxOrder,
  exportDsSortBoxOrderFclOrLcl,
  updateOperationRouteManage,
} from "@/api/operateManage/ecTrackingTable.js";
import { editOperationRemark } from "@/api/operateManage/common";
import { mapActions, mapState } from "vuex";
import {
  searchConfig,
  tableColumns_DPG,
  tableColumns_PG,
  tableColumns_FCL,
} from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { mixinConfSearch } from "_comp/ComColumnConf/SearchColumn/mixinConfSearch.js";
import { comFileDownload } from "@/utils/download.js";
import { getListNameEnIsSortBox } from "@/api/common";
export default {
  name: "StatementAccount",
  mixins: [mixinColsConf, mixinConfSearch],
  components: {
    TabSearchColumn: () => import("_comp/ComColumnConf/SearchColumn"),
    TabItem: () => import("_comp/ComColumnConf/SearchColumn/TabItem"),
    Popover: () => import("_comp/ComColumnConf/SearchColumn/Popover"),
    TooltipOver: () => import("_comp/TooltipOver"),
    FormSingle: () => import("_comp/ComTable/FormSingle"),
    SearchDropdown: () =>
      import("_comp/ComColumnConf/SearchColumn/SearchDropdown"),
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
      },
      mergeObj: {},
      mixinTableColArr: {
        439: tableColumns_DPG(),
        449: tableColumns_PG,
        459: tableColumns_PG,
        469: tableColumns_PG,
        479: tableColumns_PG,
        489: tableColumns_PG,
        499: tableColumns_FCL,
        509: tableColumns_FCL,
      },
      mergeObj: {}, // 合并行
      routeList: [],
      routeObj: {},
      currSelect: "",
    };
  },
  created() {
    this.tabsConfig.btnArr = [
      {
        table: "导出",
        icon: "iconfont daochu",
        handleClick: this.handleExport,
      },
    ];
    Promise.all([
      this["dictionary/getDictionary"](["dsSortBoxStatus"]),
      getListNameEnIsSortBox(),
    ]).then(([_, routeRes]) => {
      const { data } = routeRes;
      const list = [];
      this.routeList = (data || []).map(({ id, name }) => {
        list.push({
          value: id,
          nameCn: name,
        });
        this.routeObj[id] = name;
        return {
          value: name,
          label: name,
        };
      });
      this.mixinTableColArr[439] = tableColumns_DPG(list);
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getDsSortBoxOrder(params, countType) {
      this.mergeObj = {};
      const httpReq = [500, 510].includes(countType)
        ? getDsSortBoxFclOrLclPage
        : getDsSortBoxPage;
      return new Promise((resolve, reject) => {
        httpReq(params)
          .then((res) => {
            if ([450, 460, 470, 480, 490].includes(countType)) {
              const { rows } = res;
              if (rows && rows.length) {
                const mergeObj = {};
                rows.forEach(({ sortBoxId }, index) => {
                  if (sortBoxId) {
                    if (!mergeObj[sortBoxId])
                      mergeObj[sortBoxId] = { index, num: 0 };
                    mergeObj[sortBoxId].num += 1;
                  }
                });
                this.mergeObj = mergeObj;
              }
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
      const { createTime, webAllSearchFormData, ...searchObj } = searchFrom;
      const [startCreateTime, endCreateTime] = createTime || [];
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        startCreateTime,
        endCreateTime,
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
      };
    },
    handleSpanMethod({ row, column, rowIndex, columnIndex }) {
      const { property } = column;
      const obj = row.sortBoxId && this.mergeObj[row.sortBoxId];
      if (["table_xx_27", "table_xx_28", "table_xx_29"].includes(property)) {
        if (obj && obj.num > 1) {
          const { index, num } = obj;
          if (rowIndex === index) {
            return {
              rowspan: num,
              colspan: 1,
            };
          }
          return {
            rowspan: 0,
            colspan: 0,
          };
        } else if (!obj) {
          if (property === "table_xx_27") {
            return {
              rowspan: 1,
              colspan: 3,
            };
          }
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
      if (type === "routeManageId") {
        updateOperationRouteManage({
          id: row.id,
          routeManageId: row.routeManageId,
        }).then(() => {
          row.routeManageName = this.routeObj[e];
          const { routeManageName } =
            this.searchFromData[this.tabsConfig.activeName] || {};
          if (routeManageName) {
            this.mixinkeepTable(true);
          }
          this.handleRouteStateCount();
          this.currSelect = "";
        });
      } else if (type === "operationRemark") {
        editOperationRemark({
          id: row.id,
          operationRemark: row.operationRemark,
        }).then(() => {
          this.currSelect = "";
        });
      }
    },
    handleExport() {
      const { activeName } = this.tabsConfig;
      const params = {
        ...this.getQueryParams(activeName),
      };
      if (["500", "510"].includes(activeName)) {
        comFileDownload(this, exportDsSortBoxOrderFclOrLcl, params);
      } else {
        comFileDownload(this, exportDsSortBoxOrder, params);
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ {
  .tableData .el-table--border td.border-right-td {
    border-right: 1px solid #e2e2e2;
  }
  .tableData .el-table--border td.border-left-td {
    border-left: 1px solid #e2e2e2;
  }
  .com-tabs .el-tabs__item {
    padding: 6px;
  }
  .padding_0 {
    padding: 0;
  }
  .search-dropdown {
    position: absolute;
    right: -180px;
    bottom: 0px;
  }
  .el-table {
    .table-header-cell.header-red,
    .el-input .el-input__inner {
      color: #ff6767;
    }
    .el-select .el-input .el-input__inner {
      color: #515151;
    }
  }
}
.custom_tooltip {
  cursor: pointer;
  line-height: 49px;
}
</style>
