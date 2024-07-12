<template>
  <ComDialog
    v-if="dialogShow"
    ref="myDialog"
    :customDialog="dialogConfig"
    @onClose="handleClose"
  >
    <template v-slot:content>
      <div class="content-padding-20">
        <ComForm
          :formConfig="formConfig"
          ref="myComForm"
          v-if="Object.keys(dictionary.dicsData).length"
        >
          <template v-slot:orderNum="slotProps">
            <div class="flex flex-align-center">
              <TooltipOver
                :content="formConfig.formModel.orderNum"
                refName="tooltipOver"
                :style="{
                  maxWidth: '135px',
                }"
              />
              <el-tag
                :style="{
                  color: '#66A5FF',
                }"
                size="mini"
                color="#66A5FF1A"
              >
                {{ slotProps.dicsData.nameCn }}
              </el-tag>
            </div>
          </template>
          <template v-slot:isMakeInvoice="slotProps">
            <div v-if="slotProps.formModel.type == 0">
              <el-checkbox v-model="slotProps.formModel.isMakeInvoice">
                {{ slotProps.fieldItem.text }}
              </el-checkbox>
            </div>
          </template>
          <template v-slot:num="slotProps">
            <div class="flex">
              <el-input
                class="flex-input"
                type="number"
                v-model="slotProps.formModel.num"
                placeholder="数量"
                maxlength="11"
                clearable
                title=""
                @change="(val) => handleChange(val, 'unitPrice')"
                @input.native="handleDecimal(slotProps.formModel, 'num', 2)"
              />
              <span style="margin: 0 5px">/</span>
              <el-input
                class="flex-input"
                type="number"
                v-model="slotProps.formModel.unitPrice"
                placeholder="单价"
                maxlength="11"
                clearable
                @change="(val) => handleChange(val, 'num')"
                title=""
                @input.native="
                  handleDecimal(slotProps.formModel, 'unitPrice', 2, true)
                "
              />
            </div>
          </template>
          <template v-slot:isIncludeTax="slotProps">
            <div class="tax-item flex">
              <el-checkbox
                v-model="slotProps.formModel.isIncludeTax"
                @change="handleTaxChecked"
                >含税</el-checkbox
              >
              <el-input
                v-if="slotProps.formModel.isIncludeTax"
                type="number"
                v-model="slotProps.formModel.taxRate"
                placeholder="税率(%)"
                maxlength="2"
                clearable
                title=""
                @change="handleChangeTax"
                @input.native="handleTax(slotProps.formModel)"
              >
                <template slot="append">%</template>
              </el-input>
            </div>
          </template>
        </ComForm>
      </div>
    </template>
  </ComDialog>
