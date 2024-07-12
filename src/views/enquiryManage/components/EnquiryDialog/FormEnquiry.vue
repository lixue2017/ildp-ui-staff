<template>
  <div>
    <ComForm
      class="enquiry-form"
      ref="formRef"
      :formConfig="{
        ...formConfig,
        ...config({
          type,
          isFcl,
          cabinetList,
          shippingMode: formModel.shippingMode || 1,
          tradeType: formModel.tradeType || 1,
        }),
        formModel,
      }"
      @handleChange="handleChange"
    >
      <template v-slot:country="slotProps">
        <span
          class="tag"
          v-if="
            slotProps.formModel.country ||
            slotProps.formModel.destinationCountryName
          "
          >{{
            slotProps.formModel.country.countryCode ||
            slotProps.formModel.destinationCountryName
          }}</span
        >
      </template>
      <template v-slot:pickupAddressId="slotProps">
        <AutoComplete
          ref="tempRef"
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            handle: (val) => handleChange(val, 'pickupAddressId'),
            /*disabled: !slotProps.formModel.customerId,
            placeholder: slotProps.formModel.customerId
              ? '请选择提货地址'
              : '请先选择委托客户',*/
            refreshRequest: pickupRefreshRequest,
            handleCreate: handleCreate,
          }"
          :additionalParam="{
            customerId: slotProps.formModel.customerId,
            shippingMode: slotProps.formModel.shippingMode,
          }"
        />
      </template>
      <template v-slot:addCabinet>
        <i
          v-if="cabinetList.length < 10"
          class="el-icon-circle-plus primary-text-color"
          @click="handleAddCabinet()"
        />
      </template>
      <template v-slot:removeCabinet="slotProps">
        <i
          class="el-icon-remove text-danger-color"
          @click="handleRemoveCabinet(slotProps.fieldItem.index)"
        ></i>
      </template>
    </ComForm>

    <AddWarehouseDialog
      appendToBody
      ref="addWarehouse"
      @handleSuccess="handleAddSuccess"
    />
  </div>
</template>

