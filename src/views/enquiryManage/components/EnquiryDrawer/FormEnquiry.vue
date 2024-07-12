<template>
  <ComForm
    ref="formRef"
    :formConfig="{
      ...formConfig,
      ...config(formModel.shippingMode || 1, {
        isOverSea,
        isFcl,
        cabinetList,
      }),
      formModel,
    }"
    @handleChange="handleChange"
  >
    <template v-slot:country="slotProps">
      <span
        class="tag"
        v-if="slotProps.formModel.country || slotProps.formModel.countryCode"
        >{{
          slotProps.formModel.country.countryCode ||
          slotProps.formModel.countryCode
        }}</span
      >
    </template>
    <template v-slot:addCabinet>
      <i v-if="cabinetList.length < 10"
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
      }),
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
  },
  data() {
    return {
      isOverSea: this.formModel.overseasToDoor,
      isFcl: this.formModel.packingMode == 0 ? true : false,
      config,
      formConfig: {
        httpRequest: this.submitSave, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "113px",
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
      const { endPortId, overseasShippingMode, country } = formData;
      if (typeof endPortId !== "number") {
        formData.endPortId = formData.endPortId?.id;
        if (country) {
          formData.countryCode = country?.countryCode;
          formData.destinationCountryId = country?.countryId;
          delete formData.country;
        }
      } else {
        const {
          endPortId: currEndPortId,
          countryCode,
          destinationCountryId,
        } = this.formModel;
        formData.endPortId = currEndPortId;
        formData.countryCode = countryCode;
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
      if (!this.isOverSea) {
        formData.foreignQuotedPriceUserId &&
          delete formData.foreignQuotedPriceUserId;
        formData.deliveryAddress && delete formData.deliveryAddress;
        formData.overseasShippingMode && delete formData.overseasShippingMode;
      } else {
        overseasShippingMode &&
          (formData.overseasShippingMode = overseasShippingMode.join(","));
      }
      for (let key in formData) {
        // console.log(key);
        if (!formData[key] && formData[key] !== 0 && formData[key] !== false) {
          delete formData[key];
        }
      }
      return saveOrUpdateEnquiry({ ...formData, state: this.state });
    },
    handleSuccess() {
      this.$emit("handleSuccess");
    },
    handleChange(val, type) {
      if (type === "packingMode") {
        this.isFcl = val == 0;
        this.$nextTick(() => {
          this.$refs.formRef?.getFormModel();
        });
      }
      if (type === "endPortId") {
        console.log(val);
        this.$refs.formRef.setFormModel({
          country: val,
        });
      }
      if (type === "overseasToDoor") {
        this.isOverSea = val;
        this.$nextTick(() => {
          this.$refs.formRef?.getFormModel();
        });
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
					this.msgError(`第${errList.join(', ')}行柜型重复，请重新选择柜型`)
					return
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
  width: 492px;
  margin-left: -13px;
}
/deep/ {
  .el-col > .item-margin-left {
    margin-left: -15px;
  }
  .el-input-group__append {
    width: 58px;
    text-align: center;
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
