<template>
  <div>
    <ComDrawer
      class="add-cabinet-arrangement"
      ref="myDrawer"
      :customDrawer="drawerConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <ComDetailTop title="添加" :config="{}" />
        <ComForm :formConfig="searchFormConfig" v-show="isFormShow" />
        <ComTable
          :ref="`tableDrawerRef`"
          v-if="isFormShow"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableConfig.columnConfig"
          :httpRequest="tableConfig.httpRequest"
          :getQueryParams="getSearchParams"
          @onSelectionChange="onSelectionChangeEvt"
          :selectionTableRow="[...checkTableArr]"
          rowKey="accountBillId"
          selectionKey="accountBillId"
        >
          <template v-slot:bottomTotal>
            <div class="grand-total">
              <span class="title">小计：</span>
              <span>{{ subtotalMoney }}</span>
            </div>
          </template>
        </ComTable>
      </template>
    </ComDrawer>
  </div>
</template>

<script>
import { postInvoiceBill } from "@/api/settlementManage/paymentReceived";
// import { mapState } from "vuex";
import { accumulationFn } from "@/utils/instructions";
import { searchDrawerFormCols, tableDrawerCols } from "./model";
export default {
  props: {},
  data() {
    return {
      drawerConfig: {
        title: "",
        width: "1288px",
        size: "small",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: this.hide,
          },
          {
            text: "确定",
            type: "primary",
            disabled: true,
            handleClick: () => {
              this.$emit("handleCheckClick", [...this.checkTableArr]);
              this.hide();
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "75px",
        lists: searchDrawerFormCols(),
        formRules: {},
      },
      tableConfig: {
        tableHeight: "calc(100vh - 262px)",
        httpRequest: postInvoiceBill,
        columnConfig: tableDrawerCols(),
      },
      isFormShow: false, // 阻止自动聚焦与表格选择缓存
      searchFromData: {},
      checkTableArr: [],
      addInvoiceObj: {},
      backIds: [],
    };
  },
  methods: {
    getTableList(searchFrom = {}) {
      this.searchFromData = { ...searchFrom };
      this.$refs[`tableDrawerRef`]?.refreshTable();
    },
    onSelectionChangeEvt(arr = []) {
      this.checkTableArr = arr;
      this.$set(this.drawerConfig.footer[1], "disabled", !arr.length);
    },
    show(rows, obj) {
      this.checkTableArr = [];
      this.addInvoiceObj = obj;
      this.backIds = rows.map((e) => e.accountBillId);
      this.$refs.myDrawer.show();
      this.$nextTick(() => {
        this.isFormShow = true;
      });
    },
    hide() {
      (this.isFormShow = false), this.$refs.myDrawer.hide();
    },
    getSearchParams() {
      const { dealingsCompany, businessCompany, invoiceCurrencyObj } =
        this.addInvoiceObj;
      return {
        ...this.searchFromData,
        // dealingsCompanyList: dealingsCompany
        //   ? dealingsCompany.toString().split(",")
        //   : undefined,
        businessCompany,
        invoiceCurrencyId: invoiceCurrencyObj.value,
        rejectAccountBillId: this.backIds, // 排除已选中的
      };
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  computed: {
    // ...mapState(["dictionary"]),
    subtotalMoney() {
      let moneyArr = [];
      (this.checkTableArr || []).forEach((e) => {
        const curIndex = moneyArr.findIndex(
          (m) => m.currencyCode === e.currencyCode
        );
        if (curIndex > -1) {
          moneyArr[curIndex].totalMoney = accumulationFn([
            moneyArr[curIndex].totalMoney,
            +e.totalMoney,
          ]);
        } else {
          moneyArr.push({
            currencyCode: e.currencyCode,
            totalMoney: +e.totalMoney,
          });
        }
      });
      return (
        moneyArr
          .map((e) => this.formatMoney(e.totalMoney) + e.currencyCode)
          .join(" + ") || 0
      );
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.add-cabinet-arrangement {
  .operation-content {
    .iconfont {
      font-size: 13px;
      margin-right: 2px;
    }
  }
  /deep/ .el-drawer {
    .com-detail-top {
      margin-bottom: 20px;
      padding: 20px 0 0 0;
    }
    .el-table--medium td {
      padding: 7px 0;
    }
    .el-drawer__header {
      display: none;
    }
    .my-pagination-container {
      text-align: left;
      padding: 12px 0;
      position: absolute;
      bottom: 0;
    }
  }
  .grand-total {
    display: flex;
    justify-content: flex-start;
    .title {
      margin-right: -30px;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.estimate-header {
  display: flex;
  span {
    flex: 1;
    padding: 0 3px;
  }
}
.estimate-row {
  span {
    flex: 1;
    padding: 0 3px;
  }
}
</style>
