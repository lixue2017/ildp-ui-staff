<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <ComForm
            ref="searchTabForm"
            :formConfig="searchFormConfig"
            v-if="showSearchForm"
          >
            <template v-slot:businessCompany="slotProps">
              <AutoComplete
                ref="businessCompanyRef"
                :formModel="slotProps.formModel"
                :fieldItem="{
                  ...slotProps.fieldItem,
                  handle: changeCompany,
                }"
                :additionalParam="{}"
              />
            </template>
            <template v-slot:salesman="slotProps">
              <AutoComplete
                ref="salesmanRef"
                :formModel="slotProps.formModel"
                :fieldItem="slotProps.fieldItem"
                :additionalParam="{
                  customerId: slotProps.formModel.businessCompany,
                }"
              />
            </template>
          </ComForm>
          <!-- <div>
            <el-tabs v-model="tabsConfig.activeType" @tab-click="mixinkeepTable" class="tabsBtn">
              <el-tab-pane label="业务回款考核" name="1" />
              <el-tab-pane label="逾期回款考核" name="2" />
            </el-tabs>
          </div> -->
          <ComTable
            :ref="`tableRef${tab.name}`"
            :tableHeight="tableConfig.tableHeight"
            :columnConfig="tableColumns({currencyList})"
            :httpRequest="tableConfig.httpRequest"
            :getQueryParams="getQueryParams"
            :extraConfig="{ multiline: true }"
            :paginationConfig="paginationConfig"
            @getResult="getResult"
            @handleTableView="handleDetails"
            v-if="tabsConfig.activeName == tab.name && showSearchForm"
          >
          </ComTable>
          <div class="grand-total">
            <template v-for="gross in totalData">
              <div class="total-class" :key="gross.prop">
                <span class="title">{{ gross.key }}：</span>
                <template v-for="item in gross.subtotal">
                  <span class="value">{{
                    `${item.label}：${item.value}`
                  }}</span>
                </template>
              </div>
            </template>
          </div>
        </el-tab-pane>
      </template>
      <template v-slot:slotTabsRight>
        <div class="titleTips">
          <!-- <span
            >*
            自然月月结：操作上个月接单的，本月最后1天收回；票结：提柜(到港)时间+15天；签收后月结：提柜(到港)时间+30天</span
          > -->
          <span>* 自然月月结：操作上个月接单的，本月最后1天收回；</span>
          <span>票结：提柜(到港)时间+15天；</span>
          <span>签收后月结：提柜(到港)时间+30天；</span>
        </div>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { searchForm, tableColumns, formRules } from "./model.js";
