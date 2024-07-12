<template>
  <!-- 整箱出库 -->
  <div class="details">
    <div class="content-box">
      <ComDetailTop
        :title="overseaLangObj.zx_ck_xq"
        :formModel="initInfo"
        :titConfig="leftTopConfig"
        ref="detailTopRef"
        @handleClick="handleTopClick"
      >
        <!-- <template v-slot:subTitle>
          <span class="sub-title"> ({{ titTypeObj[viewDetailsSource] }}) </span>
        </template> -->
        <template v-slot:subTitle>
          <span class="sub-title">
            {{ initInfo.customerName ? `(${initInfo.customerName})` : "" }}
          </span>
        </template>
      </ComDetailTop>
      <div class="content" v-if="isInitRes">
        <div class="order-left">
          <HeadCard :formModel="initInfo" :formConfig="cardConfig" />

          <ComForm
            class="basic-info"
            :formConfig="{
              ...warehouseHeadConfig,
              formModel: {
                ...initInfo,
                web_delivery_tag:
                  initInfo.deliveryWarehouse.customerName || '海外仓',
              },
            }"
          />

          <div class="goods">
            <div class="tabs">
              <el-button
                size="small"
                plain
                v-for="item in tabsColumns()"
                :key="item.key"
                class="tabs-change"
                :type="item.key === tabs.active ? 'activation' : ''"
                @click="changeTabs(item.key)"
              >
                {{ item.label }}
              </el-button>
            </div>
            <!-- 基本信息 -->
            <div v-show="tabs.active === 1">
              <ComForm
                ref="basicInfoFormRef"
                class="basic-info"
                :formConfig="warehouseConfig"
              >
                <!-- <template v-slot:tableData>

                </template> -->
              </ComForm>
            </div>
            <!-- 货物信息 -->
            <div v-if="tabs.active === 20">
              <FbaGoodsTable
                :order-id="$route.query.id"
                :goods-form-model="warehouseConfig.formModel"
                :isPerformance="isPerformance"
              />
              <template v-if="initInfo.isSticker">
                <TbLabeling
                  :formData="initInfo"
                  :platformOrFbaObj="{
                    mType: 2,
                  }"
                />
              </template>
            </div>
            <!-- 账单信息 -->
            <div v-if="tabs.active === 2">
              <CostInfo
              ref="costInfoRef"
              :formModel="{
                ...initInfo,
                billingMain:
                viewDetailsSource == 'webWarehouseOutbound'
                    ? initInfo.warehouseComId //海外仓
                    : initInfo.operationMain, //订单操作单
                id: initInfo.id,
                businessType: 30,
                jobNo : initInfo.number,
                isBussiness : initInfo.warehouseComId == initInfo.operationMain ? 1 : 0
              }"
              :isWarehouse="viewDetailsSource == 'webWarehouseOutbound' ? true : false"
            />
              <!-- <ECommerceCostBill
                :formModel="{
                  ...initInfo,
                  orderHandleType: 2,
                  webViewSource: viewDetailsSource,
                  businessType: 5,
                }"
                :businessType="0"
                :show-btn-arr="showBtnArr"
                @changeBillEvent="changeCostRequest"
              /> -->
            </div>
            <!-- 附件信息 -->
            <div v-show="tabs.active === 5">
              <ComAttachTable ref="comAttachRef" />
            </div>
            <!-- 物流信息 -->
            <div v-if="tabs.active === 6">
              <ComLogistTrack
                :activities="activities"
                isNoDrawer
                :orderType="30"
                v-if="activities.id"
              >
              </ComLogistTrack>
            </div>
            <!-- 操作记录 -->
            <div v-if="tabs.active === 7">
              <OperationRecords :id="initInfo.id || 0" :type="3" />
            </div>
          </div>
        </div>
        <div>
          <OutboundSideBar
            :formData="{
              ...initInfo,
              webPageSource: viewDetailsSource,
            }"
            :remarkHide="
              !['webOperationOutbound', 'webWarehouseOutbound'].includes(
                viewDetailsSource
              )
            "
          />
        </div>
      </div>
    </div>

    <div
      class="order-footer"
      v-if="['webOrderOutbound'].includes(viewDetailsSource)"
    >
      <!-- 订单显示底部按钮 -->
      <slot name="footerBtn" :btnInfo="initInfo" />
      <el-button @click="reBack()"> 关 闭 </el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  tabsConfig,
  truckConfig,
  fbaWarehouseHeadCols,
  warehouseTypeCols,
} from "../model";
import {
  getFbaDetails,
  getFbaPerformanceDetails,
} from "@/api/warehouse/prediction";
import { getEditFbaOrder } from "@/api/overseas/fbaOrder";
import{cardConfig,titleConfig} from "./model.js"
import {getHeaderTotalBill} from "@/api/operateRecord/customsClearance.js"
const formConfig = {
  formModel: {},
  httpRequest: () => {}, // 表单提交接口
  successFunction: () => {}, // 表单提交成功回调
  labelWidth: "90px",
  formRules: {}, // 表单校验规则
  visibleAll: true,
};
export default {
  props: {
    viewDetailsSource: {
      type: String,
      default: () => "",
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComTable: () => import("_comp/ComTable"),
    ComLogistTrack: () => import("_comp/ComLogistTrack"),
    FbaGoodsTable: () =>
      import(
        "@/views/newOrderManage/overSea/overseas/components/fbaGoodsTable.vue"
      ),
    ECommerceCostBill: () =>
      import("_comp/CostInfo/billings/eCommerceWarehouse"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable"),
    FbaSideOperationBar: () => import("_comp/ComOperate/views/FBASideBar.vue"),
    OutboundSideBar: () => import("_comp/ComOperate/views/OutboundSideBar.vue"),
    OperationRecords: () =>
      import("@/views/newOrderManage/components/OperationRecords/index.vue"),
    HeadCard: () => import("./headCard.vue"),
    TbLabeling: () => import("../../wholeSale/components/tbLabeling.vue"),
    CostInfo: () => import("_comp/CostInfo/billings/overseasWarehouse.vue"),
  },
  data() {
    const showBtnArr = {
      webOrderOutbound: [10, 20, 30, 70, 40, 50, 63],
      webOperationOutbound: [20, 30, 70, 40, 50, 63],
      webWarehouseOutbound: [20, 30, 70, 40, 50, 63],
    }[this.viewDetailsSource];
    const leftTopConfig=titleConfig({viewDetailsSource:this.viewDetailsSource})
    return {
      leftTopConfig,
      cardConfig,
      showBtnArr,
      initInfo: {},
      tabs: tabsConfig,
      warehouseHeadConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "125px" : "105px",
        lists: fbaWarehouseHeadCols(),
      },
      warehouseConfig: {
        ...formConfig,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "125px" : "70px",
      },
      truckConfig: {
        ...formConfig,
        lists: truckConfig.lists,
        isAttachFileId: true,
      },
      activities: {
        title: this.overseaLangObj.logistics_trajectory || "物流轨迹",
      },
      isInitRes: false,
      pageTypeObj: {
        webOrderOutbound: "2", // 订单
        webOperationOutbound: "1", // 操作单
        webWarehouseOutbound: "0", // 仓库
      },
      titTypeObj: {
        webOrderOutbound: "订单信息",
        webOperationOutbound: "操作信息",
        webWarehouseOutbound: this.overseaLangObj.ck_lb("海外仓"),
      },
      isPerformance: false,
    };
  },
  created() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getInitData() {
      const { id, isPerformance,active=1 } = this.$route.query;
      this.isPerformance = !!isPerformance;
      if (!id) {
        this.reBack();
        return;
      }
      this["dictionary/getDictionary"]("predictionManage").then(() => {
        // this.tabs.active = 1;
        this.tabs.active=this.typeConversion(active,'number')
        this.getDetails();
      });
    },
    changeTabs(key) {
      this.tabs.active = key;
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetails();
        this.tabs.active = 1;
      }
    },
    getDetails() {
      const { id } = this.$route.query;
      this.activities.id = id; //操作单id
      this.isInitRes = false;
      let reqs = {
        // 仓库详情接口
        getFbaDetails,
      };
      if (this.viewDetailsSource === "webOrderOutbound") {
        // 订单详情接口
        reqs = {
          getFbaDetails: getEditFbaOrder,
        };
      }
      if (this.viewDetailsSource === "webOperationOutbound") {
        // 操作详情接口
        reqs = {
          getFbaDetails: getFbaPerformanceDetails,
        };
      }
      Promise.all([
        reqs.getFbaDetails(id),
      ]).then(([res]) => {
        // console.log("details", res.data);
        const { insurance, cod, ebayPlatform, sign, attachList, ...resData } =
          res.data;
        this.initInfo = {
          ...resData,
          insurance: insurance == 1,
          webOrderSource: this.pageTypeObj[this.viewDetailsSource],
        };
        this.changeCostRequest();
        this.warehouseConfig = {
          ...this.warehouseConfig,
          lists: warehouseTypeCols(this.viewDetailsSource),
          formModel: {
            ...this.initInfo,
            web_receiving_tag: "FBA仓",
          },
          afterMounted: () => {
            this.$refs.comAttachRef?.setFileList(attachList || []); // 附件信息
          },
        };
        this.isInitRes = true;
      });
    },
    changeCostRequest() {
      const { id, warehouseComId, operationMain } = this.initInfo;
      const params = {
        orderId: id,
        billingMain:
          this.viewDetailsSource == "webWarehouseOutbound"
            ? warehouseComId
            : operationMain,
        businessType: 30,
      };
      getHeaderTotalBill(params).then((res) => {
        const { data = {} } = res;
        this.initInfo = {
          ...this.initInfo,
          ...data,
        };
      });
    },
    handleEdit() {},
    handleRefreshPage() {
      this.getDetails();
    },
    tabsColumns() {
      let filterTabs = [];
      if (
        this.viewDetailsSource === "webOrderOutbound" &&
        [0, 11].includes(this.initInfo.status)
      ) {
        filterTabs.push(...[2]); // 草稿/打回状态不显示
      }
      return this.tabs.columns.filter((e) => !filterTabs.includes(e.key));
    },
  },
};
</script>

