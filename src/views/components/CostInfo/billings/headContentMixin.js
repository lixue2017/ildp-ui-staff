import { deleteSettleAccounts } from "@/api/settlementManage/statementManage";
import { mixinCostTableConf } from "../components/tableMixin";
import { mixinHeadGenerateBill } from "../components/headBtnMixin.js";

/** 头部与表格操作 */
export const mixinHeadContent = {
  mixins: [mixinCostTableConf, mixinHeadGenerateBill],
  data() {
    return {
      headEventObj: {
        copyBillEvt: () => this.initDataRequest(), // 复制后刷新不传值
        addBill: (aObj = {}) => {
          //新增费用
          this.addBill(aObj);
          this.handleSelectionChange();
        },
        handleSaveAll: this.handleSaveAll, //全部保存
        createdBill: this.createdBill, //生成对账单
        batchBillGenerateEvt: () =>
          this.batchBillGenerateEvt(() => {
            // 批量生成对账单后刷新
            this.initDataRequest();
          }),
        batchEditBill: this.handleEditAll, //批量编辑
        handleDelAll: this.handleDelAll, // 批量删除
      },
      operationObj: {
        editCallBack: this.resetEditSelect,
        httpSaveRequest: this.handleRowSave,
        saveCallBack: () => this.initDataRequest(), // 保存后刷新不传值
        httpDelRequest: (row) => {
          if (row.id) {
            return deleteSettleAccounts(row.id);
          }
        },
        delCallBack: () => this.initDataRequest(), // 删除后刷新不传值
      },
      dataObj: {},
    };
  },
  methods: {
    resetEditSelect(row) {
      const isSelectEdit = this.selectionRows.some((e) => e.id === row.id);
      // 选中后修改需重置选择项
      if (isSelectEdit) {
        this.handleSelectionChange();
      }
    },
    handleSelectionChange() {
      this.$nextTick(() => {
        this.onTableSelectionChange(this.selectionRows);
      });
    },
  },
};
