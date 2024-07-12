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
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'code'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row)"
                  >
                    {{ slotProps.row.code }}
                  </span>
                </template>
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
                <template v-if="slotProps.prop === 'isPublic'">
                  <span v-if="dataPublicType && slotProps.row.isPublic">
                    {{
                      dataPublicType[slotProps.row.isPublic] &&
                      dataPublicType[slotProps.row.isPublic].label
                    }}
                  </span>
                  <span v-else>--</span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <AddDialog ref="AddDialog" @handleSuccess="handleSuccess" />
  </div>
</template>

<script>
import { getAirGroupList } from "@/api/marketManage/airline";
import { mapActions, mapState } from "vuex";
import { searchColumns, tableColumns } from "./model";
import { clone } from "@/utils/ruoyi.js";
import {
  deleteOperateCode,
  putOperateCode,
  setCodeEnable,
  setCodeDisable,
} from "@/api/marketManage/airline.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "AirlineGroupInfo",
  mixins: [mixinColsConf],
  components: {
    AddDialog: () =>
      import("@/views/marketManage/airlineGroupInfo/components/addDialog.vue"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      dataPublicType: [
        {
          label: "×否",
          value: "0",
        },
        {
          label: "√是",
          value: "1",
        },
      ],
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "航线组管理",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: (rows) => {
              this.addAirlineGroupInfo();
            },
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getAirGroupList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        // expansion: false,
        size: "small",
        labelWidth: "100px",
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
        httpRequest: getAirGroupList,
        columnConfig: tableColumns,
        btnArr: [
          {
            text: "修改",
            showStatus: ["0"],
            handleClick: (row) => {
              this.editAirlineGroupInfo(row);
            },
          },
          {
            text: "启用",
            showStatus: ["0", "2"],
            handleClick: (row) => {
              this.Enable(row);
            },
          },
          {
            text: "禁用",
            color: "#FF6767",
            showStatus: ["1"],
            handleClick: (row) => {
              this.disable(row);
            },
          },
          {
            text: "删除",
            color: "#FF6767",
            showStatus: ["0"],
            handleClick: (row) => {
              this.deleteAirLineGroupInfo(row);
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
    getAirGroupList(searchFrom = {}) {
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
    handleView(row) {
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((item) => item.id);
      localStorage.setItem("airlineGroupIdList", JSON.stringify(idList));
      this.$router.push({
        path: "/marketManage/marketBData/airlineGroupInfoDetails",
        query: {
          id: row.id,
          backPath: this.$route.path,
        },
      });
    },
    addAirlineGroupInfo() {
      this.$refs.AddDialog.show();
    },
    editAirlineGroupInfo(row) {
      this.$refs.AddDialog.show(row);
    },
    deleteAirLineGroupInfo(row) {
      return new Promise((resolve) => {
        deleteOperateCode(row.id).then((res) => {
          this.mixinkeepTable();
        });
        resolve();
      });
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
    handleSuccess() {
      this.$refs.AddDialog.hide();
      this.mixinkeepTable();
    },
    Enable(row) {
      //启用
      // const params = {
      //   id: row.id,
      //   status: 1,
      // };
      return new Promise((resolve) => {
        setCodeEnable(row.id).then((res) => {
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
        setCodeDisable(row.id).then((res) => {
          this.mixinkeepTable();
        });
        resolve();
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
