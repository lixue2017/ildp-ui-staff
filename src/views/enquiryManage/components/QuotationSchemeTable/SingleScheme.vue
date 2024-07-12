<template>
  <div>
    <div class="quotation-scheme">
      <div class="index">
        <span v-if="!isShowCheck && !isShowRadio">{{ index + 1 }}</span>
        <el-checkbox v-if="isShowCheck" @change="handleSelect" />
        <el-radio-group
          v-model="webViewSource.radioId"
          v-if="isShowRadio"
          @change="handleSelectRadio"
        >
          <el-radio :label="quotationSchemeInfo.id">
            <span></span>
          </el-radio>
        </el-radio-group>
      </div>
      <ComForm
        ref="formRef"
        class="scheme-form"
        :formConfig="{
          ...schemeConfig,
          formModel: {
            ...schemeConfig.formModel,
            proxyType,
          },
          ...quotationSchemeConfig(
            singleEdit,
            isOverseasToDoor,
            formData.packingMode,
            proxyType
          ),
        }"
        @handleChange="handleChange"
        v-if="singleEdit"
      >
        <template v-slot:airShipCompany="slotProps">
          <AutoComplete
            ref="schemeRef"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              getSearchOptions: getStatus,
              handleCreate: _handleAddRouteInfo,
            }"
            @selectHandleChange="
              (val) => handleChange(val, slotProps.fieldItem.id)
            "
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
      </ComForm>
      <RouteInfo
        v-else
        :formData="schemeConfig.formModel"
        :isQuotation="isQuotation"
        :isOverseasToDoor="isOverseasToDoor"
        :sharePage="webViewSource && webViewSource.sharePage"
        :proxyType="proxyType"
      />
      <div class="operation-content-btn">
        <template v-for="(iBtn, i) in rowBtnList(singleEdit)">
          <el-button
            :key="`btn_${i}`"
            size="small"
            type="text"
            v-throttle
            class="operate-icon"
            @click="iBtn.handleClick(iBtn)"
            :style="{ color: iBtn.color }"
            >{{ iBtn.text }}</el-button
          >
        </template>
      </div>
      <span
        class="quotation-state tag-green-color"
        v-if="
          webViewSource.detailRadio && quotationSchemeInfo.schemeState === 1
        "
        >客户确认</span
      >
    </div>
    <!-- <ComForm
      ref="detailFormRef"
      class="scheme-detail-form"
      :formConfig="schemeDetailConfig"
      v-if="!isOverseasToDoor && schemeDetailConfig.formModel.id"
    /> -->
    <CostTable
      ref="costTableRef"
      :isEdit="singleEdit"
      :isFcl="isFcl"
      :webViewSource="webViewSource"
      :isOverseasToDoor="isOverseasToDoor"
      :columnData="quotationSchemeInfo.quotationSchemeDetailInfoVOList"
      :cabinetList="formData.cabinetList"
      :queryPage="queryPage"
    />
    <div class="grand-total" v-if="quotationSchemeInfo.totalCost">
      <span>合计：</span>
      <span>
        <span class="value">{{ quotationSchemeInfo.totalCost }}</span>
      </span>
    </div>
    <!-- <AddEditDialog ref="dialog" /> -->
  </div>
</template>

