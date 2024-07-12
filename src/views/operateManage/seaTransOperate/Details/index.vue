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
            {{
              initInfo.customerShortName
                ? `(${initInfo.customerShortName})`
                : ""
            }}
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
              v-if="basicInfoConfig.formModel.id"
              :initInfo="{
                ...basicInfoConfig.formModel,
                ...initInfo,
                customsClearanceType: typeConversion(
                  veryList.basicInfo.customsClearanceType
                ),
                headTransportModeName: veryList.basicInfo.headTransportModeName,
                outWarehouseWayName: veryList.basicInfo.outWarehouseWayName,
                viewSource: 'oceanShipping',
                bookingSpaceProxyName:
                  initInfo.proxyType == '1'
                    ? initInfo.sameIndustryProxyName
                    : initInfo.bookingSpaceProxyName,
              }"
              @handleSuccess="handleOperateSuccess"
              @handleSplitOrderSuccess="handleSplitOrderSuccess"
            />

            <div class="tabs">
              <template v-for="item in tabColumns()">
                <el-button
                  size="small"
                  plain
                  :key="item.key"
                  class="tabs-change"
                  :type="item.key === tabs.active ? 'activation' : ''"
                  @click="changeTabs(item.key)"
                  v-if="!item.showType || item.showType === initInfo.orderType"
                >
                  {{ item.label }}
                </el-button>
              </template>
            </div>
          </div>
          <!-- 基本信息 -->
          <div v-show="tabs.active === 1">
            <ComForm
              class="basic-info"
              ref="basicInfoForm"
              :formConfig="basicInfoConfig"
              v-if="basicInfoConfig.formModel.id"
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
            <template v-if="initInfo.orderType == 2 ? tabs.active === 2 : true">
              <EcTableInfo
                v-if="
                  initInfo.orderType == 2 &&
                  Object.keys(basicInfoConfig.formModel).length //电商
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
                  canEditInvoice: initInfo.canEditInvoice, // 客户箱单发票-按钮是否显示
                  canInvoiceList: initInfo.canInvoiceList, // 客户箱单发票-列表是否显示
                  isMainBill: initInfo.isMainBill, // 订单类型 1“拼柜主单”，2“自拼主单”，3“已拆单”，5/7/9“原/主单号
                }"
                :showTable="
                  initInfo.isMainBill === 7 ? [5, 1] : [0, 1, 2, 3, 4, 5]
                "
                @tableList="handleVeryList"
              />
              <TableInfo
                v-if="
                  initInfo.orderType == 3 &&
                  Object.keys(basicInfoConfig.formModel).length //传统
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
                @tableList="handleVeryList"
                @handleTraditionGoods="
                  () =>
                    handleOperateSuccess() /* 改变货物报关方式，需要更新节点 */
                "
              />
            </template>
          </div>
          <!-- 拖车信息 -->
          <div v-if="tabs.active === 3">
            <operateTrailerInfo :operateId="initInfo.id" />
          </div>
          <!-- 清报关信息 -->
          <div v-if="tabs.active === 4">
            <ComForm
              ref="customClear"
              class="custom-info"
              :formConfig="customsConfig"
              v-if="customsConfig.formModel.operateId"
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
              <template v-slot:accessory>
                <ComUpload
                  :uploadConfig="customsConfig.uploadConfig"
                  v-if="customsConfig.uploadConfig.fileList.length"
                >
                </ComUpload>
                <span v-else>--</span>
              </template>
              <template v-slot:slotCustomsClearance>
                <!-- 清关信息 -->
                <customsClearanceDetails
                  v-if="customsConfig.formModel.operateId"
                  detailType="operationOrderDetails"
                  :operateId="customsConfig.formModel.operateId"
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
              :showMblTab="tabsActive == 5"
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
              :activities="activities"
              :orderSourceObj="{ trackSource: 'operationDetails' }"
              isNoDrawer
              isShowSelect
              v-if="activities.id && initInfo.customerId"
            >
            </ComLogistTrack>
          </div>

          <!-- 附件信息 -->
          <div v-if="tabs.active === 10 && uploadTableConfig.show">
            <FileUploadTable
              ref="uploadTypeRef"
              :uploadTableConfig="uploadTableConfig"
              :uploadFileTableConfig="uploadFileTableConfig"
            />
            <!-- <ComAttachTable
              :paramObj="{
                operationOrderId: initInfo.id,
                orderNumId: initInfo.orderId,
                orderNumType: initInfo.orderType,
                operationOrderNum: initInfo.operationOrderNum,
                hideTitBtn: !(
                  initInfo.orderType === 2 && initInfo.canUploadFile
                ),
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
            v-if="veryList.operateDetail"
            :listData="{ ...veryList, viewBarSource: 'ec_operation_details' }"
            :basicData="{
              ...basicInfoConfig.formModel,
              operationOrderId: initInfo.id,
              orderId: initInfo.orderId,
              isBookingSpace: initInfo.isBookingSpace,
            }"
            :orderStatus="initInfo.operationOrderStatus"
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
import { defaultTextParams } from "_comp/ComUpload/model";
import { mapActions, mapState } from "vuex";
import commonMixin from "@/utils/mixin";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import mixinOperationDetail from "../../components/mixinOperationDetail";
import { getSeaTraditionDetail } from "@/api/trandition/oceanModel";
import { getECDetail } from "@/api/order/firstTransport.js";
import { getrouteNoByoperationId } from "@/api/marketManage/airline";
import { getTakeOrders } from "@/api/operateManage/common";
import { getBoxSortByOperationId } from "@/api/container/arrange.js";
import { getCustomInfo } from "@/api/operateManage/details.js";
import { BUS_TYPE } from "@/utils/mixin";
import {
  getOrderAttachList,
  updateAttachListByOrderIdNew,
} from "@/api/common.js";
export default {
  // name: "SeaTransDetails",
  mixins: [commonMixin, mixinOperationDetail, mixinEditCache],
  components: {
    ComUpload: () => import("_comp/ComUpload"),
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
    SuborderTable: () =>
      import("@/views/operateManage/components/SuborderTable/index.vue"), // 子单信息
  },
  provide() {
    return {
      PROVIDECURRFILTER:true,
    };
  },
  data() {
    const accessoryConfig = {
      ...defaultTextParams,
      fileList: [],
      disabled: true,
    };
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
        uploadConfig: {
          ...accessoryConfig,
        },
        clearUploadConfig: {
          ...accessoryConfig,
        },
      },
      orderTypeList: [
        {
          color: "#35D06F",
          nameCn: "海运",
        },
        {
          color: "#35D06F",
          nameCn: "空运",
        },
      ],
      opts: {
        2: {
          reqs: getECDetail,
        },
        3: {
          reqs: getSeaTraditionDetail,
        },
      },
      veryList: {},
      activities: {
        title: "物流轨迹",
      },
      selectionRows: [], //对账管理中所选择的对账信息
      isInitRes: false,
      uploadTableConfig: {
        show: false,
      },
      uploadFileTableConfig: {},
    };
  },
  created() {
    this["dictionary/getDictionary"]("operateDetails");
  },
  methods: {
    ...mapActions(["dictionary/getDictionary", "tagsView/delView"]),
    getDetails(id, type) {
      const { active = undefined } = this.$route.query;
      this.isInitRes = false;
      this.basicInfoConfig.formModel = {};
      this.mixinDetailCacheTabList = []; // 重置
      getTakeOrders(id).then(async (res) => {
        const {
          orderId,
          operationOrderNum,
          orderType,
          isMainBill,
          id: operateId,
          startPortName,
          endPortName,
          countryName,
          containerTrailer,
          isConceal,
          operationRemark,
          wholeCabinetSn,
          insureNo,
          airLineId,
          sortBoxId,
        } = res.data;

        if (isMainBill === 5 || orderType === 2) {
          let { query } = this.$route;
          let path = "/operateManage/seaTransDetails/extend";
          if (orderType === 2) {
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

        const routeData = !!airLineId
          ? (await getrouteNoByoperationId(operateId)).data || {}
          : {}; // 航次
        const sortBoxData = !!sortBoxId
          ? (await getBoxSortByOperationId(operateId)).data || {}
          : {}; // 排柜

        this.basicInfoConfig.lists = eCommerceOperate({
          orderType,
          routeDataId: routeData.id,
          sortBoxDataId: isMainBill == "0" ? null : sortBoxData.id, // 非主单隐藏排柜信息
        });

        // [2, 4, 5, 11]子单显示tab；isMainBill：7为子单
        if (isMainBill === 7 && ![2, 4, 5, 11].includes(this.tabs.active)) {
          this.tabs.active = 2;
        } else if (active) {
          this.tabs.active = this.typeConversion(active, "number");
        }
        this.mixinDetailCacheTabList = [this.tabs.active];
        this.initInfo = {
          ...res.data,
          routeName: routeData?.name,
        };

        if (!type) {
          this.activities.id = operateId;
        }
        this.veryList = {
          ...this.veryList,
          operateDetail: res.data,
        };
        if (this.tabs.active == 10) {
          //用于上下翻页或详情页面跳转
          this.initGetUploadInfo();
        }
        this.isInitRes = true;

        Promise.all([
          this.opts[orderType].reqs(orderId),
          getCustomInfo({ operationOrderId: operateId }),
        ]).then(([basicInfo, customInfo]) => {
          this.$refs.operateDetail?.getData(operateId);
          // 基本信息
          const { data } = basicInfo;
          // console.log("basicInfo", basicInfo.data);
          this.veryList = {
            ...this.veryList,
            basicInfo: basicInfo.data,
            airflight: routeData,
            // argCabinet: sortBoxData,
            customInfo: customInfo.data,
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
            startPortName,
            endPortName,
            countryName,
            containerTrailer,
            orderRemark: data.remark,
            operationOrderNum, //操作单号
            isMainBill,
            isConceal,
            operationRemark,
            wholeCabinetSn,
            insureNo,
            routeOrderAttachList: routeData.attachList, // 航次订舱资料
            routeResData: {
              ...routeData,
              routeOrderCodeName: `${routeData.routeCode || "--"}[${
                routeData.routeName || "--"
              }]`,
            },
            sortBoxResData: sortBoxData,
          };
          // console.log("models", models);
          this.basicInfoConfig.formModel = models;
          this.$refs.basicInfoForm?.setFormModel(models);
          // console.log('总数据',this.basicInfoConfig)
          //清报关信息
          const customData = {
            ...customInfo.data,
            operateId,
          };
          // console.log("customInfo", customData);
          this.customsConfig.uploadConfig.fileList =
            customData.attachList || [];
          this.customsConfig.formModel = {
            ...customData,
          };
          this.$refs.customClear?.setFormModel(customData);
          this.$refs.tableRef?.handleUpdateView();
          // console.log(this.$refs);
        });
      });
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next" || type === "titJump") {
        // this.tabs.active = 1;
        if (this.tabs.active == 13) {
          this.tabs.active = 1;
        }
        this.customsConfig.formModel = {};
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
      if (key == 10) {
        this.initGetUploadInfo();
      }
      this.mixinDetailCacheTabList.push(key);
    },
    initGetUploadInfo() {
      const { id, orderId, orderType } = this.initInfo;
      this.uploadFileTableConfig = {
        noLengthHide: false, //没有附件时隐藏table
      };
      this.uploadTableConfig = {
        show: true,
        webEditUpload: true,
        isGetUploadFileTypes: true,
        onGetFileType: "CTCZD",
        isAttachIdGetList: false,
        onFileChange: (arr) => {
          const { deleteAttachIdList = [] } =
            this.$refs.uploadTypeRef?.getAttachmentParams({
              isGetDeleteIds: true,
            });
          const params = [
            {
              attachDeleteIds: deleteAttachIdList,
              attachIds: arr.join(","),
              orderId: id,
              orderType: 1, //1操作订单ID    2 电商头程订单ID  3传统订单id    4其他订单id   如果传1 orderId取操作单ID，否则取订单ID
              queryType: 3,
            },
          ];
          updateAttachListByOrderIdNew(params).then((res) => {
            this.$refs.uploadTypeRef?.getAttachRequestFiles();
          });
        },
        httpGetFileRequest: (result = {}) => {
          //初始化附件
          const { explains } = result;
          return getOrderAttachList({
            orderId: orderId,
            operationOrderId: id,
            orderType: orderType,
            queryType: !!orderId ? 2 : 3,
            queryTypeList: explains,
          });
        },
      };
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
      let filterTabs = [];
      if (!this.initInfo.containerTrailerShow) {
        // 非整柜不显示拖车 0-FCL整柜 1-LCL散货
        // 4253-有拖车节点显示拖车信息 trailerShow - 一般拖车
        filterTabs = [3];
        if (this.tabs.active == 3) {
          this.tabs.active = 1;
        }
      }
      const { relevanceId, isMainBill, orderType } = this.initInfo;
      // 1、isMainBill===2 // 自拼主单 (relevanceId && isMainBill === 0是子系统主单)
      // 2、isMainBill===1 // 拼柜主单
      // 3、isMainBill===3 // 已拆柜主单
      if (![1, 2, 3].includes(isMainBill) || orderType !== 2) {
        filterTabs.push(13);
      }
      if (isMainBill === 7) {
        return this.tabs.columns.filter((e) => [2, 4, 5, 11].includes(e.key)); // [2, 4, 5, 11]子单显示tab
      }
      return this.tabs.columns.filter((e) => !filterTabs.includes(e.key));
    },
    handleBLSuccess() {
      this.$refs.tableRef?.handleUpdateView();
      this.$refs.operateDetail.getData(this.initInfo.id);
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
    .form-title-1 {
      display: flex;
      flex-direction: column;
      &::before {
        display: inline-block;
        content: "";
        width: calc(100% - 12px);
        height: 1px;
        // background-color: #e2e2e2;
        margin-bottom: 14px;
      }
    }
    .form-title-2 {
      display: flex;
      flex-direction: column;
      &::before {
        display: inline-block;
        content: "";
        width: calc(100% - 12px);
        height: 1px;
        background-color: #e2e2e2;
        margin-bottom: 14px;
      }
    }
    .el-form-item__label {
      color: #8b8b8b;
    }
    .el-form-item__content {
      color: #515151;
    }
    .border-bottom-solid {
      margin-bottom: 0;
    }
    .border-top-solid {
      &::before {
        margin-top: 14px;
        margin-bottom: 10px;
      }
    }
    .form-rows-expansion-top {
      margin-top: 14px;
      border-top: 1px solid #e2e2e2;
    }
    .expansion-show {
      display: block;
    }
    .expansion-hide {
      display: none;
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
        .detail-card {
          display: flex;
          justify-content: space-between;
          & > div {
            display: flex;
            align-items: center;
            padding: 19px 26px 19px 12px;
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
          & > div:nth-of-type(2) {
            padding-right: 12px;
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
            .order-no {
              display: flex;
              flex-direction: column;
            }
            .order-label {
              font-size: 12px;
            }
          }
        }
        .tabs {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          padding: 14px 0;
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

        /deep/ .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
