<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableConfig.columnConfig"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
            >
              <!-- :pagination="false" -->
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'code'">
                  <span
                    class="primary-text-btn"
                    @click="handleUpdate(slotProps.row, 'view')"
                    >{{ slotProps.row.code }}</span
                  >
                </template>
                <template v-if="slotProps.prop === 'level'">
                  <span v-if="slotProps.row.level === 0" style="color: "
                    >①</span
                  >
                  <span v-else-if="slotProps.row.level === 1">②</span>
                  <span v-else-if="slotProps.row.level === 2">③</span>
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
import { getNodeList } from "@/api/trajectory/index";
import { getTraditionListAll } from "@/api/trandition/index"; //传统订单
import { mapActions, mapState } from "vuex";
import { tableColumns, searchLists } from "./model";
import { DateCompute } from "@/utils/index.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "NodeInfo",
  mixins: [mixinColsConf],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
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
            label: "轨迹基础信息",
            name: "1",
          },
        ],
      },
      searchFromData: {
        // 1: { orderType: 3 },
        2: { orderType: 3 },
        3: { orderType: 4 },
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        size: "small",
        labelWidth: "110px",
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
        httpRequest: getNodeList,
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
    };
  },
  created() {
    this["dictionary/getDictionary"]("nodeInfoTypeEn").then((res) => {
      this.showSearchForm = true;
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
    getList(searchFrom = {}) {
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchFrom,
        beginTime: searchFrom.beginTime && searchFrom.beginTime[0],
        endTime:
          searchFrom.beginTime && DateCompute(searchFrom.beginTime[1], 1),
        dataStatus: searchFrom.dataStatus && searchFrom.dataStatus.join(","),
        types: searchFrom.types && searchFrom.types.join(","),
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tab) {
      return this.searchFromData[tab];
    },
    handleCopy(row) {
      console.log("复制");
      console.log(row);
    },
    handleDelete(row) {
      console.log("删除");
      console.log(row);
    },
    handleUpdate(rows) {
      this.$router.push({
        path: "/trajectory/DetailNodeInfo",
        query: {
          // id: row.id,
          backPath: this.$route.fullPath,
          // pageSign: idList.join(',')
        },
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
</style>
