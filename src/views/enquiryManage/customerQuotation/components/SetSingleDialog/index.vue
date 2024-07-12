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
        :formConfig="formConfig"
        @handleChange="handleChange"
      >
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
        <template v-slot:foreign="slotProps">
          <ForeignTable
            ref="foreignTableRef"
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
  setCustomerQuotation,
  getCustomerQuotation,
} from "@/api/enquiryManage/index";
import {
  getEditQuotation,
  editQuotation,
} from "@/api/enquiryManage/customerQuotation";
export default {
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    FreightTable: () => import("../FreightTable"),
    SurchargeTable: () => import("../SurchargeTable"),
    ForeignTable: () => import("../ForeignTable"),
  },
  data() {
    return {
      dialogConfig: {
        title: "设置对客户报价",
        width: "1150px",
        size: "small",
        footer: [
          {
            text: "确 定",
            type: "primary",
            handleClick: () => this.handleSubmit(0),
          },
          // {
          //   text: "保存并分享",
          //   type: "primary",
          //   handleClick: () => this.handleSubmit(1),
          // },
          {
            text: "取 消",
            handleClick: this.hide,
          },
        ],
      },
      dialogShow: false,
      formConfig: {
        httpRequest: this.handleSave, // 表单提交接口
        successFunction: this.handleSuccess,
        formModel: {
          changePriceType: 1,
        },
      },
      cabinetList: [{ newId: 1 }],
      packingMode: 0,
      boxModel: {},
      formData: {},
      isEditQuotation: false,
    };
  },
  methods: {
    show(params) {
      this.handleQuotation(params).then((data) => {
        const {
          freightRateSurchargeList,
          foreignQuotationSheetList,
          domesticQuotationSheet,
          changePriceType,
        } = data;
        const isSurcharge =
          freightRateSurchargeList && freightRateSurchargeList.length;
        const isOverseas =
          foreignQuotationSheetList && foreignQuotationSheetList.length;
        this.formData = data;
        this.formConfig = {
          ...this.formConfig,
          ...formConfig(isSurcharge, isOverseas, !!domesticQuotationSheet),
          formModel: {
            ...data,
            changePriceType: changePriceType || 1,
          },
        };
        this.dialogShow = true;
        this.$refs.myDrawer.show();
      });
    },
    // quotationSheetId：报价id，quotationSchemeIds：报价方案id集合，inquirySheetId：询价id
    handleQuotation(param) {
      return new Promise((resolve, reject) => {
        let reqHttp = getCustomerQuotation;
        this.isEditQuotation = false;
        // 有报价单id是调编辑接口
        if (param.quotationSheetId) {
          reqHttp = getEditQuotation;
          this.isEditQuotation = true;
        }
        reqHttp(param).then((res) => {
          const {
            packingMode,
            boxModelName,
            domesticQuotationSheet,
            foreignQuotationSheet,
          } = res.data;
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
              customerQuotation:
                item.customerQuotation === false ? false : true,
              profit:
                item.profit || item.profit === 0 ? item.profit : undefined,
            }));
          let foreignQuotationSheetList = [];
          if (foreignQuotationSheet && foreignQuotationSheet.surchargeList) {
            foreignQuotationSheetList =
              foreignQuotationSheet.surchargeList &&
              foreignQuotationSheet.surchargeList.map((item) => ({
                ...item,
                customerQuotation:
                  item.customerQuotation === false ? false : true,
                profit:
                  item.profit || item.profit === 0 ? item.profit : undefined,
              }));
          }
          resolve({
            ...res.data,
            freightRateSettingList,
            freightRateSurchargeList,
            foreignQuotationSheetList,
          });
        });
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
        const { quotationSchemeDetailInfoVOList, ...data } = item;
        const obj = {};
        (quotationSchemeDetailInfoVOList || []).forEach((setItem) => {
          const param = {
            quantity: undefined,
            ...setItem,
            profit:
              setItem.profit || setItem.profit === 0
                ? setItem.profit
                : undefined,
            customerQuotation: setItem.customerQuotation !== false,
          };
          if (packingMode) {
            obj.priceTable = {
              ...param,
              quantity: param.num,
              customerQuotation: true,
            };
          } else {
            obj[setItem.cabinetName] = param;
          }
          // obj.remark = setItem.remark;
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
      const freightList = this.$refs.freightTableRef?.getSaveList();
      const surchargeList = this.$refs.surchargeTableRef?.getSaveList();
      const foreignList = this.$refs.foreignTableRef?.getSaveList();
      if (this.$refs.freightTableRef && !freightList) {
        return;
      }
      if (this.$refs.surchargeTableRef && !surchargeList) {
        return;
      }
      if (this.$refs.foreignTableRef && !foreignList) {
        return;
      }
      // if (!freightList.length) {
      //   this.$message.error("请选择运费！");
      //   return;
      // }
      const { domesticQuotationSheet, foreignQuotationSheet } = this.formData;
      if (domesticQuotationSheet) {
        const detailList = [...(freightList || []), ...(surchargeList || [])];
        this.domesticQuotationSheet = {
          id: domesticQuotationSheet.id,
          type: domesticQuotationSheet.type,
          detailList: detailList.map((item) => ({
            amount: item.amount,
            cabinetId: item.cabinetId,
            costId: item.costId,
            currencyId: item.currencyId,
            id: item.id,
            num: item.quantity,
            profit: item.profit,
            quotationSchemeId: item.quotationSchemeId,
            remark: item.remark,
            unitPrice: item.unitPrice,
          })),
        };
      }
      if (foreignList && foreignList.length) {
        this.foreignQuotationSheet = {
          id: foreignQuotationSheet.id,
          type: foreignQuotationSheet.type,
          detailList: foreignList.map((item) => ({
            amount: item.amount,
            cabinetId: item.cabinetId,
            costId: item.costId,
            currencyId: item.currencyId,
            id: item.id,
            num: item.quantity,
            profit: item.profit,
            quotationSchemeId: item.quotationSchemeId,
            remark: item.remark,
            unitPrice: item.unitPrice,
          })),
        };
      }
      this.share = share;
      this.$refs.formRef.submitForm();
    },
    handleSave(formData) {
      const { changePriceType, remark } = formData;
      const {
        customerId,
        inquirySheetId,
        quantity,
        cabinetList,
        volume,
        weight,
      } = this.formData;
      const params = {
        volume,
        weight,
        quantity,
        customerId,
        inquirySheetId,
        changePriceType,
        cabinetList,
        remark,
        share: this.share,
        domesticQuotationSheet: this.domesticQuotationSheet,
        foreignQuotationSheet: this.foreignQuotationSheet,
      };
      return this.isEditQuotation
        ? editQuotation(params)
        : setCustomerQuotation(params);
    },
    handleSuccess(res) {
      console.log(res);
      this.$emit("handleSuccess");
      this.hide();
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
    width: 25px;
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
  .el-form-item--small.el-form-item {
    margin-bottom: 7px;
  }
  .form-class .form-title {
    margin: 6px 0 10px;
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
