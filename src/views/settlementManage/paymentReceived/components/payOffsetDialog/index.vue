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
          v-if="showStatus"
        >
          <template v-slot:repaymentMoney="slotProps">
            <div class="repaymentMoney-class">
              <el-input-number
                v-model="slotProps.formModel.repaymentMoney"
                size="mini"
                :placeholder="slotProps.fieldItem.placeholder"
                :controls="false"
                v-input-number-limit="{
                  value: 2,
                }"
                disabled
              ></el-input-number>
              <el-tooltip
                class="repaymentMoney-tips"
                placement="bottom"
                popper-class="atooltip"
              >
                <div slot="content">
                  应退余额说明：<br />
                  1.应退余额=借款金额-报销金额小计；<br />
                  2.1个借款仅可进行1次抵消还款；<br />
                  3."正数"为收款，"负数"为付款；
                </div>
                <span class="sub-title">
                  <i class="iconfont bangzhu2 iconfontSize"></i>
                </span>
              </el-tooltip>
            </div>
          </template>
          <template v-slot:isSquare="slotProps">
            <el-checkbox
              v-model="slotProps.formModel.isSquare"
              :disabled="offsetInfo.isDisabled"
              @change="(val) => handleChangeIsSquare(val, slotProps.formModel)"
              >{{ slotProps.fieldItem.text }}
            </el-checkbox>
          </template>
          <template v-slot:tableData="slotProps">
            <CostTable
              ref="CostTableRef"
              :formData="slotProps.formModel"
              @subtotalMoney="handleSubtotalMoney"
            />
          </template>
        </ComForm>
      </template>
    </ComDialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { formConfig, formRules, tableColumns } from "./model.js";
