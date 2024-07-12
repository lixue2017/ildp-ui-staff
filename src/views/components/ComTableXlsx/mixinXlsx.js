import { defaultParams } from "_comp/ComUpload/model";
import {
  multiplicationFn,
  accumulationFn,
  beDividedFn,
} from "@/utils/instructions";
import { handleCopyText } from "@/utils/confirmBox";
import { deepCopy } from "@/utils/index.js";
import { getMousePosition } from "@/utils/dom.js";

/** 操作历史记录 */
const mixinHistoryXlsxRecord = {
  data() {
    return {
      historyStepList: [], // 操作步骤列表
      historyIndex: 0,
      // noRecordStep: false, // 前进/后退不记录操作步骤
    };
  },
  methods: {
    // 步骤集合
    handleAddHistoryStep(hisObj) {
      const hisData = hisObj || {
        tableData: this.tableData,
        mergeObj: this.mergeObj,
      };
      if (this.historyStepList.length) {
        // 有新的记录时, 删除当前操作之后的历史记录
        this.historyStepList.splice(this.historyIndex + 1);
        this.historyStepList.push({
          ...deepCopy(hisData),
        });
      } else {
        this.historyStepList[0] = {
          ...(this.historyStepList[0] || {}),
          ...deepCopy(hisData),
        };
      }
      this.historyIndex = this.historyStepList.length - 1;
    },
    // 后退一步骤
    takeStepBack() {
      if (this.historyIndex) {
        // this.noRecordStep = true;
        this.historyIndex -= 1;
        const { tableData, mergeObj } = this.historyStepList[this.historyIndex];
        if (tableData || mergeObj) {
          this.setHistoryRecord(tableData, mergeObj);
        }
      }
    },
    // 前进一步骤
    takeStepForward() {
      if (this.historyStepList.length - 1 > this.historyIndex) {
        // this.noRecordStep = true;
        this.historyIndex += 1;
        const { tableData, mergeObj } = this.historyStepList[this.historyIndex];
        if (tableData || mergeObj) {
          this.setHistoryRecord(tableData, mergeObj);
        }
      }
    },
    // 设置为操作记录值
    setHistoryRecord(tData, mObj) {
      if (tData) {
        this.tableData = deepCopy(tData);
      }
      if (mObj) {
        this.mergeObj = { ...mObj };
      }
    },
  },
};

/** 粘贴附件上传 */
const pasteImgUpload = {
  mixins: [mixinHistoryXlsxRecord],
  data() {
    return {
      productUploadConfig: {
        ...defaultParams,
        url:
          process.env.VUE_APP_BASE_API + "/customer/product/productImg/upload",
        type: "text",
        className: "text-uploader",
        name: "file",
        showFileList: false,
        fileList: [],
        accept: ".jpeg,.jpg,.png,.bmp",
        uploadData: {},
        successTip: false,
        limit: undefined,
        isPrediction: false,
      },
    };
  },
  methods: {
    /** 粘贴图片上传 */
    onPasteUpload(event) {
      let items = event.clipboardData && event.clipboardData.items;
      if (items && items.length && items[0].kind === "string") {
        if (
          this.copyData &&
          typeof this.copyData === "string" &&
          this.copyData.includes("http")
        ) {
          const i = this.productUploadConfig.accept
            .split(",")
            .findIndex((k) => this.copyData.includes(k));
          if (i > -1) {
            this.handleParte();
          }
        }
      } else {
        const uploadRef = this.$refs.productUploadRef;
        uploadRef?.onPasteUpload(event);
      }
    },
    handleDeleteImg() {
      this.selectList.forEach((k) => {
        this.tableData[k][this.selectProp] = "";
      });
      const oneSelect = this.oneSelect;
      this.selectList = [];
      this.oneSelect = null;
      if (oneSelect || oneSelect === 0) {
        const ref = this.$refs[`${this.selectProp}_${oneSelect}`];
        if (ref) {
          ref.forEach((item) => {
            item.blur();
          });
        }
      }
      this.selectProp = "";
      // 添加操作记录
      this.handleAddHistoryStep();
    },
    handleParteBlur(prop, index) {
      setTimeout(() => {
        if (prop === this.selectProp && this.selectList.includes(index)) {
          this.$refs[`${prop}_${index}`] &&
            this.$refs[`${prop}_${index}`][0].focus();
        }
      }, 300);
    },
    handleImgImport(row) {
      this.$refs.productUploadRef?.handleUploadClick();
      this.contextVisible = false;
    },
    uploadSuccess(res) {
      this.selectList.forEach((k) => {
        this.tableData[k][this.selectProp] = res.imgUrl;
      });
      this.selectProp = "";
      this.selectList = [];
      this.oneSelect = null;
      // 添加操作记录
      this.handleAddHistoryStep();
    },
    handleImportErr() {},
    handleUploading() {},
  },
  components: {
    ComUpload: () => import("_comp/ComUpload"),
  },
};

