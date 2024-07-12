<template>
  <ComDialog
    v-if="dialogShow"
    ref="myDialog"
    :customDialog="dialogConfig"
    @onClose="handleClose"
  >
    <template v-slot:content>
      <div class="warehousing-form">
        <ComForm
          :formConfig="formConfig"
          ref="myComForm"
          @handleChange="handleChange"
        />
      </div>
      <div class="warehousing-table">
        <!-- <ComTable
          ref="tableRef"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableConfig.columnConfig"
          :httpRequest="tableConfig.httpRequest"
          :getQueryParams="getTableQueryParams"
          :pagination="false"
          :extraConfig="{
            stripe: false,
          }"
        > -->
        <ComTable
          ref="tableRef"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableConfig.columnConfig"
          :columnData="tableConfig.columnData"
          :pagination="false"
          :extraConfig="{
            stripe: false,
          }"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-for="item in currencyArr">
              <div :key="item.keyName" v-if="slotProps.prop === item.keyName">
                <span v-if="slotProps.row.currencyCode === formConfig.formModel[item.placeholderKey]">
                  {{ currencyCost(slotProps.row, slotProps.prop) }}
                </span>
                <el-input-number
                  v-else
                  size="mini"
                  v-model="
                    slotPropsRow(slotProps.row, slotProps.prop)[item.keyName]
                  "
                  v-input-number-limit="10"
                  :placeholder="getPlaceholder(item.placeholderKey)"
                  :controls="false"
                  @change="() => handleInpChange(item.keyName, slotProps.row)"
                />
              </div>
            </template>
          </template>
        </ComTable>
      </div>
    </template>
  </ComDialog>
</template>

