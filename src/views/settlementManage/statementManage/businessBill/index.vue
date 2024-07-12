<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig()"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
                  :tName="tab.name"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              :extraConfig="{ multiline: true }"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'orderNum'">
                  <span
                    class="primary-text-btn"
                    @click="handleUpdate(slotProps.row)"
                  >
                    {{ slotProps.row.orderNum }}
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
import { getBusinessList } from "@/api/settlementManage/statementManage";
import { searchColumns, tableColumns } from "./model";
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { getFirstInitData } from "@/utils/index.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived";
export default {
  name: "BusinessBill",
  mixins: [mixinColsConf],
  components: {
    ComDialog: () => import("_comp/ComDialog"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "待出业务对账单",
            name: "1",
          },
        ],
      },
      searchFromData: {},
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
        searchColsHeight: true,
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
      },
      tableConfig: {
        httpRequest: getBusinessList,
        className: "table-header-height",
      },
      mixinTableColArr: [tableColumns],
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.getInitialData();
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getInitialData() {
      this.showSearchForm = true;
      // getFirstInitData({
      //   httpRequest: logisticsCustomerInfo,
      // }).then((res) => {
      //   this.searchFromData = {
      //     billingMain: res.id,
      //     billingMainName: `${res.code}[${res.shortName}]`,
      //   };
      //   this.showSearchForm = true;
      // });
    },
    getList(searchFrom = {}) {
      this.searchFromData = { ...searchFrom };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const { billingMainName, ...nSearchData } = this.searchFromData || {};
      console.log("nSearchData", nSearchData);
      return {
        ...nSearchData,
      };
    },
    getSearchFormConfig() {
      return {
        ...this.searchFormConfig,
      };
    },
    handleUpdate({ orderId: id, businessType, billingMain, dealingsCompany }) {
      this.$router.push({
        path: "/settlementManagement/statementManage/editBusinessBill",
        query: {
          id,
          businessType,
          billingMain,
          dealingsCompany,
          backPath: this.$route.path,
        },
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