<script>
import { saveOrUpdateEnquiry } from "@/api/enquiryManage";
import { config } from "./model";
export default {
  props: {
    formModel: {
      type: Object,
      default: () => ({
        shippingMode: 1, // 1=海运；2=空运；
        tradeType: 2, // 1=进口；2=出口；
        type: "1", // 1=国内;2=海外;3=国内+海外;
      }),
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    AddWarehouseDialog: () => import("_comp/PrivateWarehouseDialog/AddDialog"),
  },
  data() {
    return {
      isOverSea: this.formModel.overseasToDoor,
      isFcl: this.formModel.packingMode == 0 ? true : false,
      type: this.formModel.type || "1",
      config,
      formConfig: {
        httpRequest: this.submitSave, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "130px",
        uploadFormConfig: {
          type: "picture-card",
          className: "card-uploader",
          limit: 5,
          accept: ".jpg,.png",
        },
        isAttachFileId: true,
      },
      state: 0,
      cabinetList: [],
      newId: 0,
      pickupRefreshRequest: false,
      customerId: "",
    };
  },
  created() {
    this.newId += 1;
    this.cabinetList = this.formModel.cabinetList || [
      {
        newId: this.newId,
        cabinetQuantity: undefined,
        cabinetId: "",
      },
    ];
    if (!this.cabinetList || !this.cabinetList.length) {
      this.newId += 1;
      this.cabinetList.push({
        newId: this.newId,
      });
    }
    (this.formModel.cabinetList || []).forEach((item) => {
      this.formModel[`cabinetQuantity${item.id}`] = item.cabinetQuantity;
      this.formModel[`cabinetId${item.id}`] = item.cabinetId;
      // this.formModel[`cabinetName${item.id}`] = item.cabinetName;
    });
  },
  methods: {
    submitSave(formData) {
      const { overseasShippingMode, country, tradeType } = formData;
      if (country) {
        formData.destinationCountryName = country?.countryCode;
        formData.destinationCountryId = country?.countryId;
        delete formData.country;
      } else {
        const { destinationCountryName, destinationCountryId } = this.formModel;
        formData.destinationCountryName = destinationCountryName;
        formData.destinationCountryId = destinationCountryId;
      }
      if (this.isFcl) {
        const cabinetList = [];
        this.cabinetList.map((item) => {
          cabinetList.push({
            id: item.id,
            cabinetQuantity:
              formData[`cabinetQuantity${item.id || item.newId}`],
            cabinetId: formData[`cabinetId${item.id || item.newId}`],
          });
          formData[`cabinetQuantity${item.id || item.newId}`] &&
            delete formData[`cabinetQuantity${item.id || item.newId}`];
          formData[`cabinetId${item.id || item.newId}`] &&
            delete formData[`cabinetId${item.id || item.newId}`];
        });
        formData.cabinetList = cabinetList;
      } else {
        formData.cabinetList = [];
      }
      if (this.type == 1) {
        formData.foreignQuotedPriceUserId &&
          delete formData.foreignQuotedPriceUserId;
        formData.deliveryAddress && delete formData.deliveryAddress;
        formData.overseasShippingMode && delete formData.overseasShippingMode;
      } else {
        if (this.type == 2) {
          formData.domesticQuotedPriceUserId &&
            delete formData.domesticQuotedPriceUserId;
          formData.endPortId && delete formData.endPortId;
          if (tradeType == 1) {
            formData.deliveryAddress && delete formData.deliveryAddress;
          } else if (tradeType == 2) {
            formData.startPortId && delete formData.startPortId;
          }
        }
        overseasShippingMode &&
          (formData.overseasShippingMode = overseasShippingMode.join(","));
      }
      for (let key in formData) {
        // console.log(key);
        if (
          !formData[key] &&
          formData[key] !== 0 &&
          formData[key] !== false &&
          formData[key] !== null
        ) {
          delete formData[key];
        }
      }
      return saveOrUpdateEnquiry({ ...formData, state: this.state });
    },
    handleSuccess() {
      this.$emit("handleSuccess");
    },
    handleChange(val, type) {
      switch (type) {
        case "packingMode":
          this.isFcl = val == 0;
          this.$nextTick(() => {
            this.$refs.formRef?.getFormModel();
          });
          break;
        case "endPortId":
          this.$refs.formRef.setFormModel({
            country: val,
          });
          break;
        case "startPortId":
          if (this.type == 2 && this.formModel.tradeType == 1) {
            this.$refs.formRef.setFormModel({
              country: val,
            });
          }
          break;
        case "type":
          this.type = val;
          this.$nextTick(() => {
            this.$refs.formRef?.getFormModel();
          });
          break;
        case "customerId":
          if (val) {
            this.pickupRefreshRequest = !this.pickupRefreshRequest;
          }
          this.$refs.formRef.setFormModel({
            pickupAddressId: "",
            pickupAddressType: "",
            pickupAddressName: "",
          });
          break;
        case "pickupAddressId":
          const params = {};
          if (this.type == 2 && this.formModel.tradeType == 2) {
            params.country = {
              countryId: val?.countryId,
              countryCode: val?.countryName,
            };
          }
          this.$refs.formRef.setFormModel({
            pickupAddressType: val?.type,
            ...params,
          });
          break;
        default:
          break;
      }
    },
    // state 0=草稿；1=已提交；2=报价中；3=已完结
    handleSave(state) {
      this.state = state;
      if (this.isFcl && this.cabinetList?.length > 1) {
        let nCabinetList = [];
        let errList = [];
        const sParam = this.$refs.formRef?.getFormParams();
        this.cabinetList.map((item, i) => {
          const sId = sParam[`cabinetId${item.id || item.newId}`];
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
    // 新增提货地址弹框显示
    handleCreate() {
      const { customerId } = this.$refs.formRef?.getFormParams() || {};
      this.$nextTick(() => {
        this.$refs.addWarehouse.show({
          customerId,
        });
      });
    },
    // 新增提货地址成功
    handleAddSuccess() {
      this.pickupRefreshRequest = !this.pickupRefreshRequest;
    },
  },
};
</script>

<style lang="scss">
.enquiry-upload-file {
  .accessory {
    .accessory-title {
      font-size: 13px;
      color: #8b8b8b;
      font-weight: 400;
      margin-top: 0px;
    }
  }
  .el-upload--picture-card {
    width: 65px;
    height: 65px;
    line-height: 73px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 65px;
    height: 65px;
  }
  .paste-content,
  .card-uploader {
    margin-left: 65px;
  }
  .paste-content .el-input {
    width: 251px !important;
  }
}
</style>

<style lang="scss" scoped>
.form-class {
  margin-left: -13px;
}
.enquiry-form {
  /deep/ {
    .form-title {
      padding-left: 14px;
      border: none;
    }
    .el-col > .item-margin-left {
      margin-left: -15px;
    }
    .el-input-group__append {
      width: 58px;
      text-align: center;
    }
    .form-column-list .input-unit-number {
      .el-input-number {
        margin-right: 0;

        .el-input__inner {
          border-radius: 4px 0px 0px 4px;
        }
      }
      & > span {
        text-align: center !important;
        background: rgba(188, 188, 188, 0.2);
        border-radius: 0px 4px 4px 0px;
        border: 1px solid #bcbcbc;
        height: 32px;
        border-left: none;
      }
    }
    .el-input.is-disabled {
      .el-input__inner {
        &::placeholder {
          color: #fa7a7a;
        }
      }
    }
  }
}

.tag {
  display: inline-block;
  height: 21px;
  line-height: 21px;
  padding: 0 13px;
  margin-left: -15px;
  text-align: center;
  background: rgba(53, 208, 111, 0.1);
  border-radius: 12px;
  color: #35d06f;
}
.el-icon-circle-plus,
.el-icon-remove {
  font-size: 16px;
  cursor: pointer;
}
</style>
