<template>
  <div class="operate-details" v-if="isInitRes">
    <div class="operate-content">
      <ComDetailTop
        :title="/* 电商详情 */ '电商操作单信息'"
        :formModel="initInfo"
        :titConfig="cLeftTopConfig"
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
            :titSelectData="{
              ...initInfo,
              viewTempSource: 'ec_temp_jump',
            }"
            @handleClick="handleTopClick"
          />
        </template>
      </ComDetailTop>
      <div class="flex">
        <div class="order-left">
          <div class="top-box">
            <ComCard
              :initInfo="{
                ...initInfo,
                viewSource: ['oceanShipping', 'airTransport'][
                  initInfo.operationOrderType
                ],
                cabinProxyName: initInfo.overseasAgencyName,
                bookingSpaceProxyName:
                  initInfo.proxyType == '1'
                    ? initInfo.sameIndustryProxyName
                    : initInfo.bookingSpaceProxyName,
              }"
              @handleSuccess="
                () => {
                  initInfo.operationOrderType === 0 && handleOperateSuccess();
                }
              "
              @handleSplitOrderSuccess="
                () => {
                  initInfo.operationOrderType === 0 &&
                    handleSplitOrderSuccess();
                }
              "
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
              @handleChange="handleBasicChange"
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
          <div v-if="tabs.active === 2">
            <EcTableInfo
              ref="tableRef"
              :formModel="{
                ...basicInfoConfig.formModel,
                orderId: initInfo.orderId,
                operationOrderId: initInfo.id,
                orderType: initInfo.orderType,
                bailorPeople: initInfo.bailorPeople,
                createTime: initInfo.operationCreateTime,
                freightType: initInfo.freightType,
                encasementWay: +initInfo.freightType,
                invoiceStatus: initInfo.invoiceStatus,
                isInvoice: initInfo.isInvoice,
                kaIdList: initInfo.kaIdList,
                canEditInvoice: initInfo.canEditInvoice, // 客户箱单发票-按钮是否显示
                canInvoiceList: initInfo.canInvoiceList, // 客户箱单发票-列表是否显示
                isMainBill: initInfo.isMainBill, // 订单类型 1“拼柜主单”，2“自拼主单”，3“已拆单”，5/7/9“原/主单号
              }"
              :showTable="
                initInfo.isMainBill === 5
                  ? [0, 1]
                  : initInfo.isMainBill === 7
                  ? [5, 1]
                  : [0, 1, 2, 3, 4, 5]
              "
              @tableList="handleVeryList"
            />
          </div>
          <!-- 拖车信息 -->
          <div v-if="tabs.active === 3">
            <operateTrailerInfo :operateId="initInfo.id" />
          </div>
          <!-- 清报关信息 -->
          <div v-if="tabs.active === 4">
            <customsClearanceDeclaration
              :formData="initInfo"
              @handleSuccess="handleCustomsOperateSuccess"
            />
            <!-- <ComForm ref="customClear" :formConfig="customsConfig">
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
                    {{ slotProps.dicsData.nameCn || "--" }}
                  </span>
                  <span class="mark-icon">
                    {{ busTypeFind(slotProps.formModel.busType) }}
                  </span>
                </div>
                <div v-else>--</div>
              </template>
              <template v-slot:slotCustomsClearance>
                <customsClearanceDetails
                  detailType="operationOrderDetails"
                  :operateId="initInfo.id"
                />
              </template>
            </ComForm> -->
          </div>
          <!-- 提单信息 -->
          <div v-if="tabs.active === 5">
            <BLDetails
              ref="blDetailsRef"
              detailType="operationOrderDetails"
              :operateId="initInfo.id"
              :showMblTab="initInfo.isMainBill === 5 ? false : tabsActive == 5"
              :mblModel="{
                orderType: initInfo.orderType,
              }"
              :isMainBill="initInfo.isMainBill"
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
              :formModel="{
                ...initInfo,
                webViewSource: 'ecTradOther',
              }"
              :paramObj="{
                businessType: '0,2',
              }"
              :extraData="{
                showTableNum: 12,
                billingMain: initInfo.operateMain,
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
            />
          </div>

          <!-- 附件信息 -->
          <div v-if="tabs.active === 10">
            <FileUploadTable
              :uploadTableConfig="{
                ...handleFileRequestCollection(),
              }"
            />
            <!-- <ComAttachTable
              :paramObj="{
                operationOrderId: initInfo.id,
                orderNumId: initInfo.orderId,
                orderNumType: initInfo.orderType,
                operationOrderNum: initInfo.operationOrderNum,
                hideTitBtn:
                  initInfo.isMainBill === 5 || !initInfo.canUploadFile,
              }"
              :uploadFileModel="
                operationalInsuranceFile({
                  operationOrderId: initInfo.id,
                })
              "
            /> -->
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
          <template v-if="tabs.active === 12">
            <VehiclesTable
              :formData="{
                orderId: initInfo.orderId,
                orderType: initInfo.orderType,
              }"
            />
          </template>
          <template v-if="tabs.active === 13">
            <SuborderTable
              :formModel="{
                ...initInfo,
                operationOrderId: initInfo.id,
              }"
              @cancelSplitOrderSuccess="cancelSplitOrderSuccess"
            />
          </template>
        </div>
        <div class="order-right" v-if="initInfo.isMainBill !== 7">
          <ComOperate
            ref="operateDetail"
            :listData="{
              ...veryList,
              viewBarSource: 'ec_operation_details',
            }"
            :basicData="{
              ...basicInfoConfig.formModel,
              operationOrderId: initInfo.id,
              orderId: initInfo.orderId,
              isBookingSpace: initInfo.isBookingSpace,
              operationRemark: initInfo.operationRemark,
            }"
            :isExtendOrder="initInfo.isMainBill === 5"
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
  // customsConfig,
} from "./model";
import { mapActions, mapState } from "vuex";
import commonMixin from "@/utils/mixin";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import mixinOperationDetail from "../../components/mixinOperationDetail";
import { getECDetail } from "@/api/order/firstTransport.js";
import { getrouteNoByoperationId, editHblNo } from "@/api/marketManage/airline";
import {
  getTakeOrders,
  getOperationDetailExtend,
} from "@/api/operateManage/common";
import { getBoxSortByOperationId } from "@/api/container/arrange.js";
import { getCustomInfo } from "@/api/operateManage/details.js";
import { BUS_TYPE } from "@/utils/mixin";
import { updateAttachListByOrderIdNew, getOrderAttachList } from "@/api/common";
export default {
  // name: "EcOperateDetails",
  mixins: [commonMixin, mixinOperationDetail, mixinEditCache],
  components: {
    ComLogistTrack: () => import("_comp/ComLogistTrack"),
    EcTableInfo: () => import("@/views/operateManage/components/EcTableInfo"),
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
    customsClearanceDeclaration: () =>
      import("../components/ClearCustomsTable"), // 清报关详情
    operateTrailerInfo: () =>
      import("@/views/operateManage/components/TrailerInfo/index.vue"), // 拖车信息
    OperationRecords: () =>
      import("@/views/newOrderManage/components/OperationRecords/index.vue"),
    SuborderTable: () =>
      import("@/views/operateManage/components/SuborderTable/index.vue"), // 子单信息
  },
  provide() {
    return {
      PROVIDECURRFILTER:true,
    };
  },
  data() {
    return {
      initInfo: {},
      cardConfig,
      tabs: tabsConfig,
      basicInfoConfig: {
        formModel: {},
        labelWidth: "93px",
        isAttachFileId: true,
        lists: [], // 展开/收缩初始值
      },
      // customsConfig: {
      //   formModel: {},
      //   lists: customsConfig.lists,
      //   labelWidth: "105px",
      // },
      veryList: {},
      isInitRes: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("operateDetails");
  },
  methods: {
    ...mapActions(["dictionary/getDictionary", "tagsView/delView"]),
    getDetails(id) {
      this.isInitRes = false;
      this.basicInfoConfig.formModel = {};
      this.mixinDetailCacheTabList = []; // 重置
      getOperationDetailExtend(id).then(async (res) => {
        const {
          orderId,
          operationOrderNum,
          isMainBill,
          id: operateId,
          startPortName,
          endPortName,
          countryName,
          containerTrailer,
          isConceal,
          wholeCabinetSn,
          insureNo,
          airLineId,
          sortBoxId,
          operationOrderType,
        } = res.data;
        // if (isMainBill === 5) {
        //   const { query } = this.$route;
        //   const path = "/operateManage/ecOperateExtendDetails"; // 子单
        //   this["tagsView/delView"](this.$route).then(() => {
        //     // 返回时关闭当前页面，防止反复保存
        //     this.$router.replace({
        //       path,
        //       query,
        //     });
        //   });
        //   return;
        // }
        const [resOrder, resRoute, resSortBox] = await Promise.all([
          isMainBill !== 5 && !!orderId ? getECDetail(orderId) : undefined, // 电商订单基础数据 (子单无订单ID)
          !!airLineId ? getrouteNoByoperationId(operateId) : undefined, // 航次
          !!sortBoxId ? getBoxSortByOperationId(operateId) : undefined, // 排柜
        ]);
        const orderResData = resOrder?.data || {};
        const routeData = resRoute?.data || {};
        const sortBoxData = resSortBox?.data || {};

        this.basicInfoConfig.lists = eCommerceOperate({
          operationOrderType,
          routeDataId: routeData.id,
          sortBoxDataId: sortBoxData.id,
        });

        this.initInfo = res.data;

        this.veryList = {
          ...this.veryList,
          operateDetail: res.data,
          // basicInfo: orderResData,
          airflight: routeData,
          // argCabinet: sortBoxData,
        };

        let models = res.data || {};

        if (isMainBill !== 5 && !!orderId) {
          models = {
            ...orderResData,
            startPortName,
            endPortName,
            countryName,
            containerTrailer,
            orderRemark: orderResData.remark,
            operationOrderNum, //操作单号
            isMainBill,
            isConceal,
            wholeCabinetSn,
            insureNo,
          };
        }

        if (models.customsClearanceId) {
          models.customsClearanceId = models.customsClearanceId
            .split(",")
            .map((item) => +item);
        } else {
          models.customsClearanceId = [];
        }
        models.pickUpHome = !!models.pickUpHome;
        models.isHomeDelivery = !!models.isHomeDelivery;
        models.freightType = this.typeConversion(models.freightType) || "1";

        if (operationOrderType === 1) {
          models.web_route_hblNo = routeData.hblNo; // 空运分单号
        }

        this.basicInfoConfig.formModel = {
          ...models,
          routeOrderAttachList: routeData.attachList, // 航次订舱资料
          routeResData: {
            ...routeData,
            routeOrderCodeName: `${routeData.routeCode || "--"}[${
              routeData.routeName || "--"
            }]`,
          },
          sortBoxResData: sortBoxData,
        };

        this.mixinDetailCacheTabList = [this.tabs.active];

        this.basicInfoConfig.afterMounted = () => {
          if (this.tabs.active == 4) {
            this.initDeclareAfterLoad();
          }
          setTimeout(() => {
            // 业务节点信息
            this.$refs.operateDetail?.getData(operateId);
          }, 100);
        };
        this.isInitRes = true;
      });
    },
    initDeclareAfterLoad() {
      // 清报关信息
      // this.customsConfig.formModel = {};
      // getCustomInfo({ operationOrderId: this.initInfo.id }).then((dRes) => {
      //   this.customsConfig.formModel = {
      //     ...dRes.data,
      //     isCustomsLoadShow: true,
      //   };
      // });
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleTopClick({ type, id }) {
      if (["pre", "next", "titJump"].includes(type)) {
        this.getDetails(id);
      }
    },
    mixinInitData(cacheObj = {}) {
      if (!cacheObj.goRefreshBackPage) {
        this.tabs.active = 1;
      }
      const { id, active } = this.$route.query;
      if (!id) {
        this.reBack();
        return;
      }
      if (active) {
        this.tabs.active = Number(active);
      }
      this.getDetails(id);
    },
    changeTabs(key) {
      // console.log("key", key);
      this.tabs.active = key;
      this.mixinDetailCacheTabList.push(key);
      if (key === 4) {
        this.initDeclareAfterLoad();
      }
    },
    showToggle(item) {
      item.expansion = !item.expansion;
      this.basicInfoConfig.lists[0].fieldList[item.changeIndex].className =
        item.expansion ? "expansion-show" : "expansion-hide";
    },
    handleBasicChange(val, k) {
      if (k === "web_route_hblNo") {
        const { id } = this.basicInfoConfig.formModel.routeResData;
        editHblNo({ id, hblNo: val || "" }).then(() => {
          this.msgSuccess("分单号更新成功");
        });
      }
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
    handleCustomsOperateSuccess() {
      const { logisticsList } = this.$refs.operateDetail || {};
      const bgObj = (logisticsList || []).find((e) => e.nodeId === 18) || {}; // 报关
      const zlObj = (bgObj.smallNodeList || []).find((e) => e.nodeId === 114); // 资料收集
      if (zlObj && zlObj.state !== 3) {
        // 更新报关资料节点
        this.$refs.operateDetail?.getData(this.initInfo.id, true);
      }
    },
    handleOperateSuccess() {
      const { id } = this.$route.query;
      this.getDetails(id);
      this.$refs.myLogistTrack && this.$refs.myLogistTrack.changeActivities();
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
      const { relevanceId, isMainBill, operationOrderType } = this.initInfo;
      let filterTabs = [];
      if (isMainBill === 5) {
        // 5-系统接单新生成的子单
        filterTabs = [12, 13];
      }
      if (operationOrderType === 1) {
        // 空运
        filterTabs.push(...[3, 13]);
      } else {
        if (isMainBill === 7) {
          // 海运 [2, 4, 5, 11]子单显示tab；isMainBill：7为子单
          if (![2, 4, 5, 11].includes(this.tabs.active)) {
            this.tabs.active = 2;
          }
          return this.tabs.columns.filter((e) => [2, 4, 5, 11].includes(e.key)); // [2, 4, 5, 11]子单显示tab
        }

        if (!this.initInfo.containerTrailerShow) {
          // 集装箱拖车  trailerShow - 一般拖车
          filterTabs.push(3);
        }
        if (![1, 2, 3].includes(isMainBill)) {
          // 1-拼柜主单 2-自拼主单 3-已拆柜主单
          filterTabs.push(13);
        }
      }
      if (filterTabs.includes(this.tabs.active)) {
        this.tabs.active = 1;
      }
      return this.tabs.columns.filter((e) => !filterTabs.includes(e.key));
    },
    handleBLSuccess() {
      this.$refs.tableRef?.handleUpdateView();
      this.$refs.operateDetail?.getData(this.initInfo.id);
    },
    handleSplitOrderSuccess() {
      this.initInfo.isMainBill = 3;
      setTimeout(() => {
        this.$nextTick(() => {
          this.changeTabs(13);
        });
      });
    },
    cancelSplitOrderSuccess() {
      this.initInfo.isMainBill = 0;
      setTimeout(() => {
        this.$nextTick(() => {
          this.changeTabs(1);
        });
      });
    },
    handleFileRequestCollection() {
      const { id, orderId, orderType } = this.initInfo;
      return {
        isAttachIdGetList: false,
        isGetUploadFileTypes: true,
        onGetFileType: "CZD",
        httpGetFileRequest: ({ explains }) => {
          //初始化附件
          return getOrderAttachList({
            orderId,
            orderType,
            operationOrderId: id,
            queryType: !!orderId ? 2 : 3,
            queryTypeList: explains,
          });
        },
        httpSaveFileRequest: ({ attachId }) => {
          return this.handleUpdateAttach(attachId);
        },
        httpDelFileRequest: ({ attachAllList, deleteAttachIdList }) => {
          return this.handleUpdateAttach(
            attachAllList.join(","),
            deleteAttachIdList
          );
        },
      };
    },
    handleUpdateAttach(attachIds, attachDeleteIds = []) {
      return updateAttachListByOrderIdNew([
        {
          attachDeleteIds,
          attachIds,
          orderId: this.initInfo.id,
          orderType: 1, // 1-操作单
          queryType: 3,
        },
      ]);
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
