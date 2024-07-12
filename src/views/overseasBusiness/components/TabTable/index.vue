<template>
  <div>
    <!-- 海外清关，海外提派，海外入仓详情引用，pageType均为1 -->
    <div class="tabs">
      <el-button
        size="small"
        plain
        v-for="item in getTabsConfig()"
        :key="item.key"
        class="tabs-change"
        :type="item.key == active ? 'activation' : ''"
        @click="changeTabs(item.key)"
      >
        {{ item.label }}
      </el-button>
    </div>
    <template v-if="active == 11">
      <OverseaGoodsTable
        v-if="['t_11'].includes(formData.pageTabSource)"
        :goodsObj="{
          id: formData.id,
          viewHwSource: '2', // 海外清关货物
        }"
      />
      <GoodInfo
        v-else
        ref="goodRef"
        :formData="formData"
        :pageType="pageType"
      />
      <ExamineInfo ref="examineRef" :formData="formData" />
    </template>
    <template v-if="active == 21">
      <BasicInfo ref="basicRef" :formData="formData" :pageType="pageType" />
    </template>
    <template v-if="active == 10">
      <boxStorageInfo :formData="formData" :menuType="'overSeas'" />
    </template>
    <template v-if="active == 20">
      <skuStorageInfo :formData="formData" :menuType="'overSeas'" />
    </template>
    <template v-if="active == 30">
      <CostInfo
        ref="chargeTableRef"
        :formModel="{
          ...formData,
          customerId: formData.bailorPeopleId,
          customerName: formData.bailorPeopleName,
          billingMain: formData.businessUnit,
          orderType: formData.settlementBusinessType,
          businessType: formData.settlementBusinessType,
          operationMain: formData.businessUnit,
        }"
        :needCheckAccount="needCheckAccount"
        :businessType="formData.settlementBusinessType"
        @changeBillEvent="changeCostRequest"
      />
      <!-- @handleSaveSuccess="handleChange" -->
    </template>
    <template v-if="active == 40">
      <template v-if="['t_11'].includes(formData.pageTabSource)">
        <slot name="slotFileTab" />
      </template>
      <UploadFile
        v-else
        :fileData="{
          ...formData,
          type: pageType,
          attachId: attIds,
        }"
        @attachIdList="uploadAttach"
        @seeUploadFn="seeUploadFn"
      />
    </template>
    <template v-if="active == 50">
      <ComLogistTrack
        ref="myLogistTrack"
        :activities="activities"
        isNoDrawer
        :orderType="50"
      >
        <template v-slot:title="slotProps">
          <span class="orange-bg"> {{ slotProps.activity.name }}</span>
        </template>
        <template v-slot:operationDate="slotProps">
          <span> {{ slotProps.activity.trajectoryTime }}</span>
        </template>
        <template v-slot:operationContent="slotProps">
          <span> {{ slotProps.activity.msg }}</span>
        </template>
      </ComLogistTrack>
    </template>
    <template v-if="active == 60">
      <StorageDelivery
        :dispatchObj="{
          psId: formData.id,
          searchRelatedOrder: this.pageType != 3,
          psType: 2, // 海外
        }"
      />
    </template>
  </div>
</template>

<script>
import { tabsConfig } from "./model";
import { uploadAttach } from "@/api/operateRecord/customsClearance";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    pageType: {
      type: Number,
      default: 1,
    },
    sessionStorageActive: {
      type: Number,
      default: 1,
    },
    needCheckAccount: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CustomsCostBill: () =>
      import("_comp/CostInfo/billings/customsClearanceBill"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable"),
    GoodInfo: () =>
      import(
        "@/views/overseasBusiness/components/TabTable/components/GoodInfo"
      ),
    OverseaGoodsTable: () =>
      import(
        "@/views/warehouseManage/predictionManage/inStorage/detailsTabInfo/overseaGoods/index.vue"
      ),
    ExamineInfo: () =>
      import(
        "@/views/overseasBusiness/components/TabTable/components/ExamineInfo"
      ),
    BasicInfo: () =>
      import(
        "@/views/overseasBusiness/components/TabTable/components/BasicInfo"
      ),
    UploadFile: () =>
      import(
        "@/views/overseasBusiness/components/TabTable/components/UploadFile"
      ),
    CostInfo: () => import("_comp/CostInfo/billings/otherOverSeaOrder.vue"),
    boxStorageInfo: () =>
      import("@/views/warehouseManage/components/boxStorageInfo/index.vue"),
    skuStorageInfo: () =>
      import("@/views/warehouseManage/components/skuStorageInfo/index.vue"),
    ComLogistTrack: () => import("_comp/ComLogistTrack"),
    StorageDelivery: () =>
      import(
        "@/views/warehouseManage/predictionManage/inStorage/detailsTabInfo/storage/delivery.vue"
      ),
  },
  data() {
    const {
      directClearanceOrderDetail,
      deliveryClearanceOrderDeatail,
      warehouseOrderDetailVo,
      overseaBusinessTypes,
    } = this.formData;
    let tabs =
      overseaBusinessTypes.length === 1 && this.pageType !== 1
        ? [11, 60, 30, 40, 50]
        : [11, 60, 21, 30, 40, 50];
    if (this.pageType == 3) {
      tabs = [10, 20, ...tabs].filter((e) => e != 11 && e != 21);
    }
    return {
      tabsConfig: tabsConfig(tabs),
      attachId: {
        1: directClearanceOrderDetail?.attachId,
        2: deliveryClearanceOrderDeatail?.attachId,
        3: warehouseOrderDetailVo?.attachId,
      },
      attIds: [],
      active: 1,
      activities: {
        title: this.overseaLangObj.logistics_trajectory || "物流轨迹",
        id: this.formData.id,
      },
    };
  },
  created() {
    //海外入仓，海外提派，海外直清从列表跳转到详情的时候清除标签点击缓存
    const sessionStorageActive = sessionStorage.getItem("tabActive");
    const { active } = this.tabsConfig;
    this.active = sessionStorageActive || active;
    this.attIds = this.attachId[this.pageType];
  },
  methods: {
    changeTabs(key) {
      this.active = key;
      this.$emit("handleActive", key);
    },
    getTabsConfig() {
      const { warehouseOrderDetailVo } = this.formData;
      const { columns } = this.tabsConfig;
      let columnsConfig;
      if (this.pageType == 3) {
        columnsConfig = columns.filter((e) => {
          const { isBox, isSku } = e;
          if (isBox) {
            return warehouseOrderDetailVo.isBox;
          } else if (isSku) {
            return warehouseOrderDetailVo.isSku;
          } else {
            return true;
          }
        });
      } else {
        columnsConfig = columns;
      }
      return columnsConfig;
    },
    seeUploadFn() {},
    uploadAttach(attachIds = []) {
      this.attIds = attachIds.join(",");
      uploadAttach({
        attachIds,
        id: this.formData.id,
        updateSource: this.pageType,
      });
    },
    handleChange() {
      this.$emit("handleChange");
    },
    changeCostRequest() {
      this.$emit("changeCostRequest");
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 6px 0 14px 0;
}
/deep/ {
  .top {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 14px;
      font-weight: bold;
    }
    .subtitle {
      font-size: 12px;
      margin-left: 5px;
      color: #5094ff;
    }
  }
}
</style>
