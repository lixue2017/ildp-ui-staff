<template>
  <div class="operate-details" v-if="isInitRes">
    <div class="operate-content">
      <ComDetailTop
        :title="/* 空运详情 */ '操作单信息'"
        :formModel="initInfo"
        :config="topConfig"
        ref="detailTopRef"
        @handleClick="handleTopClick"
        v-if="veryList.operateDetail"
      >
        <template v-slot:subTitle>
          <span class="sub-title">
            {{
              veryList.operateDetail.customerShortName
                ? `(${veryList.operateDetail.customerShortName})`
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
                ...veryList.operateDetail,
                customsClearanceType: typeConversion(
                  veryList.basicInfo.customsClearanceType
                ),
                transportType: initInfo.transportType,
                destinationWarehouseName: initInfo.destinationWarehouseName,
                headTransportModeName: veryList.basicInfo.headTransportModeName,
                outWarehouseWayName: veryList.basicInfo.outWarehouseWayName,
                viewSource: 'airTransport',
                bookingSpaceProxyName:
                  veryList.operateDetail.proxyType == 1
                    ? veryList.operateDetail.sameIndustryProxyName
                    : veryList.operateDetail.bookingSpaceProxyName,
              }"
            />
            <div class="tabs">
              <template v-for="item in tabs.columns">
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
              v-if="
                Object.keys(dictionary.dicsData).length &&
                basicInfoConfig.formModel.id
              "
            >
              <template v-slot:expansion="slotProps">
                <span
                  @click="showToggle(slotProps.fieldItem)"
                  class="expansion-btn"
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
              <template v-slot:routeGroup="slotProps">
                <span
                  v-if="
                    slotProps.formModel.lineType ||
                    slotProps.formModel.lineType === 0
                  "
                >
                  <span
                    class="mark-icon"
                    :style="{
                      borderColor: getMarkIconColor(
                        dictionary.dicsData.transportMode[
                          slotProps.formModel.lineType
                        ]
                      ),
                      color: getMarkIconColor(
                        dictionary.dicsData.transportMode[
                          slotProps.formModel.lineType
                        ]
                      ),
                    }"
                  >
                    {{
                      dictionary.dicsData.transportMode[
                        slotProps.formModel.lineType
                      ] &&
                      dictionary.dicsData.transportMode[
                        slotProps.formModel.lineType
                      ].nameCn
                    }}
                  </span>
                  <span
                    class="mark-icon"
                    :style="{
                      borderColor: getMarkIconColor(
                        slotProps.dicsList[slotProps.formModel.routeProxy]
                      ),
                      color: getMarkIconColor(
                        slotProps.dicsList[slotProps.formModel.routeProxy]
                      ),
                    }"
                  >
                    {{
                      slotProps.dicsList[slotProps.formModel.routeProxy] &&
                      slotProps.dicsList[slotProps.formModel.routeProxy].label
                    }}
                  </span>
                </span>
                <span v-else>--</span>
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

              <template v-slot:airflightCode="{ formModel }">
                <span
                  v-if="formModel.airflightCode"
                  class="primary-text-btn"
                  @click="viewAirflightDetail(formModel.airflightId)"
                >
                  {{ formModel.airflightCode }}
                </span>
                <span v-else>--</span>
              </template>
              <template v-slot:airflightHblNo="{ formModel }">
                <el-input
                  v-if="formModel.airflightId"
                  v-model="formModel.airflightHblNo"
                  placeholder="分单号"
                  maxlength="500"
                  clearable
                  @change="handleHblNo"
                ></el-input>
                <span v-else>--</span>
              </template>
            </ComForm>
          </div>
          <!-- 货物信息 -->
          <div v-show="tabs.active === 2">
            <EcTableInfo
              v-if="
                orderType == 2 && Object.keys(basicInfoConfig.formModel).length
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
              }"
              @tableList="handleVeryList"
            />
            <TableInfo
              v-if="
                orderType == 4 && Object.keys(basicInfoConfig.formModel).length
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
              }"
              @tableList="handleVeryList"
              @handleTraditionGoods="
                () =>
                  handleOperateSuccess() /* 改变货物报关方式，需要更新节点 */
              "
            />
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
              <template v-slot:exportInfo="slotProps">
                <div v-if="slotProps.formModel.id">
                  <span class="mark-icon green-mark">
                    {{ slotProps.dicsList[0].label }}
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
              v-if="activities.id"
            />
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
        </div>
        <div class="order-right">
          <ComOperate
            ref="operateDetail"
            v-if="veryList.operateDetail"
            :listData="{ ...veryList }"
            :basicData="{
              ...basicInfoConfig.formModel,
              orderId: initInfo.orderId,
              operationOrderId: initInfo.id,
              isBookingSpace: initInfo.isBookingSpace,
            }"
            :orderStatus="initInfo.operationOrderStatus"
            @handleSuccess="handleOperateSuccess"
          />
        </div>
      </div>
    </div>

    <!-- <template v-if="getFootBtn().length > 1">
			<div class="footer-seize-seat"></div>
			<div class="order-footer">
				<template v-for="(btn, index) in getFootBtn()">
					<el-button :type="btn.type" @click="btn.handleClick" :key="index">
						{{ btn.text }}
					</el-button>
				</template>
			</div>
		</template> -->

    <!-- <OrderSubmit ref="OrderSubmit" @handleSuccess="handleOrderSubmitSuccess" /> -->
  </div>
