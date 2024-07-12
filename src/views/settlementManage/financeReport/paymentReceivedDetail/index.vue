<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <div>
            <keep-alive>
              <ComForm
                ref="formRef"
                :formConfig="searchFormConfig"
                v-if="showSearchForm && tabsConfig.activeName === tab.name"
              >
                <template v-slot:accountId="slotProps">
                  <AutoComplete
                    ref="saleRef"
                    :formModel="slotProps.formModel"
                    :fieldItem="slotProps.fieldItem"
                    :additionalParam="{
                      customerId: slotProps.formModel.customerId || undefined,
                    }"
                  />
                </template>
              </ComForm>
            </keep-alive>
          </div>
          <!-- <div class="title-class">
            <div class="title">收付款明细表</div>
            <keep-alive>
              <ComForm ref="titleRef" :formConfig="titleConfig" />
            </keep-alive>
          </div> -->
          <div>
            <keep-alive v-if="mixinShowTable">
              <ComTable
                :ref="`tableRef${tab.name}`"
                v-if="tabsConfig.activeName === tab.name && showSearchForm"
                :tableHeight="tableConfig.tableHeight"
                :columnConfig="tableMixinConfig(tab.name)"
                :httpRequest="tableConfig.httpRequest"
                :getQueryParams="getQueryParams"
                @getResult="getResult"
                :extraConfig="{ multiline: true }"
                :treeLazyLoad="{
                  lazy: true,
                  load: (row, treeNode, resolve) =>
                    getColsChildren(row, treeNode, resolve),
                }"
              >
              </ComTable>
            </keep-alive>
          </div>
          <div>
            <keep-alive v-if="mixinShowTable && subtotalShow">
              <ComTable
                :ref="`tableTotalRef${tab.name}`"
                v-if="tabsConfig.activeName === tab.name && showSearchForm"
                :columnConfig="paymentReceivedDetailTotal"
                :columnData="subtotalMoneyList"
                :extraConfig="{ multiline: true }"
              >
              </ComTable>
            </keep-alive>
          </div>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {
  lists,
  formConfigs,
  formRules,
  paymentReceivedDetailTable,
  paymentReceivedDetailTotal,
} from "../components/model.js";
import { formatDate, getNowDate } from "@/utils/index.js";
import { download } from "@/utils/download.js";
import {
  accountBillDailySheetList,
  exportAccountBillDailySheet,
  accountBillDailySheetDetail,
  logisticsCustomerInfo,
} from "@/api/settlementManage/paymentReceived.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "PaymentReceivedDetail",
  computed: {
    ...mapState(["dictionary", "user"]),
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    return {
      paymentReceivedDetailTotal,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "收付款明细表",
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
      searchFormConfig: {
        formModel: {
          createTime: [
            formatDate(new Date().getTime() - 24 * 60 * 60 * 1000, "/", "date"),
            formatDate(new Date().getTime() - 24 * 60 * 60 * 1000, "/", "date"),
          ],
        },
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        resetFormFn: (obj) => {
          if (obj.customerId) {
            this.$refs.saleRef[0].querySearchAsync();
          }
        },
        searchForm: true,
        fold: true,
        size: "small",
        labelWidth: "105px",
        // lists: lists.formConfigs,
        lists: this.getFormLists(),
        formRules: formRules,
      },
      titleConfig: {
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        size: "small",
        labelWidth: "85px",
        lists: lists.titleConfigs,
        formRules: {},
      },
      tableConfig: {
        tableHeight: "calc(100vh - 432px)",
        httpRequest: this.getList,
      },
      mixinTableColArr: [paymentReceivedDetailTable],
      subtotalMoneyList: [],
      searchFromData: {
        startDealDate: formatDate(
          new Date().getTime() - 24 * 60 * 60 * 1000,
          "/",
          "date"
        ),
        endDealDate: formatDate(
          new Date().getTime() - 24 * 60 * 60 * 1000,
          "/",
          "date"
        ),
      },
      subtotalShow: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      logisticsCustomerInfo({ pageNum: 1, pageSize: 10 }).then(
        ({ rows = [] }) => {
          this.searchFormConfig.formModel = {
            ...this.searchFormConfig.formModel,
            customerId: rows[0]?.id,
            customerName: rows[0]?.nameCn,
          };
          const { createTime } = this.searchFormConfig.formModel || {};
          this.searchFromData = {
            startDealDate: createTime && createTime[0],
            endDealDate: createTime && createTime[1],
            customerId: rows[0]?.id,
            customerName: rows[0]?.nameCn,
          };
          this.showSearchForm = true;
        }
      );
    });
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getList(params) {
      return new Promise((resolve) => {
        accountBillDailySheetList(params).then((res) => {
          const { rows } = res || {};
          const params = {
            ...res,
            rows: rows.map((e) => {
              return {
                ...e,
                hasChildren: true, //TRUE为有主子单，可以展开，FALSE为常规单，不必处理
              };
            }),
          };
          resolve(params);
        });
      });
    },
    getSearchList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      this.searchFromData = {
        ...searchObj,
        startDealDate: createTime && createTime[0],
        endDealDate: createTime && createTime[1],
      };
      this.mixinkeepTable(true);
    },
    getFormLists() {
      return formConfigs(
        {
          customerIdHandle: (curObj) => {
            //条件搜索---选择所属公司后重置银行账号的接口参数并重新请求接口根据所选择的所属公司来筛选银行账号返回数据
            this.$refs.saleRef[0]?.changeFocusRequest();
            // this.$refs.saleRef[0].querySearchAsync();
            // this.$refs.formRef[0].setFormModel({
            //   accountId: "",
            // });
          },
        },
        "PaymentReceivedDetail"
      );
    },
    handleExport() {
      const { startDealDate, endDealDate, dealingsCompanyObj, ...obj } =
        this.searchFromData;
      const createTime = formatDate(
        new Date().getTime() - 24 * 60 * 60 * 1000,
        "/",
        "date"
      );
      const params = {
        ...obj,
        startDealDate: startDealDate ? startDealDate : createTime, //左统计时间
        endDealDate: endDealDate ? endDealDate : createTime, //右统计时间
        dealingsCompany: dealingsCompanyObj?.id,
      };
      // exportAccountBillDailySheet(params).then((res) => {
      //   const { msg } = res;
      //   download(msg);
      // });
      comFileDownload(this, exportAccountBillDailySheet, params);
    },
    getResult({ resultData }) {
      if (resultData && resultData.total) {
        this.subtotalShow = true;
      } else {
        this.subtotalShow = false;
        return;
      }
      const {
        collVSubtotal,
        collSSubtotal,
        collTSubtotal,
        payVSubtotal,
        paySSubtotal,
        payTSubtotal,
      } = resultData.data || {};
      const subtotalMoneyList = [
        {
          title: "已核销金额：",
          coll_rmb: collVSubtotal?.rmb,
          coll_usd: collVSubtotal?.usd,
          coll_hkd: collVSubtotal?.hkd,
          coll_eur: collVSubtotal?.eur,
          coll_gbp: collVSubtotal?.gbp,
          pay_rmb: payVSubtotal?.rmb,
          pay_usd: payVSubtotal?.usd,
          pay_hkd: payVSubtotal?.hkd,
          pay_eur: payVSubtotal?.eur,
          pay_gbp: payVSubtotal?.gbp,
        },
        {
          title: "剩余金额：",
          coll_rmb: collSSubtotal?.rmb,
          coll_usd: collSSubtotal?.usd,
          coll_hkd: collSSubtotal?.hkd,
          coll_eur: collSSubtotal?.eur,
          coll_gbp: collSSubtotal?.gbp,
          pay_rmb: paySSubtotal?.rmb,
          pay_usd: paySSubtotal?.usd,
          pay_hkd: paySSubtotal?.hkd,
          pay_eur: paySSubtotal?.eur,
          pay_gbp: paySSubtotal?.gbp,
        },
        {
          title: "水单金额：",
          coll_rmb: collTSubtotal?.rmb,
          coll_usd: collTSubtotal?.usd,
          coll_hkd: collTSubtotal?.hkd,
          coll_eur: collTSubtotal?.eur,
          coll_gbp: collTSubtotal?.gbp,
          pay_rmb: payTSubtotal?.rmb,
          pay_usd: payTSubtotal?.usd,
          pay_hkd: payTSubtotal?.hkd,
          pay_eur: payTSubtotal?.eur,
          pay_gbp: payTSubtotal?.gbp,
        },
      ];
      this.subtotalMoneyList = subtotalMoneyList;
      this.$refs[`tableTotalRef${this.tabsConfig.activeName}`] &&
        this.$refs[
          `tableTotalRef${this.tabsConfig.activeName}`
        ][0]?.setNewTableData(this.subtotalMoneyList);
    },
    getQueryParams() {
      const {
        startDealDate,
        endDealDate,
        accountId,
        customerId,
        customerName,
        dealingsCompanyObj = {},
        ...searchObj
      } = this.searchFromData;
      console.log("this.searchFromData", this.searchFromData);
      const yesterday = formatDate(
        new Date().getTime() - 24 * 60 * 60 * 1000,
        "/",
        "date"
      );
      const opt = {
        ...searchObj,
        accountId: accountId,
        customerId: customerId,
        startDealDate: startDealDate ? startDealDate : yesterday, //默认搜索昨日
        endDealDate: endDealDate ? endDealDate : yesterday, //默认搜索昨日
        dealingsCompany: dealingsCompanyObj?.id || undefined,
        dealingsCompanyName: dealingsCompanyObj?.shortName || undefined,
      };
      // this.getTitleData({
      //   ...opt,
      //   accountId,
      //   customerId,
      // });
      return opt;
    },
    // getTitleData(formModel) {
    //   const { startDealDate, endDealDate, customerId, accountId } = formModel;
    //   const { name } = this.user;
    //   const UNCHARTED_FORM_9 = getNowDate();
    //   this.$refs.titleRef[0]?.setFormModel({
    //     UNCHARTED_FORM_4: customerId?.nameCn || "", //公司名称
    //     UNCHARTED_FORM_5: accountId?.customerName || "", //银行
    //     UNCHARTED_FORM_6: accountId?.bankAccount || "", //账号
    //     UNCHARTED_FORM_7: `${startDealDate}~${endDealDate}`, //日期
    //     UNCHARTED_FORM_8: name, //制单人
    //     UNCHARTED_FORM_9, //制表日期
    //   });
    // },
    getColsChildren(row = {}, treeNode, resolve) {
      const { bankReceiptId } = row;
      const params = {
        bankReceiptId: bankReceiptId,
      };
      accountBillDailySheetDetail(params).then((res) => {
        const data = res?.rows || [];
        resolve(data);
      });
    },
  },
  mixins: [mixinColsConf],
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .title-class {
    border-top: 1px solid #d7d7d7;
    font-size: 16px;
    .title {
      text-align: center;
      padding: 15px 0px;
    }
  }
}
</style>
