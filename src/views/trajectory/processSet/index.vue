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
              :currentNode="treeConfig.currentNode"
              :searchConfig="treeConfig.searchConfig"
              :rgWidth="0"
              :className="'tree-basic-archives'"
              v-if="showSearchForm"
            >
              <template v-slot:default>
                <ComForm
                  ref="mySearchForm"
                  :formConfig="searchFormConfig"
                  v-if="showSearchForm && tabsConfig.activeName === tab.name"
                />
                <keep-alive v-if="mixinShowTable">
                  <ComTable
                    :ref="`tableRef${tab.name}`"
                    v-if="tabsConfig.activeName === tab.name"
                    :tableHeight="tableConfig.tableHeight"
                    :columnConfig="tableConfig.columnConfig"
                    :httpRequest="tableConfig.httpRequest"
                    :getQueryParams="() => getQueryParams()"
                  >
                    <template v-slot:customRow="{ slotProps }">
                      <template v-if="slotProps.prop === 'code'">
                        <span
                          class="primary-text-btn"
                          @click="handleUpdate(slotProps.row, 'view')"
                          >{{ slotProps.row.code }}</span
                        >
                      </template>
                      <template v-if="slotProps.prop === 'operation'">
                        <div class="operation-content">
                          <div
                            class="btn"
                            v-for="(item, index) in tableConfig.statusList"
                            :key="index"
                          >
                            <el-button
                              class="operate-icon"
                              size="mini"
                              type="text"
                            >
                              {{ item.text }}
                            </el-button>
                          </div>
                        </div>
                      </template>
                    </template>
                  </ComTable>
                </keep-alive>
              </template>
              <template v-slot:treeFooter>
                <my-pagination
                  :page="treeStart"
                  :limit="treePaginationConfig.limit"
                  :total="treeTotal"
                  :small="true"
                  v-if="!!treeTotal"
                  className="small-paging"
                  :layout="treePaginationConfig.layout"
                  @pagination="handlePagination"
                />
              </template>
            </ComTree>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { DateCompute } from "@/utils/index.js";
import { getFlowList, getLinkList } from "@/api/trajectory/index";
import { getTraditionListAll } from "@/api/trandition/index"; //传统订单
import {
  getBasicDataList,
  getBasicArchivesTreeList,
  addOperateDataType,
  updateOperateDataType,
  delOperateDataType,
  addOperateData,
  updateOperateData,
  delOperateData,
} from "@/api/operationalData";
import { mapActions, mapState } from "vuex";
import { tableColumns, searchLists } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "ProcessSet",
  mixins: [mixinColsConf],
  components: {
    ComTree: () => import("_comp/ComTree"),
    ComDialog: () => import("_comp/ComDialog"),
    MyPagination: () => import("_comp/ComTable/MyPagination"),
  },
  // computed: {
  //   ...mapState(["dictionary"]),
  // },
  data() {
    return {
      treeData: [],
      treeStart: 1,
      treeTotal: 0,
      treePaginationConfig: {
        limit: 20,
        layout: "total, prev, jumper, next",
      },
      treeNameCn: "",
      dataStatus: [
        {
          label: "草稿",
          value: 0,
          color: "#FAAD14",
        },
        {
          label: "已预报",
          value: 1,
          color: "#52C41A",
        },
      ],
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: this.handleTabsClick,
        tabs: [
          {
            label: "轨迹设置",
            name: "1",
          },
        ],
        // btnArr: [
        //   {
        //     table: "创建",
        //     // handleClick: () => this.handleUpdate(),
        //   },
        // ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        // fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getBasicDataList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        size: "small",
        labelWidth: "85px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchLists,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        columnConfig: tableColumns,
        getQueryParams: this.getQueryParams,
        httpRequest: (query) => {
          const { currentNode } = this.treeConfig;
          if (!query.flowId) {
            query.flowId = currentNode;
          }
          return getLinkList(query, true);
        },
        statusList: [
          {
            text: "发DRAFT",
            type: "",
            // handleClick: (row) => this.handleUpdate(row, "editStatus"),
          },
          {
            text: "修改",
            type: "",
            // handleClick: (row) => this.handleUpdate(row, "editStatus"),
          },
          {
            text: "删除",
            type: "",
            // handleClick: (row) => this.handleUpdate(row, "editStatus"),
          },
        ],
      },
      treeConfig: {
        nodeKey: "id",
        defaultProps: {
          children: "children",
          label: "name",
        },
        treeData: [],
        searchConfig: {
          show: true,
          handleSearch: (row) => {
            this.getFlowList({ nameCn: row });
          },
        },
        currentNode: undefined,
      },
      showSearchForm: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]([
      "trueOrFalse",
      "orderStatus",
      "nodeType",
    ]).then(() => {
      this.getFlowList();
    });
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleCommand(cb, row) {
      cb && cb(row);
    },
    handleTabsClick() {
      this.mixinkeepTable();
    },
    getBasicDataList(searchFrom = {}) {
      const { flowId } = this.searchFromData;
      const { createTime, ...obj } = searchFrom;
      this.searchFromData = {
        ...obj,
        beginTime: createTime && createTime[0],
        endTime: createTime && createTime[1],
        flowId,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      //初始化
      // return this.searchFromData.flowId?this.searchFromData:{flowId:1}
      return this.searchFromData;
    },
    handlePagination(row = {}) {
      this.getFlowList(row);
    },
    handleCopy(row) {
      console.log("复制");
      console.log(row);
    },
    handleDelete(row) {
      console.log("删除");
      console.log(row);
    },
    handleTreeClick(data) {
      this.searchFromData = {
        flowId: data.id || "",
      };
      this.$refs.mySearchForm[0].resetForm();
    },
    getFlowList(row = {}) {
      //左侧树的请求接口，暂无新轨迹树查询接口替换
      console.log("nameCn", nameCn);
      const {
        nameCn,
        limit = this.treePaginationConfig.limit,
        page = this.treeStart,
      } = row;
      this.treeConfig.treeData = [];
      this.treeNameCn = nameCn;
      getFlowList({
        name: nameCn,
        pageNum: page,
        pageSize: limit || 999,
      }).then((res) => {
        this.treeTotal = res.total || 0;
        const treeData = res.rows.map((item) => {
          return {
            id: item.id,
            name: item.name,
            type: item.type,
          };
        });
        this.treeConfig = {
          ...this.treeConfig,
          treeData,
          currentNode: res.rows[0].id,
        };
        console.log("this.treeConfig", this.treeConfig);
        this.showSearchForm = true;
      });
    },
    handleUpdate() {
      this.$router.push("/trajectory/detailProcessSet");
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  /deep/ {
    .tree-basic-archives {
      .el-tree-node__content {
        height: 34px !important;
      }
    }
  }
  .small-paging {
    padding: 15px 10px 20px;
  }
  .white-space-nowrap {
    white-space: nowrap;
  }
  .operation-header {
    // padding: 0 20px;
    span {
      &:nth-child(1) {
        width: 40%;
      }
      &:nth-child(2) {
        width: 60%;
      }
      display: inline-block;
      text-align: center;
    }
  }
  .operation-content {
    // padding: 0 20px;
    display: flex;
    .operate-status {
      span {
        &:nth-child(1) {
          width: 40%;
        }
        &:nth-child(2) {
          width: 60%;
        }
        display: inline-block;
        text-align: center;
      }
    }
    .btn {
      display: flex;
      justify-content: flex-end;
      margin-top: 7px;
      .btn-list {
        display: flex;
      }
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
  /deep/.table-class {
    .el-tooltip {
      color: #5094ff;
    }
  }
}
</style>
