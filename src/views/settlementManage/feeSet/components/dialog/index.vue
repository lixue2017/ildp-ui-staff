<template>
  <!-- 结算管理-费用基本信息-账户管理-新增删除 -->
  <ComDialog
    ref="customDialog"
    :customDialog="customDialogConfig"
    class="airline-dialog"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:customerId="slotProps">
          <AutoComplete
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              handle: customerIdChange,
            }"
          />
        </template>
        <template v-slot:currency="slotProps">
          <AutoComplete
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              handle: currencyChange,
              getSearchOptions: currencyCurrency,
            }"
          />
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>


<script>
import { mapState } from "vuex";
import { config, formRulesLists } from "./model.js";
import {
  addBankInfo,
  editBankInfo,
} from "@/api/customerManage/customerList.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  // props: {
  //   appendToBody: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      customDialogConfig: {
        title: "操作接单",
        width: "900px",
        dataStatus: 0,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
          {
            text: "确 认",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
        ],
        type: "",
      },
      formConfig: {
        formModel: {},
        httpRequest: this.editPopBill, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    editPopBill(form) {
      //确认

      const {
        id,
        customerId: { id: customerId },
        bankAccount,
        currency,
        openingBank,
        openingBankEn,
        accountName,
        accountNameEn,
        openAddress,
        openAddressEn,
        taxNumber,
        invoiceTitle,
        phone,
        remark,
        isApplyInvoice,
      } = form;
      const params = {
        id,
        customerId,
        bankAccount,
        currency,
        openingBank,
        openingBankEn,
        accountName,
        accountNameEn,
        openAddress,
        openAddressEn,
        taxNumber,
        invoiceTitle,
        phone,
        remark,
        isApplyInvoice: isApplyInvoice ? 1 : 0,
      };
      if (id) {
        return editBankInfo(params);
      } else {
        return addBankInfo(params);
      }
    },
    show(row = {}, config = {}) {
      const { isApplyInvoice } = row;
      const { lists, formRules, width, labelWidth, title } = config;
      const { customerId, currencyId, customerName } = row;
      this.formConfig = {
        ...this.formConfig,
        lists,
        formRules,
        labelWidth,
        formModel: {
          ...row,
          customerId: {
            id: customerId || "",
          },
          customerName: customerName,
          currency: currencyId,
          isApplyInvoice: row.id ? (isApplyInvoice == 1 ? true : false) : true,
        },
      };
      this.customDialogConfig = {
        ...this.customDialogConfig,
        width,
        title,
      };
      this.$refs.customDialog.show(row);
    },
    customerIdChange(row) {
      //手动选择
      const { code } = row;
      this.$refs.dialogForm?.setFormModel({
        code: code || "",
      });
    },
    currencyChange(row) {
      //手动选择货币时修改校验
      let ruleValide = {}; //ruleValide需要新增的表单校验
      let removeRule = []; //removeRule需要移除的表单校验
      if (row == 1) {
        //人民币
        removeRule = ["invoiceTitle", "openAddress"];
      } else {
        //外币
        ruleValide = {
          openAddress: formRulesLists["openAddress"],
          invoiceTitle: formRulesLists["invoiceTitle"],
        };
      }
      this.$refs.dialogForm?.setFormRules(ruleValide, removeRule); //根据用户的选择新增与删除校验
    },
    currencyCurrency(rows) {
      //修改的时候初始化
      const { currency } = this.formConfig.formModel;
      const row = rows.filter((e) => e.id == currency);
      this.currencyChange(row[0]?.id);
    },
    handleSuccess(res = {}) {
      this.$emit("handleSuccess");
      this.hide();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
