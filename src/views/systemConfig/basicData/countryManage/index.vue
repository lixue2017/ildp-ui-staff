<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="consigneeTable.tableHeight"
              :columnConfig="consigneeTable.columnConfig"
              :httpRequest="consigneeTable.httpRequest"
              :getQueryParams="consigneeTable.getQueryParams"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'clearanceInformation'">
                  <div>✓VAT</div>
                  <div>✓EORI</div>
                </template>
                <template v-if="slotProps.prop === 'status'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          dataStatus[slotProps.row.status] &&
                          dataStatus[slotProps.row.status].color,
                      }"
                    ></i>
                    {{
                      dataStatus[slotProps.row.status] &&
                      dataStatus[slotProps.row.status].label
                    }}
                  </span>
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
import { getCountryList } from "@/api/basicData";
import { DATA_STATUS } from "@/utils/mixin.js";
import { searchColumns, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name:"CountryManage",
  mixins: [mixinColsConf],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
  },
  data() {
    return {
      dataStatus: DATA_STATUS,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "国家信息",
            name: "1",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getCountryList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        // expansion: false,
        size: "small",
        labelWidth: "85px",
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
      consigneeTable: {
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: (query) => getCountryList(query, true),
        columnConfig: tableColumns,
      },
      addVisible: false,
    };
  },
  created() {
    this.activeName = `tabs${this.tabsConfig.activeName}`;
    this.showSearchForm = true;
  },
  mounted() {},
  methods: {
    getCountryList(searchFrom = {}) {
      this.searchFromData = { ...searchFrom };
      this.searchFromData.beginTime &&
        (this.searchFromData.beginTime =
          this.searchFromData.beginTime.join("@"));
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return this.searchFromData;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.operation-content {
  .btn {
    display: flex;

    .operate-icon {
      display: flex;
      align-items: center;
      margin-right: 14px;

      &.operate-icon-info {
        color: #606060;
      }

      /deep/ span {
        font-size: 12px;
      }
    }
  }
}
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
