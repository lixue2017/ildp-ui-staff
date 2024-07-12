<template>
  <!-- 一件代发 -->
  <div class="details">
    <div class="content-box">
      <ComDetailTop
        :title="overseaLangObj.yj_df_xq"
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
          <!-- <FbaHeadCard
            :infoData="{
              ...initInfo,
              customerName: initInfo.createNickName,
              orderSn: initInfo.number,
            }"
          /> -->
          <HeadCard :formModel="initInfo" :formConfig="cardConfig" />

          <ComForm
            class="basic-info"
            :formConfig="{
              ...warehouseHeadConfig,
              formModel: initInfo,
            }"
          >
            <template v-slot:insuranceSlot="slotProps">
              <div>
                <el-checkbox
                  v-model="slotProps.formModel.insurance"
                  class="single-checkbox"
                  disabled
                >
                  {{ overseaLangObj.insurance_services }}
                </el-checkbox>

                <el-checkbox
                  v-model="slotProps.formModel.cod"
                  class="single-checkbox"
                  disabled
                >
                  {{ overseaLangObj.sf_cod }}
                </el-checkbox>
                {{ overseaLangObj.cod_amount }}：
                {{ slotProps.formModel.codAmount || "--" }}
                ({{
                  slotProps.formModel.salesCurrencyCode ||
                  slotProps.formModel.salesCurrencyId ||
                  "--"
                }})
              </div>
            </template>

            <template v-slot:signSlot="slotProps">
              <div>
                <el-checkbox
                  v-model="slotProps.formModel.sign"
                  class="single-checkbox"
                  disabled
                >
                  {{ overseaLangObj.signature_service }}
                </el-checkbox>
                <span>{{ overseaLangObj.additional_charges }}</span>
              </div>
            </template>
          </ComForm>

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
                class="basic-info see-detail-info"
                ref="basicInfoFormRef"
                :formConfig="warehouseConfig"
              >
                <template v-slot:formSlotContacts>
                  <PlatContacts
                    :form-data="
                      warehouseConfig.formModel.torderOverseasPlatformContacts
                    "
                  />
                </template>
              </ComForm>
            </div>
            <!-- 货物信息 -->
            <div v-if="tabs.active === 7">
              <div class="goods-info">
                <span class="title">{{ overseaLangObj.cargo_details }}</span>
                <div>
                  <el-radio-group
                    v-model="initInfo.outGoodsType"
                    style="margin-right: 10px"
                    disabled
                  >
                    <el-radio :label="1">整箱出库</el-radio>
                    <el-radio :label="0">SKU出库</el-radio>
                  </el-radio-group>
                  <el-checkbox
                    :disabled="true"
                    v-model="initInfo.isSticker"
                    class="checkbox"
                  >
                    {{ overseaLangObj.tb_labeling() }}
                  </el-checkbox>
                </div>
              </div>
              <ComTable
                :columnConfig="goodsTableCols()"
                :httpRequest="goodsTable.httpRequest"
                :getQueryParams="() => getQueryParams()"
                :pagination="false"
                @getResult="getTableResult"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template v-if="slotProps.prop === 'product'">
                    <div>
                      <i
                        :class="
                          slotProps.row.foreignExportParam == 1
                            ? 'el-icon-circle-check'
                            : 'el-icon-warning-outline'
                        "
                      ></i>
                      <span>
                        {{ slotProps.dicsList.nameCn || "缺失" }}
                      </span>
                    </div>
                  </template>
                </template>
              </ComTable>
              <div class="grand-total">
                <template v-for="(tItem, i) in tableSubtotal">
                  <span :key="`t_${i}`">
                    <span>{{ tItem.totalLabel }}：</span>
                    <span>{{ tItem.totalNum }}</span>
                  </span>
                </template>
              </div>

              <template v-if="initInfo.isSticker">
                <TbLabeling :formData="initInfo" />
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
                  businessType: 35,
                  jobNo: initInfo.number,
                  isBussiness:
                    initInfo.warehouseComId == initInfo.operationMain ? 1 : 0,
                }"
                :isWarehouse="
                  viewDetailsSource == 'webWarehouseOutbound' ? true : false
                "
              />
            </div>
            <!-- 附件信息 -->
            <div v-show="tabs.active === 5">
              <ComAttachTable ref="comAttachRef" />
            </div>
            <!-- 物流信息 -->
            <div v-if="tabs.active === 6">
              <ComLogistTrack
                ref="myLogistTrack"
                :activities="activities"
                :orderType="35"
                isNoDrawer
                v-if="activities.id"
              >
              </ComLogistTrack>
            </div>
            <!-- 操作记录 -->
            <div v-if="tabs.active === 8">
              <OperationRecords :id="initInfo.id || 0" :type="2" />
            </div>
          </div>
        </div>

        <!-- 操作单与仓库详情显示侧边栏 -->
        <!-- <div v-if="['webWarehouseOutbound'].includes(viewDetailsSource)">
          <WholeSaleSideOperationBar
            :formData="{
              ...initInfo,
              webPageSource: viewDetailsSource,
            }"
            @handleRegistration="handleEdit"
            @handleSuccess="getInitData"
          />
        </div> -->
        <div>
          <OutboundSideBar
            viewSource="wholeSale"
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
      <el-button @click="reBack()">{{ overseaLangObj.gb_close }}</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { accumulationFn } from "@/utils/instructions";
