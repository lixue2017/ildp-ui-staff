<template>
  <div class="details" v-if="isInitRes">
    <div class="content-box">
      <ComDetailTop
        :title="overseaLangObj.dsf_rkd_des || `第三方入库单信息`"
        :formModel="initInfo"
        :titConfig="leftTitleConfig"
        ref="detailTopRef"
        @handleClick="handleTopClick"
      >
        <template v-slot:subTitle>
          <span class="sub-title">
            {{ initInfo.customerShortName ? `(${initInfo.customerShortName})` : "" }}
          </span>
        </template>
      </ComDetailTop>
      <div class="content">
        <div class="order-left">
          <!-- <WmsHeadCard :infoData="initInfo" /> -->
          <HeadCard
            :formModel="initInfo"
            :formConfig="cardConfig"
          />

          <ComForm
            class="basic-info"
            :formConfig="{
              ...warehouseHeadConfig,
              formModel: initInfo,
            }"
          />

          <div class="goods">
            <div class="tabs">
              <template v-for="item in tabsColumns()">
                <el-button
                  size="small"
                  plain
                  :key="item.key"
                  class="tabs-change"
                  :type="tabs.active == item.key ? 'activation' : ''"
                  @click="changeTabs(item.key)"
                >
                  {{ item.label }}
                </el-button>
              </template>
            </div>
            <!-- 按箱收货 -->
            <div v-if="tabs.active === 10">
              <boxStorageInfo
                :formData="warehouseConfig.formModel"
                :menuType="'thirdParty'"
              />
            </div>
            <div v-if="tabs.active === 20">
              <skuStorageInfo
                :formData="warehouseConfig.formModel"
                :menuType="'thirdParty'"
              />
            </div>
            <div v-show="tabs.active === 30">
              <ComForm
                class="basic-info"
                :ref="'basicInfoFormRef' /** 父组件有调用，更换名称需同步 */"
                :formConfig="warehouseConfig"
              >
                <template v-slot:tableData="{ formModel }">
                  <div class="goods-info">
                    <span class="title">{{
                      overseaLangObj.cargo_details || "货物信息"
                    }}</span>
                  </div>
                  <ComTable
                    ref="goodsRef"
                    :columnConfig="goodsTable.columnConfig"
                    :columnData="[]"
                    :pagination="false"
                    :defaultExpandAll="true"
                  >
                    <template v-slot:customRow="{ slotProps }">
                      <template v-if="slotProps.prop === 'expand'">
                        <div
                          v-if="
                            !slotProps.row.products ||
                            !slotProps.row.products.length
                          "
                          class="noData"
                        >
                          {{ overseaLangObj.no_data("暂无关联产品") }}
                        </div>
                        <template v-else>
                          <el-row
                            v-for="(exRow, exRIndex) in slotProps.row.products"
                            :gutter="20"
                            :key="`${exRow.temp_only_key}_${exRow.id}`"
                          >
                            <el-col
                              :span="8"
                              class="base-flex-align content-show"
                            >
                              <span
                                >{{ overseaLangObj.cp_product || "产品"
                                }}{{ exRIndex + 1 }}：</span
                              >
                              <el-tooltip :content="exRow.sku" placement="top">
                                <span>{{ exRow.sku }}</span>
                              </el-tooltip>
                            </el-col>
                            <el-col
                              :span="6"
                              class="base-flex-align content-show"
                            >
                              <span
                                >{{ overseaLangObj.sl_num || "数量" }}：</span
                              >
                              <!-- <span :title="exRow.skuNum">{{ exRow.skuNum }}</span> -->
                              <el-tooltip
                                :content="
                                  typeConversion(exRow.skuNum, 'string')
                                "
                                placement="top"
                              >
                                <span>{{ exRow.skuNum }}</span>
                              </el-tooltip>
                            </el-col>
                            <el-col
                              :span="6"
                              class="base-flex-align content-show"
                            >
                              <span
                                >{{
                                  overseaLangObj.cp_name || "产品名称"
                                }}：</span
                              >
                              <!-- <span :title="exRow.skuName">{{ exRow.skuName }}</span> -->
                              <el-tooltip
                                :content="
                                  typeConversion(exRow.skuName, 'string')
                                "
                                placement="top"
                              >
                                <span>{{ exRow.skuName }}</span>
                              </el-tooltip>
                            </el-col>
                          </el-row>
                        </template>
                      </template>
                    </template>
                  </ComTable>
                  <div class="grand-total">
                    <template v-for="gross in goodsTable.grossTotal">
                      <span :key="gross.prop">
                        <span class="label">{{ gross.label }}</span>
                        <span class="value">{{
                          formModel[gross.prop] || 0
                        }}</span>
                      </span>
                    </template>
                  </div>
                </template>
              </ComForm>
            </div>
            <!-- 账单信息 -->
            <div v-if="tabs.active === 40">
              <CostInfo
              ref="costInfoRef"
              :formModel="{
                ...initInfo,
                billingMain:
                viewDetailsSource == 'warehouseReceiving'
                    ? initInfo.warehouseComId //海外仓
                    : initInfo.operationMain, //订单操作单
                id: initInfo.id,
                businessType: 20,
                jobNo : initInfo.orderSn,
                isBussiness : initInfo.warehouseComId == initInfo.operationMain ? 1 : 0
              }"
              :isWarehouse="viewDetailsSource == 'warehouseReceiving' ? true : false"
            />
              <!-- <ECommerceCostBill
                :formModel="{
                  ...initInfo,
                  orderHandleType: 1,
                  pageType: viewDetailsSource,
                  webViewSource: viewDetailsSource,
                  businessType: 7,
                }"
                :businessType="0"
                :show-btn-arr="showBtnArr"
                @changeBillEvent="changeCostRequest"
              /> -->
            </div>
            <!-- 附件信息 -->
            <div v-show="tabs.active === 50">
              <ComAttachTable ref="comAttachRef" />
            </div>
            <!-- 物流信息 -->
            <div v-if="tabs.active === 60">
              <ComLogistTrack
                ref="myLogistTrack"
                :activities="activities"
                isNoDrawer
                v-if="activities.id"
                :orderType="20"
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
            </div>
            <!-- 操作记录 -->
            <div v-if="tabs.active === 70">
              <OperationRecords :id="initInfo.id || 0" :type="4" />
            </div>
          </div>
        </div>
        <div
          v-if="
            [
              'operationReceiving',
              'warehouseReceiving',
              'orderReceiving',
            ].includes(viewDetailsSource)
          "
        >
          <!-- 操作单与仓库详情显示侧边栏 -->
          <ThirdPartySideOperationBar
            :formData="{
              ...initInfo,
              webPageSource: viewDetailsSource,
              isNodeDisable: isWarehouseApiId,
            }"
            @handleRegistration="handleEdit"
            @handleSuccess="getInitData"
            :remarkHide="viewDetailsSource === 'orderReceiving'"
            v-if="activities.id"
          />
        </div>
        <div></div>
      </div>
    </div>

    <div
      class="order-footer"
      v-if="
        ['orderReceiving', 'warehouseReceiving'].includes(viewDetailsSource)
      "
    >
      <!-- 订单与海外仓显示底部按钮 -->
      <slot v-if="!isWarehouseApiId" name="footerBtn" :btnInfo="initInfo" />
      <el-button @click="reBack()">{{
        overseaLangObj.gb_close || "关 闭"
      }}</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import {
  warehouseHeadCols,
  warehouseTypeCols,
  goodsTableColumns,
  grossTotal,
  tabsConfig,
} from "../model";
import { cardConfig,titConfig } from "./model.js";
import {
  getWmsOrderDetails,
  getThirdPartyOrderDetails,
  getThirdPartyOrderSkuList,
  getPerformancePageDetails,
  getPerformancePageSkuList,
  getThirdPartyTotalBill,
  getThirdPartyOrderGetBox,
} from "@/api/warehouse/prediction";
import { getHeaderTotalBill } from "@/api/operateRecord/customsClearance.js";
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
    ThirdPartySideOperationBar: () =>
      import("_comp/ComOperate/views/ThirdPartySideBar.vue"),
    ComLogistTrack: () => import("_comp/ComLogistTrack"),
    ECommerceCostBill: () =>
      import("_comp/CostInfo/billings/eCommerceWarehouse"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable"),
    HeadCard: () => import("./headCard"),
    boxStorageInfo: () =>
      import("@/views/warehouseManage/components/boxStorageInfo/index.vue"),
    skuStorageInfo: () =>
      import("@/views/warehouseManage/components/skuStorageInfo/index.vue"),
    OperationRecords: () =>
      import("@/views/newOrderManage/components/OperationRecords/index.vue"),
    CostInfo: () => import("_comp/CostInfo/billings/overseasWarehouse.vue"),
  },
  data() {
    const showBtnArr = {
      orderReceiving: [10, 20, 30, 70, 40, 50, 63],
      operationReceiving: [20, 30, 70, 40, 50, 63],
      warehouseReceiving: [20, 30, 70, 40, 50, 63],
    }[this.viewDetailsSource];
    const leftTitleConfig=titConfig({viewDetailsSource:this.viewDetailsSource})
    return {
      leftTitleConfig,
      cardConfig,
      showBtnArr, //区分订单/操作单/入仓单的应收应付TAB按钮
      initInfo: {},
      tabs: tabsConfig,
      goodsTable: {
        columnConfig: goodsTableColumns,
        grossTotal,
      },
      warehouseConfig: {
        labelWidth: "92px",
        // isAttachFileId: true,
      },
      warehouseHeadConfig: {
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "142px" : "92px",
        lists: warehouseHeadCols(),
      },
      activities: {
        title: this.overseaLangObj.logistics_trajectory || "物流轨迹",
      },
      isInitRes: false,
      pageTypeObj: {
        orderReceiving: "2", // 订单
        operationReceiving: "1", // 操作单
        warehouseReceiving: "0", // 仓库
      },
      titTypeObj: {
        orderReceiving: "订单信息",
        operationReceiving: "操作信息",
        warehouseReceiving: "海外仓",
      },
    };
  },
  created() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getInitData() {
      const { id,active=30 } = this.$route.query;
      if (!id) {
        this.reBack();
        return;
      }
      this["dictionary/getDictionary"]("predictionManage").then(() => {
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
        this.tabs.active = 30;
      }
    },
    getDetails() {
      const { isPerformance, isWms, id } = this.$route.query;
      this.activities.id = id; //操作单id
      this.isInitRes = false;
      let reqs = {
        details: isPerformance
          ? getPerformancePageDetails
          : isWms
          ? getWmsOrderDetails
          : getThirdPartyOrderDetails,
        // sku: isPerformance
        //   ? getPerformancePageSkuList
        //   : getThirdPartyOrderGetBox,
      };
      reqs.details(id).then((res) => {
        // console.log("details", res.data);
        const { id, orderType, orderState, orderSn, attachList } = res.data;
        this.initInfo = {
          ...res.data,
          webOrderSource: this.pageTypeObj[this.viewDetailsSource],
          warehousingSource: this.typeConversion(res.data.warehousingSource),
        };
        this.changeCostRequest();
        this.warehouseConfig = {
          ...this.warehouseConfig,
          formModel: {
            ...this.initInfo,
          },
          lists: warehouseTypeCols(this.viewDetailsSource),
          afterMounted: () => {
            if (orderState === 6) {
              // 退回
              this.reBack();
              return;
            }
            this.$refs.comAttachRef?.setFileList(attachList || []); // 附件信息
            getThirdPartyOrderGetBox({ orderSn }).then((sRes) => {
              this.$refs.goodsRef?.setNewTableData(sRes?.data || []);
            });
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
          this.viewDetailsSource == "warehouseReceiving"
            ? warehouseComId
            : operationMain,
        businessType: 20,
      };
      getHeaderTotalBill(params).then((res) => {
        const { data = {} } = res;
        this.initInfo = {
          ...this.initInfo,
          ...data,
        };
      });
    },
    handleRefreshPage() {
      this.getDetails();
      // this.$refs.myLogistTrack?.changeActivities();
    },
    handleEdit() {},
    tabsColumns() {
      const { isBox, isSku, orderState } = this.initInfo;
      let filterTabs = [];
      if ([0, 1, 11].includes(orderState)) {
        filterTabs.push(...[40]);
      }
      let columns = this.tabs.columns.filter((e) => {
        if (e.isBox) {
          return isBox;
        } else if (e.isSku) {
          return isSku;
        } else {
          return true;
        }
      });
      return columns.filter((e) => !filterTabs.includes(e.key));
    },
    /** 操作单详情事件 */
    handleOperateRemark() {},
    /** 仓库详情事件 */
    handleWarehouseRemark() {},
  },
  computed: {
    isWarehouseApiId() {
      // 海外仓入库 有apiId隐藏相关节点操作
      return (
        this.viewDetailsSource === "warehouseReceiving" && !!this.initInfo.apiId
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.details {
  background: #f9f9f9;
  padding: 11px 0 20px;

  /deep/ {
    .basic-info .el-form-item {
      margin-bottom: 0;
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
      .content-show {
        :not(:first-child) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }
      }
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
      margin: 10px 0;

      .title {
        font-size: 14px;
        color: #515151;
        font-weight: bold;
      }
    }
  }

  .content-box {
    min-height: calc(100vh - 76px);
    margin: 10px;
    background: #fff;
    margin-bottom: 76px;

    .edit-form {
      margin-top: 15px;
      padding: 0 20px;
    }

    .detail-card {
      display: flex;
      justify-content: space-between;
      margin-bottom: 14px;

      & > div {
        display: flex;
        flex: 1;
        align-items: center;
        padding: 19px 12px;
        margin-right: 13px;

        .iconfont {
          font-size: 35px;
          margin-right: 10px;
        }

        .label {
          font-size: 12px;
          margin-bottom: 6px;
        }

        .value {
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      & > div:nth-of-type(1),
      & > div:nth-of-type(3),
      & > div:nth-of-type(4) {
        flex: 1;
      }

      .card-addr {
        flex: 1;
        font-size: 15px;

        .value {
          display: flex;
          width: 100%;
          justify-content: flex-start;
          align-items: center;
          font-size: 16px;
          font-weight: 500;
        }

        .line {
          width: 21px;
          height: 1px;
          border-bottom: 1px #5094ff dashed;
          margin: 0 5px;
        }
      }

      .order-no {
        display: flex;
        flex-direction: column;

        .order-title,
        .order-label,
        .unit {
          font-size: 12px;
        }

        .order-title {
          margin-bottom: 5px;
        }

        .order-value {
          font-size: 15px;
          font-weight: bold;
        }
      }

      .order-label {
        font-size: 12px;
      }
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
      border-bottom: 1px solid #e2e2e2;

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
