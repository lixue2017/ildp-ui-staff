<template>
  <ComDialog
    class="order-dialog"
    ref="customDialog"
    :customDialog="customDialogConfig"
  >
    <template v-slot:content>
      <ComForm
        :formConfig="formConfig"
        ref="dialogForm"
        @error-request="requestError"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:printDataType="slotProps">
          <el-select
            v-model="slotProps.formModel.printDataType"
            size="mini"
            class="type-select"
            @change="handleCountList"
          >
            <template v-for="selectItem in typeOptions">
              <el-option
                :key="selectItem.value"
                :label="selectItem.label"
                :value="selectItem.value"
                v-if="
                  !selectItem.showInvoice ||
                  selectItem.showInvoice === detailData.isInvoice
                "
              />
            </template>
          </el-select>
        </template>
        <template v-slot:rowTitle>
          <div class="row-title">
            <span class="form-title">箱唛信息选择</span>
            <span class="subtitle">
              <i class="el-icon-warning-outline"></i>
              <span> 选择仅打印箱唛时可用 </span>
            </span>
          </div>
        </template>

        <template v-slot:boxNum>
          <div class="base-flex-between print-tab">
            <div class="box-title">
              <el-button
                :type="printType === 1 ? 'primary' : ''"
                size="small"
                plain
                @click="() => (printType = 1)"
                >全部打印</el-button
              >
              <el-button
                :type="printType === 2 ? 'primary' : ''"
                size="small"
                plain
                @click="() => (printType = 2)"
                >部分打印</el-button
              >
              <!-- <el-checkbox
                disabled
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >
                全选
              </el-checkbox> -->
            </div>
            <div class="total-num">
              总箱数：
              <div>{{ totalBoxCount }}</div>
            </div>
          </div>
          <template v-if="printType === 2">
            <div :key="i" class="batch-box" v-for="(count, i) in batchCounts">
              <div class="box-range">
                <div>
                  <span class="box-range-title">第{{ i + 1 }}批次</span>
                  <el-checkbox
                    :indeterminate="partialPrinting[i].isIndeterminate"
                    v-model="partialPrinting[i].checkAll"
                    @change="(val) => handleCheckAllChange(val, i)"
                    >全选</el-checkbox
                  >
                </div>
                <div>
                  <span>box_range：From</span>
                  <el-input-number
                    size="mini"
                    v-model="partialPrinting[i].boxRangeFrom"
                    :min="count.from + 1"
                    :max="count.to"
                    :controls="false"
                    v-input-number-limit="0"
                    @change="(val) => handleFromTo(val, i)"
                  ></el-input-number>
                  <span>to</span>
                  <el-input-number
                    size="mini"
                    v-model="partialPrinting[i].boxRangeTo"
                    :min="partialPrinting[i].boxRangeFrom"
                    :max="count.to"
                    :controls="false"
                    v-input-number-limit="0"
                    @change="(val) => handleFromTo(val, i)"
                  ></el-input-number>
                </div>
              </div>
              <el-checkbox-group
                v-model="partialPrinting[i].checkedNum"
                @change="(val) => handleCheckedCitiesChange(val, i)"
              >
                <el-checkbox
                  v-for="n in partialPrinting[i].boxNum"
                  :label="n"
                  :key="n"
                  >{{ n }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </template>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { warehousingConfig, onlyPrintConfig } from "./model";
import {
  getShippingMark,
  getShippingMarkFour,
  getDownShippingMark,
  getPrintWarehousing,
  getShippingMarkByOperation,
  getShippingMarkFourByOperation
} from "@/api/common";
import { getGoodsList, getFreightList } from "@/api/order/firstTransport.js";
import { comDownload } from "@/utils/download.js";
import { filesPreview } from "@/utils/index";
import { download } from "@/utils/download.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    source: {
      type: String,
      default: "",
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  data() {
    return {
      detailData: {},
      customDialogConfig: {
        title: "入库单",
        width: "614px",
        useFooter: "footer",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "下 载",
            type: "primary",
            handleClick: () => this.handleSubmit(1),
          },
          {
            text: "预 览",
            type: "primary",
            handleClick: () => this.handleSubmit(2),
          },
        ],
      },
      formConfig: {
        formModel: {
          type: 1,
          mtPrintType: "1",
        },
        httpRequest: this.getShippingMark, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "120px",
        lists: onlyPrintConfig.lists, // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      printDowType: null,
      loadMsg: null,
      partialPrinting: [],
      printType: 1,
      typeOptions: [
        {
          label: "仓库核实箱数",
          value: 2,
          showInvoice: 1,
        },
        {
          label: "客户预报箱数",
          value: 1,
        },
      ],
      totalBoxCount: 0,
      boxCountList: [],
      batchCounts: [],
      freightInfo: {},
      submitType: "",
    };
  },
  methods: {
    getGoodsList() {
      const { operationOrderId, freightType, orderType } = this.detailData;
      const params = {
        freightType,
        operationOrderId,
        orderType,
      };
      return new Promise((resolve, reject) => {
        getGoodsList(params).then((res) => {
          this.freightInfo.verFreightList = res.data;
          resolve(res);
        });
      });
    },
    getFreightList() {
      const { id: orderEcId, orderId, operationOrderId } = this.detailData;
      const params = {
        orderEcId: orderId || orderEcId,
        operationOrderId,
      };
      return new Promise((resolve, reject) => {
        getFreightList(params).then((res) => {
          this.freightInfo.freightList = res.rows;
          resolve(res);
        });
      });
    },
    handleCountList(printDataType) {
      const { freightList = [], verFreightList = [] } = this.freightInfo;
      const list = {
        1: freightList,
        2: verFreightList,
      }[printDataType];
      const boxCounts = [];
      const batchCounts = [];
      const partialPrinting = [];
      (list || []).forEach((item) => {
        let from = 0;
        let to = printDataType === 1 ? item.boxCount : item.warehousingQuantity;
        if (boxCounts.length) {
          from = boxCounts[boxCounts.length - 1].num;
          to = from + to;
        }
        batchCounts.push({
          from,
          to,
        });
        partialPrinting.push({
          checkAll: true,
          boxRangeFrom: from + 1,
          boxRangeTo: to,
          isIndeterminate: false,
          checkedNum: this.initBatchChecked(from, to),
          boxNum: this.initBatchChecked(from, to),
        });
        for (let i = from; i < to; i++) {
          boxCounts.push({
            num: i + 1,
            warehouseCode:
              printDataType === 1
                ? item.consigneeWarehouseCode
                : item.warehouseCode,
          });
        }
      });
      this.boxCountList = boxCounts;
      this.batchCounts = batchCounts;
      this.totalBoxCount = boxCounts.length;
      this.partialPrinting = partialPrinting;
    },
    show(row) {
      if (this.source === "inStorage") {
        const { id, orderId, operationOrderNum, countryName } = this.formData;
        this.detailData = {
          ...this.formData,
          id: orderId,
          operationOrderId: id,
          number: operationOrderNum,
          country: countryName,
        };
      } else {
        this.detailData = this.formData;
      }
      const { isInvoice, webPrintSource,operationOrderNum,isMainBill,number,orderType } = this.detailData;
      if (![0, 1].includes(isInvoice) && webPrintSource !== "order_bar_print")
        return;
      console.log(this.detailData);
      const reqList = [this.getFreightList()];
      if (isInvoice) {
        reqList.push(this.getGoodsList());
      }
      const printDataType = isInvoice ? 2 : 1;
      Promise.all(reqList).then(() => {
        const titleNum=(isMainBill==5)&&(orderType==2)?operationOrderNum:number
        this.customDialogConfig.title = `打印[${titleNum}]`;
        this.formConfig.formModel = {
          ...this.formConfig.formModel,
          isShowSku: true,
          isShowOrderSn: true,
          isSign: 3,
          printDataType,
        };
        this.handleCountList(printDataType);
        this.$refs.customDialog.show();
      });
    },
    initBatchChecked(from, to) {
      const boxNum = [];
      for (let i = from; i < to; i++) {
        boxNum.push(i + 1);
      }
      return boxNum;
    },
    hide() {
      this.checkedNum = [];
      this.isIndeterminate = false;
      this.$refs.customDialog.hide();
    },
    getShippingMark(formData) {
      const { isShowSku, isShowOrderSn, isSign, mtPrintType, printDataType } =
        formData;
      const { number, id, customerId, cusOrderNumber,operationOrderNum,isMainBill,orderType } = this.detailData;
      const pickNum = [];
      let warehouseCodes = [];
      if (this.printType === 2) {
        this.partialPrinting.forEach((item) => {
          pickNum.push(...item.checkedNum);
        });
        warehouseCodes = pickNum.map(
          (n) => this.boxCountList[n - 1].warehouseCode || null
        );
      } else {
        this.boxCountList.map((item) => {
          pickNum.push(item.num);
          warehouseCodes.push(item.warehouseCode);
        });
      }
      if (!pickNum.length) {
        this.$message.error("请选择箱数");
        return new Promise((resolve, reject) => {
          reject();
        });
      }
      this.printDowType = mtPrintType === "2" ? 3 : 2;
      const httpShippingMark=this.getHttpRequst({mtPrintType,isMainBill,orderType})
      // const httpShippingMark =
      //   mtPrintType === "2" ? getShippingMarkFour : getShippingMark;
      return httpShippingMark({
        number:(isMainBill==5)&&(orderType==2)?operationOrderNum:number,//isMainBill:5 子单
        id,
        customerId,
        total: this.totalBoxCount,
        pickNum,
        warehouseCodes,
        cusOrderNumber,
        mtPrintType,
        isShowSku,
        isShowOrderSn,
        isSign,
        printDataType,
      });
    },
    getHttpRequst(row={}){
      const {mtPrintType,isMainBill,orderType}=row
      if(isMainBill==5&&mtPrintType==1&&orderType==2){
        //电商子单且10*10
        return getShippingMarkByOperation
      }else if(isMainBill==5&&mtPrintType==2&&orderType==2){
        //电商子单&&A4
        return getShippingMarkFourByOperation
      }else if(mtPrintType==1){
        //10*10
        return getShippingMark
      }else if(mtPrintType==2){
        //A4
        return getShippingMarkFour
      }
    },
    getPrintWarehousing(formData) {
      // console.log(formData);
      // console.log(this.checkedNum);
      // console.log(this.detailData);
      const {
        number: inWarehouseNum,
        id,
        customerName: customer,
        customerId,
        putWarehouseTime: inWarehouseTime,
        // cusConsignee: { countryName: aimCountry },
        orderVolume: cbm,
        orderWeight: weight,
        warehouseId,
        productIds,
        remark,
        customerNo,
        country,
      } = this.detailData;
      this.printDowType = 1;
      return getPrintWarehousing({
        inWarehouseNum,
        id,
        customer,
        customerId,
        inWarehouseTime,
        appointmentTime: inWarehouseTime,
        aimCountry: country || countryName,
        sum: this.totalBoxCount,
        weight,
        cbm,
        warehouseId,
        productIds,
        remark,
        customerNo,
      });
    },
    handleSuccess(res) {
      let msg = "";
      if (res.data) {
        msg = res.data.msg;
      } else {
        msg = res.msg;
      }
      if (msg) {
        if (this.submitType === 1) {
          download(msg);
        } else {
          filesPreview(msg);
        }
      }
      this.requestError();
      this.hide();
      // if ([1, 3].includes(this.printDowType)) {
      //   if (this.submitType === 1) {
      //     comDownload(res);
      //   } else {
      //     filesPreview(res.msg);
      //   }
      //   this.requestError();
      //   this.hide();
      //   return;
      // }
      // getDownShippingMark({ fileName: res.msg })
      //   .then((dRes) => {
      //     if (dRes.msg) {
      //       if (this.submitType === 1) {
      //         comDownload(dRes);
      //       } else {
      //         filesPreview(dRes.msg);
      //       }
      //       this.requestError();
      //       this.hide();
      //     } else {
      //       setTimeout(
      //         () => {
      //           this.handleSuccess(res);
      //         },
      //         this.totalBoxCount.length > 100 ? 5000 : 3000
      //       );
      //     }
      //   })
      //   .catch(() => {
      //     this.requestError();
      //   });
    },
    requestError() {
      this.isRepeatPrint = false;
      this.loadMsg.close();
    },
    handleSubmit(submitType) {
      if (this.isRepeatPrint) {
        return;
      }
      this.submitType = submitType;
      this.isRepeatPrint = true;
      this.loadMsg = this.$message({
        message: "文件准备中，请稍等。。。",
        type: "warning",
        duration: 0,
      });
      this.$refs.dialogForm.submitForm();
    },
    handleFromTo(val, i) {
      console.log(val);
      const { boxRangeFrom, boxRangeTo } = this.partialPrinting[i];
      this.partialPrinting[i].checkAll = true;
      this.partialPrinting[i].isIndeterminate = false;
      this.partialPrinting[i].checkedNum = this.initBatchChecked(
        boxRangeFrom - 1,
        boxRangeTo
      );
      this.partialPrinting[i].boxNum = this.initBatchChecked(
        boxRangeFrom - 1,
        boxRangeTo
      );
    },
    handleCheckAllChange(val, i) {
      this.partialPrinting[i].checkedNum = val
        ? [...this.partialPrinting[i].boxNum]
        : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value, i) {
      let checkedCount = value.length;
      const { boxNum } = this.partialPrinting[i];
      this.partialPrinting[i].checkAll = checkedCount === boxNum.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < boxNum.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.order-dialog {
  /deep/ .el-dialog__body {
    padding: 20px;
    .form-class {
      .el-form-item {
        margin-bottom: 10px;
      }
      .border-bottom-solid {
        margin-bottom: 0;
        &::after {
          margin-bottom: 15px;
        }
      }
      .row-title {
        margin-bottom: 12px;
        .form-title {
          border-left: 0;
          padding-left: 0;
        }
      }
      .print-type .el-radio {
        &:not(:last-child) {
          margin-bottom: 5px;
        }
      }
    }
  }
}
.subtitle {
  i {
    font-size: 14px;
    color: #ff813d;
    margin: 0 2px 0 10px;
  }
  span {
    color: #bcbcbc;
    font-size: 12px;
    font-weight: 400;
  }
}
/deep/ {
  .print-data-type {
    .el-form-item {
      padding-bottom: 4px;
      border-bottom: 1px solid #e7e7e7;
      margin-top: -11px;
      margin-bottom: 10px;
    }
  }
}
.el-select.type-select {
  width: 110px;
  /deep/ {
    .el-input__inner {
      padding-left: 8px;
      padding-right: 25px;
    }
    .el-input__suffix {
      height: 28px;
    }
  }
}
.print-tab {
  margin-bottom: 20px;

  .box-title {
    span {
      font-size: 14px;
      font-weight: bold;
      margin-right: 10px;
      color: #515151;
    }
  }
  .total-num {
    display: flex;
    align-items: center;
    div {
      width: 80px;
      height: 28px;
      line-height: 28px;
      padding: 0px 15px;
      border: 1px solid #bcbcbc;
      border-radius: 4px;
      color: #515151;
      background: #f4f4f4;
      cursor: not-allowed;
    }
  }
}
.batch-box {
  .box-range {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 20px;
    background: rgb(236, 243, 255);

    & > div {
      display: flex;
      align-items: center;

      /deep/ {
        .el-input-number {
          width: 60px;
        }
      }
      .box-range-title {
        font-weight: bold;
        margin: 0px 20px 0 0;
        color: #515151;
      }
    }
    span {
      font-weight: 400;
      margin: 0 5px;
      color: #8b8b8b;
    }
    .el-input {
      width: 60px;
    }
  }
  /deep/ {
    .el-checkbox-group {
      padding: 3px 20px;
      margin-right: -8px;
    }
  }
}
.el-checkbox {
  margin-right: 8px;
  /deep/ .el-checkbox__label {
    white-space: nowrap;
    width: 22px;
  }
}
</style>
