import { confirmBill, postBatchConfirmBill } from "@/api/settlementManage/statementManage";
import { billBatchConfirmForm } from "../confirmedBill/model";
import { confirmDialogCols } from "../customerBill/model";

/**
 * 引用处：收款账单确认/付款账单确认
 */
export const mixinBatchBill = {
  data() {
    return {
      tabBtnArr: [
        {
          table: "批量确认", // 按钮名称显示不同
          disabled: true,
          showType: ["0", "1"],
          handleClick: () => {
            this.handleBatch("0");
          },
        },
        {
          table: "批量打回", // 按钮名称显示不同
          disabled: true,
          showType: ["0", "1"],
          handleClick: () => {
            this.handleBatch("1");
          },
        },
      ],
      selectionRows: [],
    };
  },
  methods: {
    handleTabsClick() {
      this._showTabBtn();
      this.initMixinColumnConf();
    },
    _showTabBtn() {
      const { activeName, type } = this.tabsConfig;
      const tabBtn = this.tabBtnArr.filter((e) => e.showType.includes(type));
      const btnList = activeName === "1" ? tabBtn : [];
      this.$set(this.tabsConfig, "btnArr", btnList);
    },
    selectionRowEvt(row) {
      const rSome = this.selectionRows.some(
        (e) => e.settleModel === row.settleModel // 结算模式
      );
      if (this.selectionRows.length && !rSome) {
        return false;
      }
      return true;
    },
    onTableSelectionChange(rows = []) {
      const row = rows[0] || {};

      this.selectionRows = rows.filter(
        (e) => e.settleModel === row.settleModel
      );

      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    handleBatch(status) {
      if (!this.selectionRows.length) {
        return;
      }
      const { type } = this.tabsConfig;
      const { settleModel } = this.selectionRows[0];
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: billBatchConfirmForm(status, settleModel),
        formModel: {
          status,
          ids: this.selectionRows.map((e) => e.id),
          settleType: [2, 1][type],
          settleModel,
        },
        httpRequest: postBatchConfirmBill,
        successFunction: () => {
          this.mixinkeepTable();
        },
      });
		},
		handleBillConfirm(row, status) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: confirmDialogCols({
          settleModel: row.settleModel,
          status,
        }),
        formModel: {
          status,
          id: row.id,
          rejectNum: row.rejectNum || 0,
          settleType: [2, 1][row.type], // 1-收款, 2-付款
          settleModel: row.settleModel,
        },
        httpRequest: confirmBill,
        successFunction: () => {
          this.mixinkeepTable();
        },
      });
    },
  },
  watch: {
    "selectionRows.length"(sLen) {
      this.tabsConfig.btnArr.map((e) => {
        this.$set(e, "disabled", !sLen);
      });
    },
  },
  created() {
    this._showTabBtn();
  },
};
