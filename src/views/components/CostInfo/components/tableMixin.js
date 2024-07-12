import { mapActions, mapState } from "vuex";
import {
  settleAccountsOrderList,
  updateSettleAccounts,
  postAddSettleAccounts,
  postBatchOperate,
} from "@/api/settlementManage/statementManage";
import { multiplicationFn } from "@/utils/instructions";

/** 表格列操作，头部全部保存与新增账单按钮操作 */
export const mixinCostTableConf = {
  props: {
    formModel: {
      type: Object,
      default: () => ({
        // "id": 1079, // 1024
        // customCostInfoId: 283,
        // orderId: 984,
        // "operationOrderNum":"BSEC22120323",
        // "customerId":66,
      }),
    },
  },
  data() {
    return {
      selectionRows: [],
      saveHttpObj: {
        addHttp: postAddSettleAccounts,
        editHttp: updateSettleAccounts,
        listHttp: settleAccountsOrderList,
      },
      additionalParams: {}, // 附加参数，获取不同的账单列表
      tableDefaultParam: {}, // 初始化从ComTable中返回的参数
      addRowParam: {}, // 不同类型，新增行的参数不同
    };
  },
  methods: {
    addBill() {
      // 市场部费用一次增加多条数据
      this.$refs[`receiptTableRef`]?.addTableOpnData([this.addDefaultRow()]);
    },
    // 新增行的默认值
    addDefaultRow() {
      const { id, operationOrderNum } = this.formModel;
      return {
        type: 1,
        prepaidCollect: 0,
        isGenerateStatement: 0,
        num: 1,
        isNewAdd: true,
        rBtnUpdate: true,
        orderId: id,
        operationOrderNum,
        ...this.addRowParam,
      };
    },
    /** 表格列保存 */
    handleRowSave(row) {
      return new Promise((resolve, reject) => {
        this.editSaveRules(row, null, (params) => {
          if (params.id) {
            this.saveHttpObj.editHttp(params).then(() => {
              resolve();
            });
          } else {
            this.saveHttpObj.addHttp(params).then(() => {
              resolve();
            });
          }
        });
      });
    },
    /** 批量编辑 */
    handleEditAll() {
      const allData = this.$refs[`receiptTableRef`].tableDataArr;
      allData.forEach((row) => {
        if (this.showBillOpnBtn(row) && !row.rBtnUpdate) {
          this.$refs[`receiptTableRef`]?.handleEdit(row);
        }
      });
    },
    /** 全部保存 */
    handleSaveAll() {
      const allData = this.$refs[`receiptTableRef`].tableDataArr;
      if (!allData.length) {
        return;
      }
      let editRows = [];
      let filArr = [];
      for (let [i, ele] of allData.entries()) {
        if (ele.rBtnUpdate) {
          filArr.push(i);
          const isLoop = this.editSaveRules(ele, i + 1, (opt) => {
            editRows.push(opt);
          });
          if (!isLoop) break;
        }
      }
      // 有编辑行，并且全部校验通过
      if (editRows.length && filArr.length === editRows.length) {
        // console.log('批量保存')
        this.saveAllRequest(editRows).then(() => {
          this.isBatchSave = true;
          this.initDataRequest();
        });
      }
    },
    /**全部保存接口 */
    saveAllRequest(editRows) {
      const { customerId, id } = this.formModel;
      const opt = {
        type: 2,
        customerId,
        orderId: id,
        billInfos: editRows,
      };
      return postBatchOperate(opt);
    },
    /** 保存必填项校验 */
    editSaveRules(params, idx, callBack) {
      let ruleArr = [];
      const ruleMsg = {
        type: "类型",
        costId: "费用名称",
        dealingsCompany: "往来单位",
        currencyId: "币别",
        unitPrice: "单价",
        num: "数量",
      };
      const nonZeroKeys = ["unitPrice", "num"]; // 必填且不能为0
      if (params.isIncludeTax) {
        // 勾选含税时，税率必填
        ruleMsg.taxRate = "税率";
      }
      for (let key in ruleMsg) {
        if (!params[key]) {
          if (nonZeroKeys.includes(key)) {
            ruleArr.push(ruleMsg[key]);
          } else {
            if (params[key] !== 0) {
              ruleArr.push(ruleMsg[key]);
            }
          }
        }
      }
      if (ruleArr.length) {
        let idxTit = idx ? `序号${idx}行` : "";
        this.msgError(`${idxTit}请输入或选择${ruleArr.join("、")}`);
        return false;
      }
      params.taxRate = params.taxRate === undefined ? "" : params.taxRate;
      if (callBack) {
        // 保存
        const { rBtnUpdate, isNewAdd, temp_secondId, temp_add_id, ...nParams } =
          params;
        callBack && callBack(nParams);
        return true;
      }
    },
    /** 批量删除 */
    handleDelAll() {
      const ids = this.selectionRows
        .filter((ele) => this.showBillOpnBtn(ele))
        .map((e) => e.id);
      if (ids.length) {
        this.$refs[`receiptTableRef`]?.handleDel({
          id: ids.join(","),
        });
      } else {
        this.msgError("请选择可删除行");
      }
    },
    /** 接口数据 */
    initDataRequest(tParams) {
      if (tParams) {
        this.tableDefaultParam = tParams;
      }
      const { id, customCostInfoId } = this.formModel;
      const opt = {
        orderId: customCostInfoId || id,
        ...this.additionalParams,
        ...this.tableDefaultParam,
      };
      this.$refs.profitRef?.profitRefresh(); // 刷新利润表
      return this.saveHttpObj.listHttp(opt).then((res) => {
        const billInfoArr = res.data?.billInfoList || [];
        this.$set(this.dataObj, "billInfoList", billInfoArr);
        this.independentTableData(res.data?.billList || []);
      });
    },
    /** 独立列表数据处理 */
    independentTableData(arr = []) {
      this._tableData(arr);
    },
    _tableData(billArr = []) {
      const allData = this.setColsTableData
        ? this.setColsTableData
        : this.$refs[`receiptTableRef`]?.tableDataArr || [];
      this.setColsTableData = null;
      let editList = allData.filter((e) => e.rBtnUpdate);
      if (this.isBatchSave || !editList.length) {
        // 批量保存后刷新数据
        this.$refs[`receiptTableRef`]?.setTableOpnData(billArr);
        this.isBatchSave = false;
      } else {
        // 保存后获取 行ID
        billArr.forEach((ele) => {
          const eIndex = editList.findIndex((u) => u.id === ele.id);
          if (eIndex > -1) {
            Object.assign(ele, editList.splice(eIndex, 1)[0]);
          }
        });
        this.$refs[`receiptTableRef`].setTableOpnData([
          ...editList,
          ...billArr,
        ]);
      }
      // 编辑后更新详情头部的账单金额
      if (this.isChangeRequest) {
        this.$emit("changeBillEvent");
        this.onTableSelectionChange && this.onTableSelectionChange(); // 重置选择项
      }
      this.isChangeRequest = true;
    },
    showColsHide(hRef) {
      if (hRef && !hRef.mixinShowTable) {
        // 获取列设置前的数据，防止未保存的数据被清空
        this.setColsTableData = this.$refs[`receiptTableRef`]?.tableDataArr;
        return false;
      }
      return true;
    },
    // 计算金额
    handleMoney(row, val, key) {
      if (["num", "unitPrice"].includes(key)) {
        row.totalMoney =
          key === "num"
            ? multiplicationFn([val, row.unitPrice])
            : multiplicationFn([val, row.num]);
      }
    },
    // 对账单跳转
    handleDetail(row) {
      const { newBackPathUrl } = this.formModel;
      this.$router.push({
        path: "/settlementManagement/statementManage/editBillManage",
        query: {
          id: row.reconciliationId,
          backPath: newBackPathUrl || this.$route.fullPath,
          activeTab: "3", // 1为新增，2为修改，3为详情
        },
      });
    },
    showBillOpnBtn(row = {}) {
      // 已生成对账单、已锁单不可操作
      if (![0, "0"].includes(row.isGenerateStatement) || row.lockOrder) {
        return false;
      }
      return true;
    },
    dictArr(tItem) {
      // 获取字典词
      return this[`${tItem}Dict`];
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "billType",
      "paymentType",
      "accountBillStatus",
    ]);
  },
  activated() {},
  deactivated() {},
  computed: {
    ...mapState({
      typeDict: (state) => state.dictionary.dicsData.billType,
      prepaidCollectDict: (state) => state.dictionary.dicsData.paymentType,
    }),
  },
  components: {
    TableOperation: () => import("_comp/ComTable/tableOperation"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    BillingHead: () => import("./billingHead.vue"),
    ProfitTable: () => import("./profitTable.vue"),
  },
};
