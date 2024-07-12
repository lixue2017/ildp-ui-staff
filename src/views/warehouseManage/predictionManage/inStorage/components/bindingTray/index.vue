<template>
  <ComDialog
    ref="myDialog"
    :customDialog="dialogConfig"
    :confirmClose="false"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <div class="content-padding-20">
        <ComForm
          :formConfig="formConfig"
          ref="myComForm"
          v-if="$refs.myDialog && $refs.myDialog.dialogVisible"
          @handleChange="handleChange"
        >
          <template v-slot:trayNumObj="slotProps">
            <AutoComplete
              :formModel="slotProps.formModel"
              :fieldItem="slotProps.fieldItem"
              :additionalParam="{
                customerId: slotProps.formModel.customerId,
                storageMode: slotProps.formModel.storageMode,
                warehouseId: slotProps.formModel.warehouseId,
              }"
            />
          </template>
        </ComForm>

        <div>
          <ComDialog
            ref="goodsDlgRef"
            :customDialog="dialogGoodsConf"
            :confirmClose="false"
            :dialogBoxCenter="true"
          >
            <template v-slot:content>
              <template
                v-if="$refs.goodsDlgRef && $refs.goodsDlgRef.dialogVisible"
              >
                <ComTable
                  :columnConfig="tableConfig.columnConfig"
                  :columnData="tableConfig.columnData"
                />
              </template>
            </template>
          </ComDialog>
        </div>
      </div>
    </template>
  </ComDialog>
