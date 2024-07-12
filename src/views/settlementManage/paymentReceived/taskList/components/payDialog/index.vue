<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      :confirmClose="confirmClose"
      class="audit-dialog"
    >
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
        >
          <template v-slot:tableData="slotProp">
            <div>
              <span>明细：</span>
            </div>
            <div>
              <ComTable
                :ref="`tableRef`"
                :columnConfig="tableConfig.columnConfig"
                :columnData="tableConfig.columnData"
              >
              </ComTable>
              <div class="grand-total">
                <span class="title">小计：</span>
                <span>{{ subtotalMoney }}</span>
              </div>
            </div>
          </template>
        </ComForm>
      </template>
    </ComDialog>
  </div>
</template>


<script>
import { formConfig, tableConfig } from "./model.js";
import {
  cashierPaymentCheck,
  batchPaymentCheck,
} from "@/api/settlementManage/paymentReceived.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  // props: {
  //   appendToBody: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  data() {
    return {
      confirmClose: false,
      customDialogConfig: {
        title: "批量付款登记",
        width: "1000px",
        appendToBody: this.appendToBody || false,
        footer: [
          {
            text: "保存",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm?.submitForm();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitBefore, // 表单提交接口
        successFunction: this.handleFormSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "90px",
        lists: formConfig.batchPayLists.lists, // 表单渲染列表
        formRules: formConfig.batchPayLists.formRules, // 表单校验规则
      },
      tableConfig: {
        httpRequest: cashierPaymentCheck,
        columnConfig: tableConfig.lists,
        columnData: [],
      },
    };
  },
  created() {},
  methods: {
    show(row) {
      //类型与流程初始化为第一个选项
      const { id, selectLists } = row;
      cashierPaymentCheck(id).then((res) => {
        const bankReceiptCheckBy = selectLists[0].bankReceiptCheckBy;
        const remark = selectLists[0].remark;
        const { accountBillInfos } = res.data;
        console.log("accountBillInfos", accountBillInfos);
        this.tableConfig.columnData = accountBillInfos;
        this.formConfig.formModel = {
          id: id,
          poll: selectLists.length,
          bankReceiptCheckBy,
          remark,
        };
        this.calcTotal(this.tableConfig.columnData);
        this.$refs.dialogForm?.setFormModel(this.formConfig.formModel);
        this.$refs.customDialog.show();
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    calcTotal(list = []) {
      //currencyCode--币种   totalMoney--金额   暂无字段
      let moneyArr = [];
      list.forEach((e) => {
        const curIndex = moneyArr.findIndex(
          (m) => m.currencyCode === e.currencyCode
        );
        if (curIndex > -1) {
          moneyArr[curIndex].totalMoney += +e.totalMoney;
        } else {
          moneyArr.push({
            currencyCode: e.currencyCode,
            totalMoney: +e.totalMoney,
          });
        }
      });
      this.subtotalMoney = moneyArr
        .map((e) => e.totalMoney.toFixed(2) + e.currencyCode)
        .join(" + ");
    },
    submitBefore(formModel) {
      //提交
      const { id, bankReceiptCheckBy, remark } = formModel;
      const params = {
        id: id.split(","), //id (v1.0.6改动)
        bankReceiptCheckBy,
        remark,
      };
      return batchPaymentCheck(params);
    },
    handleFormSuccess() {
      //提交成功后回调
      this.hide();
      this.$emit("handleSuccess");
    },
  },
};
</script>
<style lang="scss" scoped>
.audit-dialog {
  /deep/ {
    .grand-total {
      display: flex;
      justify-content: flex-start;
    }
  }
}
</style>
