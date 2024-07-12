<template>
  <ComDialog
    v-if="dialogShow"
    ref="myDialog"
    :customDialog="dialogConfig"
    @onClose="handleClose"
  >
    <template v-slot:content>
      <div class="">
        <ComForm
          :formConfig="formConfig"
          ref="myComForm"
          v-if="Object.keys(dictionary.dicsData).length"
        >
          <template v-slot:totalMoney="slotProps">
            <el-input
              type="number"
              v-model="slotProps.formModel.totalMoney"
              placeholder="请输入金额"
              maxlength="11"
              clearable
              @change="(val) => handleChange(val)"
              @input.native="
                handleDecimal(slotProps.formModel, 'totalMoney', 2)
              "
            />
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
                @change="handleChangeTax"
                @input.native="handleTax(slotProps.formModel)"
              >
                <template slot="append">%</template>
              </el-input>
              <span v-else class="tax-item-tips"
                >提示：增值税发票勾选此选项</span
              >
            </div>
          </template>
        </ComForm>
      </div>
    </template>
  </ComDialog>
</template>
<script>
import {
  addExpense,
  updateExpense,
} from "@/api/settlementManage/paymentReceived";
import { handleDecimal } from "@/utils/validate";
import { config } from "./model";
import { mapState } from "vuex";
export default {
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    DiffMark: () => import("_comp/DiffMark"),
  },
  data() {
    return {
      dialogShow: false,
      dialogConfig: {
        title: "账单信息",
        width: "850px",
        useFooter: "footer",
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
            text: "保存",
            type: "primary",
            handleClick: this.submitSave,
          },
        ],
        addFooter: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.myDialog.hide();
              this.dialogShow = false;
            },
          },
          {
            text: "保存",
            type: "primary",
            handleClick: () => {
              this.status = 0;
              this.submitSave();
            },
          },
          {
            text: "保存并提交",
            type: "primary",
            handleClick: () => {
              this.status = 1;
              this.submitSave();
            },
          },
        ],
      },
      formConfig: {
        formModel: {
          isIncludedTax: false,
          taxRate: "",
        },
        httpRequest: this.handleSave, // 表单提交接口
        successFunction: () => {
          this.$emit("handleSuccess");
          this.handleClose();
        }, // 表单提交成功回调
        size: "small",
        labelWidth: "100px",
        lists: config.lists,
        formRules: config.formRules, // 表单校验规则
      },
      status: 0,
    };
  },
  computed: {
    ...mapState(["dictionary"]),
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
    handleChange(val) {
      const data = this.$refs.myComForm.getFormParams();
      const tax = data.isIncludeTax ? data.taxRate || 0 : 0;
      const totalMoney = Number(val || 0);
      const taxMoney = (totalMoney || 0) * (Number(tax || 0) / 100);
      const inTaxMoney = (totalMoney || 0) - taxMoney;
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
      const taxMoney = Number(
        ((data.totalMoney || 0) * (Number(val || 0) / 100)).toFixed(2)
      );
      this.$refs.myComForm.setFormModel({
        taxMoney,
        inTaxMoney: Number(((data.totalMoney || 0) - taxMoney).toFixed(2)),
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
    show(row = {}) {
      if (row.id) {
        this.dialogConfig.useFooter = "footer";
      } else {
        this.dialogConfig.useFooter = "addFooter";
      }
      this.formConfig.formModel = {
        ...row,
        type: typeof row.type === "number" ? `${row.type}` : row.type,
        prepaidCollect:
          typeof row.prepaidCollect === "number"
            ? `${row.prepaidCollect}`
            : row.prepaidCollect,
        isIncludeTax: row.isIncludeTax ? true : false,
      };
      this.dialogShow = true;
      setTimeout(() => {
        this.$refs.myDialog.show();
      });
    },
    handleClose() {
      this.$refs.myDialog.hide();
      this.dialogShow = false;
    },
    handleSave(formData) {
      const params = {
        ...formData,
        isIncludeTax: formData.isIncludeTax ? 1 : 0,
      };
      delete params.undefined;
      if (formData.id) {
        return updateExpense(params);
      }
      params.status = this.status;
      return addExpense(params);
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
.tax-item {
  display: flex;
  .tax-item-tips {
    color: #3179ef;
  }
}
/deep/ .form-class .border-bottom-solid {
  margin-bottom: 0;
}
</style>
