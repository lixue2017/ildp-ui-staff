<template>
  <div class="app-container">
    <ComDetailTop
      ref="detailTopRef"
      :title="`编辑${shippingMode == 1 ? '海运' : '空运'}运价`"
      :config="{}"
    />
    <template v-if="showForm && showPage">
      <ComForm
        ref="formRef"
        :formConfig="{
          ...formConfig,
          ...formConfigModel(
            shippingMode,
            formData.packingMode,
            formData.proxyType,
            formData.routeNoManageId
          ),
        }"
        @handleChange="handleChange"
      >
        <template v-slot:startPortIds="slotProps">
          <AutoComplete
            ref="startPortRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              handle: (val) => handleChange(val, 'startPortIds'),
              disabledArr: slotProps.formModel.endPortIds,
            }"
            :additionalParam="{
              typeList: shippingMode == 1 ? '0,1,2' : '3,4',
            }"
          />
        </template>
        <template v-slot:endPortIds="slotProps">
          <AutoComplete
            ref="startPortRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              handle: (val) => handleChange(val, 'endPortIds'),
              disabledArr: slotProps.formModel.startPortIds,
            }"
            :additionalParam="{
              typeList: shippingMode == 1 ? '0,1,2' : '3,4',
            }"
          />
        </template>
        <template v-slot:routeNoManageId="slotProps">
          <!-- disabled: handleRoute(
                slotProps.formModel.startPortIds,
                slotProps.formModel.endPortIds
              ).disabled,
              placeholder: handleRoute(
                slotProps.formModel.startPortIds,
                slotProps.formModel.endPortIds
              ).placeholder, -->
          <AutoComplete
            ref="routeRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              refreshRequest: routeRefreshRequest,
              handle: (val) => handleChange(val, 'routeNoManageId'),
            }"
            :additionalParam="{
              startPortIds: slotProps.formModel.startPortIds,
              endPortIds: slotProps.formModel.endPortIds,
            }"
          />
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
        <template v-slot:sameIndustryProxyId="slotProps">
          <AutoComplete
            key="industry"
            ref="industryProxyRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
            }"
          />
        </template>
        <template v-slot:tableDataSet="slotProps">
          <FreightRateSetFcl
            ref="freightRateRef"
            :formData="slotProps.formModel"
            @handleModelList="handleFreightRateList"
            v-if="formData.packingMode == 0"
          />
          <FreightRateSetLcl
            ref="freightRateRef"
            :formData="{
              ...slotProps.formModel,
              minBillingValue: formData.minBillingValue,
            }"
            v-if="formData.packingMode == 1"
          />
        </template>
        <template v-slot:tableDataCost="slotProps">
          <SurchargeTable
            ref="surchargeTableRef"
            :formData="slotProps.formModel"
            :packingMode="Number(slotProps.formModel.packingMode || 0)"
          />
        </template>
      </ComForm>
    </template>

    <div class="order-footer">
      <template v-for="(btn, index) in footerBtn">
        <el-button
          :type="btn.type"
          @click="() => btn.handleClick(btn)"
          :key="index"
          :loading="isBtnLoading"
        >
          {{ btn.text }}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { formConfig } from "./model";
