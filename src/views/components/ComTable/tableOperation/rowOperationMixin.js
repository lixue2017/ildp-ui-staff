import { comSaveRepeatedRequest } from "@/api/common";
import { customMessageBox } from "@/utils/confirmBox.js";
/** 列表中编辑操作 */

export const mixinTableOperationRow = {
  data() {
    return {
      mixinTableBtnAll: [
        {
          text: "保存",
          btnUpdate: true,
          opnBtnType: "saveRow",
          handleClick: (row) => {
            if (this.mixinOperationObj?.handleMixinCheckSaveFn) {
              // 先校验，后保存
              this.mixinOperationObj.handleMixinCheckSaveFn(row, () => {
                this.handleMixinSave(row);
              });
            } else {
              this.handleMixinSave(row);
            }
          },
        },
        {
          text: "取消",
          btnUpdate: true,
          opnBtnType: "cancelRow",
          handleClick: this.handleMixinCancel,
        },
        {
          text: "编辑",
          btnUpdate: false,
          opnBtnType: "editRow",
          handleClick: this.handleMixinEdit,
        },
        {
          text: "复制",
          btnUpdate: false,
          opnBtnType: "copyRow",
          handleClick: this.handleMixinCopy,
        },
        {
          text: "删除",
          color: "#FF6767",
          btnUpdate: false,
          opnBtnType: "delRow",
          handleClick: (row) => {
            if (this.mixinOperationObj?.handleMixinCheckDelFn) {
              // 先校验，后删除
              this.mixinOperationObj.handleMixinCheckDelFn(row, () => {
                this.handleMixinMsgBoxDel(row);
              });
            } else {
              this.handleMixinMsgBoxDel(row);
            }
          },
        },
      ],
      mixinTableRef: "oTableRef", // table的ref
      mixinTableDataArr: [], // 表格数据，保存前的全部表格数据
      oTempRow: {}, // 临时数据，用于取消是还原数据

      mixinFilterOpnBtnArr: ["copyRow"], // 过滤操作按钮
      mixinShowOpnBtnArr: [
        "saveRow",
        "cancelRow",
        "editRow",
        "copyRow",
        "delRow",
      ], // 显示按钮
      /** 操作对象 */
      mixinOperationObj: {
        // editCallBack: () => {}, // 编辑时回调
        // httpSaveRequest: () => {}, // 保存回调
        // saveCallBack: () => this.tableMixinRefresh(), // 保存后刷新
        // httpDelRequest: (row) => {}, // 删除回调
        // delCallBack: () => this.tableMixinRefresh(), // 删除后刷新
        // copyParamFn: (row) => {}, // 复制行的处理数据
        // copyCallBack: () => {}, // 复制后的回调
      },
    };
  },
  methods: {
    /** 保存 */
    async handleMixinSave(row) {
      const { httpSaveRequest, saveCallBack } = this.mixinOperationObj;
      if (httpSaveRequest) {
        await comSaveRepeatedRequest(httpSaveRequest, row);
        this.msgSuccess("保存成功");
      }
      row.rBtnUpdate = false;
      saveCallBack && saveCallBack(row);
    },
    /** 取消编辑 */
    handleMixinCancel(row) {
      if (row.isNewAdd) {
        this.handleMixinDirectlyDel(row);
      } else {
        if (!this.oTempRow[row.temp_secondId]) {
          return;
        }
        Object.keys(row).forEach((e) => {
          row[e] = this.oTempRow[row.temp_secondId][e];
        });
        row.rBtnUpdate = false; // 是否可变更
      }
      const { cancelCallBack } = this.mixinOperationObj;
      cancelCallBack && cancelCallBack(row);
    },
    handleMixinDirectlyDel(row) {
      // 新增没有保存，取消时直接删除，有排序时不能直接取index值，需要用唯一key计算出排序后的index
      const rIndex = this.mixinTableDataArr.findIndex(
        (e) => e.temp_secondId === row.temp_secondId
      );
      if (rIndex > -1) {
        this.mixinTableDataArr.splice(rIndex, 1);
        this.setTableMixinData(this.mixinTableDataArr);
      }
    },
    /** 编辑 */
    handleMixinEdit(row) {
      this.oTempRow[row.temp_secondId] = JSON.parse(JSON.stringify(row));
      let tableRef = this.$refs[this.mixinTableRef];
      if (this.mixinOperationObj.activeName) {
        tableRef =
          this.$refs[
            `${this.mixinTableRef}${this.mixinOperationObj.activeName}`
          ][0];
      }
      tableRef?.setUpdateTableVal(row, "rBtnUpdate", true);
      const { editCallBack } = this.mixinOperationObj;
      editCallBack && editCallBack(row);
    },
    /** 复制 */
    handleMixinCopy(row) {
      const {
        copyCallBack,
        copyParamFn,
        isCopyNoRequest = true,
      } = this.mixinOperationObj;
      if (isCopyNoRequest) {
        // 不调接口，只删除ID，直接复制
        const { id, temp_secondId, ...cRow } = row;
        this.mixinAddTableOpnData([
          {
            ...cRow,
            ...(copyParamFn ? copyParamFn(row) : {}),
            isNewAdd: true, // 用于取消时判断直接删除
            rBtnUpdate: true, // 复制行可编辑
          },
        ]);
      }
      copyCallBack && copyCallBack(row);
    },
    /** 刷新 */
    tableMixinRefresh() {
      let tableRef = this.$refs[this.mixinTableRef];
      if (this.mixinOperationObj.activeName) {
        tableRef =
          this.$refs[
            `${this.mixinTableRef}${this.mixinOperationObj.activeName}`
          ][0];
      }
      tableRef?.refreshTable();
    },

    /** 新增 */
    mixinAddTableOpnData(addList = []) {
      this.setTableMixinData([...addList, ...this.mixinTableDataArr]);
    },
    setTableMixinData(arr = []) {
      this.mixinTableDataArr = arr;
      let tableRef = this.$refs[this.mixinTableRef];
      if (this.mixinOperationObj.activeName) {
        tableRef =
          this.$refs[
            `${this.mixinTableRef}${this.mixinOperationObj.activeName}`
          ][0];
      }
      tableRef?.setNewTableData(arr);
    },
    /** 删除 */
    handleMixinMsgBoxDel(row) {
      const { delMsgBox } = this.mixinOperationObj;
      if (delMsgBox) {
        // 删除提示
        const {
          httpDelRequest,
          delCallBack,
          delMsgTitle = "删除提示",
        } = this.mixinOperationObj;
        customMessageBox(
          this,
          {
            msgTitle: delMsgTitle,
            msgTxtColor: "#FF6767",
            httpMsgRequest: () => httpDelRequest(row),
          },
          () => {
            this.msgSuccess("删除成功");
            delCallBack && delCallBack(row);
          }
        );
      } else {
        this.handleMixinDel(row);
      }
    },
    async handleMixinDel(row) {
      const { httpDelRequest, delCallBack, isDelNewAdd } =
        this.mixinOperationObj;
      if (httpDelRequest) {
        await comSaveRepeatedRequest(httpDelRequest, row);
        this.msgSuccess("删除成功");
      }
      if (isDelNewAdd && row.isNewAdd) {
        // 删除新增未保存的数据
        this.handleMixinDirectlyDel(row);
      }
      delCallBack && delCallBack(row);
    },

    /** 表格列保存 */
    handleMixinRowSave(params, saveHttpObj, rObj = {}) {
      return new Promise((resolve, reject) => {
        this.mixinEditSaveRules(params, rObj, () => {
          if (saveHttpObj) {
            saveHttpObj(params)
              .then(() => {
                resolve();
              })
              .catch(() => {
                reject(); // 接口报错时重置点击状态
              });
          } else {
            resolve(params);
          }
        });
      });
    },
    /** 保存时必填项校验 */
    mixinEditSaveRules(params, ruleObj, callBack) {
      const {
        ruleIndex,
        ruleMsg = {},
        ruleTableCols = [],
        otherRule,
        nonZeroKeys,
        ruleCallBack,
      } = ruleObj || {};

      const tableRuleMsg = ruleTableCols.reduce((obj, item) => {
        if (item.request) {
          obj[item.prop] = item.label;
        }
        return obj;
      }, {});

      const nRuleMsg = {
        ...tableRuleMsg,
        ...ruleMsg,
      };

      let ruleArr = [];
      for (let key in nRuleMsg) {
        if (!params[key]) {
          if (nonZeroKeys && nonZeroKeys.includes(key)) {
            // 必填且不能为0
            ruleArr.push(nRuleMsg[key]);
          } else {
            if (params[key] !== 0) {
              ruleArr.push(nRuleMsg[key]);
            }
          }
        }
      }
      if (ruleArr.length) {
        let idxTit = ruleIndex ? `序号${ruleIndex}行` : "";
        this.msgError(`${idxTit}请输入或选择 ${ruleArr.join("、")}`);
        return false;
      }

      if (ruleCallBack && !ruleCallBack(params, ruleIndex)) {
        // 单独校验, 如: 联动的数据校验
        return false;
      }

      if (otherRule) {
        // 其他校验, 如: new RegExp(/^[^\u4e00-\u9fa5]*$/); // 不能输入中文
        for (let oKey in otherRule) {
          if (
            otherRule[oKey] &&
            !otherRule[oKey].checkRule?.test(params[oKey])
          ) {
            ruleArr.push(otherRule[oKey].label);
          }
        }
        if (ruleArr.length) {
          let idxTit = ruleIndex ? `序号${ruleIndex}行` : "";
          this.msgError(`${idxTit} ${ruleArr.join("、")}`);
          return false;
        }
      }

      if (callBack) {
        // 保存
        const { rBtnUpdate, isNewAdd, temp_secondId, ...nParams } = params;
        callBack(nParams);
      }
    },
    /** 全部保存 */
    async handleMixinSaveAll(rRuleObj, allCallBack, expandRow) {
      let allList = this.mixinTableDataArr;
      const { rowExpandList, rExpandBtnUpdate } = expandRow || {};
      if (rowExpandList) {
        allList = rowExpandList; // 其他需要校验的数据, 如：嵌套列表;
      }
      if (!allList.length) {
        return;
      }
      let editRows = [];
      let filArr = [];
      for (let [i, ele] of allList.entries()) {
        if (ele.rBtnUpdate || rExpandBtnUpdate) {
          filArr.push(i);
          const isLoop = this.mixinEditSaveRules(
            ele,
            { ruleIndex: i + 1, ...rRuleObj },
            (opt) => {
              editRows.push(opt);
            }
          );
          if (isLoop === false) break;
        }
      }
      // 有编辑行，并且全部校验通过
      if (editRows.length && filArr.length === editRows.length) {
        const { saveTableAllRequest } = this.mixinOperationObj;
        if (saveTableAllRequest) {
          // console.log('调接口批量保存')
          await saveTableAllRequest(editRows);
          this.isBatchSave = true;
          this.tableMixinRefresh();
        }
        if (allCallBack) {
          allCallBack(editRows);
        }
      }
    },
    /** 单条数据保存后，其他编辑状态数据不变 */
    mixinChangeTableDataFn(resArr = []) {
      // 是否为编辑状态;
      let editList = this.mixinTableDataArr.filter((e) => e.rBtnUpdate);
      if (this.isBatchSave || !editList.length) {
        // 批量保存后刷新数据
        this.isBatchSave = false;
        this.setTableMixinData(resArr);
      } else {
        // 保存后获取 行ID
        resArr.forEach((ele) => {
          const eIndex = editList.findIndex(
            (u) => u.temp_secondId === ele.temp_secondId
          );
          if (eIndex > -1) {
            Object.assign(ele, editList.splice(eIndex, 1)[0]);
          }
        });
        this.setTableMixinData([...editList, ...resArr]);
      }
    },
    mixinTableRowBtnArr() {
      // 操作按钮，默认过滤复制按钮
      return this.mixinTableBtnAll.filter(
        (e) =>
          this.mixinShowOpnBtnArr.includes(e.opnBtnType) &&
          !this.mixinFilterOpnBtnArr.includes(e.opnBtnType)
      );
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
};

/**
 * 
		:rowOperationBtnListFn="mixinTableRowBtnArr"
		:colShowBtnFn="(btnItem, row) => btnItem.btnUpdate === (row.rBtnUpdate || false)"
		@getResult="getTableResult"


		getTableResult({ tableData }) {
			this.mixinChangeTableDataFn(tableData);
		},
 */

// 监听数据，显示按钮
export const mixinTableWatchOpnBtn = {
  data() {
    return {
      delMixinFilterNew: false, // 是否过滤新增
      total: 0,
    };
  },
  watch: {
    mixinTableDataArr: {
      deep: true,
      handler: function (newVal) {
        const nonNewArr = this.delMixinFilterNew
          ? (newVal || []).filter((e) => !e.isNewAdd)
          : newVal; // 过滤新增
        if (nonNewArr.length <= 1 && this.total <= 1) {
          // 至少包含1条数据
          this.mixinFilterOpnBtnArr.push("delRow");
        } else {
          this.mixinFilterOpnBtnArr = this.mixinFilterOpnBtnArr.filter(
            (e) => e !== "delRow"
          );
        }
      },
    },
  },
};

export const mixinTableExpandOperationRow = {
  // 表格内嵌展开行 - 与mixinTableOperationRow一起使用，注意引用顺序
  data() {
    return {
      mixinExpandOpnBtnArr: ["saveRow", "cancelRow"],
    };
  },
  methods: {
    addMixinExpand(exRow, addObj = {}, expandListKey = "products") {
      if (!exRow[expandListKey]) {
        this.$refs[this.mixinTableRef]?.setUpdateTableVal(
          exRow,
          expandListKey,
          []
        );
      }

      exRow[expandListKey].push({
        temp_only_key: Math.random() + "",
        ...addObj,
      });
    },
    removeMixinExpand(exRow, exIndex, expandListKey = "products") {
      exRow[expandListKey].splice(exIndex, 1);
    },
    mixinRowExpandBtnArr() {
      // 展开行操作按钮
      return this.mixinTableBtnAll.filter((e) =>
        this.mixinExpandOpnBtnArr.includes(e.opnBtnType)
      );
    },
  },
};
