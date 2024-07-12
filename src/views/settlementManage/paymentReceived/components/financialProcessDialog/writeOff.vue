<template>
  <ComDialog ref="dialogRef" :customDialog="dialogConfig">
    <template v-slot:content>
      <div class="flex-space-between write-off-content">
        <ComForm
          :style="`max-width: calc(100% - ${isInternalFlow ? 0 : 310}px)`"
          ref="dialogFormRef"
          :formConfig="{
            ...editFormConfig,
            ...(isInternalFlow
              ? directWriteOffFormConfig({
                  isJoinBs: !!editFormConfig.formModel.isJoinBs,
                })
              : writeOffFormConfig()),
          }"
          class="dialog-form"
          @handleChange="handleChange"
          v-if="$refs.dialogRef && $refs.dialogRef.dialogVisible"
        >
          <template
            v-for="(sItem, sIdx) in currencySlotArr"
            v-slot:[sItem.numKey]="{ formModel, fieldItem }"
          >
            <div class="flex-space-between number-select" :key="`c_${sIdx}`">
              <el-input-number
                :placeholder="fieldItem.placeholder"
                v-model="formModel[sItem.numKey]"
                v-input-number-limit="fieldItem.decimal"
                :controls="false"
                @input.native="
                  (e) =>
                    currencyInpChange(e, sItem, !!formModel.isAllVerification)
                "
              />
              <el-select
                v-model="formModel[sItem.currencyKey]"
                placeholder="币别"
                @change="(val) => changeSelect(val, sItem)"
              >
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </template>

          <template v-slot:exchangeRate="{ formModel, fieldItem }">
            <div class="base-flex-between">
              <el-input-number
                v-model="formModel.exchangeRate"
                v-input-number-limit="fieldItem.decimal"
                :min="0"
                :controls="false"
                placeholder="购汇汇率"
                :disabled="
                  !!formModel.isAllVerification ||
                  formModel.bankReceiptCurrencyId === formModel.currencyId
                "
                @change="handleFormChange"
              ></el-input-number>
              <el-checkbox
                @change="() => changeAllOff()"
                class="all-off-check"
                v-if="formModel.bankReceiptCurrencyId !== formModel.currencyId"
                :true-label="1"
                :false-label="0"
                v-model="formModel.isAllVerification"
                >全部核销</el-checkbox
              >
            </div>
          </template>

          <template v-slot:receiptPaymentAccount="slotProps">
            <AutoComplete
              ref="paymentAccountRef"
              :formModel="slotProps.formModel"
              :fieldItem="slotProps.fieldItem"
              :additionalParam="{
                customerId: slotProps.formModel.businessCompany /** 主体 */,
                currencyId: slotProps.formModel.currencyId /** 核销币别 */,
              }"
            />
          </template>

          <template v-slot:slotImgList="{ formModel }">
            <div class="custom-preview-image">
              <template v-for="(item, index) in formModel.picUrl">
                <el-image
                  v-if="item"
                  :src="item"
                  :key="index"
                  :preview-src-list="formModel.picUrl"
                >
                </el-image>
              </template>
            </div>
          </template>
          <template v-slot:businessCompanyObj="slotProps">
            <AutoComplete
              ref="tempRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                handle: payerHandle,
                getSearchOptions: payerHandleSearch,
                disabledArr: [slotProps.formModel.accountId],
              }"
              :additionalParam="{
                currencyId: slotProps.formModel.currencyId,
                customerId: slotProps.formModel.businessCompany,
              }"
            />
          </template>
          <template v-slot:accountId="slotProps">
            <AutoComplete
              ref="tempRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                disabledArr: [slotProps.formModel.receiptPaymentAccount],
                handle: handleCollection,
              }"
              :additionalParam="{}"
            />
            <!-- customerId: slotProps.formModel.dealingsCompany, -->
          </template>
          <template v-slot:collMoney="slotProps">
            <div class="coll-money">
              <el-input-number
                v-model="slotProps.formModel.collMoney"
                v-input-number-limit="{
                  value: 2, // 几位小数限制
                  maxNumber: 9999999999.99, // 最大值限制
                }"
                :min="0"
                :precision="2"
                :controls="false"
                controls-position="right"
                placeholder="收款金额"
              />
              <!-- @change="(val) => handleChange(val, 'collMoney')" -->
              <span v-if="slotProps.formModel.collCurrencyCode">{{
                slotProps.formModel.collCurrencyCode
              }}</span>
            </div>
          </template>
        </ComForm>

        <SurplusAmount
          v-if="!isInternalFlow"
          :amountData="{
            ...editFormConfig.formModel,
            remainingPayment,
            isRemainingPayment: true,
          }"
        />
      </div>
    </template>
  </ComDialog>