<script>
import { saveOrUpdateScheme, delQuotationScheme } from "@/api/enquiryManage";
import { msgBox, handleCopyText } from "@/utils/confirmBox.js";
import { quotationSchemeConfig, fromConfig } from "./model";
export default {
  props: {
    index: {
      type: Number,
      default: 1,
    },
    quotationSchemeInfo: {
      type: Object,
      default: () => {},
    },
    // 是否海外方案
    isOverseasToDoor: {
      type: Boolean,
      default: false,
    },
    // 方案是否编辑
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 分享方案按钮是否显示
    shareScheme: {
      type: Boolean,
      default: false,
    },
    // 操作按钮是否展示
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否整柜
    isFcl: {
      type: Boolean,
      default: false,
    },
    // 询价单 1：我的询价；2：头程订舱询价；3：海外询价
    queryPage: {
      type: Number,
      default: 1,
    },
    // 询价单复选框
    isShowCheck: {
      type: Boolean,
      default: false,
    },
    // 报价单单选框
    isShowRadio: {
      type: Boolean,
      default: false,
    },
    // 引用页面
    webViewSource: {
      type: Object,
      default: () => ({}),
    },
    formData: {
      type: Object,
      default: () => ({
        cabinetList: [],
      }),
    },
    // 是否报价
    isQuotation: {
      type: Boolean,
      default: false,
    },
    proxyIds: {
      type: String,
      default: "",
    },
  },
  components: {
    CostTable: () => import("./CostTable"),
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    AddEditDialog: () =>
      import(
        "@/views/marketManage/airlineFlight/components/AddEditDialog/index.vue"
      ),
    TooltipOver: () => import("_comp/TooltipOver"),
    RouteInfo: () => import("./RouteInfo"),
  },
  data() {
    const {
      startPricePeriodValidity,
      endPricePeriodValidity,
      airShipCompanyId,
      airShipCompanyName,
    } = this.quotationSchemeInfo;
    const proxyType =
      this.formData.packingMode == 1
        ? this.typeConversion(this.quotationSchemeInfo.proxyType || 0)
        : undefined;
    const pricePeriodValidity =
      startPricePeriodValidity && endPricePeriodValidity
        ? [startPricePeriodValidity, endPricePeriodValidity]
        : [];
    return {
      quotationSchemeConfig,
      proxyType,
      schemeConfig: {
        formModel: {
          ...this.quotationSchemeInfo,
          pricePeriodValidity,
          airShipCompany: airShipCompanyId
            ? {
                id: airShipCompanyId,
                label: airShipCompanyName,
              }
            : "",
        }, // 表单数据
        labelWidth: "95px",
      },
      schemeDetailConfig: {
        formModel: {
          ...this.quotationSchemeInfo,
          pricePeriodValidity,
        }, // 表单数据
        size: "small",
        labelWidth: "65px",
        ...fromConfig,
      },
      btnList: [
        {
          text: "添加费用",
          showState: [1],
          handleClick: this.handleAddCost,
        },
        {
          text: "复制",
          showState: [0],
          handleClick: this.handleCopy,
        },
        {
          text: "编辑",
          showState: [0],
          handleClick: () => this.handleUpdate(true),
        },
        {
          text: "保存",
          showState: [1],
          handleClick: this.handleSave,
        },
        {
          text: "删除",
          showState: [0, 1],
          color: "#FF6767",
          handleClick: this.handleDelete,
        },
        {
          text: "取消",
          showState: [1],
          color: "#8b8b8b",
          handleClick: this.handleCancel,
        },
      ],
      shareBtn: [
        // {
        //   text: "方案分享",
        //   handleClick: this.handleShare,
        // },
      ],
      currData: {},
      singleEdit: false,
    };
  },
  watch: {
    "quotationSchemeInfo.isEdit"(val) {},
    isEdit(val) {
      this.singleEdit = val;
    },
  },
  created() {
    this.singleEdit = this.isEdit;
  },
  methods: {
    rowBtnList(isEdit) {
      if (this.disabled) return [];
      if (this.shareScheme) return this.shareBtn;
      const state = isEdit ? 1 : 0;
      const nBtnArr = this.btnList.filter((btn) =>
        btn.showState.includes(state)
      );
      return nBtnArr;
    },
    handleShare() {
      handleCopyText(
        `${window.location.origin}/shareScheme?id=${this.quotationSchemeInfo.id}`,
        this,
        "已复制分享链接"
      );
    },
    handleAddCost() {
      this.$refs.costTableRef?.handleAdd();
    },
    handleUpdate(type) {
      if (type) {
        const {
          airShipCompanyId,
          airShipCompanyName,
          quotationSchemeDetailInfoVOList = [],
          ...data
        } = this.quotationSchemeInfo;
        this.schemeConfig.formModel.airShipCompany = airShipCompanyId
          ? {
              id: airShipCompanyId,
              label: airShipCompanyName,
            }
          : "";
        this.currData = {
          ...data,
          quotationSchemeDetailInfoVOList: JSON.parse(
            JSON.stringify(quotationSchemeDetailInfoVOList)
          ),
        };
      }
      this.singleEdit = type;
      setTimeout(() => {
        this.$refs.formRef?.getFormModel();
      });
    },
    handleChange(val, prop) {
      // console.log(val, prop);
      if (prop === "airShipCompany") {
        this.$refs.formRef?.setFormModel({
          airShipCompanyId: val?.value,
          airShipCompanyName: val?.label,
        });
      } else if (prop === "proxyType") {
        this.proxyType = val;
        this.$nextTick(() => {
          this.$refs.formRef?.renewForm();
        });
      }
    },
    handleSave() {
      // console.log(1111111, this.$refs.formRef.getFormParams());
      this.$refs.formRef.validateAll().then(() => {
        const {
          airShipCompanyId,
          airShipCompany,
          pricePeriodValidity,
          sailingSchedule,
          recommend,
          remark,
          cabinProxyId,
          sameIndustryProxyId,
          proxyType,
        } = this.$refs.formRef.getFormParams();
        const {
          id,
          quotationSheetId,
          airShipCompanyId: routeId,
          airShipCompanyName: shipCompanyName,
        } = this.quotationSchemeInfo;
        const type = this.isOverseasToDoor ? 2 : 1;
        const [startPricePeriodValidity, endPricePeriodValidity] =
          pricePeriodValidity || [];
        const params = {
          id,
          type,
          quotationSheetId,
          airShipCompanyId: airShipCompany
            ? airShipCompany.id
            : airShipCompanyId,
          startPricePeriodValidity,
          endPricePeriodValidity,
          sailingSchedule,
          recommend,
          remark,
          cabinProxyId,
          sameIndustryProxyId,
          proxyType,
        };
        if (proxyType == 1) {
          params.sameIndustryProxyId = sameIndustryProxyId;
          params.cabinProxyId = null;
        } else {
          params.sameIndustryProxyId = null;
          params.cabinProxyId = cabinProxyId;
        }
        const quotationSchemeDetailSaveParamList =
          this.$refs.costTableRef.handleSave();
        // console.log(quotationSchemeDetailSaveParamList);
        if (!quotationSchemeDetailSaveParamList) {
          return;
        }
        params.quotationSchemeDetailSaveParamList =
          quotationSchemeDetailSaveParamList;
        // console.log("params", params);
        saveOrUpdateScheme(params).then(() => {
          if (
            this.quotationSchemeInfo.addId ||
            this.webViewSource.isAddScheme
          ) {
            // 编辑调接口更新合计值
            this.$emit("handleRenew", this.index);
            if (!this.quotationSchemeInfo.addId) {
              this.handleUpdate(false);
            }
          } else {
            this.schemeConfig.formModel = {
              ...params,
              pricePeriodValidity,
              airShipCompanyName: airShipCompany
                ? airShipCompany.label
                : shipCompanyName,
            };
            this.handleUpdate(false);
          }
        });
      });
    },
    handleCopy() {
      console.log(this.quotationSchemeInfo);
      const { id, ...params } = this.quotationSchemeInfo;
      params.type = this.isOverseasToDoor ? 2 : 1;
      const quotationSchemeDetailSaveParamList =
        this.$refs.costTableRef.handleSave();
      if (!quotationSchemeDetailSaveParamList) {
        return;
      }
      params.quotationSchemeDetailSaveParamList =
        quotationSchemeDetailSaveParamList;
      this.$emit("handleCopy", JSON.parse(JSON.stringify(params)), this.index);
      // saveOrUpdateScheme(params).then((res) => {
      //   this.$emit("handleRenew", null, res.data);
      // });
    },
    getStatus(row) {
      // console.log(row);
      //获取关联航次的状态，后端需要这个值
      // const { id } = this.formConfig.formModel.airShipCompanyId;
      // if (id) {
      //   const obj = row.filter((e) => id === e.id)[0];
      //   this.formConfig.formModel = {
      //     ...this.formConfig.formModel,
      //     routeNoManageStatus: [obj.status],
      //   };
      // }
    },
    _handleAddRouteInfo() {
      //新增航次信息
      this.$refs.dialog?.show({}, true);
    },
    handleDelete() {
      if (this.quotationSchemeInfo.addId) {
        this.$emit("handleDelete");
      } else {
        const msg = "删除操作不可逆！";
        const title = "删除提示";
        const className = "el-icon-warning text-warning";
        msgBox(this, { title, className, msg }, () => {
          delQuotationScheme(this.quotationSchemeInfo.id).then(() => {
            this.$message.success("删除成功");
            this.$emit("handleDelete");
          });
        });
      }
    },
    handleCancel() {
      if (this.quotationSchemeInfo.addId && !this.id) {
        this.$emit("handleDelete");
      } else {
        this.singleEdit = false;
        this.$refs.formRef?.setFormModel(this.currData);
        this.$refs.detailFormRef?.setFormModel(this.currData);
        this.$refs.costTableRef?.$refs.tableRef?.setNewTableData([
          ...this.currData.quotationSchemeDetailInfoVOList,
        ]);
        this.currData = {};
      }
    },
    handleSelect(val) {
      // console.log(val);
      const { id } = this.quotationSchemeInfo;
      this.$emit("handleSelect", {
        id,
        bol: val,
      });
    },
    handleSelectRadio(val) {
      this.$emit("handleSelectRadio", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.quotation-scheme {
  display: flex;
  align-items: center;
  min-height: 95px;
  background: #f6f6f6;

  .index {
    width: 52px;
    text-align: center;
  }
  .scheme-form {
    flex: 1;
    padding-top: 15px;
    /deep/ {
      .el-form-item--small.el-form-item {
        margin-bottom: 15px;
      }
      .el-form-item__error {
        z-index: 1;
      }
      // .el-form-item.scheme-remark {
      //   margin-top: 15px;
      // }
    }
  }
  .operation-content-btn {
    width: 288px;
    justify-content: flex-end;
    padding-right: 30px;
    .operate-icon.el-button {
      margin-left: 30px;
    }
  }
  .quotation-state {
    margin-right: 10px;
  }
}
.scheme-detail-form {
  border-top: 1px solid #e2e2e2;
  padding: 7px 0 7px 52px;
  /deep/ {
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__label,
    .el-form-item__content {
      line-height: 26px;
    }
    .el-form-item--small .el-form-item__content {
      min-height: 26px;
    }
  }
}
.grand-total > span {
  &:nth-child(2) {
    padding-left: 10px;
  }
}
</style>
