<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchTabForm(tab.name)"
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
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.name)"
              :customSort="{ prop: 'createTime', order: 'descending' }"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'serialCode'">
                  <span
                    class="primary-text-btn"
                    @click="handleUpdate(slotProps.row, 'claimDialog', 'view')"
                  >
                    {{ slotProps.row.serialCode }}
                  </span>
                </template>
                <!-- <template v-if="slotProps.prop === 'status'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor: slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                </template> -->
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ClaimDialog ref="claimDialog" />
    <PaymentExchangeMemoDlg ref="exchangeMemoRef" />
  </div>
</template>

<script>
import { getReceiptList } from "@/api/settlementManage/paymentReceived";
import { mapActions } from "vuex";
import {
  paymentSearchColumns,
  paymentTableColumns,
} from "@/views/settlementManage/paymentReceived/waterBill/model.js";
import noDataImg from "@/assets/image/noData.png";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
export default {
  name: "PaymentWaterBill",
  mixins: [mixinColsConf],
  components: {
    ClaimDialog: () =>
      import(
        "@/views/settlementManage/paymentReceived/waterBill/components/ClaimDialog"
      ),
    PaymentExchangeMemoDlg: () =>
      import(
        "@/views/settlementManage/paymentReceived/waterBill/components/EditDialog/exchangeMemo.vue"
      ),
  },
  data() {
    return {
      noDataImg,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {
          this.$nextTick(() => {
            this.initMixinColumnConf();
          });
        },
        tabs: [
          {
            label: "付款水单信息",
            name: "1",
          },
          {
            label: "已完结",
            name: "2",
          },
        ],
        btnArr: [
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        size: "small",
        labelWidth: "100px",
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getReceiptList,
      },
      mixinTableColArr: [paymentTableColumns("1"), paymentTableColumns("2")],
      tabconfigBtns: [
        {
          table: "付款佰信核销",
          showTabName: "2",
          hasPermission: ["settlementManage:waterBill:financePay"],
          handleClick: () => this.handlePaymentBaiXin(),
        },
      ],
    };
  },
  created() {
    this["dictionary/getDictionary"]("billDictionary").then(() => {
      this.getInitialData();
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handlePaymentBaiXin() {
      this.$refs.exchangeMemoRef.handleCustomDialog(
        {},
        {
          successFn: () => this.mixinkeepTable(),
        }
      );
    },
    getSearchList(searchFrom = {}) {
      const { auditTime, transactionTime, verificationTime, ...searchObj } =
        searchFrom;
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
        startTime: auditTime && auditTime[0],
        endTime: auditTime && auditTime[1],
        startDealDate: transactionTime && transactionTime[0],
        endDealDate: transactionTime && transactionTime[1],
        verificationStartTime: verificationTime && verificationTime[0],
        verificationEndTime: verificationTime && verificationTime[1],
      };
      this.mixinkeepTable(true);
    },
    handleUpdate(row, type, operationType) {
      const { id } = row;
      const { activeName } = this.tabsConfig;
      if (activeName == 1) {
        this.$refs[type]?.show(row, type, operationType);
      } else {
        const idList = this.$refs[
          `tableRef${+this.tabsConfig.activeName}`
        ][0].tableData.map((e) => e.id);
        this.$router.push({
          path: "/settlementManagement/billConfirmed/waterDetail",
          query: {
            id,
            backPath: this.$route.path,
            pageSign: idList.join(","), // 详情显示上一页/下一页
          },
        });
      }
    },
    getQueryParams(tab) {
      const { activeName } = this.tabsConfig;
      const { companyByName, ...nObj } = this.searchFromData[tab] || {};
      return {
        ...nObj,
        status: activeName === "1" ? "1" : "2",
        payType: 0, // 0-应付
      };
    },
    getInitialData() {
      const arr=this.tabconfigBtns.filter((e)=>{
        return hasBtnPermits(e.hasPermission)
      })
      this.$set(this.tabsConfig,'btnArr',arr)
      this.showSearchForm = true;
      // getFirstInitData({
      //   httpRequest: logisticsCustomerInfo,
      // }).then((res) => {
      //   this.tabsConfig.tabs.map((e) => {
      //     this.searchFromData[e.name] = {
      //       companyBy: res.id,
      //       companyByName: `${res.code}[${res.shortName}]`,
      //     };
      //   });
      //   this.showSearchForm = true;
      // });
    },
    searchTabForm(tName) {
      return {
        ...this.searchFormConfig,
        lists: paymentSearchColumns(tName), // 搜索表单渲染列表
        formModel: {
          ...this.searchFromData[tName], // tab1默认筛选，tab2不默认
        },
      };
    },
    tableTabConfig(tName) {
      return paymentTableColumns(tName);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
