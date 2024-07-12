<template>
  <div class="app-container detail-container" v-if="formData.id">
    <ComDetailTop
      :title="`海外提派`"
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
              :pageType="2"
              :menuType="menuType"
              :onlyDirect="onlyDelivery"
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
          :pageType="2"
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
      :orderType="45"
      @handleSuccess="() => handleEditSuccess(currId)"
    />
  </div>
</template>
<script>
import { config, cardConfig,titConfig } from "./model";
import { getDeliveryClearanceInfo, getOrderDeliveryClearanceList } from "@/api/order/overSeaOther";
import { mixinDetailConf } from "../../components/mixinDetailConf.js";
import { getHeaderTotalBill } from "@/api/operateRecord/customsClearance";
export default {
	// name: "DetailDelivery",
  mixins: [mixinDetailConf],
  data() {
    const leftTopConfig=titConfig()
    return {
      leftTopConfig,
      cardConfig,
      formConfig: {
        isAttachFileId: true,
        size: "small",
        labelWidth: "107px",
        lists: [], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      formData: {},
      isInitRes: false,
      deliveryPlaceRefreshRequest: false,
      source: 2, //  1直清 2派送
      onlyDelivery: false,
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
    this.menuType = menuType||this.menuType;
  },
  methods: {
    getDetails(id, callBack) {
      if (id) {
        this.isInitRes = false;
        this.onlyDelivery = false;
        return getDeliveryClearanceInfo({ id }).then((res) => {
          const { warehouse, ...data } = res.data;
          data.deliveryPlaceType = this.typeConversion(data.deliveryPlaceType);
          data.freightType = this.typeConversion(data.freightType);
          data.isInsure = !!data.isInsure;
          if (data.overseaBusinessTypes.length > 1) {
            data.isWarehousing = true;
          } else {
            this.onlyDelivery = true;
          }
          if (warehouse) {
            Object.keys(warehouse).forEach((k) => {
              data[`warehouse_${k}`] = warehouse[k];
            });
          }
          this.formConfig.lists = config({
            freightType:data.freightType
          }).lists;
          this.formData = data;
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
          httpRequest: getOrderDeliveryClearanceList,
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