import {
  tabsConfig,
  warehouseTypeCols,
  yGoodsSkuTableColumns,
  yGoodsBoxTableColumns,
  fbaWarehouseHeadCols,
} from "../model";
import { cardConfig, titleConfig } from "./model.js";
import {
  getWholeSaleOrderDetails,
  getWholeSaleOperationDetails,
  getWholeSaleDetails,
  getPlatformGoodsInfo,
  getThirdPartyTotalBill,
} from "@/api/warehouse/prediction";
import { getHeaderTotalBill } from "@/api/operateRecord/customsClearance.js";
const formConfig = {
  formModel: {},
  labelWidth: "90px",
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
    PlatContacts: () =>
      import(
        "@/views/newOrderManage/overSea/overseas/components/platContacts.vue"
      ),
    ECommerceCostBill: () =>
      import("_comp/CostInfo/billings/eCommerceWarehouse"),
    CostInfo: () => import("_comp/CostInfo/billings/overseasWarehouse.vue"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable"),
    WholeSaleSideOperationBar: () =>
      import("_comp/ComOperate/views/WholeSaleSideBar.vue"),
    OutboundSideBar: () => import("_comp/ComOperate/views/OutboundSideBar.vue"),
    OperationRecords: () =>
      import("@/views/newOrderManage/components/OperationRecords/index.vue"),
    HeadCard: () => import("./headCard.vue"),
    TbLabeling: () => import("./tbLabeling.vue"),
  },
  // computed: {
  //   ...mapState(["dictionary"]),
  // },
  data() {
    const showBtnArr = {
      webOrderOutbound: [10, 20, 30, 70, 40, 50, 63],
      webOperationOutbound: [20, 30, 70, 40, 50, 63],
      webWarehouseOutbound: [20, 30, 70, 40, 50, 63],
    }[this.viewDetailsSource];
    const leftTopConfig = titleConfig({
      viewDetailsSource: this.viewDetailsSource,
    });
    return {
      leftTopConfig,
      cardConfig,
      showBtnArr,
      initInfo: {},
      tabs: tabsConfig,
      warehouseConfig: {
        ...formConfig,
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "133px" : "110px",
      },
      warehouseHeadConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "120px" : "92px",
        lists: fbaWarehouseHeadCols(),
      },
      // tickerInfo: [],
      // truckConfig: {
      //   ...formConfig,
      //   lists: truckConfig.lists,
      //   isAttachFileId: true,
      // },
      goodsTable: {
        httpRequest: getPlatformGoodsInfo,
      },
      tableSubtotal: [],
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
    };
  },
  created() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getInitData() {
      const { id } = this.$route.query;
      if (!id) {
        this.reBack();
        return;
      }
      this["dictionary/getDictionary"]("predictionManage").then(() => {
        this.tabs.active = 1;
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
      }
    },
    getQueryParams() {
      return {
        orderOverseasPlatformId: this.activities.id,
      };
    },
    getDetails() {
      const { id } = this.$route.query;
      this.activities.id = id; //操作单id
      this.isInitRes = false;

      let reqs = {
        // 仓库详情接口
        httpDetails: getWholeSaleDetails,
      };
      if (this.viewDetailsSource === "webOrderOutbound") {
        // 订单详情接口
        reqs = {
          httpDetails: getWholeSaleOrderDetails,
        };
      }
      if (this.viewDetailsSource === "webOperationOutbound") {
        // 操作详情接口
        reqs = {
          httpDetails: getWholeSaleOperationDetails,
        };
      }
      Promise.all([
        reqs.httpDetails(id),
        // getTickerInfo(id), // 接口不要一起调用，放到单独的组件里，或切换tab时调用
        // getTruckInfo(id),
      ])
        .then(([res]) => {
          // , tickerInfo, truckInfo
          // console.log("details", res.data);
          const {
            insurance,
            cod,
            ebayPlatform,
            sign,
            orderRemark,
            attachList,
            deliveryWarehouse,
            isSticker,
            ...resData
          } = res.data;
          this.initInfo = {
            ...resData,
            remark: orderRemark,
            insurance: insurance == 1,
            cod: cod == 1,
            ebayPlatform: ebayPlatform == 1,
            sign: sign == 1,
            webOrderSource: this.pageTypeObj[this.viewDetailsSource],
            deliveryWarehouse,
            WEB_DeliveryCustomerName: deliveryWarehouse?.customerName || "",
            isSticker: isSticker == 0 ? false : true,
          };
          this.changeCostRequest();
          this.warehouseConfig = {
            ...this.warehouseConfig,
            formModel: this.initInfo || {},
            lists: warehouseTypeCols(this.viewDetailsSource),
            afterMounted: () => {
              this.$refs.comAttachRef?.setFileList(attachList || []); // 附件信息
            },
          };
          this.isInitRes = true;
          //贴标信息
          // const tickerList = tickerInfo.rows || [];
          // const list = tickerList.map((item) => {
          //   return Object.assign(
          //     {},
          //     {
          //       tickerConfig: {
          //         ...formConfig,
          //         formModel: {
          //           ...item,
          //           isSort: item.isSort == 1 ? false : true,
          //           stickerType: item.stickerType.toString(),
          //         },
          //         lists: tickerConfig.lists,
          //         isAttachFileId: true,
          //         labelWidth: "80px",
          //       },
          //     }
          //   );
          // });
          // this.tickerInfo = list || [];
          //快递卡车信息
          // const truckData = truckInfo.data;
          // const { isTruckOrExpress } = truckData;
          // this.truckConfig.lists =
          //   isTruckOrExpress == 1 ? truckConfig.lists : expressConfig.lists;
          // this.truckConfig.formModel = truckData || {};
        })
        .catch();
    },
    changeCostRequest() {
      const { id, warehouseComId, operationMain } = this.initInfo;
      const params = {
        orderId: id,
        billingMain:
          this.viewDetailsSource == "webWarehouseOutbound"
            ? warehouseComId
            : operationMain,
        businessType: 35,
      };
      getHeaderTotalBill(params).then((res) => {
        const { data = {} } = res;
        this.initInfo = {
          ...this.initInfo,
          ...data,
        };
      });
    },
    handleOperateSuccess() {
      this.getDetails();
    },
    handleEdit() {},
    getTableResult({ tableData: arr = [] }) {
      const { outGoodsType } = this.initInfo;
      this.tableSubtotal = [
        {
          totalLabel: outGoodsType === 0 ? "库存PCS数" : "总库存数",
          totalNum: accumulationFn(arr.map((e) => e.quantityInventory)),
        },
        {
          totalLabel: outGoodsType === 0 ? "总出库PCS数" : "总出库数",
          totalNum: accumulationFn(arr.map((e) => e.quantity)),
        },
      ];
    },
    goodsTableCols() {
      if (this.initInfo.outGoodsType === 1) {
        return yGoodsBoxTableColumns();
      }
      return yGoodsSkuTableColumns;
    },
    tabsColumns() {
      let filterTabs = [];
      if (
        this.viewDetailsSource === "webOrderOutbound" &&
        [0].includes(this.initInfo.status)
      ) {
        filterTabs.push(...[2]); // 草稿状态不显示, 打回仍然显示
        if (this.tabs.active === 2) {
          this.tabs.active = 1;
        }
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
    .see-detail-info {
      padding-top: 10px;
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

    .accessory-title {
      margin-bottom: 0;
    }

    .accessory-txt {
      font-size: 12px;
      color: #515151;
      font-weight: 400;
      margin-left: 15px;
    }

    .goods-info {
      display: flex;
      justify-content: space-between;
      margin: 14px 0;

      .title {
        font-size: 14px;
        color: #515151;
        font-weight: bold;
      }
    }
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
      // border-bottom: 1px solid #e2e2e2;

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
