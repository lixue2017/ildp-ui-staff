<template>
  <div class="operate-details" v-if="isInitRes">
    <div class="operate-content">
      <ComDetailTop
        :title="/* 海运详情 */ '操作单信息'"
        :formModel="initInfo"
        :config="topConfig"
        ref="detailTopRef"
        @handleClick="handleTopClick"
      >
        <template v-slot:subTitle>
          <span class="sub-title">
            {{ initInfo.customerName ? `(${initInfo.customerName})` : "" }}
          </span>
        </template>

        <template v-slot:titContentSlot>
          <TitPageJump
            :titSelectData="initInfo"
            @handleClick="handleTopClick"
          />
        </template>
      </ComDetailTop>
      <div class="flex">
        <div class="order-left">
          <div class="top-box">
            <ComCard
              :initInfo="{
                ...basicInfoConfig.formModel,
                //...initInfo,
                customsClearanceType: typeConversion(
                  initInfo.customsClearanceType
                ),
                viewSource: 'oceanShipping',
                cabinProxyName: initInfo.overseasAgencyName,
                headTransportMode: initInfo.headTransportMode,
                bookingSpaceProxyName:
                  initInfo.proxyType == 1
                    ? initInfo.sameIndustryProxyName
                    : initInfo.bookingSpaceProxyName,
              }"
              @handleSuccess="handleOperateSuccess"
            />

            <div class="custom-tabs-btn">
              <template v-for="tItem in tabColumns()">
                <el-button
                  size="small"
                  plain
                  :key="tItem.key"
                  @click="() => changeTabs(tItem.key)"
                  :type="tItem.key === tabs.active ? 'activation' : ''"
                  >{{ tItem.label }}</el-button
                >
              </template>
            </div>
          </div>
          <!-- 基本信息 -->
          <div v-show="tabs.active === 1">
            <ComForm
              class="basic-info"
              ref="basicInfoForm"
              :formConfig="basicInfoConfig"
            >
              <template v-slot:expansion="slotProps">
                <span
                  @click="showToggle(slotProps.fieldItem)"
                  class="base-flex-end primary-text-color cursorPointer"
                >
                  <span>
                    {{ slotProps.fieldItem.expansion ? "收缩" : "展开" }}
                  </span>
                  <i
                    :class="`${
                      slotProps.fieldItem.expansion
                        ? 'el-icon-arrow-up'
                        : 'el-icon-arrow-down'
                    } el-icon--right`"
                  ></i>
                </span>
              </template>

              <template v-slot:containerTrailer="{ formModel, dicsData }">
                <span
                  >{{ formModel.transactionWarehouseCode || "--" }}/{{
                    formModel.transactionWarehouseName || "--"
                  }}</span
                >
                <span class="tag-blue-color" v-if="dicsData.nameCn">{{
                  dicsData.nameCn
                }}</span>
              </template>

              <template v-slot:code="{ formModel }">
                <span
                  v-if="formModel.routeResData.code"
                  class="primary-text-btn"
                  @click="() => viewAirflightDetail(formModel.routeResData)"
                >
                  {{ formModel.routeResData.code }}
                </span>
                <span v-else>--</span>
              </template>
              <template v-slot:registerNo="{ formModel }">
                <span
                  v-if="formModel.sortBoxResData.registerNo"
                  class="primary-text-btn"
                  @click="
                    () => viewArgCabinetRegisterDetail(formModel.sortBoxResData)
                  "
                >
                  {{ formModel.sortBoxResData.registerNo }}
                </span>
                <span v-else>--</span>
              </template>
            </ComForm>
          </div>
          <!-- 货物信息 -->
          <div v-show="tabs.active === 2">
            <EcTableInfo
              v-if="
                initInfo.orderType == 2 //电商
              "
              ref="tableRef"
              :formModel="{
                ...basicInfoConfig.formModel,
                orderId: initInfo.orderId,
                operationOrderId: initInfo.id,
                orderType: initInfo.orderType,
                bailorPeople: initInfo.bailorPeople,
                createTime: initInfo.createTime,
                freightType: initInfo.freightType,
                invoiceStatus: initInfo.invoiceStatus,
                isInvoice: initInfo.isInvoice,
                kaIdList: initInfo.kaIdList,
              }"
              :showTable="[0, 1]"
              @tableList="handleVeryList"
            />
            <TableInfo
              v-if="
                initInfo.orderType == 3 //传统
              "
              ref="tableRef"
              :formModel="{
                ...basicInfoConfig.formModel,
                operationOrderId: initInfo.id,
                orderType: initInfo.orderType,
                orderId: initInfo.orderId,
                bailorPeople: initInfo.bailorPeople,
                createTime: initInfo.createTime,
                freightType: initInfo.freightType,
              }"
              :showTable="[0]"
              @tableList="handleVeryList"
              @handleTraditionGoods="
                () =>
                  handleOperateSuccess() /* 改变货物报关方式，需要更新节点 */
              "
            />
          </div>
          <!-- 拖车信息 -->
          <div v-if="tabs.active === 3">
            <operateTrailerInfo :operateId="initInfo.id" />
          </div>
          <!-- 清报关信息 -->
          <div
            v-if="
              tabs.active === 4 && customsConfig.formModel.isCustomsLoadShow
            "
          >
            <ComForm
              ref="customClear"
              class="custom-info"
              :formConfig="customsConfig"
            >
              <template v-slot:code="slotProps">
                <div v-if="slotProps.formModel.code">
                  <div
                    class="display-flex"
                    @click="handleCustomDetails(slotProps.formModel)"
                  >
                    <span class="primary-text-btn ellipsis-text">
                      {{ slotProps.formModel.code }}
                    </span>
                  </div>
                </div>
                <div v-else>--</div>
              </template>
              <template v-slot:exportType="slotProps">
                <div v-if="slotProps.formModel.id">
                  <span class="mark-icon green-mark">
                    {{ slotProps.dicsData.nameCn }}
                  </span>
                  <span class="mark-icon blue-mark">
                    {{ busTypeFind(slotProps.formModel.busType) }}
                  </span>
                </div>
                <div v-else>--</div>
              </template>

              <template v-slot:slotCustomsClearance>
                <!-- 清关信息 -->
                <customsClearanceDetails
                  detailType="operationOrderDetails"
                  :operateId="initInfo.id"
                />
              </template>
            </ComForm>
          </div>
          <!-- 提单信息 -->
          <div v-if="tabs.active === 5">
            <BLDetails
              ref="blDetailsRef"
              detailType="operationOrderDetails"
              :operateId="initInfo.id"
              :mblModel="{ orderType: initInfo.orderType }"
              :isMainBill="initInfo.orderType === 2 ? initInfo.isMainBill : 0"
              @handleSuccess="handleBLSuccess"
              @handleEditSuccess="handleBLSuccess"
            />
          </div>

          <!-- 账单信息 -->
          <template v-if="mixinDetailCacheTabList.includes(7)">
            <!-- 切换页签缓存编辑值 -->
            <CostInfo
              v-show="tabs.active === 7"
              ref="chargeTableRef"
              :formModel="initInfo"
              :paramObj="{
                businessType: '0,2',
              }"
              :extraData="{
                showTableNum: 12,
              }"
            />
          </template>
          <!-- 物流轨迹 -->
          <div v-if="tabs.active === 8">
            <ComLogistTrack
              ref="myLogistTrack"
              :paramObj="{
                operationOrderId: initInfo.id,
                orderNumId: initInfo.orderId,
                orderNumType: initInfo.orderType,
                operationOrderNum: initInfo.operationOrderNum,
                customerId: initInfo.customerId,
                salesmanId: initInfo.salesman,
                kaIdList: initInfo.kaIdList,
                webMailTag: 'operation_gj',
              }"
              :activities="{
                title: '物流轨迹',
                id: initInfo.id,
              }"
              :orderSourceObj="{ trackSource: 'operationDetails' }"
              isNoDrawer
              isShowSelect
              v-if="initInfo.customerId"
            >
            </ComLogistTrack>
          </div>

          <!-- 附件信息 -->
          <div v-if="tabs.active === 10">
            <ComAttachTable
              :paramObj="{
                operationOrderId: initInfo.id,
                orderNumId: initInfo.orderId,
                orderNumType: initInfo.orderType,
                operationOrderNum: initInfo.operationOrderNum,
                hideTitBtn: true,
              }"
              :uploadFileModel="
                operationalInsuranceFile({
                  operationOrderId: initInfo.id,
                })
              "
            />
          </div>
          <!-- 操作记录 -->
          <div v-if="tabs.active === 11">
            <OperationRecords
              :id="initInfo.id || 0"
              :params="{
                orderId: initInfo.orderId,
                orderType: initInfo.orderType,
              }"
            />
          </div>
        </div>
        <div class="order-right">
          <ComOperate
            ref="operateDetail"
            :listData="{
              ...veryList,
              customInfo: customsConfig.formModel,
            }"
            :basicData="{
              ...basicInfoConfig.formModel,
              orderId: initInfo.orderId,
              operationOrderId: initInfo.id,
              isBookingSpace: initInfo.isBookingSpace,
            }"
            :orderStatus="initInfo.operationOrderStatus"
            :isExtendOrder="true"
            @handleSuccess="handleOperateSuccess"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  tabsConfig,
  eCommerceOperate,
  cardConfig,
  customsConfig,
} from "./model";
import { mapActions, mapState } from "vuex";
import commonMixin from "@/utils/mixin";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import mixinOperationDetail from "../../components/mixinOperationDetail";
import { getrouteNoByoperationId } from "@/api/marketManage/airline";
import { getOperationDetailExtend } from "@/api/operateManage/common";
import { getCustomInfo } from "@/api/operateManage/details.js";
import { BUS_TYPE } from "@/utils/mixin";

export default {
  name: "SeaTransDetails",
  mixins: [commonMixin, mixinOperationDetail, mixinEditCache],
  components: {
    ComLogistTrack: () => import("_comp/ComLogistTrack"),
    EcTableInfo: () => import("@/views/operateManage/components/EcTableInfo"),
    TableInfo: () => import("@/views/operateManage/components/TableInfo"),
    ComCard: () =>
      import("@/views/operateManage/components/CardOrder/index.vue"),
    BLDetails: () =>
      import(
        "@/views/operateManage/operateRecord/BOLManage/components/BLdetail/index.vue"
      ),
    CostInfo: () => import("_comp/CostInfo"),
    customsClearanceDetails: () =>
      import(
        "@/views/operateManage/operateRecord/customsClearance/components/detailInfo.vue"
      ), // 清关详情
    operateTrailerInfo: () =>
      import("@/views/operateManage/components/TrailerInfo/index.vue"), // 拖车信息
    OperationRecords: () =>
      import("@/views/newOrderManage/components/OperationRecords/index.vue"),
  },
  data() {
    return {
      initInfo: {},
      cardConfig,
      tabs: tabsConfig,
      basicInfoConfig: {
        formModel: {},
        labelWidth: "93px",
        visibleAll: true,
        isAttachFileId: true,
        lists: [], // 展开/收缩初始值
      },
      customsConfig: {
        formModel: {},
        visibleAll: true,
        lists: customsConfig.lists,
        labelWidth: "105px",
      },
      veryList: {},
      selectionRows: [], //对账管理中所选择的对账信息
      isInitRes: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("operateDetails");
  },
  methods: {
    ...mapActions(["dictionary/getDictionary", "tagsView/delView"]),
    getDetails(id, type) {
      this.isInitRes = false;
      this.basicInfoConfig.formModel = {};
      this.customsConfig.formModel = {};
      this.mixinDetailCacheTabList = []; // 重置
      getOperationDetailExtend(id).then(async (res) => {
        const {
          operationCreateBy,
          operationCreateTime,
          realFreightVolume,
          realFreightWeight,
          ...data
        } = res.data;
        if (data.isMainBill !== 5 || data.orderType === 2) {
          let { query } = this.$route;
          let path = "/operateManage/seaTransDetails";
          if (data.orderType === 2) {
            query.pageSign = "";
            path = "/operateManage/ecOperateDetails";
          }
          this["tagsView/delView"](this.$route).then(() => {
            // 返回时关闭当前页面，防止反复保存
            this.$router.replace({
              path,
              query,
            });
          });
          return;
        }
        data.createBy = operationCreateBy;
        data.createTime = operationCreateTime;
        data.billingWeight = realFreightWeight;
        data.billingVolume = realFreightVolume;

        const {
          airLineId,
          // sortBoxId,
          // orderId,
          // operationOrderNum,
          orderType,
          id: operateId,
        } = data;

        const [resRoute] = await Promise.all([
          !!airLineId ? getrouteNoByoperationId(operateId) : undefined, // 航次
        ]);

        const routeData = resRoute?.data || {};

        this.basicInfoConfig.lists = eCommerceOperate({
          orderType,
          routeDataId: routeData.id,
        });
        this.initInfo = data;

        this.veryList = {
          ...this.veryList,
          operateDetail: data,
          airflight: routeData,
        };

        if (data.customsClearanceId) {
          data.customsClearanceId = data.customsClearanceId
            .split(",")
            .map((item) => +item);
        } else {
          data.customsClearanceId = [];
        }
        data.pickUpHome = !!data.pickUpHome;
        data.isHomeDelivery = !!data.isHomeDelivery;
        data.freightType = data.freightType || "1";

        const models = {
          ...data,
          putWarehouseTime: data.warehousingTime,
          declareCurrencyName: data.currency,
          orderRemark: data.remark,
          shipper: data.cusConsigner,
          consignee: data.cusConsignee,
          notifier: data.cusNotifier,
          encasementWay: data.freightType,
          routeOrderAttachList: routeData.attachList, // 航次订舱资料
          routeName: routeData?.name,
          routeResData: {
            ...routeData,
            routeOrderCodeName: `${routeData.routeCode || "--"}[${
              routeData.routeName || "--"
            }]`,
          },
        };

        this.basicInfoConfig.formModel = models;

        this.basicInfoConfig.afterMounted = () => {
          this.initAfterLoad(operateId);
        };

        this.mixinDetailCacheTabList = [this.tabs.active];

        this.isInitRes = true;
      });
    },
    initAfterLoad(oId) {
      Promise.all([getCustomInfo({ operationOrderId: oId })]).then(
        ([customInfo]) => {
          this.$refs.operateDetail?.getData(oId);

          // 清报关信息
          this.customsConfig.formModel = {
            ...customInfo.data,
            isCustomsLoadShow: true,
          };
        }
      );
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleTopClick({ type, id }) {
      if (["pre", "next", "titJump"].includes(type)) {
        // this.tabs.active = 1;
        this.getDetails(id);
      }
    },
    mixinInitData(cacheObj = {}) {
      if (!cacheObj.goRefreshBackPage) {
        this.tabs.active = 1;
      }
      const { id } = this.$route.query;
      if (!id) {
        this.reBack();
        return;
      }
      this.getDetails(id);
    },
    changeTabs(key) {
      // console.log("key", key);
      this.tabs.active = key;
      this.mixinDetailCacheTabList.push(key);
    },
    showToggle(item) {
      item.expansion = !item.expansion;
      this.basicInfoConfig.lists[0].fieldList[item.changeIndex].className =
        item.expansion ? "expansion-show" : "expansion-hide";
    },
    getMarkIconColor(dics) {
      return dics && dics.color;
    },
    // 核实数据回调
    handleVeryList(data) {
      this.veryList = {
        ...this.veryList,
        ...data,
      };
    },
    // 报关类型
    busTypeFind(val) {
      const obj = BUS_TYPE.find((e) => e.value == val) || {};
      return obj.label || "--";
    },
    handleOperateSuccess() {
      const { id } = this.$route.query;
      this.getDetails(id);
      this.$refs.myLogistTrack?.changeActivities();
    },
    viewAirflightDetail(row) {
      this.$router.push({
        path: "/marketManage/airlineFlightDetails",
        query: {
          id: row.id,
          backPath: this.$route.fullPath,
        },
      });
    },
    viewArgCabinetRegisterDetail(row) {
      this.$router.push({
        path: "/projectContainer/cabinetInfo",
        query: {
          id: row.id,
          backPath: this.$route.fullPath,
        },
      });
    },
    tabColumns() {
      let filterTabs = [12, 13];
      if (!this.initInfo.containerTrailerShow) {
        // 非整柜不显示拖车 0-FCL整柜 1-LCL散货
        // 4253-有拖车节点显示拖车信息 trailerShow - 一般拖车
        filterTabs.push(3);
        if (this.tabs.active == 3) {
          this.tabs.active = 1;
        }
      }
      return this.tabs.columns.filter((e) => !filterTabs.includes(e.key));
    },
    handleBLSuccess() {
      this.$refs.tableRef?.handleUpdateView();
      this.$refs.operateDetail.getData(this.initInfo.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.operate-details {
  background: #f9f9f9;
  /deep/ {
    .el-upload-list {
      margin-top: -3px;
    }
    .form-rows-box {
      padding: 14px 0;
      border-bottom: 1px solid #e2e2e2;
    }
    .form-rows-bottom-border {
      padding-bottom: 14px;
      border-bottom: 1px solid #e2e2e2;
    }
    .form-rows-expansion-top {
      padding-top: 14px;
    }
    .expansion-show {
      display: block;
    }
    .expansion-hide {
      display: none;
    }
    .tab-field-rows-box {
      padding: 14px 0;
    }
    .mark-icon {
      border-radius: 12px;
      padding: 2px 11px;
      font-size: 12px;
      margin-right: 5px;
      border: 1px solid #66a5ff;
      color: #66a5ff;
    }
    .blue-mark {
      border: 1px solid #66a5ff;
      color: #66a5ff;
    }
    .green-mark {
      border: 1px solid #35d06f;
      color: #35d06f;
    }
  }
  // content
  .operate-content {
    min-height: calc(100vh - 108px);
    margin: 10px;
    background: #fff;
    .flex {
      display: flex;
      .order-left {
        min-width: 900px;
        flex: 0 1 100%;
        padding: 0 20px 114px;

        /deep/ .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
