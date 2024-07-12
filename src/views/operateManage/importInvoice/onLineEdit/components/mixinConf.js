import { defaultParams } from "_comp/ComUpload/model";
import {
  multiplicationFn,
  accumulationFn,
  beDividedFn,
} from "@/utils/instructions";
import { handleCopyText } from "@/utils/confirmBox";
export const mixinConf = {
  components: {
    FormSingle: () => import("_comp/ComTable/FormSingle"),
    ComUpload: () => import("_comp/ComUpload"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    AddDialog: () => import("_comp/PrivateWarehouseDialog/AddDialog/index.vue"),
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
      cancelMerge: [
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
      updateImg: [
        "img", // 产品图片
        "priceImg", // 后台定价截图
      ],
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
      productId: 0,
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
          const inputArr = that.slotInputProp.filter(
            (key) =>
              !that.updateImg.includes(key) &&
              ![
                "boxTotalWeight",
                "totalProductNetWeight",
                "boxVolume",
              ].includes(key)
          );
          let [prop, index] = that.showInputKey.split("_");
          const i = inputArr.findIndex((key) => key === prop);
          if (i > -1) {
            let property = inputArr[i + 1];
            index = Number(index);
            if (prop === "productLink") {
              property = inputArr[0];
              if (that.tableData.length > index + 1) {
                that.tabIndex = index + 1;
                index = index + 1;
              }
            }
            const { mergeColumn } = that.tableData[index];
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
      if (prop !== "boxCount") {
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
      const boxCount = [];
      const boxTotalWeight = [];
      const totalProductNetWeight = [];
      const boxVolume = [];
      if (this.menuType === 2) {
        // 取消合并单元格
        const { mergeColumn } = this.tableData[this.oneSelect];
        const obj = {};
        const mergeRow = this.tableData[this.mergeObj[mergeColumn].index];
        this.cancelMerge.forEach((k) => (obj[k] = mergeRow[k]));
        delete this.mergeObj[mergeColumn];
        this.tableData = this.tableData.map((item, index) => {
          if (mergeColumn === item.mergeColumn) {
            boxCount.push(obj.boxCount || 0);
            boxTotalWeight.push(obj.boxTotalWeight || 0);
            totalProductNetWeight.push(obj.totalProductNetWeight || 0);
            boxVolume.push(obj.boxVolume || 0);
            return {
              ...item,
              ...obj,
              mergeColumn: null,
            };
          } else {
            if (
              !item.mergeColumn ||
              this.mergeObj[item.mergeColumn].index === index
            ) {
              boxCount.push(item.boxCount || 0);
              boxTotalWeight.push(item.boxTotalWeight || 0);
              totalProductNetWeight.push(item.totalProductNetWeight || 0);
              boxVolume.push(item.boxVolume || 0);
            } else {
              boxCount.push(0);
              boxTotalWeight.push(0);
              totalProductNetWeight.push(0);
              boxVolume.push(0);
            }
            return item;
          }
        });
      } else {
        //合并单元格
        const len = this.selectList.length;
        if (len > 1) {
          const first = this.selectList[0];
          let last = this.selectList[len - 1];
          if (this.tableData[last].mergeColumn) {
            const { num } = this.mergeObj[this.tableData[last].mergeColumn];
            for (let i = last + 1; i < last + num; i++) {
              this.selectList.push(i);
            }
            last = last + num - 1;
          }
          this.mergeColumn += 1;
          const i = first > last ? last : first;
          this.mergeObj[this.mergeColumn] = {
            index: i,
            num: this.selectList.length,
          };
          const obj = {};
          this.cancelMerge.forEach((k) => (obj[k] = undefined));
          this.tableData = this.tableData.map((item, index) => {
            if (this.selectList.includes(index)) {
              if (i === index) {
                boxCount.push(item.boxCount || 0);
                boxTotalWeight.push(item.boxTotalWeight || 0);
                totalProductNetWeight.push(item.totalProductNetWeight || 0);
                boxVolume.push(item.boxVolume || 0);
              } else {
                boxCount.push(0);
                boxTotalWeight.push(0);
                totalProductNetWeight.push(0);
                boxVolume.push(0);
              }
              return {
                ...item,
                ...(i === index ? {} : obj),
                mergeColumn: this.mergeColumn,
              };
            } else {
              if (
                !item.mergeColumn ||
                this.mergeObj[item.mergeColumn].index === index
              ) {
                boxCount.push(item.boxCount || 0);
                boxTotalWeight.push(item.boxTotalWeight || 0);
                totalProductNetWeight.push(item.totalProductNetWeight || 0);
                boxVolume.push(item.boxVolume || 0);
              } else {
                boxCount.push(0);
                boxTotalWeight.push(0);
                totalProductNetWeight.push(0);
                boxVolume.push(0);
              }
              return item;
            }
          });
        }
      }
      this.menuType = 0;
      this.selectProp = "";
      this.selectList = [];
      this.oneSelect = null;
      this.grossTotal.boxCount = boxCount;
      this.grossTotal.boxTotalWeight = boxTotalWeight;
      this.grossTotal.totalProductNetWeight = totalProductNetWeight;
      this.grossTotal.boxVolume = boxVolume;
      // 添加操作记录
      this.$emit("addRecord", {
        tableData: this.tableData,
        mergeObj: this.mergeObj,
      });
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
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const clientWidth = document.documentElement.clientWidth;
      this.contextMenuLeft = ev.x;
      this.contextMenuTop = ev.y + scrollTop - 100;
      if (clientWidth - this.contextMenuLeft < 400) {
        this.contextMenuLeft -= 180;
      }
      if (clientHeight + scrollTop - this.contextMenuTop < 480) {
        this.contextMenuTop -= 282;
      }
      this.contextVisible = true;
    },
    // 处理右键菜单显示
    handleMenuData(prop) {
      if (this.cancelMerge.includes(prop)) {
        // 合并/取消
        let mergeColumn = this.tableData[this.oneSelect].mergeColumn;
        let menuType = 0;
        this.selectList.forEach((k) => {
          if (
            !this.tableData[k].mergeColumn ||
            mergeColumn !== this.tableData[k].mergeColumn
          ) {
            menuType = 1;
            return;
          } else {
            mergeColumn = this.tableData[k].mergeColumn;
          }
        });
        if (!menuType) {
          menuType = 2;
        }
        if (prop !== "boxCount" && menuType === 1) {
          menuType = 0;
        }
        this.menuType = menuType;
      } else if (this.updateImg.includes(prop)) {
        // 图片插入
        this.menuType = 3;
      }
    },
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
      this.$emit("addRecord", {
        tableData: this.tableData,
      });
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
      this.$emit("addRecord", {
        tableData: this.tableData,
      });
    },
    handleImportErr() {},
    handleUploading() {},
    // 添加行
    addLine(type) {
      const list =
        this.selectLine || this.selectLine === 0
          ? [this.selectLine]
          : [...this.selectList];
      list.sort();
      const tableData = [...this.tableData];
      const {
        quantityNum,
        totalDeclaredValue,
        boxCount,
        boxTotalWeight,
        totalProductNetWeight,
        boxVolume,
      } = this.grossTotal;
      let arr = [];
      switch (type) {
        case "above":
          let firstIndex = list[0];
          const firstItem = tableData[firstIndex];
          if (firstItem.mergeColumn) {
            firstIndex = tableData.findIndex(
              (item) => item.mergeColumn === firstItem.mergeColumn
            );
          }
          tableData.splice(firstIndex, 0, ...this.addRows(this.aboveRowsNum));
          arr = new Array(this.aboveRowsNum).fill(0);
          quantityNum.splice(firstIndex, 0, ...arr);
          totalDeclaredValue.splice(firstIndex, 0, ...arr);
          boxCount.splice(firstIndex, 0, ...arr);
          boxTotalWeight.splice(firstIndex, 0, ...arr);
          totalProductNetWeight.splice(firstIndex, 0, ...arr);
          boxVolume.splice(firstIndex, 0, ...arr);
          this.aboveRowsNum = 1;
          break;
        case "below":
          let lastIndex = list[list.length - 1];
          let { mergeColumn } = tableData[lastIndex];
          if (mergeColumn) {
            const { index, num } = this.mergeObj[mergeColumn];
            lastIndex = index + num - 1;
          }
          tableData.splice(
            lastIndex + 1,
            0,
            ...this.addRows(this.belowRowsNum)
          );
          arr = new Array(this.belowRowsNum).fill(0);
          quantityNum.splice(lastIndex + 1, 0, ...arr);
          totalDeclaredValue.splice(lastIndex + 1, 0, ...arr);
          boxCount.splice(lastIndex + 1, 0, ...arr);
          boxTotalWeight.splice(lastIndex + 1, 0, ...arr);
          totalProductNetWeight.splice(lastIndex + 1, 0, ...arr);
          boxVolume.splice(lastIndex + 1, 0, ...arr);
          this.belowRowsNum = 1;
          break;

        default:
          break;
      }
      this.grossTotal = {
        quantityNum,
        totalDeclaredValue,
        boxCount,
        boxTotalWeight,
        totalProductNetWeight,
        boxVolume,
      };
      this.handleClearSelect();
      const mergeObj = JSON.parse(JSON.stringify(this.mergeObj));
      Object.keys(mergeObj).forEach((k) => {
        const i = tableData.findIndex((data) => data.mergeColumn == k);
        if (i > -1) {
          mergeObj[k].index = i;
        }
      });
      this.mergeObj = mergeObj;
      this.tableData = tableData;
      // 添加操作记录
      this.$emit("addRecord", {
        tableData: this.tableData,
        mergeObj: this.mergeObj,
      });
    },
    handleDeleteLine() {
      if (this.selectLine || this.selectLine === 0) {
        const { mergeColumn } = this.tableData[this.selectLine];
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
              const { mergeColumn } = this.tableData[i];
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
            if (item.mergeColumn) {
              if (!mergeObj[item.mergeColumn])
                mergeObj[item.mergeColumn] = { index, num: 0 };
              mergeObj[item.mergeColumn].num += 1;
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
          if (item.mergeColumn && !this.mergeObj[item.mergeColumn]) {
            item.mergeColumn = undefined;
          }
        });
        console.log(this.tableData);
        this.selectProp = "";
        this.selectList = [];
        this.oneSelect = null;
      }
      this.contextVisible = false;
      // 添加操作记录
      this.$emit("addRecord", {
        tableData: this.tableData,
        mergeObj: this.mergeObj,
      });
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
        if (item.mergeColumn) {
          const { index } = this.mergeObj[item.mergeColumn];
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
        this.handleChangeTotal(
          this.tableData[this.selectLine],
          this.selectLine
        );
      } else {
        let data = this.copyData;
        if (this.copyData.constructor === Object) {
          data = this.copyData[this.selectProp];
        }
        this.selectList.forEach((i) => {
          this.tableData[i][this.selectProp] = data;
          if (
            [
              "boxWeight",
              "boxLength",
              "boxWidth",
              "boxHeight",
              "boxCount",
              "productNetWeight",
              "quantityNum",
              "declaredValue",
              "productUnitPrice",
            ].includes(this.selectProp)
          ) {
            this.handleChange(data, this.selectProp, i, true);
          }
        });
      }
      this.handleClearSelect();
      // 添加操作记录
      this.$emit("addRecord", {
        tableData: this.tableData,
      });
    },
    addRows(num = 1) {
      const rows = [];
      let params = {};
      if (this.encasementWay != 0) {
        const {
          consigneeWarehouseId,
          consigneeWarehouseCode,
          warehouseAddress,
        } = this.tableData[0] || {};
        params = {
          consigneeWarehouseId,
          consigneeWarehouseCode,
          warehouseAddress,
        };
      }
      for (let i = 0; i < num; i++) {
        this.newId += 1;
        rows.push({
          // 新增字段初始化
          newId: `newId${this.newId}`,
          sku: undefined,
          shippingMark: undefined,
          declaredNameCn: undefined,
          declaredNameEn: undefined,
          customsCode: undefined,
          quantityNum: undefined,
          declaredValue: undefined,
          totalDeclaredValue: undefined,
          boxLength: undefined,
          boxWidth: undefined,
          boxHeight: undefined,
          boxCount: undefined,
          boxWeight: undefined,
          productNetWeight: undefined,
          boxTotalWeight: undefined,
          totalProductNetWeight: undefined,
          boxVolume: undefined,
          boxNumber: undefined,
          materialCn: undefined,
          materialEn: undefined,
          businessUseEn: undefined,
          img: undefined,
          brand: undefined,
          shipmentId: undefined,
          referenceId: undefined,
          consigneeWarehouseId: undefined,
          consigneeWarehouseCode: undefined,
          warehouseAddress: undefined,
          productUnitPrice: undefined,
          declaredValues: undefined,
          asin: undefined,
          productLink: undefined,
          priceImg: undefined,
          mergeColumn: undefined,
          ...params,
        });
      }
      return rows;
    },
    handleChange(val, prop, index, noAddRecord) {
      const row = this.tableData[index];
      const {
        boxLength = 0,
        boxWidth = 0,
        boxHeight = 0,
        boxCount = 0,
        boxWeight = 0,
        quantityNum,
        declaredValue,
        productNetWeight,
        productUnitPrice,
        boxTotalWeight = 0,
      } = row;
      switch (prop) {
        case "sku":
          if (val) {
            this.handleSelectSku(val, row, index);
          } else {
            row.parProductId = null;
            row.productId = null;
          }
          break;
        // case "boxWeight":
        //   row.boxTotalWeight = multiplicationFn([boxCount, boxWeight], 4);
        //   break;
        case "boxLength":
        case "boxWidth":
        case "boxHeight":
        case "boxCount":
        case "productNetWeight":
          if (prop !== "productNetWeight") {
            row.boxVolume = multiplicationFn(
              [(boxLength * boxWidth * boxHeight) / 1000000, boxCount],
              4
            );
          }
          if (["boxCount", "productNetWeight"].includes(prop)) {
            // row.boxTotalWeight = multiplicationFn([boxCount, boxWeight], 4);
            const totalProductNetWeight = multiplicationFn(
              [boxCount, productNetWeight],
              2
            ); // 总净重
            this.$set(row, "totalProductNetWeight", totalProductNetWeight);
          }
          if (["boxCount"].includes(prop)) {
            row.boxWeight =
              boxCount == 0 ? 0 : beDividedFn([boxTotalWeight, boxCount], 4);
          }
          break;
        case "quantityNum":
        case "declaredValue":
        case "productUnitPrice":
          row.totalDeclaredValue = multiplicationFn(
            [quantityNum, declaredValue],
            2
          ); // 申报总价
          if (Number(productUnitPrice || 0)) {
            row.declaredValues = `${multiplicationFn(
              [Number(declaredValue || 0) / Number(productUnitPrice || 0), 100],
              2
            )}%`; // 申报单价/网页售价*100%
          } else {
            row.declaredValues = "--";
          }
          break;
        case "boxTotalWeight":
          row.boxWeight =
            boxCount == 0 ? 0 : beDividedFn([boxTotalWeight, boxCount], 4);
          break;
        default:
          break;
      }
      if (
        [
          "sku",
          // "boxWeight",
          "boxLength",
          "boxWidth",
          "boxHeight",
          "boxCount",
          "productNetWeight",
          "quantityNum",
          "declaredValue",
          "totalDeclaredValue",
          "productUnitPrice",
          "boxTotalWeight",
        ].includes(prop)
      ) {
        this.handleChangeTotal(row, index);
      }
      if (!noAddRecord) {
        // 添加操作记录
        this.$emit("addRecord", {
          tableData: this.tableData,
        });
      }
    },
    handleChangeTotal(row, index) {
      const {
        quantityNum,
        totalDeclaredValue,
        boxCount,
        boxTotalWeight,
        totalProductNetWeight,
        boxVolume,
      } = this.grossTotal;
      quantityNum[index] = row.quantityNum;
      totalDeclaredValue[index] = row.totalDeclaredValue;
      if (!row.mergeColumn || this.mergeObj[row.mergeColumn].index == index) {
        boxCount[index] = row.boxCount;
        boxTotalWeight[index] = row.boxTotalWeight;
        totalProductNetWeight[index] = row.totalProductNetWeight;
        boxVolume[index] = row.boxVolume;
      }
      this.grossTotal = {
        quantityNum,
        totalDeclaredValue,
        boxCount,
        boxTotalWeight,
        totalProductNetWeight,
        boxVolume,
      };
    },
    handleSelectWarehouse(row, index) {
      if (this.encasementWay != 0 || this.newsData.outWarehouseWay == 50) {
        this.tableData.forEach((item) => {
          item.consigneeWarehouseId = row.id;
          item.consigneeWarehouseCode = row.code;
          item.warehouseAddress = row.address;
        });
      } else {
        this.tableData[index].consigneeWarehouseId = row.id;
        this.tableData[index].consigneeWarehouseCode = row.code;
        this.tableData[index].warehouseAddress = row.address;
      }
      this.$emit("addRecord", {
        tableData: [...this.tableData],
      });
    },
    handleSelectSku(val, row, rowIndex) {
      const { index } = this.mergeObj[row[this.identName]] || {};
      let boxCount = 0;
      if ((!index && index !== 0) || rowIndex === index) {
        boxCount = row.boxCount;
      } else {
        const list = this.tableData;
        boxCount = list[index].boxCount;
      }
      const {
        id: parProductId, // 产品子表id
        sku,
        shippingMark, // 唛头
        declaredNameCn, // 货物中文名称
        declaredNameEn, // 货物英文名称
        customsCode, // 海关编码
        cusProductId: productId,
        cusProduct: {
          declaredValue, // 申报单价
          singleBoxNetWeight: productNetWeight, // 每箱净重
          materialCn, // 产品材质(中文)
          materialEn, // 产品材质(英文)
          businessUseCn, // 用途(中文)
          businessUseEn, // 用途(英文)
          brand, // 品牌
          img, // 产品图片
          productUnitPrice, // 销售价
          asin, // ASIN
          productModel: boxNumber, // 产品型号
          productLink, // 对应清关店铺的平台销售链接
          priceImg, // 后台定价截图
        },
      } = val;
      const totalDeclaredValue = multiplicationFn(
        [row.quantityNum, declaredValue],
        2
      ); // 申报总价
      const totalProductNetWeight = multiplicationFn(
        [boxCount, productNetWeight],
        2
      ); // 总净重
      let declaredValues = "--"; // 申报单价/网页售价*100%
      if (Number(productUnitPrice || 0)) {
        declaredValues = `${multiplicationFn(
          [Number(declaredValue || 0) / Number(productUnitPrice || 0), 100],
          2
        )}%`; // 申报单价/网页售价*100%
      }
      const params = {
        sku,
        shippingMark, // 唛头
        declaredNameCn, // 货物中文名称
        declaredNameEn, // 货物英文名称
        customsCode, // 海关编码
        declaredValue, // 申报单价
        totalDeclaredValue, // 申报总价
        productNetWeight, // 每箱净重
        totalProductNetWeight, // 总净重
        boxNumber, // 型号
        materialCn, // 产品材质(中文)
        materialEn, // 产品材质(英文)
        businessUseEn:
          businessUseCn || businessUseEn
            ? `${businessUseCn}/${businessUseEn}`
            : "", // 用途
        brand, // 品牌
        img, // 产品图片
        productUnitPrice, // 销售价
        declaredValues, // 申报单价/网页售价*100%
        asin, // ASIN
        productLink, // 对应清关店铺的平台销售链接
        priceImg, // 后台定价截图
        parProductId,
        productId,
      };
      Object.keys(params).forEach((k) => {
        this.$set(row, k, params[k]);
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
