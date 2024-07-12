<template>
  <div>
    <ComDialog
      ref="dialogRef"
      :customDialog="dialogConfig"
      :dialogBoxCenter="true"
    >
      <template v-slot:content>
        <div :class="formConfig.className">
          <ComForm
						ref="formRef"
						v-if="$refs.dialogRef && $refs.dialogRef.dialogVisible"
            :formConfig="formConfig"
						@handleChange="handleChange"
          >
						<template v-slot:accountObj="slotProps">
							<AutoComplete
								:formModel="slotProps.formModel"
								:fieldItem="{
									...slotProps.fieldItem,
									handle: handleAutoSelect
								}"
								:additionalParam="{
									customerId: slotProps.formModel.businessCompany
								}"
							/>
						</template>

          </ComForm>
        </div>
      </template>
    </ComDialog>

		<ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { querySearchList } from "@/api/common";
import { postExpensePayeeInfo, postExpensePayeeCheck, postExpensePayeeVerification, postExpensePayeeRepulse } from "@/api/settlementManage/paymentReceived.js";
import { mapActions } from "vuex";
import { formatDate } from "@/utils/index.js";
// import { msgTipBox } from "@/utils/confirmBox.js";
import { editDlgFormCols, dlgFormRules } from "./model.js";
// import { remarkDialogCols } from "_comp/ConfirmDialog/customFormDialog/model.js"

export default {
  props: {

  },
  data() {
    return {
      dialogConfig: {
				appendToBody: true,
				width: '1100px',
        footer: [{
					text: "确定",
					type: "primary",
					handleClick: () => {
						this.$refs.formRef.submitForm();
					},
				}, {
					text: "取消",
					plain: true,
					handleClick: () => {
						this.$refs.dialogRef.handleClose();
					},
				},],
      },
			// footerBtnRepulse: {
			// 	text: "打回",
			// 	plain: true,
			// 	handleClick: this.handleRepulse,
			// },
      formConfig: {
				labelWidth: '100px',
				isAttachFileId: true,
				httpRequest: this.submitRequest,
			},
			mType: '' // 模板区分
    };
  },
  methods: {
    async showDialog(row, {
			modelType
		}) {
			const infoObj = await this.comRepeatedRequest(this, postExpensePayeeInfo, {id: row.id});
			const { accountId, bankReceiptCurrencyId, accountName, bankAccount, openAddress,
				serialCode, ...nObj} = infoObj.data || {}
			// console.log('infoObj==', infoObj)
			this.mType = modelType;
			this.dialogConfig.title = `收款${modelType === "confirm" ? "确认" : "核销"}(${serialCode || '--'})`;
      this.formConfig = {
				...this.formConfig,
        formModel: {
					...nObj,
					// attachId: "567,231",
					accountObj: {
						value: accountId,
						currencyId: bankReceiptCurrencyId,
						accountName,
						bankAccount,
						openAddress,
					},
					bankAccount,
					// dealDate: formatDate(new Date(), "-", "date")
				},
        successFunction: this.editSuccess,
        lists: editDlgFormCols({
					modelType: modelType === "confirm" ? "collectionConfirm" : "collectionWriteOff"
				}),
        formRules: dlgFormRules(),
      };
			this.getCurrency();
    },
		handleAutoSelect(aObj) {
			this.$refs.formRef.setFormModel({
				openingBank: aObj.openingBank || "",
				bankReceiptCurrencyCode: aObj.currencyCode || ""
			})
			this._expensePayeeInfo(aObj);
		},
		handleChange(v, k) {
			if (['dealDate', 'exchangeLoss'].includes(k)) {
				this._expensePayeeInfo();
			}
		},
		_expensePayeeInfo(aObj) {
			const { id, exchangeLoss, dealDate, totalMoney, accountObj } = this.$refs.formRef.getFormParams();
			const { value, currencyId } = aObj || accountObj || {};
			const opt = {
				id,
				exchangeLoss,
				dealDate,
				totalMoney,
				accountId: value,
				bankReceiptCurrencyId: currencyId,
			}
			postExpensePayeeInfo(opt).then(res => {
				this.$refs.formRef.setFormModel({
					bankReceiptMoney: res.data.bankReceiptMoney,
					bankReceiptCurrencyCode: res.data.bankReceiptCurrencyCode || "",
				})
			})
		},
		submitRequest(fData) {
			const {  value, accountName, bankAccount, openAddress, currencyId } = fData.accountObj
			const submitKeys = ["id", "businessCompany", "dealDate", "remark", "verificationBy",
				"attachId", "serviceCharge", "serviceChargeCurrencyId", "exchangeLoss", "totalMoney",
				"openingBank", "bankReceiptCurrencyCode", "bankReceiptMoney"]
			const opt = submitKeys.reduce((obj, k) => {
				obj[k] = fData[k]
				return obj
			}, {
				accountId: value,
				accountName,
				bankAccount,
				openAddress,
				currencyId,
			})
			const submitHttp = this.mType === "confirm" ? postExpensePayeeCheck : postExpensePayeeVerification
			// console.log('fData==', fData, opt)
			return submitHttp(opt)
		},
		// 打回
		// handleRepulse() {
		// 	const { id } = this.$refs.formRef.getFormParams();
    //   this.$refs.customDialogRef.showCustomDialog({
    //     customFormConfig: remarkDialogCols(),
    //     formModel: {
    //       id,
    //     },
    //     httpRequest: postExpensePayeeRepulse,
    //     successFunction: this.editSuccess,
    //   });
		// },
		editSuccess() {
      this.$refs.dialogRef.hide();
      this.$emit("handleSuccess");
    },
		getCurrency() {
      // 获取默认币别
			const { serviceChargeCurrencyId } = this.formConfig.formModel;
			const { selectList = [] } = this.formConfig
      if (selectList.length) {
				this.formConfig.formModel.serviceChargeCurrencyId = serviceChargeCurrencyId || selectList[0].value;
				this.$refs.dialogRef.show();
        return;
      }

      querySearchList({
        type: "currency",
        pageNum: 1,
        pageSize: 999
      }).then(res => {
        this.formConfig.selectList = (res.rows || []).map(c => ({
          label: c.code,
          value: c.id
        }));
				this.formConfig.formModel.serviceChargeCurrencyId = serviceChargeCurrencyId || this.formConfig.selectList[0]?.value;
				this.$refs.dialogRef.show();
      });
    },
		...mapActions(["dictionary/getDictionary"]),
  },
	components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
		AutoComplete: () => import("_comp/ComForm/AutoComplete"),
		ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