import {
  saveOrUpdateFreightRate,
  getFreightRateInfo,
  copyFreightRate,
} from "@/api/marketManage/freightRate";
import { msgBox } from "@/utils/confirmBox.js";
import { POSTOrderIsolateConfig } from "@/api/marketManage/airline";
export default {
  name: "EditFreightRate",
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComForm: () => import("_comp/ComForm"),
    FreightRateSetFcl: () => import("../components/FreightRateSet/setFCL"),
    FreightRateSetLcl: () => import("../components/FreightRateSet/setLCL"),
    SurchargeTable: () => import("../components/SurchargeTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    return {
      formData: {
        packingMode: "0",
        proxyType: "0",
        routeNoManageId: "",
        cabinProxyId: 187,
        cabinProxyCode: "深圳堡森市场部",
      },
      footerBtn: [
        {
          text: "保存并启用",
          state: 1,
          handleClick: this.handleSave,
        },
        {
          text: "保存草稿",
          state: 0,
          handleClick: this.handleSave,
        },
        {
          text: "取 消",
          handleClick: this.reBack,
        },
      ],
      formConfig: {
        formModel: {
          cabinProxyCode: "",
          routeName: "",
          shipCompanyName: "",
          transferPortCode: "",
        },
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.reBack, // 表单提交成功回调
        size: "small",
        labelWidth: "98px",
      },
      formConfigModel: formConfig,
      showForm: false,
      showPage: true,
      shippingMode: 1,
      routeRefreshRequest: false,
      proxyIds: "",
    };
  },
  created() {
    const { shippingMode = 1 } = this.$route.query;
    this.shippingMode = shippingMode;
    const packingMode = shippingMode == 1 ? "0" : "1";
    const proxyType = shippingMode == 1 ? "1" : "0";
    this.formConfig = {
      ...this.formConfig,
      formModel: {
        ...(packingMode == 0 && shippingMode == 1
          ? { cabinProxyId: 187, cabinProxyCode: "深圳堡森市场部" }
          : {}),
        packingMode,
        routeName: "",
        shipCompanyName: "",
        transferPortCode: "",
        proxyType,
      },
    };
    this.formData.packingMode = packingMode;
    this.formData.proxyType = proxyType;
    this.getInfo();
    this.searchDictionary();
    this.getOrderIsolateConfig();
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
    }),
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchDictionary() {
      this["dictionary/getDictionary"]("freightRate").then(() => {
        this.showForm = true;
      });
    },
    getInfo() {
      const { id, copyId } = this.$route.query;
      if (!id && !copyId) return;
      this.showPage = false;
      const req = id ? getFreightRateInfo : copyFreightRate;
      req(id || copyId).then((res) => {
        const {
          packingMode,
          startPortCode,
          endPortCode,
          startEffectiveTime,
          endEffectiveTime,
          proxyType,
          ...data
        } = res.data;
        const formData = {
          ...data,
          startPortCode: startPortCode.split("/"),
          endPortCode: endPortCode.split("/"),
          packingMode: this.typeConversion(packingMode),
          proxyType: this.typeConversion(proxyType || 0),
          effectiveTime:
            startEffectiveTime && endEffectiveTime
              ? [startEffectiveTime, endEffectiveTime]
              : [],
        };
        this.formData = formData;
        this.formConfig.formModel = formData;
        this.showPage = true;
      });
    },
    handleSave(btn) {
      this.state = btn.state;
      const packingMode = this.$refs.formRef.getFormModelVal("packingMode");
      const freightRateSettingList = this.$refs.freightRateRef.getTableList();
      const freightRateSurchargeList =
        this.$refs.surchargeTableRef.getTableList();
      if (!freightRateSurchargeList) {
        this.$message.error("附加费未保存！");
        return;
      }
      if (packingMode == 1) {
        return this.$refs.freightRateRef.getFormValidate().then(() => {
          if (freightRateSettingList) {
            this.$refs.formRef.submitForm();
          }
        });
      } else {
        if (!freightRateSettingList) {
          this.$message.error("运价设置未保存！");
          return;
        }
        this.$refs.formRef.submitForm();
      }
    },
    submitFormRequest(formData) {
      console.log(formData);
      // 1==海运；2=空运；
      const {
        effectiveTime,
        proxyType,
        sameIndustryProxyId,
        cabinProxyId,
        ...data
      } = formData;
      const [startEffectiveTime, endEffectiveTime] = effectiveTime;
      let params = {
        ...data,
        startEffectiveTime,
        endEffectiveTime,
        shippingMode: this.shippingMode,
        state: this.state,
      };
      const freightRateSettingList = this.$refs.freightRateRef.getTableList();
      const freightRateSurchargeList =
        this.$refs.surchargeTableRef.getTableList();
      if (formData.packingMode == 0) {
        params.freightRateSettingList = freightRateSettingList;
        params.sameIndustryProxyId = sameIndustryProxyId;
        params.cabinProxyId = cabinProxyId;
      } else {
        params = {
          ...params,
          ...freightRateSettingList,
          proxyType,
          ...(proxyType == 0
            ? { cabinProxyId, sameIndustryProxyId: null }
            : { sameIndustryProxyId, cabinProxyId: null }),
        };
      }
      if (formData.routeNoManageId && formData.routeNoManageId.id) {
        params.routeNoManageId = formData.routeNoManageId.id;
      }
      params.freightRateSurchargeList = freightRateSurchargeList;
      return saveOrUpdateFreightRate(params);
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleFreightRateList(list) {
      this.$refs.surchargeTableRef?.handleChangeList(list);
    },
    confirmBox(val) {
      if (
        (!this.$refs.freightRateRef ||
          !this.$refs.freightRateRef.columnData.length) &&
        (!this.$refs.surchargeTableRef ||
          !this.$refs.surchargeTableRef.columnData)
      ) {
        return;
      }
      const msg = "重新选择装箱方式，需重置运费设置，是否确认重置 ！";
      const title = "确认提示";
      const className = "el-icon-warning text-warning";
      msgBox(
        this,
        { title, className, msg },
        () => {
          this.formData.packingMode = val;
          this.formData.freightRateSettingList = [];
          this.formData.freightRateSurchargeList = [];
          this.formData.minBillingValue = undefined;
          this.formData.pricingType = 0;
          this.$refs.formRef.setFormModel({
            pricingType: 0,
            minBillingValue: undefined,
            freightRateSettingList: [],
            freightRateSurchargeList: [],
          });
          this.$nextTick(() => {
            this.$refs.formRef.renewForm();
          });
        },
        () => {
          this.$refs.formRef.setFormModel({
            packingMode: val == 0 ? "1" : "0",
          });
        }
      );
    },
    handleChange(val, prop) {
      console.log(val, prop);
      switch (prop) {
        case "packingMode":
          this.confirmBox(val);
          break;
        case "proxyType":
          this.formData.proxyType = val;
          this.$nextTick(() => {
            this.$refs.formRef.renewForm();
          });
          break;
        case "routeNoManageId":
          this.formData.routeNoManageId = val;
          if (val) {
            const {
              flightName,
              name: voyageNumber,
              cabinProxyId,
              cabinProxyName: cabinProxyCode,
              routeId,
              routeCode: routeName,
              transfer: transferPortId,
              transferName: transferPortCode,
              shipCompanyId,
              shipCompany: shipCompanyName,
              cabinOpenTime,
              sailOpenTime,
              voyage,
              cutGateTime,
              etaTime,
              sameIndustryProxyId,
              sameIndustryProxyName: sameIndustryProxyCode,
              proxyType,
            } = val;
            this.$refs.formRef.setFormModel({
              flightName,
              voyageNumber,
              cabinProxyId,
              cabinProxyCode,
              routeId,
              routeName,
              transferPortId,
              transferPortCode,
              shipCompanyId,
              shipCompanyName,
              cabinOpenTime,
              sailOpenTime,
              voyage,
              cutGateTime,
              etaTime,
              sameIndustryProxyId,
              sameIndustryProxyCode,
              proxyType,
            });
            this.formData.proxyType = proxyType;
          }
          this.$nextTick(() => {
            this.$refs.formRef.renewForm();
          });
          break;
        case "startPortIds":
        case "endPortIds":
          if (val) {
            this.routeRefreshRequest = !this.routeRefreshRequest;
            this.$refs.formRef.setFormModel({
              routeNoManageId: "",
              routeNoManageCode: "",
            });
            this.formData.routeNoManageId = "";
            this.$nextTick(() => {
              this.$refs.formRef.renewForm();
            });
          }
          break;

        default:
          break;
      }
    },
    handleRoute(start, end) {
      let disabled = false;
      let placeholder = "关联船名/航班名";
      if (!start || !start.length) {
        disabled = true;
        placeholder = "请先选择起运港！";
      } else if (!end || !end.length) {
        disabled = true;
        placeholder = "请先选择目的港！";
      }
      return {
        disabled,
        placeholder,
      };
    },
    getOrderIsolateConfig() {
      POSTOrderIsolateConfig().then((res) => {
        const { data } = res;
        this.proxyIds = data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  margin-bottom: 100px;
  /deep/ {
    .com-detail-top {
      margin: 0 0 15px;
      padding: 0;
    }
    .form-class .form-title {
      padding-left: 0;
      border-left: none;
    }
    .top {
      margin-top: -20px;
    }
    .table-data-cost {
      margin-bottom: 0px;
    }
    .form-class .el-input.is-disabled {
      .el-input__inner {
        padding: 0 15px;
        // &::placeholder,
        // &::-webkit-input-placeholder,
        // &::-moz-placeholder,
        // &::-ms-input-placeholder {
        //   color: #fa7a7a;
        // }
      }
    }
  }
}
</style>