import { accumulationFn } from "@/utils/instructions";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { formatDate } from "@/utils/index.js";
import { getFirstInitData } from "@/utils/index.js";
import {
  getBusinessRefundCheck,
  exportBusinessRefundCheck,
  logisticsCustomerInfo,
} from "@/api/settlementManage/paymentReceived.js";
import { comFileDownload } from "@/utils/download.js";
import {GETCurrencyConfigList} from "@/api/settlementManage/feeSet.js"
export default {
  name: "Examine",
  mixins: [mixinColsConf],
  data() {
    return {
      tableColumns,
      tabsConfig: {
        activeName: "1",
        // activeType:"1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "业务回款考核",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: this.getProfitStatementExport,
          },
        ],
      },
      searchFormConfig: {
        formModel: {
          checkDate: [
            formatDate(new Date(new Date().getFullYear(), 0, 1), "-", "date"),
            formatDate(new Date().getTime(), "-", "date"),
          ],
        }, // 表单数据
        httpRequest: async (formModel) => {
          const { businessCompany: oldVal } = this.searchFromData;
          const { businessCompany: newVal } = formModel;
          if (newVal != oldVal) {
            const params = {
              customerId: newVal,
            };
            const { data } = await GETCurrencyConfigList(params);
            this.currencyList = data[0].currencyList || [];
          }
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        fold: true,
        size: "small",
        labelWidth: "100px",
        lists: searchForm,
        formRules, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 320px)",
        // columnConfig: tableColumns,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            getBusinessRefundCheck(formModel).then((res) => {
              const { data, total, ...nObj } = res;
              this.paginationConfig.pageSizes = [20, 30, 50, 100, total];
              resolve({ ...nObj, totalMoney: data, total });
            });
          });
        },
      },
      showSearchForm: false,
      totalData: [],
      searchFromData: {},
      paginationConfig: {
        limit: 20,
        layout: "total, sizes, prev, pager, next, jumper",
        className: "",
        small: false,
        total: 20,
        pageSizes: [20, 30, 50, 100],
      },
      currencyList:[]//可用币种集合
    };
  },
  mounted() {},
  created() {
    this["dictionary/getDictionary"]([
      "settlementBusinessType",
      "accountCycle",
    ]).then(() => {
      getFirstInitData({
        httpRequest: logisticsCustomerInfo,
      }).then(async(e) => {
        const { id, code, shortName } = e;
        const {data=[]}=await GETCurrencyConfigList({customerId:id})
        this.currencyList=data[0].currencyList||[]
        this.searchFormConfig.formModel = {
          ...this.searchFormConfig.formModel,
          businessCompany: id,
          businessCompanyName: `${code}[${shortName}]`,
        };
        this.searchFromData = this.searchFormConfig.formModel;
        this.showSearchForm = true;
      });
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getQueryParams() {
      const { businessCompanyName, checkDate, ...nObj } = this.searchFromData;
      return {
        ...nObj,
        startTime: checkDate && checkDate[0],
        endTime: checkDate && checkDate[1],
        // tab:this.tabsConfig.activeType
      };
    },
    getSearchList(searchFrom = {}) {
      this.searchFromData = {
        ...searchFrom,
        //在这里添加搜索的传参，再把接口替换一下就可以了
      };
      this.mixinkeepTable(true);
    },
    handleDetails(row, fieldItem) {
      const { orderNo } = row;
      const { cPageNoKey, cOrderIdKey } = fieldItem;
      this.$router.push({
        path: cPageNoKey,
        query: {
          id: row[cOrderIdKey],
          orderNo,
        },
      });
    },
    getResult(row = {}) {
      const { totalMoney } = row.resultData;
      const currencyIds=this.currencyList.map((e)=>e.currencyId)
      this.totalData = [
        {
          key: "应收金额",
          subtotal: totalMoney.collectSubtotal.map((e) => {
            const { currencyCode,currencyId, money } = e;
            if (currencyIds.includes(currencyId)) {
                return {
                  label: currencyCode,
                  value: money,
                };
              }
          }).filter((e)=>e),
        },
        {
          key: "回款金额",
          subtotal: totalMoney.refundSubtotal.map((e) => {
            const { currencyCode,currencyId, money } = e;
            if (currencyIds.includes(currencyId)) {
                return {
                  label: currencyCode,
                  value: money,
                };
              }
          }).filter((e)=>e),
        },
        {
          key: "剩余未回金额",
          subtotal: totalMoney.surplusSubtotal.map((e) => {
            const { currencyCode,currencyId, money } = e;
            if (currencyIds.includes(currencyId)) {
                return {
                  label: currencyCode,
                  value: money,
                };
              }
          }).filter((e)=>e),
        },
      ];
    },
    changeCompany(row) {
      this.$refs.salesmanRef[0] &&
        this.$refs.salesmanRef[0].changeFocusRequest();
    },
    getProfitStatementExport() {
      //导入
      const params = this.getQueryParams();
      comFileDownload(this, exportBusinessRefundCheck, params);
    },

  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style lang="scss" scoped>
.total-class {
  &:not(:last-child) {
    margin-right: 30px;
  }
  .value {
    margin-right: 10px;
  }
}
// .tabsBtn{
//   /deep/{
//     .el-tabs__header{
//       margin:0px
//     }
//   }
// }
/deep/.tabs-right-btn {
  width: 100%;
  justify-content: space-between;
  align-items: flex-end !important;

  .titleTips {
    margin-left: 100px;
    color: #5094ff;
    span {
      &:not(:first-child) {
        margin-left: 35px;
      }
    }
  }
}
</style>
