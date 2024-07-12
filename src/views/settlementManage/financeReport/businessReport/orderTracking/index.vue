<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchFormRef"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
              :formConfig="searchTabForm()"
            >
              <template v-slot:salesmanIds="slotProps">
                <AutoComplete
                  ref="salesmanRef"
                  :formModel="slotProps.formModel"
                  :fieldItem="slotProps.fieldItem"
                  :additionalParam="{
                    orderClass: slotProps.formModel.orderClass,
                  }"
                />
              </template>
              <template v-slot:customerId="slotProps">
                <AutoComplete
                  ref="companyRef"
                  :formModel="slotProps.formModel"
                  :fieldItem="{
                    ...slotProps.fieldItem,
                    className: 'auto-dis-search',
                    disabled:
                      !slotProps.formModel.salesmanIds ||
                      !slotProps.formModel.salesmanIds.length,
                  }"
                  :additionalParam="{
                    salesmanIds: slotProps.formModel.salesmanIds,
                  }"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
            >
              <!-- :isMountedRequest="false" -->
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>

    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import {
  getOrderTraceList,
  exportOrderTrace,
  exportAllOrderTrace,
} from "@/api/settlementManage/paymentReceived.js";
import { formatDate } from "@/utils/index.js";
import { comFileDownload } from "@/utils/download.js";
import { getStreamFileDownload } from "@/utils/zipdownload";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  searchFormCols,
  formRules,
  tableColumns,
  exportDialogListCols,
} from "./model.js";

export default {
  name: "OrderTracking",
  mixins: [mixinColsConf],
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "订单跟踪表",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => {
              this.btnType = "export";
              this.$refs.searchFormRef[0]?.submitForm();
              setTimeout(() => {
                this.btnType = null;
              }, 500);
            },
          },
          {
            table: "全部导出",
            handleClick: () => {
              this.btnType = "ex_all";
              this.$refs.searchFormRef[0]?.submitForm();
              setTimeout(() => {
                this.btnType = null;
              }, 500);
            },
          },
        ],
      },
      searchFormConfig: {
        searchForm: true,
        fold: true,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        labelWidth: "85px",
        formRules, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 265px)",
        httpRequest: getOrderTraceList,
      },
      btnType: null,
      searchFromData: {},
      mixinTableColArr: [tableColumns],
    };
  },
  methods: {
    getTableList(searchFrom = {}) {
      this.searchFromData = searchFrom;
      if (this.btnType === "export") {
        this.handleCustomDialog();
        // comFileDownload(this, exportOrderTrace, this.getQueryParams());
      } else if (this.btnType === "ex_all") {
        // comFileDownload(this, exportAllOrderTrace, this.getQueryParams());
        this.handleCustomDialog("ex_all");
      } else {
        this.mixinkeepTable(true);
      }
    },
    searchTabForm() {
      return {
        ...this.searchFormConfig,
        lists: searchFormCols({
          // customerHandle: (val) => {
          // 	this.$refs.salesmanRef[0]?.changeFocusRequest();
          // 	if (!this.isDefaultSelection) {
          // 		this.isDefaultSelection = true;
          // 		this.getTableList(this.$refs.searchFormRef[0]?.getFormParams());
          // 	}
          // },
          selectTypeHandle: (v) => {
            this.$refs.salesmanRef &&
              this.$refs.salesmanRef[0]?.changeFocusRequest();
          },
          salesmanHandle: () => {
            this.$refs.companyRef &&
              this.$refs.companyRef[0]?.changeFocusRequest();
            this.$refs.searchFormRef[0]?.setFormModel({
              customerId: "", // 隐藏的查询联动需要重置
              customerId_name: "",
            });
          },
        }),
      };
    },
    getQueryParams() {
      const { createTime, oDate, ...searchObj } = this.searchFromData;
      const [startTime, endTime] = createTime || [];
      return {
        ...searchObj,
        startTime,
        endTime,
        // startGoodsWarehouseDate: oDate && oDate[0],
        // endGoodsWarehouseDate: oDate && oDate[1],
      };
    },
    handleCustomDialog(tType) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: exportDialogListCols(tType),
        formModel: {
          col_list: this.exportDictCols
            .map((e) => e.value)
            .filter(
              (v) => !["profit", "financeStatus", "salesmanName"].includes(v)
            ),
          ds_col_list: this.exportDsAllCols
            .map((e) => e.value)
            .filter(
              (v) => !["profit", "financeStatus", "salesmanName"].includes(v)
            ),
          ct_col_list: this.exportCtAllCols
            .map((e) => e.value)
            .filter(
              (v) => !["profit", "financeStatus", "salesmanName"].includes(v)
            ),
        },
        successFunction: (res) => {
          let url = "/order/trace/exportDynamicColumns";
          let opt = {
            columnList: (res.col_list || []).map((e) => {
              return this.exportDictCols.find((c) => c.value === e);
            }),
          };
          if (tType === "ex_all") {
            url = "/order/trace/exportAllDynamicColumns";
            opt = {
              dsColumnList: (res.ds_col_list || []).map((e) => {
                return this.exportDsAllCols.find((c) => c.value === e);
              }),
              ctColumnList: (res.ct_col_list || []).map((e) => {
                return this.exportCtAllCols.find((c) => c.value === e);
              }),
            };
          }
          getStreamFileDownload(
            url,
            {
              ...this.getQueryParams(),
              ...opt,
            },
            {
              method: "post",
            }
          );
        },
      });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    // 默认当前用户
    const theSameMonth = [
      `${formatDate(new Date().getTime(), "/", "month")}/01`,
      formatDate(new Date().getTime(), "/", "date"),
    ]; // 默认当月1号到当前日期
    this.searchFromData = {
      createTime: theSameMonth,
      // oDate: theSameMonth,
      orderClass: "10", // 默认类型
      salesmanIds: this.salesmanId ? [this.salesmanId] : [],
    };
    this.searchFormConfig.formModel = { ...this.searchFromData };
    this["dictionary/getDictionary"]([
      "orderStatus",
      "orderTrackingTableType",
      "freightType",
      "isMainBillType",
      "ddgzbdcl",
      "ddgzbdcqbDs",
      "ddgzbdcqbCt",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  computed: {
    ...mapState({
      exportDictCols: (state) => state.dictionary.dicsData.ddgzbdcl || [],
      exportDsAllCols: (state) => state.dictionary.dicsData.ddgzbdcqbDs || [],
      exportCtAllCols: (state) => state.dictionary.dicsData.ddgzbdcqbCt || [],
    }),
    ...mapGetters(["salesmanId", "salesmanName"]),
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
</script>
