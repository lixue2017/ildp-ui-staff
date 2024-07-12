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
                    :tableHeight="categoryTable.tableHeight"
                    :columnConfig="categoryTable.columnConfig"
                    :httpRequest="categoryTable.httpRequest"
                    :getQueryParams="categoryTable.getQueryParams"
                  >
                    <template v-slot:customRow="{ slotProps }">
                      <template v-if="slotProps.prop === 'status'">
                        <span>
                          <i
                            class="status-dot"
                            :style="{
                              backgroundColor:
                                dataStatus[slotProps.row.status].color,
                            }"
                          ></i>
                          {{ dataStatus[slotProps.row.status].label }}
                        </span>
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
import { getCategoryList, getCategoryTree } from "@/api/basicData";

import { searchColumns, tableColumns, DATA_STATUS } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "CategoryManage",
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
            label: "品类信息",
            name: "1",
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getCategoryList(formModel);
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
      categoryTable: {
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: (query) => getCategoryList(query, true),
        columnConfig: tableColumns,
      },
      addVisible: false,
      treeConfig: {
        nodeKey: "code",
        defaultProps: {
          children: "baseGoodsInfoList",
          label: "nameCn",
        },
        treeData: [],
      },
    };
  },
  created() {
    this.activeName = `tabs${this.tabsConfig.activeName}`;
    this.showSearchForm = true;
    this.getCategoryTree();
  },
  mounted() {},
  methods: {
    getCategoryTree() {
      getCategoryTree().then((res) => {
        this.treeConfig.treeData = [
          {
            code: 0,
            nameCn: "全部",
            baseGoodsInfoList: [...(res.data || [])],
          },
        ];
      });
    },
    getCategoryList(searchFrom = {}) {
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
      let codeStr = [data.code];
      if (data.baseGoodsInfoList && Array.isArray(data.baseGoodsInfoList)) {
        data.baseGoodsInfoList.forEach((item) => {
          item.code && codeStr.push(item.code);
        });
      }
      this.searchFromData = {
        parentCodeStr: codeStr.join(","),
      };
      this.$refs.mySearchForm[0].resetForm();
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
