<template>
  <div class="details">
    <div class="content-box">
      <ComDetailTop
        :title="/* 海外仓入库 */ overseaLangObj.ds_tc_ys || `电商头程运输`"
        :formModel="initInfo"
        ref="detailTopRef"
        @handleClick="handleTopClick"
      >
        <template v-slot:subTitle>
          <span class="sub-title">
            {{
              initInfo.operationOrderNum
                ? `(${initInfo.operationOrderNum})`
                : ""
            }}
          </span>
        </template>
      </ComDetailTop>
      <div class="content" v-if="isInitRes">
        <div class="order-left">
          <DockingHeadCard :infoData="initInfo" />

          <ComForm :formConfig="storehouseConfig" />

          <div class="goods">
            <div class="custom-tabs-btn">
              <template v-for="item in tabs.columns">
                <el-button
                  size="small"
                  plain
                  :key="item.key"
                  :type="item.key === tabs.active ? 'activation' : ''"
                  @click="changeTabs(item.key)"
                  v-if="showTabs(item)"
                >
                  {{ item.label }}
                </el-button>
              </template>
            </div>
            <div v-if="tabs.active === 0">
              <boxStorageInfo
                :formData="basicInfoConfig.formModel"
                :menuType="'buttOrder'"
              />
            </div>
            <div v-if="tabs.active === 40">
              <skuStorageInfo
                :formData="basicInfoConfig.formModel"
                :menuType="'buttOrder'"
              />
            </div>
            <!-- 基本信息 -->
            <div v-show="tabs.active === 1">
              <ComForm
                class="basic-info"
                ref="basicInfoFormRef"
                :formConfig="basicInfoConfig"
              >
                <!-- <template v-slot:tableData="slotProps">
                  <EcTableInfo
                    ref="tableRef"
                    :data="slotProps"
                    :formModel="{
                      ...basicInfoConfig.formModel,
                      operationOrderId: initInfo.id,
                      orderType: initInfo.orderType,
                      bailorPeople: initInfo.bailorPeople,
                      createTime: initInfo.createTime,
                      freightType: initInfo.freightType,
                    }"
                  />
                </template> -->
              </ComForm>
            </div>
            <!-- 派送信息 -->
            <div v-if="tabs.active === 20">
              <DispatchInfo :dispatchObj="initInfo" />
            </div>
            <!-- 账单信息 -->
            <div v-if="tabs.active === 2">
              <CostInfo
                ref="costInfoRef"
                :formModel="{
                  ...initInfo,
                  billingMain: initInfo.customerBeLongId, //订单操作单
                  id: initInfo.id,
                  businessType: 0,
                  jobNo: initInfo.operationOrderNum,
                  warehouseComId: initInfo.customerBeLongId,
                  isBussiness:
                    initInfo.customerBeLongId == initInfo.operateMain ? 1 : 0,
                }"
                :needCheckAccount="true"
                :isWarehouse="true"
              />
            </div>
            <!-- 物流信息 -->
            <div v-if="tabs.active === 3">
              <ComLogistTrack
                ref="ComLogistTrackRef"
                :activities="{
                  title: overseaLangObj.logistics_trajectory || '物流轨迹',
                  id: initInfo.id,
                  operationOrderNum: initInfo.operationOrderNum,
                }"
                :orderSourceObj="{
                  trackSource: 'tailDetails',
                  requestKey: 'tail',
                }"
                isNoDrawer
              />
            </div>
            <template v-if="tabs.active === 8">
              <StorageDelivery
                :dispatchObj="{
                  psId: initInfo.id,
                  searchRelatedOrder: false,
                  psType: 1,
                }"
              />
            </template>
          </div>
        </div>

        <!-- 侧边栏参考清关详情使用单独组件 -->
        <div class="order-right">
          <ButtOrderSideOperationBar
            :formData="basicInfoConfig.formModel"
            @handleSuccess="getNewTrack"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import {
  tabsConfig,
  basicInfoConfig,
  storehouseLists,
} from "./model";
import {
  getECDetail,
} from "@/api/order/firstTransport.js";
import { getWmsTakeOrders } from "@/api/operateManage/common";
import { getThirdPartyTotalBill } from "@/api/warehouse/prediction";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { getHeaderTotalBill } from "@/api/operateRecord/customsClearance.js";
export default {
  name: "ButtOrderDetails",
  mixins: [mixinEditCache],
  components: {
    ComUpload: () => import("_comp/ComUpload"),
    ComTable: () => import("_comp/ComTable"),
    // EcTableInfo: () => import("./EcTableInfo"),
    ECommerceCostBill: () =>
      import("_comp/CostInfo/billings/eCommerceWarehouse"),
    ComLogistTrack: () => import("_comp/ComLogistTrack"),
    DispatchInfo: () => import("../detailsTabInfo/dispatchInfo/dispatch"),
    DockingHeadCard: () => import("./components/headCard"),
    ButtOrderSideOperationBar: () =>
      import("./components/buttOrderSideOperationBar.vue"),
    boxStorageInfo: () =>
      import("@/views/warehouseManage/components/boxStorageInfo/index.vue"),
    skuStorageInfo: () =>
      import("@/views/warehouseManage/components/skuStorageInfo/index.vue"),
    StorageDelivery: () =>
      import(
        "@/views/warehouseManage/predictionManage/inStorage/detailsTabInfo/storage/delivery.vue"
      ),
    CostInfo: () => import("_comp/CostInfo/billings/overseasWarehouse.vue"),
  },
  data() {
    return {
      initInfo: {},
      tabs: tabsConfig,
      storehouseConfig: {
        formModel: {},
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "142px" : "92px",
        lists: storehouseLists,
        className: "detail-see-form",
      },
      basicInfoConfig: {
        formModel: {},
        lists: basicInfoConfig.lists,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "72px" : "60px",
      },
      isInitRes: false,
    };
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    mixinInitData() {
      const { id } = this.$route.query;
      if (!id) {
        this.reBack();
        return;
      }
      this["dictionary/getDictionary"]("predictionManage").then(() => {
        this.getDetails(id);
      });
    },
    getDetails(id) {
      this.isInitRes = false;
      getWmsTakeOrders(id).then((res) => {
        const { orderId } = res.data;
        this.storehouseConfig.formModel = res.data;
        Promise.all([getECDetail(orderId || id)]).then(([basicInfo]) => {
          const { data = {} } = basicInfo;
          this.initInfo = {
            ...res.data,
            headTransportModeName: data.headTransportModeName,
            outWarehouseWayName: data.outWarehouseWayName,
          };
          this.getTabsBtns(this.initInfo);
          this.changeCostRequest();
          this.basicInfoConfig.formModel = {
            ...data,
            orderId,
            freightType: data.freightType || "1",
            pickUpHome: !!data.pickUpHome,
          };
          this.isInitRes = true;
        });
      });
    },
    changeCostRequest() {
      const { popClearanceCheckId } = this.initInfo;
      const opt = {
        orderId: popClearanceCheckId,
        businessType: 6,
      };
      getThirdPartyTotalBill(opt).then((res) => {
        this.initInfo = {
          ...this.initInfo,
          ...res.data,
        };
      });
    },
    changeCostRequest() {
      const { id, customerBeLongId } = this.initInfo;
      const params = {
        orderId: id,
        billingMain: customerBeLongId,
        businessType: 0,
      };
      getHeaderTotalBill(params).then((res) => {
        const { data = {} } = res;
        this.initInfo = {
          ...this.initInfo,
          ...data,
        };
      });
    },
    changeTabs(key) {
      console.log("key", key);
      this.tabs.active = key;
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetails(id);
      }
    },
    showTabs(item) {
      let isTwoArr = [];
      return !isTwoArr.includes(item.key);
    },
    getNewTrack() {
      const { active } = this.tabs;
      if (active == 3) {
        //只有选中物流信息的时候刷新，否则不刷新
        this.$refs.ComLogistTrackRef.getLogisticsNodes();
      }
    },
    getTabsBtns(row) {
      this.tabs=tabsConfig(row)
      this.tabs.active = this.tabs.columns[0].key;
    },
  },
};
</script>

<style lang="scss" scoped>
.details {
  background: #f9f9f9;
  padding: 10px 0 20px;
  /deep/ {
    .border-top-solid::before {
      margin-top: 15px;
    }
    .order-left {
      min-width: 900px;
      flex: 0 1 100%;
      padding: 0 20px 114px;
    }
    .goods {
      padding-right: 20px;
    }
    .accessory-title {
      margin-bottom: 0;
    }
    .accessory-txt {
      font-size: 12px;
      color: #515151;
      font-weight: 400;
      margin-left: 15px;
    }
    .border-bottom-solid {
      margin-bottom: 0;
    }
  }
  .content-box {
    min-height: calc(100vh - 108px);
    margin: 0 10px;
    background: #fff;
    .edit-form {
      margin-top: 15px;
      padding: 0 20px;
    }
    .content {
      width: 100%;
      display: flex;
    }
    .custom-tabs-btn {
      margin-bottom: 14px;
    }
  }
}
</style>
