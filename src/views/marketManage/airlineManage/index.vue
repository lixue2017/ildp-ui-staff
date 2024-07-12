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
              :tableHeight="airlineTable.tableHeight"
              :columnConfig="airlineTable.columnConfig"
              :httpRequest="airlineTable.httpRequest"
              :getQueryParams="airlineTable.getQueryParams"
              :rowOperationBtnListFn="() => airlineTable.btnArr"
              :colShowBtnFn="operationBtn"
              @handleTableView="handleDetails"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'status'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor: slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <AddDialog ref="AddDialog" @handleSuccess="mixinkeepTable" />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { getAirlineList } from "@/api/marketManage/airline";
import { mapActions, mapState } from "vuex";
import { searchColumns, tableColumns, customDialogCols } from "./model";
import {
  deleteOperateRoute,
  setRouteEnable,
  setRouteDisable,
} from "@/api/marketManage/airline.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "AirlineManage",
  mixins: [mixinColsConf],
  components: {
    AddDialog: () =>
      import("@/views/marketManage/airlineManage/components/addDialog.vue"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "航线管理",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: (rows) => {
              this.addAirLine();
            },
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getAirlineList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true, // 模糊搜索是否需要展开按钮
        // expansion: false,
        size: "small",
        labelWidth: "75px",
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
      airlineTable: {
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getAirlineList,
        columnConfig: tableColumns,
        btnArr: [
          {
            text: "修改",
            showStatus: [0],
            handleClick: (row) => {
              this.editAirLine(row);
            },
          },
          {
            text: "启用",
            showStatus: [0, 2],
            handleClick: (row) => {
              this.Enable(row);
            },
          },
          {
            text: "禁用",
            color: "#FF6767",
            showStatus: [1],
            handleClick: (row) => {
              this.disable(row);
            },
          },
          {
            text: "删除",
            color: "#FF6767",
            showStatus: [0],
            handleClick: (row) => {
              this.deleteAirLine(row);
            },
          },
        ],
      },
    };
  },
  created() {
    this["dictionary/getDictionary"]("marketManage").then((res) => {
      this.showSearchForm = true;
    });
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getAirlineList(searchFrom = {}) {
      this.searchFromData = {
        ...searchFrom,
        startTime: searchFrom.createTime && searchFrom.createTime[0],
        endTime: searchFrom.createTime && searchFrom.createTime[1],
      };
      delete this.searchFromData.createTime;
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return this.searchFromData;
    },
    operationBtn(rItem, row) {
      //0-草稿   1-已启用   2-已禁用
      const { status } = row;
      const { showStatus } = rItem;
      if (showStatus.includes(status)) {
        return true;
      } else {
        return false;
      }
    },
    Enable(row) {
      //启用
      // const params = {
      //   id: row.id,
      //   status: 1,
      // };
      return new Promise((resolve) => {
        setRouteEnable(row.id).then((res) => {
          this.mixinkeepTable();
        });
        resolve();
      });
    },
    disable(row) {
      //禁用
      // const params = {
      //   id: row.id,
      //   status: 0,
      // };
      return new Promise((resolve) => {
        setRouteDisable(row.id).then((res) => {
          this.mixinkeepTable();
        });
        resolve();
      });
    },
    deleteAirLine(row) {
      return new Promise((resolve) => {
        deleteOperateRoute(row.id).then((res) => {
          this.mixinkeepTable();
          resolve();
        });
      });
    },
    addAirLine() {
      this.$refs.AddDialog.show();
    },
    editAirLine(row) {
      this.$refs.AddDialog.show(row);
    },
    handleDetails(row) {
      const { isSortBox } = row;
      this.$refs.customDialogRef?.showCustomDialog({
        customFormConfig: customDialogCols({ isSortBox }),
        formModel: {
          ...row,
        },
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.btn {
  margin-right: 5px;
}
</style>
