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
              :rowOperationBtnListFn="getStatusList"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'code'">
                  <span
                    class="primary-text-btn"
                    @click="handleUpdate(slotProps.row, 'view')"
                    >{{ slotProps.row.code }}</span
                  >
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <AddEditDialog ref="dialog" @handleSuccess="handleSuccess" />
    <releaseDialog ref="releaseGoods" @handleSuccess="handleReleaseSuccess" />
  </div>
</template>

<script>
import { getTraditionListAll } from "@/api/trandition/index"; //传统订单
import { mapActions, mapState } from "vuex";
import { deletePopDetain } from "@/api/operateRecord/DOCManage";
import { tableColumns, searchLists } from "./model";
import { getDetainList } from "@/api/operateRecord/DOCManage";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "DOCManage",
  mixins: [mixinColsConf],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    AddEditDialog: () => import("./components/AddEditDialog"),
    releaseDialog: () =>
      import(
        "@/views/operateManage/operateRecord/DOCManage/components/releaseDialog/index.vue"
      ),
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
        handleTabsClick: () => {},
        tabs: [
          {
            label: "扣货信息",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "创建",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => this.handleUpdate({}, "add"),
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
        httpRequest: getDetainList,
        // httpRequest: getTraditionListAll,
        statusList: [
          {
            text: "放货",
            type: "",
            handleClick: (row) => {
              this.handleUpdate(row, "Doc");
            },
            // handleClick: (row) => this.handleUpdate(row, "editStatus"),
          },
          {
            text: "修改",
            type: "edit",
            handleClick: (row) => {
              this.handleUpdate(row, "editStatus");
            },
          },
          {
            text: "删除",
            type: "",
            color:"#FF6767",
            handleClick: (row) => this.handleUpdate(row, "delete"),
          },
        ],
      },
    };
  },
  created() {
    this["dictionary/getDictionary"]("DocTypeEn").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    // getSearchHeight(height) {
    //   this.tableConfig.tableHeight = `calc(100vh - ${height + 211}px)`;
    // },
    handleCommand(cb, row) {
      cb && cb(row);
    },
    getList(searchFrom = {}) {
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchFrom,
        beginTime: searchFrom.beginTime && searchFrom.beginTime.join("@"),
        dataStatus: searchFrom.dataStatus && searchFrom.dataStatus.join(","),
        stateList: searchFrom.stateList && searchFrom.stateList.join(","),
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tab) {
      return this.searchFromData[tab];
    },
    handleDelete(row) {
      console.log("删除");
      console.log(row);
    },
    getStatusList(row) {
      const { status } = row;
      if (status != 1) {
        return this.tableConfig.statusList;
      } else {
        return [];
      }
    },
    handleUpdate(rows, type) {
      if (/add|edit/.test(type)) {
        this.$refs.dialog.show(rows, type);
      } else if (type === "view") {
				this.$router.push({
					path: "/operateManage/operateRecord/DOCManageDetails",
					query: {
						operateId: rows.operationOrderId,
						backPath: this.$route.path,
					},
				});
      } else if (type === "delete") {
        deletePopDetain(rows.id).then((res) => {
          this.mixinkeepTable();
        });
      } else if (type === "Doc") {
        this.$refs.releaseGoods.show(rows, type);
      }
    },
    handleSuccess() {
      this.mixinkeepTable();
    },
    handleReleaseSuccess() {
      this.mixinkeepTable();
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
