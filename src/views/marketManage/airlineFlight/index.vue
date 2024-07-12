<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
							@searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="airlineTable.columnConfig"
              :httpRequest="airlineTable.httpRequest"
              :getQueryParams="airlineTable.getQueryParams"
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
                <template v-if="slotProps.prop === 'operation'">
                  <div v-if="slotProps.row.status >= 2">--</div>
                  <div class="operate-btn-list" v-else>
                    <div
                      class="btn"
                      v-for="(item, index) in airlineTable.statusList[
                        slotProps.row.status
                      ]"
                      :key="index"
                    >
                      <el-button
                        :class="`operate-icon ${
                          item.info ? 'operate-icon-info' : ''
                        }`"
                        size="mini"
                        type="text"
                        @click="item.handleClick(slotProps.row)"
                      >
                        {{ item.text }}
                      </el-button>
                    </div>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <AddEditDialog ref="dialog" @handleSuccess="mixinkeepTable" />
    <AirlineStatusDialog
      ref="airlineStatusDialog"
      @handleSuccess="mixinkeepTable"
    />
  </div>
</template>

<script>
import {
  getAirFlightList,
  editAirFlight,
  deleteAirFlight,
  POSTOrderIsolateConfig
} from "@/api/marketManage/airline";
import { mapActions, mapState } from "vuex";
import { searchColumns, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "AirlineFlight",
  mixins: [mixinColsConf],
  components: {
    AddEditDialog: () => import("./components/AddEditDialog/index.vue"),
    AirlineStatusDialog: () => import("./components/AirlineStatusDialog"),
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
            label: "航次登记",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "新增",
            className: "btn-type-add",
            icon: "el-icon-plus",
            handleClick: () => this.handleUpdate({}, "add"),
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getAirFlightList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
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
        searchColsHeight: true,
      },
      airlineTable: {
        getQueryParams: this.getQueryParams,
        httpRequest: getAirFlightList,
        columnConfig: tableColumns,
        statusList: {
          0: [
            {
              text: "登记",
              handleClick: (row) => this.handleUpdate(row, 1),
            },
            {
              text: "修改",
              handleClick: (row) => this.handleUpdate(row, "edit"),
            },
            {
              text: "删除",
              handleClick: this.handleDelete,
            },
          ],
          1: [
            // {
            //   text: "离港",
            //   handleClick: (row) => this.handleStatus(row.id, 2),
            // },
            {
              text: "修改",
              handleClick: (row) => this.handleUpdate(row, "edit"),
            },
          ],
          2:[],
          3:[]
          // 2: [
          //   {
          //     text: "到港",
          //     handleClick: (row) => this.handleStatus(row.id, 3),
          //   },
          // ],
        },
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
    getAirFlightList(searchFrom = {}) {
      this.searchFromData = {
        ...searchFrom,
        startDate: searchFrom.createTime && searchFrom.createTime[0],
        endDate: searchFrom.createTime && searchFrom.createTime[1],
        statusList: searchFrom.statusList && searchFrom.statusList.join(","),
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
      this.$router.push({
        path: "/marketManage/airlineFlightDetails",
        query: {
          id: row.id,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleDelete(row) {
      deleteAirFlight(row.id).then(() => {
        this.mixinkeepTable();
      });
    },
    handleUpdate(row, type) {
      if (/add|edit/.test(type)) {
        POSTOrderIsolateConfig().then((res)=>{
          const {data}=res
          this.$refs.dialog.show({...row,WEB_ids:data}, true);
        })
      } else {
        editAirFlight({ id: row.id, status: type }).then(() => {
          this.mixinkeepTable();
        });
      }
    },
    handleStatus(id, status) {
      // this.$refs.airlineStatusDialog.show(id, status);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
