<template>
  <div class="app-container detail-container" v-if="formData.id">
    <ComDetailTop
      :title="`海外清关`"
      :formModel="formData"
      :titConfig="leftTopConfig"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    >
    	<template v-slot:subTitle>
        <span class="sub-title">
          {{ formData.customerShortName ? `(${formData.customerShortName})` : "" }}
        </span>
      </template>
			<template v-slot:titContentSlot>
        <TitOrderPageJump
          v-if="isInitRes"
          :titSelectConf="overseaTitSelect()"
          @handleClick="handleTopClick"
        />
      </template>
    </ComDetailTop>
    <div class="content">
      <div class="order-left">
        <Card :config="cardConfig" :formData="formData" />
        <ComForm
          class="order-form"
          :formConfig="{ ...formConfig, formModel: formData }"
          ref="formRef"
          v-if="isInitRes"
        >
          <template v-slot:tableData>
            <TabTable
              ref="tabContentRef"
              :formData="formData"
              :active="tabActive"
              :pageType="1"
              :menuType="menuType"
              @handleChange="() => handleEditSuccess(currId)"
              @handleActive="handleActive"
              @changeCostRequest="changeCostRequest"
            />
          </template>
        </ComForm>
      </div>
      <div>
        <!-- 操作单与仓库详情显示侧边栏 -->
        <LogisticsSideBar
          ref="logisticsRef"
          :formData="formData"
          :menuType="menuType"
          :pageType="1"
          v-if="isInitRes && ![1, 11].includes(formData.overallStatus)"
        />
      </div>
    </div>
    <div class="order-footer" v-if="menuType === 'order'">
      <template v-for="(btn, index) in getOrderFooterBtn(menuType)">
        <el-button
          :type="btn.btnType || 'primary'"
          @click="() => btn.handleClick(btn)"
          :key="index"
          v-if="
            !btn.statusArr || btn.statusArr.includes(formData.overallStatus)
          "
        >
          {{ btn.text }}
        </el-button>
      </template>
    </div>
    <ConfirmDialog ref="confirmDlgRef" />
    <OrderReceive
      ref="orderReceiveRef"
      @handleSuccess="() => handleEditSuccess(currId)"
    />
    <RelatedQuotation
      ref="relatedQuotationRef"
      :orderType="50"
      @handleSuccess="() => handleEditSuccess(currId)"
    />
  </div>
</template>
<script>
import { config, cardConfig,titConfig } from "./model";
import { getDirectClearanceInfo, getOrderDirectClearanceList } from "@/api/order/overSeaOther";
import { mixinDetailConf } from "../../components/mixinDetailConf.js";
import { getHeaderTotalBill } from "@/api/operateRecord/customsClearance";
export default {
	// name: "DetailCustomsClearance",
  mixins: [mixinDetailConf],
  data() {
    const leftTopConfig=titConfig()
    return {
      leftTopConfig,
      cardConfig,
      formConfig: {
        isAttachFileId: true,
        size: "small",
        labelWidth: "95px",
        lists: config(2).lists, // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      formData: {},
      isInitRes: false,
      deliveryPlaceRefreshRequest: false,
      source: 1, //  1直清 2派送
      menuType: "order",
    };
  },
  components: {
    LogisticsSideBar: () => import("../../components/LogisticsSideBar"),
		TitOrderPageJump: () =>
      import("@/views/operateManage/components/TitPageJump/orderJump.vue"),
  },
  mounted() {
    const { menuType } = this.$route.query;
    this.menuType = menuType;
  },
  methods: {
    getDetails(id, callBack) {
      if (id) {
        this.isInitRes = false;
        getDirectClearanceInfo({ id }).then((res) => {
          const { delivery, warehouse, ...data } = res.data;
          data.transportMode = this.typeConversion(data.transportMode);
          data.freightType = this.typeConversion(data.freightType);
          if (warehouse) {
            Object.keys(warehouse).forEach((k) => {
              data[`warehouse_${k}`] = warehouse[k];
            });
          }
          if (delivery) {
            delivery.deliveryPlaceType = this.typeConversion(
              delivery.deliveryPlaceType
            );
            delivery.isInsure = delivery.isInsure ? true : false;
            Object.keys(delivery).forEach((k) => {
              data[`delivery_${k}`] = delivery[k];
            });
          }
          const [_, type] = data.overseaBusinessTypes;
          const obj = {
            2: "清关+派送",
            3: "清关+入仓",
          };
          data.overseaBusinessTypesName = obj[type] || "仅清关";
          this.formConfig.lists = config(
            type,
            data.overallStatus !== 3,
            this.menuType
          ).lists;
          this.formConfig.formModel = data;
          this.formData = {
            ...data,
          }; // 添加默认值
          this.changeCostRequest();
          this.isInitRes = true;
          callBack && callBack();
        });
      } else {
        this.reBack();
      }
    },
    changeCostRequest() {
      const { id, businessUnit, operationMain, settlementBusinessType } =
        this.formData;
      const opt = {
        orderId: id,
        billingMain: this.menuType === "order" ? operationMain : businessUnit,
        businessType: settlementBusinessType,
      };
      getHeaderTotalBill(opt).then((res) => {
        this.formData = {
          ...this.formData,
          ...res.data,
        };
      });
    },
		overseaTitSelect() {
      return {
        additionalParam: {},
        selectItem: {
          type: "autocomplete",
          searchParamName: "jobNo",
          httpRequest: getOrderDirectClearanceList,
          getCustomData: (item) => {
            return {
              key: item.id,
              value: item.id,
              label: item.jobNo,
            };
          },
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../components/detail.scss";
</style>
