<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComTree
              :data="treeConfig.treeData"
              :handleNodeClick="handleTreeClick"
              :defaultProps="treeConfig.defaultProps"
              :nodeKey="treeConfig.nodeKey"
              :searchConfig="treeConfig.searchConfig"
              class="tree-height"
            >
              <template v-slot:default>
                <ComForm
                  ref="mySearchForm"
                  :formConfig="searchFormConfig"
                  v-if="showSearchForm && tabsConfig.activeName === tab.name"
                >
                </ComForm>
                <keep-alive v-if="mixinShowTable">
                  <ComTable
                    :ref="`tableRef${tab.name}`"
                    v-if="tabsConfig.activeName === tab.name"
                    :tableHeight="addressTable.tableHeight"
                    :columnConfig="addressTable.columnConfig"
                    :httpRequest="addressTable.httpRequest"
                    :getQueryParams="addressTable.getQueryParams"
                  >
                    <template v-slot:customRow="{ slotProps }">
                      <template v-if="slotProps.prop === 'status'">
                        <span v-if="dataStatus[slotProps.row.status]">
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
                        <span v-else>--</span>
                      </template>
                    </template>
                  </ComTable>
                </keep-alive>
              </template>
            </ComTree>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { getAddressList, getCountryList } from "@/api/basicData";
import { searchColumns, tableColumns, DATA_STATUS, treeData } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "AddressManage",
  mixins: [mixinColsConf],
  components: {
    ComTree: () => import("_comp/ComTree"),
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
            label: "州(省)/城市(市)",
            name: "1",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getAddressList(formModel);
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
      addressTable: {
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: (query) => getAddressList(query, true),
        columnConfig: tableColumns,
      },
      treeConfig: {
        nodeKey: "id",
        defaultProps: {
          children: "children",
          label: "nameCn",
        },
        treeData: [],
        searchConfig: {
          show: true,
          handleSearch: this.getCountryList,
        },
      },
    };
  },
  created() {
    this.activeName = `tabs${this.tabsConfig.activeName}`;
    this.showSearchForm = true;
    this.getCountryList();
  },
  mounted() {},
  methods: {
    getCountryList(searchStr) {
      this.treeConfig.treeData = [];
      getCountryList({
        searchStr,
        pageNum: 1,
        pageSize: 999,
      }).then((res) => {
        res.rows.forEach((item) => {
          this.treeConfig.treeData.push({
            id: item.id,
            nameCn: `${item.twoCode}[${item.nameCn}]`,
          });
        });
      });
    },
    getAddressList(searchFrom = {}) {
      this.searchFromData = { ...this.searchFromData, ...searchFrom };
      this.searchFromData.beginTime &&
        (this.searchFromData.beginTime =
          this.searchFromData.beginTime.join("@"));
      this.searchFromData.gradeStr &&
        (this.searchFromData.gradeStr = this.searchFromData.gradeStr.join(","));
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return this.searchFromData;
    },
    handleTreeClick(data) {
      this.searchFromData = {
        countryId: data.id || "",
      };
      this.$refs.mySearchForm[0].resetForm();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tree-height {
  height: calc(100vh - 140px);
}
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