</template>

<script>
import { querySearchList } from "@/api/common";
import { customMessageBox } from "@/utils/confirmBox.js";
import {
  submitBatchVerification,
  postInteriorVerification,
} from "@/api/settlementManage/paymentReceived.js";
import { writeOffFormConfig, directWriteOffFormConfig } from "./modelProcess";
import { formatDate } from "@/utils/index.js";

export default {
  data() {
    return {
      dialogConfig: {
        useFooter: "footer",
        footer: [
          {
            text: "保存",
            type: "primary",
            handleClick: () => {
              if (!this.isInternalFlow) {
                this.handleCheckTip();
              } else {
                this.$refs.dialogFormRef.submitForm();
              }
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.dialogRef.handleClose();
            },
          },
        ],
        width: "1000px",
        title: "付款核销",
      },
      editFormConfig: {
        formModel: {},
        isAttachFileId: true,
        httpRequest: this.editDlgRequest, // 表单提交接口
      },
      currencySlotArr: [
        {
          numKey: "verificationMoney", // 核销金额
          currencyKey: "currencyId",
        },
        {
          numKey: "serviceCharge", // 手续费
          currencyKey: "serviceChargeCurrencyId",
        },
      ],
      remainingPayment: 0, // 预计剩余付款金额
      isInternalFlow: false,
      unitList: [],
      directWriteOffFormConfig,
      writeOffFormConfig,
    };
  },
  methods: {
    /** 汇率计算 */
    changeSelect(val, sItem) {
      // console.log('changeSelect==', val, sItem);
      if (sItem.numKey === "verificationMoney") {
        this.$refs.paymentAccountRef?.changeFocusRequest();
        let changeObj = {
          receiptPaymentAccount: "",
        };
        const { bankReceiptCurrencyId, surplusMoney } =
          this.editFormConfig.formModel;
        if (val === bankReceiptCurrencyId) {
          Object.assign(changeObj, {
            exchangeRate: "1.0000",
            verificationMoney: surplusMoney,
          });
          this.remainingPayment = 0;
        }
        this.$refs.dialogFormRef?.setFormModel(changeObj);
      }
    },
    currencyInpChange(e, sItem, isCheckedAll) {
      if (sItem.numKey === "verificationMoney") {
        if (!e.target.value) {
          return;
        }
        const { surplusMoney } = this.editFormConfig.formModel;
        if (isCheckedAll) {
          this.changeAllOff(e.target.value);
          return;
        }
        const RATE_NUM =
          this.$refs.dialogFormRef?.getFormModelVal("exchangeRate") || 1;
        this.remainingPayment = RATE_NUM
          ? surplusMoney - e.target.value / RATE_NUM
          : surplusMoney;
      }
    },
    handleFormChange(val) {
      const { surplusMoney } = this.editFormConfig.formModel;
      const MONEY_NUM =
        this.$refs.dialogFormRef?.getFormModelVal("verificationMoney") || 0;
      this.remainingPayment = val
        ? surplusMoney - MONEY_NUM / val
        : surplusMoney;
    },
    changeAllOff(val) {
      const { surplusMoney } = this.editFormConfig.formModel;
      if (surplusMoney) {
        const MONEY_NUM =
          val ||
          this.$refs.dialogFormRef?.getFormModelVal("verificationMoney") ||
          0;
        this.$refs.dialogFormRef?.setFormModel({
          exchangeRate: (MONEY_NUM / surplusMoney).toRoundFixed(10),
        });
        this.remainingPayment = 0;
      } else if (!val) {
        this.$refs.dialogFormRef?.setFormModel({
          exchangeRate: 1,
          verificationMoney: 0,
        });
        this.remainingPayment = 0;
      }
    },
    payerHandle(payerObj) {
      this.$refs.dialogFormRef?.setFormModel(
        {
          businessCompany: payerObj.customerId || "",
          receiptPaymentAccount: payerObj.id || "",
          receiptPaymentBankAccount: payerObj.bankAccount || "",
          receiptPaymentAccountOpeningBank: payerObj.openingBank || "",
        },
        false,
        "resetFields"
      );
    },
    payerHandleSearch(rows = []) {
      const { businessCompanyObj } = this.editFormConfig.formModel;
      const obj = rows.find((e) => e.id == businessCompanyObj?.id);
      if (obj?.id) {
        this.payerHandle(obj);
      }
    },
    handleCollection(obj) {
      this.$refs.dialogFormRef?.setFormModel({
        openingBank: obj.openingBank || "",
        bankAccount: obj.bankAccount || "",
        collCurrencyCode: obj.currencyCode || "",
        accountName: obj.accountName || "",
      });
    },
    handleChange(val, prop) {
      if (prop === "isJoinBs") {
        this.editFormConfig.formModel.isJoinBs = val;
        if (!val) {
          this.$refs.dialogFormRef?.setFormModel({
            collMoney: undefined,
          });
        }
        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs.dialogFormRef?.renewForm();
          });
        });
      }
    },
    async editShowDlg(
      row,
      {
        editSuccess,
        // mode_type = 0
      }
    ) {
      // 判断财务内部单
      this.isInternalFlow = [0, "0", "4", 4].includes(row.flowType);
      const writeOffConfig = this.isInternalFlow
        ? directWriteOffFormConfig()
        : writeOffFormConfig();

      this.dialogConfig = {
        ...this.dialogConfig,
        width: this.isInternalFlow ? "800px" : "1000px",
      };
      console.log("this.isInternalFlow", this.isInternalFlow);
      this.editFormConfig = {
        ...this.editFormConfig,
        labelWidth: "100px",
        formModel: {
          ...row,
          isJoinBs: row.isJoinBs ? true : false,
          collCurrencyCode: "",
          receiptPaymentAccount: undefined, // 内部的付款账号id
          serviceCharge: undefined, // 手续费
          serviceChargeCurrencyId: row.currencyId,
          verificationMoney: row.surplusMoney,
          // picUrl: ['http://47.107.237.68/profile/customer/2022/12/16/de91ac0d-fd36-4fe3-adb4-6f105f3dc4c2.png'],
          bankReceiptCurrencyId: row.currencyId,
          exchangeRate: "1.0000", // 汇率
          isAllVerification: 0, // 是否完全核销(0:否/1:是)
          dealDate: this.isInternalFlow
            ? row.latestPaymentDate
            : row.latestPaymentDate, //内部单没有这个字段，等后端定取值字段
          businessCompanyObj:
            this.isInternalFlow && row.accountId == row.receiptPaymentAccount
              ? undefined
              : { id: row.receiptPaymentAccount },
        },
        successFunction: (res) => {
          editSuccess && editSuccess(res);
          this.msgSuccess("保存成功");
          this.$refs.dialogRef.hide();
        },
        formRules: writeOffConfig.formRules,
        lists: writeOffConfig.columns,
      };
      this.remainingPayment = 0;
      this.$refs.dialogRef.show();
      this.getCurrency();
    },
    handleCheckTip() {
      if (this.remainingPayment < 0) {
        return this.msgError("预计剩余付款金额不能小于0");
      }
      if (this.remainingPayment == 0) {
        customMessageBox(
          this,
          {
            msgTitle: "当前付款单核销完成",
            msgTxt1: "",
            msgTxt2: "核销完成之后此付款单完结，你还要继续吗？",
            confirmButtonText: "继 续",
          },
          () => {
            this.$refs.dialogFormRef.submitForm();
          }
        );
      } else {
        customMessageBox(
          this,
          {
            msgTitle: `当前付款单还剩 ${this.formatMoney(
              this.remainingPayment,
              4
            )} ${this.editFormConfig.formModel.currencyCode} 未核销`,
            msgTxt1: "",
            msgTxt2: "此付款任务单可被再次付款，你还要继续吗？",
            confirmButtonText: "继 续",
          },
          () => {
            this.$refs.dialogFormRef.submitForm();
          }
        );
      }
    },
    editDlgRequest(formOpt) {
      // console.log('formOpt==', formOpt)
      let optArr = [
        "dealDate",
        "verificationMoney",
        "exchangeRate",
        "receiptPaymentAccount",
        "serviceCharge",
        "serviceChargeCurrencyId",
        "isAllVerification",
        "remark",
      ];
      let flowParam = {
        currencyId: formOpt.bankReceiptCurrencyId,
      };
      let verificationRequest = submitBatchVerification;
      if (this.isInternalFlow) {
        // 财务内部单
        flowParam = {};
        optArr = [
          "businessCompany",
          "receiptPaymentAccount",
          "receiptPaymentBankAccount",
          "receiptPaymentAccountOpeningBank",
          "dealDate",
          "accountName",
          "openingBank",
          "bankAccount",
          "verificationRemark",
          "collMoney",
          "isJoinBs",
          "accountId",
        ];
        verificationRequest = postInteriorVerification;
      }
      const optObj = optArr.reduce(
        (opt, key) => {
          if (key === "isJoinBs") {
            opt[key] = formOpt[key] ? 1 : 0;
          } else {
            opt[key] = formOpt[key];
          }
          return opt;
        },
        {
          ...flowParam,
          id: formOpt.id,
        }
      );
      if (!this.isInternalFlow) {
        optObj.id = [optObj.id];
        optObj.dealDate &&
          (optObj.dealDate = formatDate(optObj.dealDate, "-", "date"));
        optObj.currencyCode = formOpt.currencyId;
        optObj.serviceChargeCurrencyCode = formOpt.serviceChargeCurrencyId;
      }
      console.log("formOpt==", formOpt, optObj);
      return verificationRequest(optObj);
      // return new Promise((resolve, reject) => {
      //   resolve()
      // })
    },
    getCurrency() {
      // 获取币别
      if (this.unitList.length) {
        return;
      }
      querySearchList({
        type: "currency",
        pageNum: 1,
        pageSize: 999,
      }).then((res) => {
        this.unitList = (res.rows || []).map((c) => ({
          label: c.code,
          value: c.id,
        }));
      });
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    SurplusAmount: () => import("./amountDlg"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
// @import "~@/assets/styles/variables.scss";
.write-off-content {
  .number-select {
    /deep/ {
      .el-input-number {
        .el-input__inner {
          border-radius: 4px 0 0 4px;
        }
      }
      .el-select {
        .el-input__inner {
          border-left: none;
          border-radius: 0 4px 4px 0;
        }
      }
    }
  }
  .all-off-check {
    margin-left: 10px;
    margin-right: 0;
  }
  .coll-money {
    display: flex;
    /deep/ {
      .el-input-number {
        flex: 1;
      }
    }
    & > span {
      margin-left: 10px;
    }
  }
}
</style>
