<template>
  <div class="business-month">
    <div class="content">
      <ComTabs :tabsConfig="tabsConfig">
        <template v-for="tab in tabsConfig.tabs">
          <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
            <keep-alive>
              <ComForm
                class="search-info"
                ref="searchFormRef"
                :formConfig="searchConfig"
                v-if="showSearchForm"
              >
                <template v-slot:accountId="slotProps">
                  <AutoComplete
                    ref="saleRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="slotProps.fieldItem"
                    :additionalParam="{
                      customerId: slotProps.formModel.customerObj,
                    }"
                  />
                </template>
                <!-- <template v-slot:form-submit>
            <el-button size="small" type="primary" @click="handleExport">
              导 出
              <i class="iconfont daochu el-icon--right"></i>
            </el-button>
          </template> -->
              </ComForm>
            </keep-alive>
            <!-- <keep-alive>
              <ComForm ref="txtFormRef" :formConfig="txtFormConfig">
                <template v-slot:slotUserName>
                  {{ name }}/{{ nickName }}
                </template>
              </ComForm>
            </keep-alive> -->
            <keep-alive>
              <ComTable
                :ref="`tableRef${tab.name}`"
                tableHeight="calc(100vh - 290px)"
                :columnConfig="summaryTableCols"
                :httpRequest="tableConfig.httpRequest"
                :getQueryParams="getQueryParams"
                :pagination="true"
                @handleTableView="handleTableView"
                v-if="showSearchForm"
              >
              </ComTable>
            </keep-alive>
          </el-tab-pane>
        </template>
      </ComTabs>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  getDailySheetList,
  getDailySheetExport,
} from "@/api/settlementManage/paymentReceived.js";
import { formatDate } from "@/utils/index.js";
import { formModelConfig, summaryTableCols, formRules } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { logisticsCustomerInfo } from "@/api/settlementManage/paymentReceived.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "DailyReport",
  mixins: [mixinColsConf],
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    const formConfig = {
      formModel: {
        dealDate: [
          formatDate(new Date().getTime() - 24 * 60 * 60 * 1000, "/", "date"),
          formatDate(new Date().getTime() - 24 * 60 * 60 * 1000, "/", "date"),
        ],
        sameDay: formatDate(new Date(), "/", "date"),
      },
      httpRequest: () => {}, // 表单提交接口
      successFunction: () => {}, // 表单提交成功回调
      size: "small",
      labelWidth: "85px",
      formRules: {}, // 表单校验规则
    };
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          return;
        },
        tabs: [
          {
            label: "收付款日汇总表",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => {
              this.handleExport();
            },
          },
        ],
      },
      searchConfig: {
        ...formConfig,
        searchForm: true,
        formRules,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        lists: formModelConfig(),
      },
      txtFormConfig: {
        ...formConfig,
        formModel: {
          dealDate: `${formatDate(
            new Date().getTime() - 24 * 60 * 60 * 1000,
            "/",
            "date"
          )}~${formatDate(
            new Date().getTime() - 24 * 60 * 60 * 1000,
            "/",
            "date"
          )}`,
          sameDay: formatDate(new Date(), "/", "date"),
        },
        lists: formModelConfig(1),
      },
      searchFromData: {},
      summaryTableCols,
      btnType: null,
      tableConfig: {
        httpRequest: getDailySheetList,
      },
    };
  },
  mounted() {
    logisticsCustomerInfo({ pageNum: 1, pageSize: 10 }).then(
      ({ rows = [] }) => {
        this.searchConfig.formModel = {
          ...this.searchConfig.formModel,
          customerObj: rows[0]?.id,
          customerName: rows[0]?.nameCn,
        };
        const { dealDate, customerObj, customerName } =
          this.searchConfig.formModel;
        const startDealDate = dealDate && dealDate[0];
        const endDealDate = dealDate && dealDate[1];
        this.searchFromData = {
          startDealDate,
          endDealDate,
          customerObj,
          customerName,
        };
        // this.$refs.txtFormRef[0]?.setFormModel({
        //   customerName: rows[0]?.nameCn,
        // });
        this.showSearchForm = true;
        // this.getTableList(this.searchConfig.formModel);
        // this.mixinkeepTable(true);
      }
    );
  },
  methods: {
    getQueryParams() {
      const { startDealDate, endDealDate, customerObj, accountId } =
        this.searchFromData || {};
      const opt = {
        startDealDate,
        endDealDate,
        customerId: customerObj,
        accountIdIn: (accountId || []).map((e) => e.id).join(","),
      };
      return opt;
    },

    getSearchList(searchFrom = {}) {
      const { dealDate, ...searchObj } = searchFrom;
      this.searchFromData = {
        ...searchObj,
        startDealDate: dealDate && dealDate[0],
        endDealDate: dealDate && dealDate[1],
      };
      this.mixinkeepTable(true);
    },
    // getList(params) {
    //   return new Promise((resolve) => {
    //     getDailySheetList(params).then((res) => {
    //       const { rows } = res || {};
    //       const params = {
    //         ...res,
    //         rows: rows.map((e) => {
    //           return {
    //             ...e,
    //           };
    //         }),
    //       };
    //       resolve(params);
    //     });
    //   });
    // },
    getTableList(obj) {
      const { customerObj, dealDate, accountId } = obj || {};
      const startDealDate = dealDate && dealDate[0];
      const endDealDate = dealDate && dealDate[1];
      // this.$refs.txtFormRef[0]?.setFormModel({
      //   customerName: customerObj.label,
      //   dealDate: `${startDealDate}~${endDealDate}`,
      // });
      const opt = {
        startDealDate,
        endDealDate,
        customerId: customerObj,
        accountId: accountId?.id,
      };
      this.searchFromData = opt;
      if (this.btnType === "export") {
        this.btnType = null;
        getDailySheetExport(opt).then((res) => {
          res.data && window.open(res.data);
        });
        return;
      }
      this.$refs[`tableRef${this.tabsConfig.activeName}`][0].loading = true;
      getDailySheetList(opt).then((res) => {
        this.$refs[`tableRef${this.tabsConfig.activeName}`][0]?.setNewTableData(
          res.rows || []
        );
      });
    },
    handleExport() {
      const { startDealDate, endDealDate, customerObj, accountId } =
        this.searchFromData;
      const opt = {
        startDealDate,
        endDealDate,
        customerId: customerObj,
        accountId: accountId?.id,
      };
      // getDailySheetExport(opt).then((res) => {
      //   res.data && window.open(res.data);
      // });
      comFileDownload(this, getDailySheetExport, opt);
    },
    handleTableView(row) {
      const { customerId, customerName, accountId, accountName } = row;
      const { startDealDate, endDealDate } = this.searchFromData;
      this.$router.push({
        path: "/reportManagement/businessProfit/paymentReceivedDetail",
        query: {
          params: JSON.stringify({
            ...this.searchFromData,
            createTime:
              startDealDate && endDealDate ? [startDealDate, endDealDate] : [],
            customerId,
            customerName,
            accountId,
            accountName,
          }),
        },
      });
    },
    handleTableView(row) {
      const { customerId, customerName, accountId, accountName } = row;
      const { startDealDate, endDealDate } = this.searchFromData;
      this.$router.push({
        path: "/reportManagement/businessProfit/paymentReceivedDetail",
        query: {
          params: JSON.stringify({
            ...this.searchFromData,
            createTime:
              startDealDate && endDealDate ? [startDealDate, endDealDate] : [],
            customerId,
            customerName,
            accountId,
            accountName,
          }),
        },
      });
    },
  },
  computed: {
    ...mapGetters(["name", "nickName"]),
  },
  activated() {
    if (this.$refs.searchFormRef) {
      this.$refs.searchFormRef[0].submitForm();
    }
  },
};
</script>

<style lang="scss" scoped>
.business-month {
  // background: #f9f9f9;
  // padding: 11px 0 20px;
  margin: 10px;
  .content {
    // width: 1174px;
    padding: 15px 20px 30px;
    min-height: calc(100vh - 108px);
    margin: auto;
    background: #fff;
    .tabs {
      display: flex;
      justify-content: flex-start;
      border-bottom: 1px solid #e2e2e2;
      .title {
        color: #515151;
        font-weight: bold;
        margin-right: 30px;
        padding-bottom: 3px;
        border-bottom: 2px solid #515151;
      }
    }
    .search-info {
      margin-top: 15px;
    }
  }
}
</style>