</template>
<script>
import { deepCopy } from "@/utils/index";
import { typeConversion } from "@/utils/index";
import { handleDecimal } from "@/utils/validate";
import { config, EDIT_FORM_COL_1, EDIT_FORM_RULES_1 } from "./model";
import { mapState } from "vuex";
import {
  addSettleAccounts,
  updateSettleAccounts,
} from "@/api/settlementManage/statementManage";
import { getAccmainCus } from "@/api/common";
import { getOperateMain } from "@/api/operateManage/details.js";
export default {
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  data() {
    return {
      dialogShow: false,
      dialogConfig: {
        title: "账单信息",
        width: "680px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.myDialog.hide();
              this.dialogShow = false;
            },
          },
          {
            text: "确定",
            type: "primary",
            handleClick: this.submitSave,
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.httpRequest, // 表单提交接口
        successFunction: () => {
          this.handleClose();
          this.$emit("handleSuccess");
        }, // 表单提交成功回调
        size: "small",
        labelWidth: "90px",
        lists: config.lists,
        formRules: config.formRules, // 表单校验规则
      },
      accMain: {},
      isVoyageBill: "",
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    getAccmainCus().then((res) => {
      // const { id, nameCn: name } = res.data;
      // this.accMain = {
      //   id,
      //   name,
      // };
      const { id } = res.data;
      this.accMain = {
        id,
      };
    });
  },
  methods: {
    handleDecimal,
    handleTax(row) {
      let val = row.taxRate;
      if (val > 99) {
        val = 99;
      }
      if (val < 1) {
        val = 1;
      }
      row.taxRate = val;
    },
    getOperateMain(row, callback) {
      getOperateMain(row.orderNum)
        .then((res) => {
          callback && callback(res);
        })
        .catch((err) => {
          callback && callback(err);
        });
    },
    handleSetData(res) {
      this.formConfig.formModel = {
        ...this.formConfig.formModel,
        billingMain: res.data && res.data.operateMainName,
        dealingsCompanyName: res.data && res.data.customerId,
      };
      setTimeout(() => {
        this.$refs.myDialog.show();
      });
    },
    show(row = {}, isVoyageBill = "") {
      // this.formConfig.formModel={
      //   ...this.formConfig.formModel,
      //   billingMain:res.data.operateMainName
      // }
      if (!row.accountingTime) {
        const oDate = new Date();
        const y = oDate.getFullYear();
        const m = oDate.getMonth() + 1;
        const d = oDate.getDate();
        row.accountingTime = `${y}-${m > 9 ? m : "0" + m}-${
          d > 9 ? d : "0" + d
        }`;
      }
      if (isVoyageBill === "createBill") {
        // 航次信息/排柜单 -> 创建账单
        this.isVoyageBill = isVoyageBill;
        const confCopyList = deepCopy(config.lists);
        const bCols = confCopyList[0].fieldList[0].rows[0].cols;
        const fIndex = bCols.findIndex((e) => e.id === "billingMain");
        bCols[fIndex] = {
          ...bCols[fIndex],
          ...EDIT_FORM_COL_1,
        };
        this.formConfig.lists = confCopyList;
        this.formConfig.formRules = {
          ...config.formRules,
          ...EDIT_FORM_RULES_1,
        };
      } else {
        this.formConfig.lists = config.lists;
        this.formConfig.formRules = config.formRules; // 表单校验规则
      }
      this.formConfig.formModel = {
        ...row,
        type: typeConversion(row.type),
        prepaidCollect: typeConversion(row.prepaidCollect),
        totalMoney: (row.num || 0) * (row.unitPrice || 0),
        dealingsCompany: row.dealingsCompanyName || "",
        dealingsCompanyName: row.dealingsCompanyId || row.dealingsCompany,
        billingMain: row.billingMainName,
        isIncludeTax: row.isIncludeTax ? true : false,
        isMakeInvoice: row.isMakeInvoice ? true : false,
        orderTypes: row.orderTypes,
        isBussiness: row.isBussiness,
      };
      this.dialogShow = true;
      // console.log(row)
      // console.log(this.accMain)
      if (row.id) {
        setTimeout(() => {
          this.$refs.myDialog.show();
        });
      } else {
        this.getOperateMain(row, this.handleSetData);
      }
    },
    handleChange(val, name) {
      const data = this.$refs.myComForm.getFormParams();
      const tax = data.isIncludeTax ? data.taxRate || 0 : 0;
      const totalMoney = Number(
        (Number(val || 0) * Number(data[name] || 0)).toFixed(2)
      );
      const taxMoney = ((totalMoney || 0) * (Number(tax || 0) / 100)).toFixed(
        2
      );
      const inTaxMoney = ((totalMoney || 0) - taxMoney).toFixed(2);
      this.$refs.myComForm.setFormModel({
        totalMoney,
        taxMoney,
        inTaxMoney,
      });
    },
    handleChangeTax(val) {
      const data = this.$refs.myComForm.getFormParams();
      if (val > 99) {
        val = 99;
      }
      if (data.isIncludeTax && val < 1) {
        val = 1;
      }
      const taxMoney = (
        (data.totalMoney || 0) *
        (Number(val || 0) / 100)
      ).toFixed(2);
      this.$refs.myComForm.setFormModel({
        taxMoney,
        inTaxMoney: ((data.totalMoney || 0) - taxMoney).toFixed(2),
      });
    },
    handleTaxChecked(type) {
      if (type) {
        const data = this.$refs.myComForm.getFormParams();
        this.handleChangeTax(data.taxRate);
      } else {
        this.handleChangeTax(0);
      }
    },
    handleClose() {
      this.dialogShow = false;
    },
    httpRequest(formModel) {
      const params = {
        ...formModel,
        orderTypes: [
          this.$route.query.orderType
            ? JSON.parse(this.$route.query.orderType)
            : 2,
        ],
        isBussiness: formModel.isBussiness ? formModel.isBussiness : "",
      };
      if (params.orderTypes && params.businessType === 4) {
        //判断是否为电商头程和传统订单
        const orderType = params.orderTypes.toString();
        if ("2,3,4,5,6".includes(orderType)) {
          params.businessType = 0;
          params.isBussiness = 1;
        }
      }
      if (!params.unitPrice) {
        return this.$message.error("请输入金额");
      }

      params.isIncludeTax = params.isIncludeTax ? 1 : 0;
      params.isMakeInvoice =
        params.type == 0 ? (params.isMakeInvoice ? 1 : 0) : 0;
      delete params.undefined;
      if (typeof params.dealingsCompany === "string") {
        if (params.id) {
          delete params.dealingsCompany;
        } else {
          params.dealingsCompany = params.dealingsCompanyName;
          delete params.dealingsCompanyId;
          delete params.dealingsCompanyName;
        }
      }
      params.billingMain = this.accMain.id;
      if (this.isVoyageBill === "createBill") {
        params.billingMain = formModel.nBillingMain;
        delete params.nBillingMain;
      }
      params.costName && delete params.costName;
      if (params.id) {
        params.dealingsCompany = params.dealingsCompanyName;
        return updateSettleAccounts(params);
      } else {
        return addSettleAccounts(params);
      }
    },
    submitSave() {
      this.$refs.myComForm.submitForm();
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-bottom: 30px;
}
.content-padding-20 {
  padding: 0 20px;
}
/deep/ {
  .el-form-item__label {
    padding-right: 0;
  }
  .el-tag.el-tag--mini {
    padding: 0 12px;
    border-radius: 12px;
    margin-left: 10px;
  }
  .form-class {
    .el-checkbox {
      margin-right: 7px;
    }
    .border-bottom-solid {
      margin-bottom: 0;
    }
  }
  .tax-item {
    .el-input--suffix .el-input__inner {
      padding-right: 0;
    }
  }
}
.flex-input {
  color: red;
  /deep/.el-input__inner {
    padding-right: 0px;
  }
  /deep/.el-input__icon {
    margin-right: 10px;
  }
}
</style>
