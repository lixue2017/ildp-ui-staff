<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="dialogConfig"
      :confirmClose="confirmClose"
      class="booking-dialog"
    >
      <template v-slot:content>
        <ComForm
          ref="formRef"
          :formConfig="{
            ...formConfig,
            ...formConfigModel(formData.voyageType, formData.packingMode),
          }"
          v-if="formData.id"
        >
          <template v-slot:orderId="slotProps">
            <div class="order-temp">
              <AutoComplete
                ref="tempRef"
                :formModel="slotProps.formModel"
                :fieldItem="{
                  ...slotProps.fieldItem,
                  handle: (val) => handleChange(val, 'orderId'),
                }"
                :additionalParam="{
                  isBookingSpace: 0,
                  pageLocation: formData.packingMode ? 2 : 1,
                  typeOfShipping: formData.shippingMode === 1 ? 0 : 3,
                  startPortIds:
                    formData.startPortIds && formData.startPortIds.join(','),
                  endPortIds:
                    formData.endPortIds && formData.endPortIds.join(','),
                  bookingSpaceProxy: formData.cabinProxyId,
                  sameIndustryProxyId: formData.sameIndustryProxyId,
                }"
              />
              <el-tag
                class="tag-blue-color"
                v-if="slotProps.formModel.orderTypeName"
              >
                {{ slotProps.formModel.orderTypeName }}
              </el-tag>
              <el-tag
                class="tag-green-color"
                v-if="slotProps.formModel.typeOfShipping"
              >
                {{ slotProps.formModel.typeOfShipping }}
              </el-tag>
            </div>
          </template>
          <template v-slot:cabinProxyId="slotProps">
            <AutoComplete
              key="proxy"
              ref="proxyRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
              }"
              :additionalParam="{ ids: proxyIds }"
            />
          </template>
          <template v-slot:formData>
            <TopForm :formData="formData" :isBooking="true" />
          </template>
          <template v-slot:tableData>
            <EstimatedCost
              ref="estimatedCostRef"
              :packingMode="formData.packingMode"
              :formData="estimatedData"
            />
          </template>
        </ComForm>
      </template>
    </ComDialog>
  </div>
</template>

<script>
import {
  getFreightRateInfo,
  freightRateBooking,
} from "@/api/marketManage/freightRate";
import { formConfig } from "./model";
export default {
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    proxyIds: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      confirmClose: false,
      dialogConfig: {
        title: "海运订舱",
        width: "950px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取 消",
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "确 定",
            type: "primary",
            handleClick: () => {
              this.$refs.formRef.submitForm();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "113px",
      },
      formConfigModel: formConfig,
      formData: {},
      estimatedData: {},
    };
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    TopForm: () => import("../TopForm"),
    EstimatedCost: () => import("../EstimatedCost"),
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  methods: {
    show(row) {
      this.formData = {};
      getFreightRateInfo(row.id).then((res) => {
        res.data.typeOfShipping = "";
        res.data.sameIndustryProxy = "";
        res.data.orderTypeName = "";
        res.data.voyageType = res.data.routeNoManageId ? "0" : "1";
        this.formData = res.data;
        this.estimatedData.freightRateId = row.id;
        this.estimatedData.pricingType = res.data.pricingType;
        this.formConfig.formModel = res.data;
        this.$refs.customDialog.show();
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleChange(val) {
      console.log(val);
      const {
        orderId,
        orderType,
        bookingSpaceProxy,
        sameIndustryProxy,
        typeOfShipping,
        bookingSpaceProxyId: cabinProxyId,
        sameIndustryProxyId,
      } = val || {};
      this.estimatedData.orderId = orderId;
      this.estimatedData.orderType = orderType;
      this.$refs.formRef.setFormModel({
        bookingSpaceProxy,
        sameIndustryProxy,
        orderTypeName: ["平台", "FBA", "电商", "传统", "传统", "其他", "其他"][
          orderType
        ],
        typeOfShipping,
        cabinProxyId,
        ...(this.formData.packingMode == 1 ? { sameIndustryProxyId } : {}),
      });
      this.$nextTick(() => {
        this.$refs.estimatedCostRef.renewList();
      });
    },
    submitFormRequest(formData) {
      const {
        orderId: { orderId, id: operationOrderId },
        cabinOpenTime,
        cabinProxyId,
        cutGateTime,
        flightName,
        routeId,
        sameIndustryProxyId,
        voyageNumber,
        remark,
      } = formData;
      const { id: freightRateId } = this.formData;
      return freightRateBooking({
        freightRateId,
        orderId,
        operationOrderId,
        remark,
        cabinOpenTime,
        cabinProxyId,
        cutGateTime,
        flightName,
        routeId,
        sameIndustryProxyId,
        voyageNumber,
      });
    },
    handleSuccess() {
      this.$message.success("订舱成功");
      this.$emit("handleSuccess");
      this.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
.order-temp {
  display: flex;
  align-items: center;

  .el-tag {
    margin-left: 5px;
  }
}
</style>