export const mixinXlsxConf = {
  mixins: [pasteImgUpload],
  props: {
    // 可合并列
    cancelMerge: {
      type: Array,
      default: () => [
        "shippingMark", // 唛头
        "boxLength", // 外箱长
        "boxWidth", // 外箱宽
        "boxHeight", // 外箱高
        "boxCount", // 包装箱数
        "boxWeight", // 每箱毛重
        "productNetWeight", // 每箱净重
        "boxTotalWeight", // 总毛重
        "totalProductNetWeight", // 总净重
        "boxVolume", // 体积
        "shipmentId", // 货件号
        "referenceId", // 内部参考号
        "consigneeWarehouseId", // 海外仓地址
      ],
    },
    // 合并操作列
    mergeCellKey: {
      type: Array,
      default: () => ["boxCount"],
    },
    // 合并单元格标识
    mergeSignKey: {
      type: String,
      default: () => "mergeColumn",
    },
    updateImg: {
      type: Array,
      default: () => [
        "img", // 产品图片
        "priceImg", // 后台定价截图
      ],
    },
    // 只做显示, 禁止编辑值
    seeKeys: {
      type: Array,
      default: () => ["boxTotalWeight", "totalProductNetWeight", "boxVolume"],
    },
    // 最后一列编辑值
    lastEditKey: {
      type: String,
      default: () => "productLink",
    },
    // 数字与选择框的粘贴值处理
    pasteKeys: {
      type: Array,
      default: () => [
        "boxWeight",
        "boxLength",
        "boxWidth",
        "boxHeight",
        "boxCount",
        "productNetWeight",
        "quantityNum",
        "declaredValue",
        "productUnitPrice",
      ],
    },
  },
  components: {
    FormSingle: () => import("_comp/ComTable/FormSingle"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    return {
      accumulationFn,
      selectProp: "",
      oneSelect: null,
      selectList: [],
      selectLine: null,
      contextVisible: false,
      menuType: 0, // 1:合并单元格；2：取消单元格；3：图片插入
      ctrlKey: false,
      shiftKey: false,
      tabIndex: null,
    };
  },
  created() {
    const that = this;
    document.addEventListener("keydown", function (event) {
      console.log("key:", event.key);
      if (!that.enterList) return;
      if (event.ctrlKey) {
        that.ctrlKey = true;
        if (event.ctrlKey && event.key === "c") {
          // Ctrl + C 按下
          that.handleCopy();
        }
        if (event.ctrlKey && event.key === "v") {
          // Ctrl + v 按下
          if (!that.updateImg.includes(that.selectProp)) {
            that.handleParte();
          }
        }
      } else if (event.shiftKey) {
        that.shiftKey = true;
      } else if (event.key === "Tab") {
        if (that.showInputKey) {
          // 编辑状态切换
          const inputArr = that.slotInputProp.filter(
            (key) =>
              !that.updateImg.includes(key) && !that.seeKeys.includes(key)
          );
          let [prop, index] = that.showInputKey.split("_");
          const i = inputArr.findIndex((key) => key === prop);
          if (i > -1) {
            let property = inputArr[i + 1];
            index = Number(index);
            if (prop === that.lastEditKey) {
              // 最后一列切换到下一行
              property = inputArr[0];
              if (that.tableData.length > index + 1) {
                that.tabIndex = index + 1;
                index = index + 1;
              }
            }
            const { [that.mergeSignKey]: mergeColumn } = that.tableData[index];
            if (mergeColumn) {
              if (that.cancelMerge.includes(property)) {
                index = that.mergeObj[mergeColumn].index;
              } else if (that.tabIndex != index) {
                index = that.tabIndex;
              }
            }
            that.clickKey = `${property}_${index}`;
            that.handleClick(property, index);
            that.handleInputFocus(`${property}_${index}`);
          }
        }
      }
      //  else if (
      //   /[1-9,a-z,A-Z, ]/.test(event.key) &&
      //   that.clickKey &&
      //   that.selectList.length === 1
      // ) {
      //   that.handleInputFocus(that.clickKey);
      // }
    });
    document.addEventListener("keyup", function (event) {
      that.ctrlKey = false;
      that.shiftKey = false;
      if (event.key === "Tab") {
        console.log("keyup:Tab");
      }
    });
  },
  methods: {
    handleMouseenter() {
      this.enterList = true;
    },
    handleMouseleave() {
      this.enterList = false;
    },
    // 图片聚焦
    handleImgFocus(prop) {
      if (
        this.updateImg.includes(prop) &&
        (this.oneSelect || this.oneSelect === 0)
      ) {
        const ref = this.$refs[`${this.selectProp}_${this.oneSelect}`];
        if (ref) {
          ref.forEach((item) => {
            item.focus();
          });
        }
      }
    },
    // 单击单元格
    handleClick(prop, index) {
      this.contextVisible = false;
      this.selectLine = null;
      if (
        this.selectProp != prop ||
        this.selectList.length > 1 ||
        !this.selectList.includes(index)
      ) {
        this.selectProp = prop;
        this.selectList = [index];
        this.oneSelect = index;
      } else {
        this.selectProp = "";
        this.selectList = [];
        this.oneSelect = null;
      }
      this.handleImgFocus(prop);
    },
    // shift+点击
    handleClickShift(prop, index) {
      this.selectLine = null;
      if (
        this.selectProp != prop ||
        (!this.oneSelect && this.oneSelect !== 0)
      ) {
        this.selectProp = prop;
        this.selectList = [index];
        this.oneSelect = index;
        return;
      }
      const selectList = [];
      if (this.oneSelect > index) {
        for (let i = this.oneSelect; i >= index; i--) {
          selectList.push(i);
        }
      } else {
        for (let i = this.oneSelect; i <= index; i++) {
          selectList.push(i);
        }
      }
      this.selectList = selectList;
      this.handleImgFocus(prop);
    },
    // ctrl+点击
    handleClickCtrl(prop, index) {
      this.selectLine = null;
      if (!this.mergeCellKey.includes(prop)) {
        if (this.selectProp != prop || !this.selectList.length) {
          this.selectProp = prop;
          this.selectList = [index];
          this.oneSelect = index;
        } else {
          if (this.selectList.includes(index)) {
            const i = this.selectList.findIndex((k) => k === index);
            this.selectList.splice(i, 1);
            if (this.selectList[0]) {
              this.oneSelect = this.selectList[0];
            } else {
              this.oneSelect = null;
            }
          } else {
            this.selectList.push(index);
          }
        }
        this.handleImgFocus(prop);
      }
    },
    // menuType=1合并单元格/menuType=2取消合并单元格
    handleMerge() {
      if (!this.menuType) return;
      this.contextVisible = false;
      const { mergeSignKey } = this;
      if (this.menuType === 2) {
        // 取消合并单元格
        const { [mergeSignKey]: mergeColumn } = this.tableData[this.oneSelect];
        const obj = {};
        const mergeRow = this.tableData[this.mergeObj[mergeColumn].index];
        this.cancelMerge.forEach((k) => (obj[k] = mergeRow[k]));
        delete this.mergeObj[mergeColumn];
        this.tableData = this.tableData.map((item, index) => {
          if (mergeColumn === item[mergeSignKey]) {
            return {
              ...item,
              ...obj,
              [mergeSignKey]: null,
            };
          }
          return item;
        });
      } else {
        //合并单元格
        const len = this.selectList.length;
        if (len > 1) {
          const first = this.selectList[0];
          let last = this.selectList[len - 1];
          if (this.tableData[last][mergeSignKey]) {
            const { num } = this.mergeObj[this.tableData[last][mergeSignKey]];
            for (let i = last + 1; i < last + num; i++) {
              this.selectList.push(i);
            }
            last = last + num - 1;
          }
          this.mergeColumnNum += 1;
          const i = first > last ? last : first;
          this.mergeObj[this.mergeColumnNum] = {
            index: i,
            num: this.selectList.length,
          };
          const obj = {};
          this.cancelMerge.forEach((k) => (obj[k] = undefined));
          this.tableData = this.tableData.map((item, index) => {
            if (this.selectList.includes(index)) {
              return {
                ...item,
                ...(i === index ? {} : obj),
                [mergeSignKey]: this.mergeColumnNum,
              };
            }
            return item;
          });
        }
      }
      // console.log('3', this.tableData)
      this.menuType = 0;
      this.selectProp = "";
      this.selectList = [];
      this.oneSelect = null;
      // 添加操作记录
      this.handleAddHistoryStep();
    },
    //右键自定义菜单
    openContextMenu(ev, prop, index) {
      this.menuType = 0;
      if (prop) {
        this.selectLine = null;
        if (this.selectProp !== prop || !this.selectList.includes(index)) {
          this.selectProp = prop;
          this.selectList = [index];
          this.oneSelect = index;
        }
        this.handleMenuData(prop);
      } else {
        this.selectLine = index;
      }
      const {
        left: clickLeft,
        top: clickTop,
        right: clickRight,
        bottom: clickBottom,
      } = getMousePosition(ev);
      if (clickRight > 175) {
        // 弹窗宽度
        this.contextMenuLeft = clickLeft - 260; // 到视口边距
      } else {
        this.contextMenuLeft = clickLeft - 260 - 175;
      }
      if (clickBottom > 282) {
        // 弹窗高度
        this.contextMenuTop = clickTop;
      } else {
        this.contextMenuTop = clickTop - 282;
      }
      this.contextVisible = true;
    },
    // 处理右键菜单显示
    handleMenuData(prop) {
      const { mergeSignKey } = this;
      if (this.cancelMerge.includes(prop)) {
        // 合并/取消
        let mergeColumn = this.tableData[this.oneSelect][mergeSignKey];
        let menuType = 0;
        this.selectList.forEach((k) => {
          if (
            !this.tableData[k][mergeSignKey] ||
            mergeColumn !== this.tableData[k][mergeSignKey]
          ) {
            menuType = 1;
            return;
          } else {
            mergeColumn = this.tableData[k][mergeSignKey];
          }
        });
        if (!menuType) {
          menuType = 2;
        }
        if (!this.mergeCellKey.includes(prop) && menuType === 1) {
          menuType = 0;
        }
        this.menuType = menuType;
      } else if (this.updateImg.includes(prop)) {
        // 图片插入
        this.menuType = 3;
      }
    },
    // 添加行
    addLine(type) {
      const list =
        this.selectLine || this.selectLine === 0
          ? [this.selectLine]
          : [...this.selectList];
      list.sort();
      const tableData = [...this.tableData];
      const { mergeSignKey } = this;
      switch (type) {
        case "above":
          let firstIndex = list[0];
          const firstItem = tableData[firstIndex];
          if (firstItem[mergeSignKey]) {
            firstIndex = tableData.findIndex(
              (item) => item[mergeSignKey] === firstItem[mergeSignKey]
            );
          }
          tableData.splice(firstIndex, 0, ...this.addRows(this.aboveRowsNum));
          this.aboveRowsNum = 1;
          break;
        case "below":
          let lastIndex = list[list.length - 1];
          let { [mergeSignKey]: mergeColumn } = tableData[lastIndex];
          if (mergeColumn) {
            const { index, num } = this.mergeObj[mergeColumn];
            lastIndex = index + num - 1;
          }
          tableData.splice(
            lastIndex + 1,
            0,
            ...this.addRows(this.belowRowsNum)
          );
          this.belowRowsNum = 1;
          break;

        default:
          break;
      }
      this.handleClearSelect();
      const mergeObj = JSON.parse(JSON.stringify(this.mergeObj));
      Object.keys(mergeObj).forEach((k) => {
        const i = tableData.findIndex((data) => data[mergeSignKey] == k);
        if (i > -1) {
          mergeObj[k].index = i;
        }
      });
      this.mergeObj = mergeObj;
      this.tableData = tableData;
      // 添加操作记录
      this.handleAddHistoryStep();
    },
    handleDeleteLine() {
      const { mergeSignKey } = this;
      if (this.selectLine || this.selectLine === 0) {
        const { [mergeSignKey]: mergeColumn } = this.tableData[this.selectLine];
        this.tableData.splice(this.selectLine, 1);
        if (mergeColumn) {
          if (this.mergeObj[mergeColumn].num <= 2) {
            delete this.mergeObj[mergeColumn];
          } else {
            this.mergeObj[mergeColumn].num -= 1;
          }
        }
        this.selectLine = null;
      } else {
        if (this.selectList.length) {
          let tableData = [];
          const mergeObj = {};
          if (this.cancelMerge.includes(this.selectProp)) {
            let iList = [];
            this.selectList.forEach((i) => {
              const { [mergeSignKey]: mergeColumn } = this.tableData[i];
              if (!mergeColumn) {
                iList.push(i);
              } else if (
                mergeColumn &&
                this.mergeObj[mergeColumn] &&
                this.mergeObj[mergeColumn].index === i
              ) {
                const { index, num } = this.mergeObj[mergeColumn];
                for (let n = index; n < index + num; n++) {
                  iList.push(n);
                }
              }
            });
            tableData = this.tableData.filter((_, i) => !iList.includes(i));
          } else {
            tableData = this.tableData.filter(
              (_, i) => !this.selectList.includes(i)
            );
          }
          tableData.forEach((item, index) => {
            if (item[mergeSignKey]) {
              if (!mergeObj[item[mergeSignKey]])
                mergeObj[item[mergeSignKey]] = { index, num: 0 };
              mergeObj[item[mergeSignKey]].num += 1;
            }
          });
          Object.keys(mergeObj).forEach((k) => {
            if (mergeObj[k].num < 2) {
              delete mergeObj[k];
            }
          });
          this.mergeObj = mergeObj;
          this.tableData = tableData;
        }
        this.tableData.forEach((item) => {
          if (item[mergeSignKey] && !this.mergeObj[item[mergeSignKey]]) {
            item[mergeSignKey] = undefined;
          }
        });
        console.log(9, this.tableData);
        this.selectProp = "";
        this.selectList = [];
        this.oneSelect = null;
      }
      this.contextVisible = false;
      // 添加操作记录
      this.handleAddHistoryStep();
    },
    handleClickIndex(index) {
      if (this.selectLine === index) {
        this.selectLine = null;
        return;
      }
      this.selectLine = index;
      this.selectProp = "";
      this.selectList = [];
      this.oneSelect = null;
    },
    handleCopy() {
      if (this.selectLine || this.selectLine === 0) {
        const item = { ...this.tableData[this.selectLine] };
        if (item[this.mergeSignKey]) {
          const { index } = this.mergeObj[item[this.mergeSignKey]];
          this.cancelMerge.forEach((k) => {
            item[k] = this.tableData[index][k];
          });
        }
        this.copyData = item;
        handleCopyText(JSON.parse(JSON.stringify(item)), this, "");
      } else if (this.selectList.length) {
        const i = this.selectList[this.selectList.length - 1];
        this.copyData = this.tableData[i][this.selectProp];
        handleCopyText(this.copyData || "", this, "");
      }
      this.handleClearSelect();
    },
    handleParte() {
      if (!this.copyData) {
        this.handleClearSelect();
        return;
      }
      if (this.selectLine || this.selectLine === 0) {
        if (this.copyData.constructor === Object) {
          this.slotInputProp.forEach((k) => {
            this.tableData[this.selectLine][k] = this.copyData[k];
          });
        } else {
          this.slotInputProp.forEach((k) => {
            this.tableData[this.selectLine][k] = this.copyData;
          });
        }
        // this.handleChangeTotal();
      } else {
        let data = this.copyData;
        if (this.copyData.constructor === Object) {
          data = this.copyData[this.selectProp];
        }
        this.selectList.forEach((i) => {
          this.tableData[i][this.selectProp] = data;
          if (this.pasteKeys.includes(this.selectProp)) {
            this.handleChange(data, this.selectProp, i, true);
          }
        });
      }
      this.handleClearSelect();
      // 添加操作记录
      this.handleAddHistoryStep();
    },
    addRows(num = 1) {
      if (!num) {
        return [];
      }
      const rows = [];
      let params = {};
      const { addParamFn } = this.operationXlsxObj;
      if (addParamFn) {
        params = {
          ...addParamFn(this.tableData),
        };
      }
      for (let i = 0; i < num; i++) {
        this.newId += 1;
        rows.push({
          // 新增字段初始化
          newId: `newId${this.newId}`,
          ...this.initColsPropObj(),
          ...params,
        });
      }
      return rows;
    },
    handleChange(val, prop, index, noAddRecord) {
      // 联动数据处理
      if (this.operationXlsxObj.rowChange) {
        this.operationXlsxObj.rowChange(this.tableData[index], val, prop);
      }
      if (!noAddRecord) {
        // 添加操作记录
        this.handleAddHistoryStep();
      }
    },
    // 表格合计 - 已合并只计算一行
    handleChangeTotal() {
      const { mergeSignKey } = this;
      let mergeColArr = [];
      const boxCount = [];
      const boxTotalWeight = [];
      const totalProductNetWeight = [];
      const boxVolume = [];
      this.tableData.forEach((ele) => {
        if (!mergeColArr.includes(ele[mergeSignKey]) || !ele[mergeSignKey]) {
          boxCount.push(ele.boxCount || 0);
          boxTotalWeight.push(ele.boxTotalWeight || 0);
          totalProductNetWeight.push(ele.totalProductNetWeight || 0);
          boxVolume.push(ele.boxVolume || 0);
        }
        if (ele[mergeSignKey]) {
          mergeColArr.push(ele[mergeSignKey]);
        }
      });
    },
    handleClearSelect() {
      this.selectLine = null;
      this.selectProp = "";
      this.selectList = [];
      this.oneSelect = null;
      this.contextVisible = false;
    },
  },
};