<style lang="scss" scoped>
.details {
  background: #f9f9f9;
  // padding: 11px 0 20px;

  /deep/ {
    .mark-radio {
      margin-left: 8px;
    }

    .basic-info {
      padding-bottom: 20px;
    }

    .basic-info,
    .ticker-info,
    .truck-info {
      .el-form-item {
        margin-bottom: 0;
      }
    }

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

    // .accessory-title {
    //   margin-bottom: 0;
    // }

    // .accessory-txt {
    //   font-size: 12px;
    //   color: #515151;
    //   font-weight: 400;
    //   margin-left: 15px;
    // }
  }

  .content-box {
    min-height: calc(100vh - 108px);
    margin: 10px;
    background: #fff;

    .edit-form {
      margin-top: 15px;
      padding: 0 20px;
    }

    .content {
      width: 100%;
      display: flex;
    }

    .tabs {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      // margin: 14px 0;
      padding: 14px 0px;
      margin-bottom: 14px;
      // border-bottom:1px solid #e2e2e2;

      // .tabs-btn {
      //   color: #515151;

      //   &:hover,
      //   &:focus {
      //     color: #5094ff;
      //   }

      //   &.isActive {
      //     color: #5094ff;
      //     border-color: #5094ff;
      //   }
      // }
    }
  }
}
</style>
