<template>
  <ComDialog
    class="drawer-wrapper"
    ref="myDrawer"
    :customDialog="dialogConfig"
    :confirmClose="false"
    @onClose="hide"
  >
    <template v-if="dialogShow" v-slot:content>
      <ComForm
        ref="formRef"
        :formConfig="{
          ...formConfig,
          ...config(!packingMode, cabinetList, isSurcharge),
        }"
        @handleChange="handleChange"
      >
        <template v-slot:addCabinet>
          <i
            v-if="cabinetList.length < 10"
            class="el-icon-circle-plus primary-text-color"
            @click="handleAddCabinet()"
          ></i>
        </template>
        <template v-slot:removeCabinet="slotProps">
          <i
            class="el-icon-remove text-danger-color"
            @click="handleRemoveCabinet(slotProps.fieldItem.index)"
          ></i>
        </template>
        <template v-slot:freight="slotProps">
          <FreightTable
            ref="freightTableRef"
            :formData="formData"
            :changePriceType="slotProps.formModel.changePriceType"
            :quantity="slotProps.formModel.quantity"
          />
        </template>
        <template v-slot:surcharge="slotProps">
          <SurchargeTable
            ref="surchargeTableRef"
            :formData="formData"
            :changePriceType="slotProps.formModel.changePriceType"
          />
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { formConfig } from "./model";
import {
  saveFreightRateQuotation,
  getQuotationInfo,
} from "@/api/enquiryManage/index";
import {
  getEditQuotation,
  editQuotation,
} from "@/api/enquiryManage/customerQuotation";
import { handleCopyText } from "@/utils/confirmBox.js";
export default {
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    FreightTable: () => import("../FreightTable"),
    SurchargeTable: () => import("../SurchargeTable"),
  },
  data() {
    return {
      dialogConfig: {
        title: "设置对客户报价",
        width: "1150px",
        size: "small",
        footer: [
          {
            text: "保 存",
            type: "primary",
            handleClick: () => this.handleSubmit(),
          },
          {
            text: "保存并分享",
            type: "primary",
            handleClick: () => this.handleSubmit(1),
          },
          {
            text: "取 消",
            handleClick: this.hide,
          },
        ],
      },
      dialogShow: false,
      config: formConfig,
      formConfig: {
        httpRequest: this.handleSave, // 表单提交接口
        successFunction: this.handleSuccess,
        formModel: {
          changePriceType: 1,
        },
      },
      cabinetList: [{ newId: 1 }],
      packingMode: 0,
      isSurcharge: false,
      boxModel: {},
      additionalCharge: true,
      formData: {},
      isEditQuotation: false,
      newId: 1,
    };
  },
  methods: {
    show(params) {
      this.handleQuotation(params).then((data) => {
        const {
          changePriceType,
          customerId,
          customerName,
          packingMode,
          cabinetList,
          remark,
          freightRateSurchargeList,
        } = data;
        const isSurcharge =
          freightRateSurchargeList && freightRateSurchargeList.length;
        const cabinetParam = {};
        if (packingMode === 0 && cabinetList && cabinetList.length) {
          cabinetList.forEach((item) => {
            cabinetParam[`cabinetQuantity${item.id}`] = item.cabinetQuantity;
            cabinetParam[`cabinetId${item.id}`] = item.cabinetId;
            cabinetParam[`cabinetName${item.id}`] = item.cabinetName;
          });
          this.cabinetList = cabinetList;
        } else {
          this.cabinetList = [{ newId: 1 }];
        }
        this.formData = data;
        this.isSurcharge = isSurcharge;
        this.packingMode = packingMode;
        this.formConfig = {
          ...this.formConfig,
          ...this.config(!packingMode, this.cabinetList, isSurcharge),
          formModel: {
            changePriceType: changePriceType || 1,
            customerId,
            customerName,
            remark,
            ...cabinetParam,
          },
        };
        this.dialogShow = true;
        this.$refs.myDrawer.show();
      });
    },
    handleQuotation({ freightRateIds, quotationSheetId }) {
      return new Promise((resolve, reject) => {
        if (freightRateIds) {
          this.isEditQuotation = false;
          getQuotationInfo({
            freightRateIds,
          }).then((res) => {
            const {
              packingMode,
              boxModelName,
              freightRateInfoList,
              freightRateSurchargeList,
            } = res.data;
            const freightRateSettingList = [
              this.geFirstData(packingMode, boxModelName),
              ...this.handleTableData(freightRateInfoList, packingMode),
            ];
            const surchargeList =
              freightRateSurchargeList &&
              freightRateSurchargeList.map((item) => ({
                ...item,
                customerQuotation:
                  item.customerQuotation === false ? false : true,
              }));
            console.log(freightRateSettingList);
            resolve({
              ...res.data,
              freightRateSettingList,
              freightRateSurchargeList: surchargeList,
            });
          });
        } else {
          this.isEditQuotation = true;
          getEditQuotation({ quotationSheetId }).then((res) => {
            const { packingMode, boxModelName, domesticQuotationSheet } =
              res.data;
            const { bulkList, cabinetList, surchargeList } =
              domesticQuotationSheet || {};
            const freightRateInfoList = packingMode
              ? { quotationSchemeDetailInfoVOList: bulkList }
              : cabinetList;
            const freightRateSettingList =
              bulkList || cabinetList
                ? [
                    this.geFirstData(packingMode, boxModelName),
                    ...this.handleTableData(freightRateInfoList, packingMode),
                  ]
                : [];
            const freightRateSurchargeList =
              surchargeList &&
              surchargeList.map((item) => ({
                ...item,
                profit:
                  item.profit || item.profit === 0 ? item.profit : undefined,
              }));
            resolve({
              ...res.data,
              freightRateSettingList,
              freightRateSurchargeList,
            });
          });
        }
      });
    },
    geFirstData(packingMode, boxModelName) {
      const params = {};
      if (packingMode === 0) {
        boxModelName.forEach((key) => {
          params[key] = {
            profit: undefined,
          };
        });
      } else {
        params.priceTable = {
          profit: undefined,
        };
      }
      return params;
    },
    handleTableData(arr, packingMode) {
      const list = !arr ? [] : Array.isArray(arr) ? arr : [arr];
      return list.map((item) => {
        const {
          freightRateSettingList,
          quotationSchemeDetailInfoVOList,
          ...data
        } = item;
        const obj = {};
        (
          freightRateSettingList ||
          quotationSchemeDetailInfoVOList ||
          []
        ).forEach((setItem) => {
          const param = {
            quantity: undefined,
            freightRateId: data.freightRateId,
            ...setItem,
            profit: setItem.profit || undefined,
            customerQuotation:
              setItem.customerQuotation === false ? false : true,
          };
          if (packingMode) {
            obj.priceTable = {
              ...param,
              quantity: param.num,
              customerQuotation: true,
            };
          } else {
            obj[setItem.boxModelName || setItem.cabinetName] = param;
          }
        });
        return {
          ...(obj.priceTable || {}),
          ...data,
          ...obj,
        };
      });
    },
    hide() {
      this.dialogShow = false;
      this.$refs.myDrawer?.hide();
    },
    handleSubmit(share) {
      // console.log(this.$refs.freightTableRef);
      const freightList = this.$refs.freightTableRef?.getSaveList();
      const surchargeList = this.$refs.surchargeTableRef?.getSaveList();
      if (this.$refs.freightTableRef && !freightList) {
        return;
      }
      if (this.$refs.surchargeTableRef && !surchargeList) {
        return;
      }
      if (!freightList.length) {
        this.$message.error("请选择运费！");
        return;
      }
      this.detailList = [...freightList, ...surchargeList];
      this.share = share;
      if (this.formData.packingMode === 0) {
        // FCL柜型校验
        let nCabinetList = [];
        let errList = [];
        const sParam = this.$refs.formRef?.getFormParams();
        this.cabinetList.map((item, i) => {
          const sId = sParam[`cabinetId${item.newId}`];
          if (!nCabinetList.includes(sId)) {
            nCabinetList.push(sId);
          } else {
            errList.push(i + 1);
          }
        });
        if (nCabinetList.length !== this.cabinetList.length) {
          this.msgError(`第${errList.join(", ")}行柜型重复，请重新选择柜型`);
          return;
        }
      }
      this.$refs.formRef.submitForm();
    },
    handleSave(formData) {
      const {
        volume,
        weight,
        quantity,
        customerId,
        changePriceType,
        remark,
        ...data
      } = formData;
      const { packingMode } = this.formData;
      const params = {
        additionalCharge: this.additionalCharge,
        share: this.share ? 1 : 0,
        volume,
        weight,
        quantity,
        customerId,
        changePriceType,
        remark,
      };
      if (packingMode === 0) {
        params.cabinetList = this.cabinetList.map((item) => ({
          cabinetQuantity: data[`cabinetQuantity${item.newId}`],
          cabinetId: data[`cabinetId${item.newId}`],
        }));
      }
      if (!this.isEditQuotation) {
        params.detailList = this.detailList;
        return saveFreightRateQuotation(params);
      } else {
        const { domesticQuotationSheet } = this.formData;
        params.domesticQuotationSheet = {
          detailList: this.detailList,
          type: 1,
          id: domesticQuotationSheet.id,
        };
        return editQuotation(params);
      }
    },
    handleSuccess(res) {
      console.log(res);
      if (res.data && this.share) {
        this.handleShare(res.data);
      }
      this.$emit("handleSuccess");
      this.hide();
    },
    handleShare(id) {
      handleCopyText(
        `${window.location.origin}/shareQuotation?id=${id}&type=1`,
        this,
        "已复制分享链接"
      );
    },
    handleAddCabinet() {
      this.newId += 1;
      this.cabinetList.push({
        newId: this.newId,
      });
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.formRef?.renewForm();
        });
      });
    },
    handleRemoveCabinet(index) {
      this.cabinetList.splice(index, 1);
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.formRef?.renewForm();
        });
      });
    },
    handleChange(val, prop) {
      if (prop === "changePriceType") {
        this.formConfig.formModel.changePriceType = val;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .el-checkbox__input {
    margin-top: -1px;
  }
  .el-input-group__append {
    width: 45px;
    padding: 0;
    text-align: center;
  }
  .el-col {
    padding-right: 4px !important;
  }
  .el-button--mini.is-round {
    padding: 5px 12px;
  }
  .el-input-number {
    width: 100%;
  }
  .el-input-number--small .el-input-number__decrease,
  .el-input-number--small .el-input-number__increase {
    width: 23px;
  }
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 10px;
    padding-right: 30px;
  }
}
.el-icon-circle-plus,
.el-icon-remove {
  font-size: 16px;
  cursor: pointer;
}
.company-name {
  margin-right: 10px;
}
.profit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /deep/ {
    .el-input-number {
      width: 98px;
    }
    .el-input {
      width: 98px;
    }
  }
}
.profit-input {
  /deep/ .el-input__inner {
    padding-left: 12px;
    padding-right: 0;
  }
}
.additional-charge {
  margin-top: 17px;
  text-align: right;
}
</style>
