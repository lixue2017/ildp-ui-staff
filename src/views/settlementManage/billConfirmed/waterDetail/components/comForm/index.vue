<template>
  <ComForm ref="searchTabForm" :formConfig="formConfig">
    <template v-slot:bsAccountInfo="slotProps">
      <div class="content-bsAccountInfo">
        <div class="title">
          {{ formData.payType == 1 ? "收款" : "付款" }}账户(BS账号)
        </div>
        <div
          class="content"
          v-for="(item, index) in accountInfo.bsAccountInfo"
          :key="index"
        >
          <div class="content-label">{{ item.label }}：</div>
          <TooltipOver
            :content="slotProps.formModel[item.value] || '--'"
            :style="{
              maxWidth: `calc(${
                slotProps.formModel.buyerId ? '50%' : '100%'
              } - 105px)`,
            }"
          />
          <i
            v-if="!['receiptPaymentAccountAddress'].includes(item.value)"
            class="txt-copy el-icon-document-copy"
            @click="handleCopyText(slotProps.formModel[item.value] || '--')"
          ></i>
        </div>
      </div>
      <div
        class="content-invoice-info"
        v-if="slotProps.formModel.buyerInvoiceTitle"
      >
        <div class="title">发票信息(收款方)</div>
        <div
          class="content"
          v-for="(item, index) in accountInfo.payee"
          :key="index"
        >
          <div class="content-label">{{ item.label }}：</div>
          <TooltipOver
            :content="slotProps.formModel[item.value] || '--'"
            :style="{
              maxWidth: 'calc(100% - 105px)',
            }"
          />
          <i
            v-if="!['sellerAccount'].includes(item.value)"
            class="txt-copy el-icon-document-copy"
            @click="handleCopyText(slotProps.formModel[item.value] || '--')"
          ></i>
        </div>
      </div>
    </template>
    <template v-slot:counterpartInfo="slotProps">
      <div class="content-bsAccountInfo">
        <div class="title">对方账号信息</div>
        <div
          class="content"
          v-for="(item, index) in accountInfo.counterpartInfo"
          :key="index"
        >
          <div class="content-label">{{ item.label }}：</div>
          <TooltipOver
            :content="slotProps.formModel[item.value] || '--'"
            :style="{
              maxWidth: `calc(${
                slotProps.formModel.sellerId ? '50%' : '100%'
              } - 105px)`,
            }"
          />
          <i
            v-if="!['openingAddress'].includes(item.value)"
            class="txt-copy el-icon-document-copy"
            @click="handleCopyText(slotProps.formModel[item.value] || '--')"
          ></i>
        </div>
      </div>
      <div
        class="content-invoice-info"
        v-if="slotProps.formModel.sellerInvoiceTitle"
      >
        <div class="title">发票信息(付款方)</div>
        <div
          class="content"
          v-for="(item, index) in accountInfo.payer"
          :key="index"
        >
          <div class="content-label">{{ item.label }}：</div>
          <TooltipOver
            :content="slotProps.formModel[item.value] || '--'"
            :style="{
              maxWidth: 'calc(100% - 105px)',
            }"
          />
          <i
            v-if="!['buyerAccount'].includes(item.value)"
            class="txt-copy el-icon-document-copy"
            @click="handleCopyText(slotProps.formModel[item.value] || '--')"
          ></i>
        </div>
      </div>
    </template>
  </ComForm>
</template>

<script>
import { comFormConfig } from "./model.js";
import { handleCopyText } from "@/utils/confirmBox.js";
export default {
  props: {
    WEBType: {
      type: String,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  data() {
    const { payType } = this.formData; //payType 0应付 1应收
    const { lists, formRules } = comFormConfig({
      WEBType: this.WEBType,
      payType,
    });
    return {
      formConfig: {
        formModel: {}, // 表单数据
        httpRequest: this.handleRequest,
        size: "small",
        labelWidth: "85px",
        lists,
        formRules,
      },
      accountInfo: {
        bsAccountInfo: [
          { label: "账号名称", value: "receiptPaymentAccountName" },
          { label: "开户行", value: "receiptPaymentAccountBank" },
          { label: "银行账号", value: "receiptPaymentBankAccount" },
          { label: "公司地址", value: "receiptPaymentAccountAddress" },
        ],
        payee: [
          { label: "销售方", value: "sellerName" },
          { label: "抬头", value: "sellerInvoiceTitle" },
          { label: "开户行", value: "sellerAccountsBank" },
          { label: "开户账号", value: "sellerAccount" },
        ],
        counterpartInfo: [
          { label: "账号名称", value: "accountName" },
          { label: "开户行", value: "openingBank" },
          { label: "银行账号", value: "bankAccount" },
          { label: "公司地址", value: "openingAddress" },
        ],
        payer: [
          { label: "购买方", value: "buyerName" },
          { label: "抬头", value: "buyerInvoiceTitle" },
          { label: "开户行", value: "buyerAccountsBank" },
          { label: "开户账号", value: "buyerAccount" },
        ],
      },
      handleCopyText,
    };
  },
  created() {
    this.setForm();
  },
  methods: {
    setForm() {
      this.formConfig.formModel = this.formData;
      this.$refs.searchTabForm?.setFormModel(this.formConfig.formModel);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ {
  .base-flex-between {
    justify-content: flex-start;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
}
.content-bsAccountInfo,
.content-invoice-info {
  margin-top: 20px;
  margin-bottom: 13px;
  .title {
    font-size: 14px;
    font-weight: bold;
    color: #515151;
  }
  .content {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 400;
    .content-label {
      width: 72px;
      text-align: right;
      color: #8b8b8b;
    }
    .txt-copy {
      font-size: 18px;
      margin-left: 6px;
      color: #5094ff;
      cursor: pointer;
    }
  }
}
.content-bsAccountInfo {
  width: 100%;
  background: #f8f8f8;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  padding: 15px 20px;
}
.content-invoice-info {
  width: 50%;
  position: absolute;
  top: -4px;
  right: -6px;
  z-index: 1;
  padding: 16px 20px 8px;
  background: #f6f9ff;
  box-shadow: 0px 0px 4px 0px #ebebeb;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
}
</style>