</template>
<script>
import {
  tabsConfig,
  ecBasicInfo,
  tranditionBasicInfo,
  ecContactsConfig,
  tranditionContactsConfig,
  basicInfoConfig,
  cardConfig,
  customsConfig,
} from "./model";
import { defaultTextParams } from "_comp/ComUpload/model";
import { mapActions, mapState } from "vuex";
import commonMixin from "@/utils/mixin";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { getSeaTraditionDetail } from "@/api/trandition/oceanModel";
import { getECDetail } from "@/api/order/firstTransport.js";
import { getrouteNoByoperationId, editHblNo } from "@/api/marketManage/airline";
import { getTakeOrders } from "@/api/operateManage/common";
import { getBoxSortByOperationId } from "@/api/container/arrange.js";
import { getCustomInfo } from "@/api/operateManage/details.js";
import { BUS_TYPE } from "@/utils/mixin";
import mixinOperationDetail from "../../components/mixinOperationDetail";
import {
  getOrderAttachList,
  updateAttachListByOrderIdNew,
} from "@/api/common.js";
export default {
  // name: "AirTransDetails",
  mixins: [commonMixin, mixinOperationDetail, mixinEditCache],
  components: {
    ComUpload: () => import("_comp/ComUpload"),
    ModulsTitle: () => import("@/components/ModulsTitle"),
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
    // OrderSubmit: () =>
    //   import("@/views/newOrderManage/components/OrderSubmit/index.vue"),
    OperationRecords: () =>
      import("@/views/newOrderManage/components/OperationRecords/index.vue"),
  },
  computed: {
    ...mapState(["dictionary"]),
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
      orderType: 2,
      initInfo: {},
      // orderList: [],
      cardConfig,
      tabs: tabsConfig,
      basicInfoConfig: {
        formModel: {},
        labelWidth: "93px",
        isAttachFileId: true,
        lists: basicInfoConfig.lists,
      },
      customsConfig: {
        formModel: {},
        labelWidth: "105px",
        lists: customsConfig.lists,
        uploadConfig: {
          ...accessoryConfig,
        },
        clearUploadConfig: {
          ...accessoryConfig,
        },
      },
      activities: {
        title: "物流轨迹",
      },
      opts: {
        2: {
          reqs: getECDetail,
          config: ecBasicInfo,
          contactsConfig: ecContactsConfig,
        },
        4: {
          reqs: getSeaTraditionDetail,
          config: tranditionBasicInfo,
          contactsConfig: tranditionContactsConfig,
        },
      },
      veryList: {},
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
      const { active = 1 } = this.$route.query;
      this.tabs.active = this.typeConversion(active, "number");
      this.isInitRes = false;
      this.mixinDetailCacheTabList = []; // 重置
      this.basicInfoConfig.lists = JSON.parse(
        JSON.stringify(basicInfoConfig.lists)
      );
      getTakeOrders(id).then((res) => {
        const operateDetail = res.data;
        const {
          airLineId,
          sortBoxId,
          orderId,
          operationOrderNum,
          orderType,
          id: operateId,
        } = operateDetail;
        if (operateDetail.isMainBill === 5 || orderType === 2) {
          let { query } = this.$route;
          let path = "/operateManage/airTransDetails/extend";
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
        this.initInfo = res.data;
        if (!type) {
          this.orderType = orderType;
          this.basicInfoConfig.lists[0].fieldList[0] =
            this.opts[this.orderType].config;
          this.basicInfoConfig.lists[0].fieldList[1] =
            this.opts[this.orderType].contactsConfig;
          this.activities.id = operateId;
        }
        if (JSON.stringify(operateDetail?.isMainBill) === "0") {
          //非主单隐藏排柜信息
          this.basicInfoConfig.lists[0].fieldList[4].disable = true;
          this.basicInfoConfig.lists[0].fieldList[5].disable = true;
        }
        this.veryList = {
          ...this.veryList,
          operateDetail,
        };
        this.mixinDetailCacheTabList = [this.tabs.active];
        this.isInitRes = true;
        Promise.all([
          this.opts[this.orderType].reqs(orderId),
          airLineId ? getrouteNoByoperationId(operateId) : "",
          sortBoxId ? getBoxSortByOperationId(operateId) : "",
          getCustomInfo({ operationOrderId: operateId }),
        ]).then(([basicInfo, airflight, argCabinet, customInfo]) => {
          this.$refs.operateDetail.getData(operateId);
          //基本信息、航次信息、排柜信息
          const { data } = basicInfo;

          this.veryList = {
            ...this.veryList,
            basicInfo: basicInfo.data,
            airflight: airflight.data,
            argCabinet: argCabinet.data,
            customInfo: customInfo.data,
          };
          if (data.customsClearanceId) {
            data.customsClearanceId = data.customsClearanceId
              .split(",")
              .map((item) => +item);
          } else {
            data.customsClearanceId = [];
          }
          data.reportCustomsWay = data.reportCustomsWay + "";
          data.pickUpHome = data.pickUpHome ? true : false;
          data.isHomeDelivery = data.isHomeDelivery ? true : false;
          data.freightType = data.freightType ? data.freightType : "1";
          const models = {
            ...data,
            ...airflight.data,
            ...argCabinet.data,
            orderRemark: data.remark,
            batchNo: argCabinet.data && argCabinet.data.code,
            argCabinetCreateBy: argCabinet.data && argCabinet.data.createBy,
            argCabinetSono: argCabinet.data?.sono,
            argCabinetCode: argCabinet.data?.code,
            argCabinetBoxModelCode: argCabinet.data?.boxModelCode,
            argCabinetStartPortName: argCabinet.data?.startPortName,
            argCabinetEndPortName: argCabinet.data?.endPortName,
            argCabinetRegisterNo: argCabinet.data?.registerNo,
            argCabinetWeight: argCabinet.data?.weight,
            argCabinetVolume: argCabinet.data?.volume,
            argCabinetCreateTime: argCabinet.data && argCabinet.data.createTime,
            argCabinetRemark: argCabinet.data && argCabinet.data.remark,
            operationOrderNum, //操作单号
            airflightSoNo: airflight.data && airflight.data.sono,
            airflightRemark: airflight.data && airflight.data.remark,
            routeOrderAttachList: airflight.data?.attachList,
            shipName: airflight.data && airflight.data.flightName,
            airflightCode: airflight.data?.code, //argCabinet.code把airflight.code覆盖掉了
            airflightId: airflight.data?.id,
            airflightHblNo: airflight.data?.hblNo,
            isConceal: operateDetail.isConceal,
            operationRemark: operateDetail.operationRemark,
            wholeCabinetSn: operateDetail.wholeCabinetSn,
            insureNo: res.data.insureNo,
            routeName: airflight.data?.name,
          };
          this.basicInfoConfig.formModel = models;
          this.$refs.basicInfoForm?.setFormModel(models);

          //清报关信息
          const customData = {
            ...customInfo.data,
            operateId,
          };
          // console.log("customInfo", customData);
          this.customsConfig.uploadConfig.fileList =
            customData.attachList || [];
          this.customsConfig.formModel = customData;
          this.$refs.customClear?.setFormModel(customData);
          this.$refs.tableRef?.handleUpdateView();
        });
      });
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next" || type === "titJump") {
        // this.tabs.active = 1;
        this.basicInfoConfig.formModel = {};
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
    viewAirflightDetail(id) {
      this.$router.push({
        path: "/marketManage/airlineFlightDetails",
        query: {
          id,
          backPath: this.$route.fullPath,
        },
      });
    },
    handleHblNo(val) {
      const { airflightId: id } = this.basicInfoConfig.formModel;
      editHblNo({ id, hblNo: val.trim() }).then(() => {
        this.$message.success("分单号更新成功");
      });
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
    .select-contacts {
      &.lastChild {
        padding-bottom: 10px;
      }
    }
    .expansion-btn {
      display: flex;
      color: #5094ff;
      align-items: center;
      justify-content: flex-end;
      cursor: pointer;
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
    .shipper-address {
      float: left;
      line-height: 20px;
      margin-top: 5px;
    }
    .mark-info {
      margin-top: -10px;
    }
    .trailer-info {
      margin-bottom: 20px;
    }
    .title-show {
      .form-title-1 {
        display: block;
      }
    }
    .title-hide {
      .form-title-1 {
        display: none;
      }
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
