<template>
  <div class="wallet-class">
    <div class="content-card">
      <MoneyCard :formData="formData" />
    </div>
    <div class="content-title">
      <span>账单明细</span>
      <span
        >* 充值审核通过、额度审核通过、一件代发核销扣款 对钱包余额产生影响</span
      >
    </div>
    <div class="content-info">
      <ComForm
        ref="searchTabForm"
        :formConfig="searchFormConfig"
        v-if="showSearchForm"
      >
      </ComForm>
      <ComTable
        class="table-class"
        ref="tableRef"
        :columnConfig="tableConfig.columnConfig"
        :httpRequest="tableConfig.httpRequest"
        :getQueryParams="getQueryParams"
        v-if="showSearchForm"
      >
      </ComTable>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { searchForm, tableColumns } from "./model.js";
import { postCustomerWalletOptInfoGetPage } from "@/api/customerManage/customerList.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: false,
        size: "small",
        labelWidth: "80px",
        lists: searchForm,
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        columnConfig: tableColumns,
        httpRequest: postCustomerWalletOptInfoGetPage,
      },
      showSearchForm: false,
      searchFromData: {},
    };
  },
  mounted() {},
  created() {
    this["dictionary/getDictionary"]([
      "walletOptBusinessType",
      "walletOptEffectType",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchList(formModel) {
      const { createTime, ...obj } = formModel;
      this.searchFromData = {
        ...obj,
        createTimeGe: createTime && createTime[0],
        createTimeLe: createTime && createTime[1],
      };
      this.$refs.tableRef?.refreshTable();
    },
    getQueryParams() {
      const { customerId } = this.formData;
      return {
        ...this.searchFromData,
        customerId,
      };
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    MoneyCard: () => import("./moneyCard"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
};
</script>

<style lang="scss" scoped>
.wallet-class {
  .content-title {
    margin-top: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #e2e2e2;
    span {
      &:nth-child(1) {
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        padding: 14px 0 11px;
        color: #515151;
      }
      &:nth-child(2) {
        margin-left: 15px;
        color: #3179ef;
      }
    }
  }
  .content-info {
    .table-class {
      margin-top: 15px;
    }
  }
}
</style>