<script>
import { config } from "./model";
import {
  settleExchangeRateBatch,
  getExchangeRateMonth,
  POSTExchangeRateBatchEdit,
} from "@/api/settlementManage/feeSet";
import { msgTipBox } from "@/utils/confirmBox.js";
import { beDividedFn } from "@/utils/instructions";
import { mapActions } from "vuex";
export default {
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    const oData = new Date();
    const y = oData.getFullYear();
    const m = oData.getMonth() + 1;
    return {
      dialogShow: false,
      dialogConfig: {
        title: "更新汇率",
        width: "1150px",
        footer: [
          {
            text: "确定",
            type: "primary",
            handleClick: this.submitSave,
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.myDialog.hide();
              this.dialogShow = false;
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: () => {}, // 表单提交接口
        successFunction: () => {}, // 表单提交成功回调
        size: "small",
        labelWidth: "90px",
        className: "content-padding-20",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: config.formLists,
                  },
                ],
              },
            ],
          },
        ],
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        columnData: [],
        httpRequest: getExchangeRateMonth,
        columnConfig: config.tableColumn,
      },
      currencyArr: [
        {
          keyName: "funCurrencyCost", //本位币汇率
          keyCode: "RMB",
          placeholderKey: "defFunCurrencyCode",
        },
        {
          keyName: "auxCurrencyCost", //辅助币汇率
          keyCode: "USD",
          placeholderKey: "defAuxCurrencyCode",
        },
        // {
        //   keyName: "funCurrencyInvoice",//发票本位币汇率
        //   keyCode: "RMB",
        // },
        // {
        //   keyName: "auxCurrencyInvoice",//发票辅助币汇率
        //   keyCode: "USD",
        // },
        // {
        //   keyName: "funCurrencyVoucher",//凭证汇率
        //   keyCode: "RMB",
        // },
      ],
    };
  },
  methods: {
    ...mapActions(["settings/actionRepeatedClick"]),
    async show(row = {}) {
      const {
        billingMainName = undefined,
        billingMain = undefined,
        ascription = undefined,
      } = row;
      const oData = new Date();
      const y = oData.getFullYear();
      const m = oData.getMonth() + 1;
      const byMonth = `${y}-${m > 9 ? m : "0" + m}`;
      const { data } = await getExchangeRateMonth({
        byMonth,
        customerId: billingMain,
        ascription,
      });
      console.log("data", data);
      const { list, ...obj } = data || {};
      this.formConfig.formModel = {
        // month: `${y}年${m > 9 ? m : "0" + m}月`,
        // funCurrencyCost: "RMB人名币",
        // auxCurrencyCost: "USD美元",
        billingMain,
        ascription,
        ...obj,
      };
      this.tableConfig.columnData = list;
      this.dialogShow = true;
      setTimeout(() => {
        this.$refs.myDialog.show();
        this.$refs.tableRef?.setNewTableData(this.tableConfig.columnData);
      });
    },
    handleChange(v, t) {
      if (t === "byMonth" && v) {
        const { billingMain, ascription } = this.formConfig.formModel;
        const params = {
          byMonth: v,
          customerId: billingMain,
          ascription,
        };
        getExchangeRateMonth(params).then((res) => {
          const { data } = res;
          this.tableConfig.columnData = data?.list || [];
          this.formConfig.formModel.byMonth = v;
          this.$refs.tableRef?.setNewTableData(this.tableConfig.columnData);
        });
        // this.$refs.tableRef?.refreshTable();
      }
    },
    handleClose() {
      this.dialogShow = false;
    },
    handleInpChange(key, row) {
      // funCurrencyCost本位币汇率
      const {defAuxCurrencyCode}=this.formConfig.formModel
      if (["funCurrencyCost"].includes(key)) {
        const getTableData = this.$refs.tableRef.getNewTableData() || [];
        // const fKey ="auxCurrencyCost"
        if (row.currencyCode !== defAuxCurrencyCode) {
          const usdRow = getTableData.find((e) => e.currencyCode === defAuxCurrencyCode);
          row.auxCurrencyCost = beDividedFn([row[key], usdRow[key]], 10) || 0;
          row.auxCurrencyInvoice = row.auxCurrencyCost; //发票辅助币汇率与辅助币汇率一致
          row.funCurrencyInvoice = row[key]; //发票本位币汇率与本位币汇率一致
          row.funCurrencyVoucher = row[key]; //凭证汇率与本位币汇率一致
        } else {
          const nRows = getTableData.map((ele) => {
            if (![defAuxCurrencyCode].includes(ele.currencyCode)) {
              ele.auxCurrencyCost = beDividedFn([ele[key], row[key]], 10) || 0;
              ele.auxCurrencyInvoice = ele.auxCurrencyCost; //发票辅助币汇率与辅助币汇率一致
            }
            ele.funCurrencyVoucher = ele[key]; //凭证汇率与本位币汇率一致
            ele.funCurrencyInvoice = ele[key]; //发票本位币汇率与本位币汇率一致
            return ele;
          });
          this.$refs.tableRef.setNewTableData(nRows);
        }
      } else if (key == "auxCurrencyCost") {
        row.auxCurrencyInvoice = row.auxCurrencyCost; //发票辅助币汇率与辅助币汇率一致
      }
    },
    currencyCost(row, key) {
      row[key] = "1.0000";
      return "1.0000";
    },
    slotPropsRow(row, key) {
      row[key] = row[key] === null ? undefined : row[key];
      return row;
    },
    submitSave() {
      const {
        byMonth = "",
        customerId,
        ascription,
        defFunCurrencyId,
        defAuxCurrencyId,
      } = this.formConfig.formModel;
      const msg = `确定更新${byMonth.split("-")[0]}年${
        byMonth.split("-")[1]
      }月的汇率? 确定之后更新汇率`;
      msgTipBox(this, { msg }, () => {
        const list = this.$refs.tableRef.getNewTableData().map((item) => {
          const {
            id,
            funCurrencyCost,
            auxCurrencyCost,
            currency,
            funCurrencyInvoice,
            auxCurrencyInvoice,
            funCurrencyVoucher,
          } = item;
          return {
            id,
            currency,
            funCurrencyCost,
            auxCurrencyCost,
            byMonth: byMonth,
            funCurrencyInvoice,
            auxCurrencyInvoice,
            funCurrencyVoucher,
          };
        });
        const params = {
          byMonth,
          customerId,
          ascription,
          defFunCurrencyId,
          defAuxCurrencyId,
          list,
        };
        this["settings/actionRepeatedClick"](true);
        POSTExchangeRateBatchEdit(params)
          .then(() => {
            this["settings/actionRepeatedClick"](false);
            this.handleClose();
            this.$emit("handleSuccess");
          })
          .catch((error) => {
            this["settings/actionRepeatedClick"](false);
          });
      });
    },
    getTableQueryParams() {
      const { month, billingMain, ascription } = this.formConfig.formModel;
      return {
        byMonth: month,
        customerId: billingMain,
        ascription,
      };
    },
    getPlaceholder(key = "") {
      const code = this.formConfig.formModel[key] || "";
      return `对${code}汇率`;
    },
  },
};
</script>

<style lang="scss" scoped>
.warehousing-form {
  margin-top: -10px;
}
/deep/ .el-dialog__body {
  padding-bottom: 30px;
}
.warehousing-table {
  /deep/ {
    .el-input__inner {
      padding: 0 8px;
      text-align: right;
    }
    .el-table--medium td,
    .el-table--medium th {
      padding: 8px 0;
    }
    .table-header-row {
      .head-blue {
        color: #5094ff;
      }
      .head-orange {
        color: #fa541c;
      }
    }
  }
}
</style>
