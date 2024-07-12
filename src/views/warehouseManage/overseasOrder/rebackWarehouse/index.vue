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
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="tableConfig.getQueryParams"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'orderNum'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row)"
                  >
                    {{ slotProps.row.orderNum }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'isDeficiencyProduct'">
                  <el-row>
                    <span
                      :class="[
                        'isComplete',
                        slotProps.row.isDeficiencyProduct
                          ? 'text-success-color'
                          : 'text-danger-color',
                      ]"
                    >
                      <i
                        :class="
                          slotProps.row.isDeficiencyProduct
                            ? 'el-icon-circle-check'
                            : 'el-icon-warning-outline'
                        "
                      ></i>
                      {{ slotProps.dicsList.nameCn || "缺失" }}
                    </span>
                  </el-row>
                </template>
                <!-- 0-草稿 1-待接单（接单） 2-待收货（收货）3-待上架 4-已上架 5-部分上架 6-已拒绝-->
                <template v-if="slotProps.prop === 'operation'">
                  <div
                    class="operate-btn-list"
                    v-if="/1/.test(slotProps.row.orderStatus)"
                  >
                    <div
                      class="btn"
                      v-for="(item, index) in tableConfig.statusList"
                      :key="index"
                    >
                      <el-button
                        :class="`operate-icon ${
                          item.info ? 'operate-icon-info' : ''
                        }`"
                        size="mini"
                        type="text"
                        :icon="item.icon"
                        @click="item.handleClick(slotProps.row)"
                      >
                        {{ item.text }}
                      </el-button>
                    </div>
                  </div>
                  <div v-else>--</div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <OrderReceiving ref="dialog" @handleSuccess="mixinkeepTable" />
  </div>
</template>

<script>
import { getWmsForecast } from "@/api/warehouse/prediction";
import { mapActions, mapState } from "vuex";
import { searchColumns, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "FbaWithdrawal",
  mixins: [mixinColsConf],
  components: {
    OrderReceiving: () => import("./OrderReceiving"),
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
            label: "FBA退仓订单",
            name: "1",
          },
        ],
        btnArr: [],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getWmsForecast(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
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
      tableConfig: {
        tableHeight: "calc(100vh - 262px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getWmsForecast,
        statusList: [
          {
            text: "接单",
            icon: "el-icon-edit-outline",
            handleClick: this.handleUpdate,
          },
        ],
      },
      mixinTableColArr: [tableColumns],
      showSearchForm: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("predictionManage").then(() => {
      this.showSearchForm = true;
    });
  },
  activated() {
    this.mixinkeepTable();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getWmsForecast(searchFrom = {}) {
      this.searchFromData = { ...searchFrom };
      this.searchFromData.beginTime &&
        (this.searchFromData.beginTime =
          this.searchFromData.beginTime.join("@"));
      this.searchFromData.statusSearch &&
        (this.searchFromData.statusSearch =
          this.searchFromData.statusSearch.join(","));
      this.searchFromData.type &&
        (this.searchFromData.type = this.searchFromData.type.join(","));
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return {
        ...this.searchFromData,
        orderType: 0,
        statusSearch: "1,3,4,5,6",
      };
    },
    handleView(row) {
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((item) => item.id);
      localStorage.setItem("fbaReWarehouseIdList", JSON.stringify(idList));
      this.$router.push(
        `/newOrderManage/overseaWarehousing/reWarehouseDetails?id=${row.id}`
      );
    },
    handleUpdate(row) {
      this.$refs.dialog.show(row);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