</template>
<script>
import { config, tableTrayMovingColumns } from "./model";
import {
  takeDelivery,
  saveTakeDelivery,
  POSTEcStorageInfoNew,
  getTrayIdGoods,
} from "@/api/warehouse/prediction";
export default {
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    return {
      dialogConfig: {
        title: this.overseaLangObj.bd_tp || "绑定托盘",
        width: "600px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: this.overseaLangObj.qx_cancel() || "取消",
            plain: true,
            handleClick: () => {
              this.$refs.myDialog.hide();
            },
          },
          {
            text: this.overseaLangObj.qr_confirm() || "确认",
            type: "primary",
            handleClick: () => {
              const { isNew, trayNumObj } =
                this.$refs.myComForm?.getFormParams() || {};
              if (isNew == 0) {
                if (trayNumObj?.value) {
                  getTrayIdGoods(trayNumObj.value).then((tRes) => {
                    const { goodsList } = tRes.data || {};
                    if (goodsList?.length) {
                      this.tableConfig.columnData = goodsList;
                      this.$refs.goodsDlgRef.show();
                    } else {
                      this.$refs.myComForm.submitForm();
                    }
                  });
                } else {
                  this.msgError("请选择托盘");
                }
              } else {
                this.$refs.myComForm.submitForm();
              }
            },
          },
        ],
      },
      dialogGoodsConf: {
        title: "托盘上存在以下货物，请确认是否收货？",
        width: "600px",
        appendToBody: true,
        footer: [
          {
            text: this.overseaLangObj.qx_cancel() || "取消",
            plain: true,
            handleClick: () => {
              this.$refs.goodsDlgRef.hide();
            },
          },
          {
            text: this.overseaLangObj.qr_confirm() || "确认",
            type: "primary",
            handleClick: () => {
              this.$refs.goodsDlgRef.hide();
              this.$refs.myComForm.submitForm();
            },
          },
        ],
      },
      formConfig: {
        formModel: {
          isNew: 1,
        },
        httpRequest: this.submitData, // 表单提交接口
        successFunction: () => {
          this.$emit("handleSuccess");
          this.$message.success("收货成功！");
          this.$refs.myDialog.hide();
        }, // 表单提交成功回调
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "142px" : "90px",
        lists: config(1).lists,
        formRules: config().formRules, // 表单校验规则
      },
      tableConfig: {
        columnConfig: tableTrayMovingColumns(),
        columnData: [],
      },
      inStorageSource: 0,
      selectList: [],
      trayType: "", // 未知退仓绑定托盘需要
    };
  },
  methods: {
    show(showInfo, rowList) {
      // console.log("showInfo", showInfo);
      // console.log("rowList", rowList);
      const {
        bailorPeople,
        storageWay,
        inStorageSource,
        customerId,
        warehousingTime,
        predictEnterWarehouseTime,
        id,
        orderOperationNum,
        orderNum,
        trayType = "",
        warehouseId,
      } = showInfo;
      this.trayType = trayType;
      this.inStorageSource = inStorageSource;
      let { storageWay: storageMode } = rowList[0];
      // 托盘：0：SKU存仓，1：整箱存仓，2：大货中转
      // 列表：2：SKU存仓，0：整箱存仓，1：大货中转
      const modeObj = {
        0: 1,
        1: 2,
        2: 0,
      };
      storageMode = modeObj[storageMode];
      this.formConfig.formModel = {
        customerId,
        bailorPeople,
        storageWay,
        storageMode: storageWay == 2 ? "0" : String(storageMode),
        isNew: 1,
        warehouseId,
      };
      let commonParams = {
        customerId,
        customerName: "",
        enterWarehouseTime: warehousingTime || predictEnterWarehouseTime,
        orderId: id,
        orderNum: orderOperationNum || orderNum,
        bailorPeople,
        type: storageWay == 1 ? 1 : 0,
      };
      if (commonParams.enterWarehouseTime) {
        commonParams.enterWarehouseTime = new Date(
          commonParams.enterWarehouseTime
        ).getTime();
      }
      this.handleChange(1, "isNew");
      if (storageWay == 1) {
        //按箱
        if (this.inStorageSource == 2) {
          //电商
          this.selectList = rowList.map((item) => {
            return Object.assign(
              {},
              {
                ...item,
                // ...commonParams,
                // packingTrackingNum: item.packingTrackingNum, //箱号、包裹号
                // volume: item.volume,
                // weight: item.weight,
                // destination: item.destination,
                // freightId: item.freightId,
                // boxSkuCount: item.boxSkuNum, //单箱sku数
                // boxCount: item.forecastBoxNum, //预计箱数
                // takeBoxCount: item.takeFreightBoxNum, //已收箱数
                // takeAmountBox: item.takeAmountBox, //输入数量
                // // storageWay: item.storageType, //存仓方式
                // productId: item.productId,
                // destinationWarehouseId: item.destinationWarehouseId,
              }
            );
          });
        } else {
          //退仓入库
          this.selectList = rowList.map((item) => {
            let opt = {
              ...item,
              // ...commonParams,
              // packingTrackingNum: item.boxSerialNumber, //箱号、包裹号
              // volume: 0,
              // weight: 0,
              // destination: "",
              // freightId: item.id,
              // boxSkuCount: 0, //单箱sku数
              // boxCount: item.forecastNum, //预计箱数
              // takeBoxCount: item.takeNum, //已收箱数
              // inputBoxNum: item.takeAmountBox, //输入数量
            };
            if (this.inStorageSource == 1) {
              //  WMS入库单入库
              opt.boxCount = item.boxCount;
              opt.takeBoxCount = item.takeBoxCount;
              opt.boxSkuCount = item.forecastNum;
              opt.productId = item.productId;
            }
            return Object.assign({}, opt);
          });
        }
      } else {
        //按sku
        if (this.inStorageSource == 2) {
          //电商
          this.selectList = rowList.map((item) => {
            return Object.assign(
              {},
              {
                ...item,
                takeFreightSkuNum: item.takeFreightSkuNum || 0,
              }
            );
          });
        } else {
          this.selectList = rowList.map((item) => {
            let takeSkuStatisticsList = [];
            if (item.takeSkuStatistics) {
              // 电商
              takeSkuStatisticsList = item.takeSkuStatistics.map((eles) => {
                return Object.assign(
                  {},
                  {
                    boxNumber: eles.boxNumber,
                    boxSkuNum: eles.boxSkuNum, //单箱sku数
                    id: eles.id,
                    takeLpnNum: 0,
                    warehousingLpnNum: 0,
                    takeSkuNum: eles.takeSkuNum, //收到sku数
                    warehousingBoxNum: eles.warehousingBoxNum, //预计箱数
                    warehousingSkuNum: eles.warehousingSkuNum, //预报sku数
                    inputSkuNum: eles.takeAmount || 0, //输入数
                  }
                );
              });
            }
            if (item.freightBitFields) {
              //退仓入库
              takeSkuStatisticsList = item.freightBitFields.map((eles) => {
                return Object.assign(
                  {},
                  {
                    boxNumber: eles.trackingNum,
                    boxSkuNum: 0, //单箱sku数
                    id: eles.id,
                    takeLpnNum: 0,
                    warehousingLpnNum: 0,
                    takeSkuNum: eles.takeNum, //收到sku数
                    warehousingBoxNum: 0, //预计箱数
                    warehousingSkuNum: eles.forecastNum, //预报sku数
                    inputSkuNum: eles.takeAmount || 0, //输入数
                  }
                );
              });
            }
            return Object.assign(
              {},
              {
                ...commonParams,
                packingTrackingNum: "",
                sku: item.sku,
                volume: item.productVolume,
                weight: item.singleBoxWeight,
                takeSkuStatisticsList,
                productId: item.productId,
                isFirstTake: item.isFirstTake,
                length: item.takeSkuStatistics
                  ? item.productLength
                  : item.length,
                width: item.takeSkuStatistics ? item.productWidth : item.width,
                height: item.takeSkuStatistics ? item.productHigh : item.height,
              }
            );
          });
        }
      }
      // console.log("selectList", this.selectList);
      this.$refs.myDialog.show();
      // this.$nextTick(() => {
      //   setTimeout(() => {
      //     this.$refs.myDialog.show();
      //   });
      // });
    },
    /** WMS收货  未知退仓也可改为此方法 */
    showDlg(row = {}, { httpRequest, handleSuccess }) {
      this.formConfig = {
        ...this.formConfig,
        lists: config(1).lists,
        formModel: {
          ...row,
          isNew: 1,
        },
        httpRequest,
        successFunction: () => {
          this.$message.success("收货成功！");
          this.$refs.myDialog.hide();
          handleSuccess && handleSuccess();
        },
      };
      this.$refs.myDialog.show();
    },
    submitData(formModel) {
      console.log('formModel',formModel)
      const { trayNumObj, remark, storageMode, isNew,warehouseId } = formModel;
      if (this.trayType === "withdrawalTray") {
        // 未知退仓
        const unKnownOpt = {
          trayNumber: trayNumObj?.value,
          trayRemark: remark,
        };
        return new Promise((resolve) => {
          this.$emit("handleWithdrawal", unKnownOpt);
          resolve();
        });
      }else if(this.trayType=="eCommerce"){
        const params={
          items:this.selectList.map((e)=>{return{storageId:e.id,takeAmountNum:e.takeAmountSku||e.takeAmountBox}}),
          remark,
          storageMode,
          traySn:trayNumObj&&trayNumObj.trayNum,
          warehouseId
        }
        return new Promise((resolve,reject)=>{
          POSTEcStorageInfoNew(params).then(() => {
            this.$emit("handleSuccess");
            resolve();
          })
          .catch((error) => reject(error));
        })
      }
      // this.selectList.forEach((item) => {
      //   item.trayNumber = trayNumber || newTrayNumber;
      //   item.trayRemark = trayRemark;
      //   item.isTake = 1; // 1-已收货
      // });
      const params = {
        orderEcFreightListVos: this.selectList,
        tWarehouseTrayVo: {
          customerId: trayNumObj?.customerId,
          id: trayNumObj?.value,
          remark,
          storageMode,
          isNew,
        },
      };
      // console.log("params", params);
      return new Promise((resolve, reject) => {
        // takeDelivery(params, this.inStorageSource).then(() => {
        //   this.$emit("handleSuccess");
        //   resolve();
        // });
        saveTakeDelivery(params)
          .then(() => {
            this.$emit("handleSuccess");
            resolve();
          })
          .catch((error) => reject(error));
      });
    },
    handleChange(val, id) {
      if (id === "isNew") {
        this.formConfig.lists = config(val).lists;
        this.$refs.myComForm?.getFormModel();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .content-padding-20 {
  padding: 0 20px;
}
</style>