import {
  GETBorrowBill,
  POSTBorrowOffset,
  getBorrowOffsetBill,
} from "@/api/settlementManage/paymentReceived.js";
import { subtractFn } from "@/utils/instructions.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    CostTable: () =>
      import(
        "@/views/settlementManage/paymentReceived/components/payOffsetDialog/components/CostTableEnable/index.vue"
      ),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    expenseInit: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      confirmClose: false,
      customDialogConfig: {
        title: "财务报销单(编辑)",
        width: "900px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "保存并提交",
            type: "primary",
            handleClick: (row) => {
              const res = this.$refs.CostTableRef?.getTableVerify();
              if (res) {
                this.$refs.dialogForm?.submitForm();
              }
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        isAttachFileId: true,
        httpRequest: this.handleSubmit, // 表单提交接口
        successFunction: this.handleFormSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "92px",
        lists: formConfig(),
        formRules, // 表单校验规则
        uploadFormConfig: {
          type: "picture",
        },
      },
      // tableConfig: {
      //   columnData: [],
      //   columnConfig: tableColumns(),
      // },
      // statusList: [
      //   {
      //     text: "删除",
      //     handleClick: (formModel) => {},
      //   },
      // ],
      showStatus: false,
      tableData: [],
      offsetInfo: {},
    };
  },
  computed: {
    ...mapState({
      dictBillType: (state) => state.dictionary.dicsData.billType,
      expenseStatus: (state) => state.dictionary.dicsData.expenseStatus,
      dictRoles: (state) => state.dictionary.dicsData.userRoles || [],
      dictUserRoles: (state) => state.user.userInfo.roles || [],
    }),
  },
  created() {},
  mounted() {},
  methods: {
    show(row = {}, extraRow = {}) {
      const { offsetMoneyHistory } = extraRow;
      const { totalMoney } = row;
      this.offsetInfo = extraRow;
      const reMainLoanMoney = subtractFn([totalMoney, offsetMoneyHistory]); //剩余借款金额=原金额-已登记还款金额
      this.formConfig = {
        ...this.formConfig,
        formModel: {
          ...row,
          isSquare: false, //默认结清
          type: this.typeConversion(row.type, "string"),
          flowType: "4", //流程字段后端没扭转，前端写死
          repaymentMoney: 0, //金额默认为0
          reMainLoanMoney,
        },
      };
      this.handleChange(this.formConfig.formModel);
      this.showStatus = true;
      this.$refs.customDialog.show();
    },
    hide() {
      this.showStatus = false;
      this.$refs.customDialog.hide();
    },
    async handleChange(row) {
      //获取账单明细
      let {
        totalMoney,
        repaymentMoney = 0,
        currencyId,
        id,
        reMainLoanMoney,
        isSquare,
      } = row; //需要判断借款金额和还款金额大小
      const { offsetMoneyHistory } = this.offsetInfo;
      let setModel = {};
      if (repaymentMoney < totalMoney || !repaymentMoney) {
        //还款金额小于借款金额
        // this.tableConfig.columnData = [{ id: 1 }, { id: 2 }];
        const params = {
          id,
          currencyId,
          totalMoney: repaymentMoney,
        };
        await getBorrowOffsetBill(params).then((res) => {
          const { rows } = res;
          this.tableData = rows;
          setModel = {
            repaymentMoney: !repaymentMoney ? null : repaymentMoney,
          };
        });
      } else if (repaymentMoney == totalMoney) {
        //还款金额等于借款金额
        this.tableData = [];
      } else if (repaymentMoney > totalMoney) {
        //还款金额大于借款金额
        const params = {
          id,
          currencyId,
          totalMoney: repaymentMoney,
        };
        await getBorrowOffsetBill(params).then((res) => {
          const { rows } = res;
          this.tableData = rows;
        });
      }
      let isDisabled = undefined;
      if (repaymentMoney >= reMainLoanMoney) {
        isDisabled = true;
        isSquare = true;
      } else if (repaymentMoney < reMainLoanMoney) {
        isDisabled = false;
      }
      this.offsetInfo = {
        ...this.offsetInfo,
        isDisabled,
        offsetMoney: subtractFn([
          totalMoney,
          offsetMoneyHistory,
          repaymentMoney,
        ]),
      };
      this.$refs.dialogForm?.setFormModel({
        ...setModel,
        isSquare,
      });
      this.$refs.CostTableRef?.setTableData(this.tableData);
    },
    handleChangeIsSquare(val, row) {
      let { repaymentMoney = 0, totalMoney, reMainLoanMoney, isSquare } = row;
      const { offsetMoneyHistory } = this.offsetInfo;
      let isDisabled = undefined;
      if (val && repaymentMoney == 0) {
        const remainMoney = subtractFn([totalMoney, offsetMoneyHistory]);
        if (remainMoney >= reMainLoanMoney) {
          isDisabled = true;
          isSquare = true;
        } else if (remainMoney < reMainLoanMoney) {
          isDisabled = false;
        }
        this.offsetInfo = {
          ...this.offsetInfo,
          isDisabled,
        };
        this.$refs.dialogForm?.setFormModel({
          repaymentMoney: subtractFn([totalMoney, offsetMoneyHistory]),
          isSquare,
        });
      }
    },
    handleFormSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    handleSubmit(row) {
      const { isSquare, id, type, flowType, repaymentMoney, remark, attIds } =
        row;
      // if (!isSquare) {
      //   this.$message.error("请确认金额是否结清");
      //   return new Promise((resolve,reject)=>{
      //     reject()
      //   })
      // }
      const params = {
        id, //报销单id
        type, //类型
        flowType, //流程
        totalMoney: repaymentMoney, //金额
        remark, //备注
        status: 1, //状态 0保存  1保存并提交
        isSquare: isSquare ? 1 : 0,
        billList: this.$refs.CostTableRef?.getTableVerify() || [], //明细
        attIds: attIds && attIds.split(","),
      };
      return POSTBorrowOffset(params);
    },
    handleSubtotalMoney(val) {
      // 报销金额小计   应付为正   应收为负
      //应退金额=借款金额-报销金额小计
      const { totalMoney } = this.formConfig.formModel;
      this.$refs.dialogForm?.setFormModel({
        repaymentMoney: subtractFn([totalMoney, val], 2),
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.repaymentMoney-class {
  display: flex;
  align-items: center;
  .repaymentMoney-tips {
    margin-left: 20px;
    color: #5094ff;
  }
}
</style>
