import {
  batchGenerateBill,
  checkAccount,
} from "@/api/settlementManage/statementManage";
import { msgBox } from "@/utils/confirmBox.js";
import { duplicateRemoval } from "@/utils/index";

/** 生成对账单 */
export const mixinHeadGenerateBill = {
  props: {},
  data() {
    return {};
  },
  methods: {
    /** 批量生成对账单 */
    batchBillGenerateEvt(callBack) {
      const billIds = this.selectionRows.map((item) => item.id);
      this.checkAccountBill(billIds.join(",")).then(() => {
        this.confirmGenerateBill(billIds.length).then(() => {
          batchGenerateBill({
            billIds,
          }).then(() => {
            this.onTableSelectionChange();
            callBack && callBack(); // 回调刷新数据
          });
        });
      });
    },
    confirmGenerateBill(num) {
      return new Promise((resolve) => {
        const title = "提示";
        const className = "el-icon-success text-success";
        const msg = `确定将${num}条费用生成对账单？`;
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    // 生成账单前校验
    checkAccountBill(idsrc) {
      return new Promise((resolve, reject) => {
        if (!this.needCheckAccount) {
          resolve();
        } else {
          checkAccount({ idsrc })
            .then((res) => {
              resolve();
            })
            .catch((err) => {
              if (err.code === 1002) {
                const title = "提示";
                const className = "el-icon-warning text-warning";
                const msg = "缺少应收费用 ，确认是否生成对账单";
                msgBox(
                  this,
                  { title, className, msg, showCancelButton: true },
                  () => {
                    resolve();
                  },
                  () => {
                    reject();
                  }
                );
              } else {
                reject();
              }
            });
        }
      });
    },
    /** 生成对账单 */
    createdBill() {
      const rows = this.selectionRows;
      //生成对账单与账单信息有关
      this.$message.closeAll();
      const { billingMain, dealingsCompany, type, currencyId } = rows[0];
      const typeIndex = rows.findIndex((e) => type !== e.type);
      if (typeIndex > -1) {
        return this.$message.error("应收应付类型不一致不可生成账单");
      }
      const index = rows.findIndex(
        (e) =>
          billingMain !== e.billingMain || dealingsCompany !== e.dealingsCompany
      );
      if (index > -1) {
        return this.$message.error("计费主体与往来单位不一致不可生成账单");
      }
      const currencyIndex = rows.findIndex((e) => currencyId !== e.currencyId);
      if (type === 0 && currencyIndex > -1) {
        return this.$message.error("应付货币不一致不可生成账单");
      }
      const nextFu = () => {
        const { newBackPathUrl, generateBillStatus } = this.formModel;
        const rowIds = rows.map((e) => e.id);
        const idRows = duplicateRemoval(rowIds).join(",");
        this.checkAccountBill(idRows).then(() => {
          this.selectionRows = []; // 清空选中项
          this.$router.push({
            path: "/settlementManagement/statementManage/editBillManage",
            query: {
              idRows,
              bsStatus: generateBillStatus, // 市场航次生成对账单
              activeTab: "1", // 1为新增，2为修改，3为详情
              backPath: newBackPathUrl || this.$route.fullPath,
            },
          });
        });
      };
      if (currencyIndex > -1) {
        this.confirmNext().then(() => {
          nextFu();
        });
      } else {
        nextFu();
      }
    },
    confirmNext() {
      return new Promise((resolve) => {
        const title = "警告提示";
        const className = "el-icon-warning text-warning";
        const msg = "币别不一致是否进入下一步！";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    onTableSelectionChange(rows = []) {
      //选择相应的账单
      const nRows = rows.filter(
        // (e) => e.isGenerateStatement !== 1 && !e.rBtnUpdate && !e.lockOrder
        (e) => e.isGenerateStatement !== 1 && !e.rBtnUpdate && !e.billNo
      );
      // this.selectionRows = nRows;
      const row = nRows[0] || {};
      this.selectionRows = nRows.filter(
        (e) =>
          // e.billingMain === row.billingMain &&
          // e.dealingsCompanyName === row.dealingsCompanyName && //往来单位
          e.type === row.type //收付类型
        //  && (row.type === 0 ? e.currencyId === row.currencyId : true) // 应付类型币别不一致不可生成账单
      );
      this.$refs.receiptTableRef?.toggleRowOpnSelection(this.selectionRows);
      // this.createdBillBtn.disabled = !rows.length;
      // this.$emit("createdBill", this.selectionRows);
    },
    selectionRowEvt(row) {
      // 列表条件选择，不满足条件置灰
      // if (row.isGenerateStatement === 1 || row.rBtnUpdate || row.lockOrder) {
      if (row.isGenerateStatement === 1 || row.rBtnUpdate || row.billNo) {
        //1已经生成过对账单，0未生成过对账单，排除已经生成过对账单的账单
        return false;
      }
      const rSome = this.selectionRows.some(
        (e) =>
          // e.billingMain === row.billingMain && // 计费主体
          // e.dealingsCompanyName === row.dealingsCompanyName && //往来单位
          e.type === row.type //收付类型
        //  &&(row.type === 0 ? e.currencyId === row.currencyId : true) // 应付类型币别不一致不可生成账单
      );
      if (this.selectionRows.length && !rSome) {
        return false;
      }
      return true;
    },
  },
};
