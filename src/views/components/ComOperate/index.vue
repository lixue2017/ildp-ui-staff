<template>
  <div style="height: 100%">
    <OperateSidebarCard :showBarTabArr="showBarTabArr">
      <template v-if="operateDetail" v-slot:slideCard="{ showTabObj }">
        <template v-if="basicData.id">
          <!-- 先加载数据，后加载模板 -->
          <div v-show="showTabObj.tabKey === 'remarkBar'">
            <div class="operate-status">
              <span>状态</span>
              <div style="flex: 1; background-color: #f9f9f9; color: #a5a5a5">
                {{
                  getDictObj(
                    dictionaryData[config.status[source]],
                    operateDetail.operationOrderStatus
                  ) || operateDetail.operationOrderStatus
                }}
              </div>
            </div>

            <keep-alive>
              <!-- 防止初始化时重复调用判断按钮显示接口 -->
              <OperationButton
                v-if="operateDetail.id && showTabObj.tabKey === 'remarkBar'"
                :btnList="operableBtnArr(source)"
                :operateDetail="operateDetail"
                @handleBtnClick="handleBtnClick"
              />
            </keep-alive>
            <OperatingRemarks
              :formModel="{
                ...basicData,
              }"
            />
          </div>
        </template>

        <div v-show="showTabObj.tabKey === 'stateBar'">
          <div v-show="showTabObj.isTabShow" class="operate-business">
            <keep-alive>
              <!-- 防止初始化时重复调用判断按钮显示接口 -->
              <OperationButton
                v-if="
                  showTabObj.tabKey === 'stateBar' &&
                  operateDetail.id &&
                  ![5, 6].includes(operateDetail.orderType)
                "
                :btnList="trajectoryBtnArr(source)"
                :nameArr="[]"
                :operateDetail="operateDetail"
                @handleBtnClick="handleBtnClick"
                class="trajectory-btn"
              />
            </keep-alive>
            <!-- <div class="title">业务相关信息</div> -->
            <OperateFlowCard
              :nodeFlowList="logisticsList"
              @handleFlowClick="handleClick"
            />
          </div>
        </div>
      </template>
    </OperateSidebarCard>

    <!-- 整柜核实 -->
    <CabinetVerifyDialog
      ref="cabinetVerifyDialog"
      @handleSuccess="handleSuccess"
    />
    <!-- 散货入仓核实 -->
    <WarehousingDialog ref="warehousingDialog" @handleSuccess="handleSuccess" />
    <!-- 更换成员 -->
    <ChangeMembersDialog
      ref="changeMembersDialog"
      @handleSuccess="handleSuccess"
    />
    <!-- 报关弹框 -->
    <DeclareCustomsDlg
      ref="declareCustomsDialog"
      @handleSuccess="handleSuccess"
    />
    <!-- 报关审核 -->
    <ExamineFormConfig ref="examineFormRef" @handleSuccess="handleSuccess" />
    <!-- 时间确定弹窗 -->
    <ConfirmDialog ref="confirmDialog" @handleSuccess="handleSuccess" />
    <!-- 自定义弹窗 -->
    <ComCustomDialog
      ref="customDlgRef"
      :slotDlgFormIds="['fileDeclarationSlot']"
    >
      <!-- 报关资料收集 -->
      <template v-slot:fileDeclarationSlot="slotProps">
        <FileUploadTable
          ref="mUploadTypeRef"
          :uploadTableConfig="{
            showFileTypeArr,
            attachList: slotProps.formModel.attachList,
          }"
        />
      </template>
    </ComCustomDialog>
    <!-- 航次离港，到港时间确认弹窗 -->
    <AirlineStatusDialog
      ref="airlineStatusRef"
      @handleSuccess="handleSuccess"
    />
    <!-- 订舱 -->
    <CheckInDialog ref="checkInDialog" @submitSuccess="handleSuccess" />
    <!-- 扣货 -->
    <AddDOCDialog ref="addDOCDialog" @handleSuccess="handleSuccess" />
    <!-- 拖车 -->
    <EditTrailer ref="trailerEditRef" @handleSuccess="handleSuccessTrailer" />
    <!-- 提单弹框 -->
    <BOLManageDialog ref="BOLManageDialog" @handleSuccess="handleSuccess" />
    <!-- 提单确认 -->
    <DraftDialog ref="draftDialog" @handleSuccess="handleSuccess" />
    <!-- 清关交接 -->
    <ConnectDialog ref="connectDlgRef" @handleSuccess="handleSuccess" />
    <!-- 清关申报 -->
    <DeclareCustomsClearance
      ref="customsClearanceRef"
      @handleSuccess="handleSuccess"
    />
    <!-- 同行散货订舱 -->
    <AddSonoDialog ref="addSonoDialog" @handleSuccess="handleSuccess" />
    <!-- 操作接单 -->
    <OrderSubmit ref="receivingRef" @handleSuccess="handleSuccess" />
    <!-- 节点配置 -->
    <NodeConfigDialog ref="nodeConfRef" @handleSuccess="handleSuccess" />
    <!-- 更改内容 -->
    <ChangeOperateContent ref="contentRef" />
    <!-- 收发通人员更换 -->
    <ChangeOperateContacts ref="contactRef" />
    <!-- 整柜登记sono -->
    <SoNoCheckIn
      ref="soNoCkInDialog"
      :isOnlySoNo="true"
      @close="
        (val) => {
          val && handleSuccess();
        }
      "
    />
    <BookingDialog ref="BookingDialog" @handleSuccess="handleSuccess" />
    <!-- 订舱登记 -->
    <!-- 打印唛头 -->
    <ComPrint ref="comPrintRef" :formData="basicData" />
    <!-- 电商维护货物地址 -->
    <MaintainAddressDialog ref="addressDlgRef" />
  </div>
</template>

<script>
import { config, customInsuranceForm, soNoCols } from "./model";
import { mapActions, mapState } from "vuex";
import { formatDate } from "@/utils/index.js";
import { msgBox, msgTipBox } from "@/utils/confirmBox.js";
import {
  getOrderLogistics,
  getStorageLogistics,
  getNodeDetail,
  addStorageLogs,
  updateOperation,
  getLogisticsOrder,
  putOrderBillSending,
} from "@/api/operateManage/common";
import { getFreightList } from "@/api/order/firstTransport.js";
import { editPopBill } from "@/api/operateRecord/BOLManage.js";
import { getSortBoxStatus } from "@/api/container/arrange.js";
import {
  getGeneralTrailer,
  getCustomInfo,
} from "@/api/operateManage/details.js";
import { setTrailerStatus } from "@/api/performance/record";
import { getPopBillGoods } from "@/api/trandition/oceanModel.js";
import { duplicateRemoval } from "@/utils/index";
import { mixinOperable } from "./mixins/operationBtnList.js";
import { mixinNodeOperable } from "./mixins/nodeOperate.js"; // 业务节点操作
import { mixinDeclarationNodeFile } from "@/views/operateManage/seaEcommerce/components/ClearCustomsTable/mixinNode.js"; // 电商报关附件节点
import { addSono, getRouteNoWaitRouteNew } from "@/api/marketManage/airline.js";
export default {
  mixins: [mixinOperable, mixinNodeOperable, mixinDeclarationNodeFile],
  props: {
    listData: {
      type: Object,
      default: {},
    },
    basicData: {
      type: Object,
      default: {},
    },
    source: {
      type: String,
      default: "operation",
    },
    isExtendOrder: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    OperationButton: () =>
      import("_comp/ComOperate/components/operateCard/operationButton.vue"), // 操作按钮
    OperateFlowCard: () =>
      import("_comp/ComOperate/components/operateCard/operationFlow.vue"), // 业务流程节点
    WarehousingDialog: () =>
      import("_comp/ComOperate/components/WarehousingDialog"), // 入仓（散货）核实
    ChangeMembersDialog: () =>
      import("_comp/ComOperate/components/ChangeMembersDialog"), // 更换成员
    // ReleaseGoodsDialog: () =>
    //   import("_comp/ComOperate/components/ReleaseGoodsDialog"), // 放货登记
    CabinetVerifyDialog: () =>
      import("_comp/ComOperate/components/CabinetVerifyDialog"), // 整柜核实
    DeclareCustomsDlg: () =>
      import(
        "@/views/operateManage/operateRecord/declareCustoms/editDeclareDlg.vue"
      ), // 报关
    ExamineFormConfig: () =>
      import(
        "@/views/operateManage/operateRecord/declareCustoms/examineFormConfig"
      ), // 报关审核
    ConfirmDialog: () => import("@/views/components/ConfirmDialog"), // 时间确定弹窗
    CheckInDialog: () =>
      import("@/views/marketManage/forBooking/components/CheckInDialog"), //订舱
    AddDOCDialog: () =>
      import(
        "@/views/operateManage/operateRecord/DOCManage/components/AddEditDialog"
      ), // 扣货登记
    EditTrailer: () =>
      import("@/views/operateManage/operateRecord/trailerInfo/editTrailer"), // 拖车
    BOLManageDialog: () =>
      import(
        "@/views/operateManage/operateRecord/BOLManage/components/editDialog/index.vue"
      ), // 提单编辑弹框
    DraftDialog: () =>
      import(
        "@/views/operateManage/operateRecord/BOLManage/components/draftDialog/index.vue"
      ), // 提单确认弹框
    // AddSonoDialog: () =>
    //   import("@/views/marketManage/airlineFlight/components/AddSonoDialog"), // 同行散货订舱
    AddSonoDialog: () =>
      import("@/views/marketManage/airlineFlight/components/AddEditDialog"), // 同行散货订舱
    ConnectDialog: () =>
      import(
        "@/views/operateManage/operateRecord/components/connectDialog/index.vue"
      ), // 清关交接
    OrderSubmit: () =>
      import("@/views/newOrderManage/components/OrderSubmit/index.vue"), // 操作接单
    BookingDialog: () =>
      import("@/views/marketManage/components/bookingRegistration/index.vue"),
    ComPrint: () => import("_comp/ComOperate/components/ComPrint"), // 打印唛头
    MaintainAddressDialog: () =>
      import(
        "@/views/operateManage/operateRecord/components/ClearanceDetial/maintainAddress/index.vue"
      ),
  },
  computed: {
    ...mapState({
      dictionaryData: (state) => state.dictionary.dicsData,
    }),
  },
  data() {
    return {
      config,
      logisticsList: [],
      operateDetail: {},
      // orderParams: {},
      trailerNodeId: "",
    };
  },
  mounted() {
    // this.getData();
  },
  methods: {
    // 获取物流节点
    getData(operateId, orderParams) {
      this.operateDetail = this.listData.operateDetail;
      // this.orderParams = orderParams;
      // if (this.source === "inStoragePredic") {
      //   const params = {
      //     orderId: orderParams.orderId,
      //     orderType: orderParams.orderType,
      //   };
      //   getStorageLogistics(params).then((res) => {
      //     this.logisticsList = res.data;
      //   });
      //   return;
      // }
      this.logisticsList = [];
      getOrderLogistics(operateId).then((res) => {
        this.logisticsList = res.data;
      });
    },

    // 物流时间登记
    timeConfirmDialog(row) {
      getNodeDetail(row.nodeId).then((res) => {
        const reqs = {
          inStoragePredic: addStorageLogs,
          operation: getLogisticsOrder,
        };
        const data = res.data;
        const { id, code } = data;
        let opts = {
          dialogTitle: data.name,
          timeConfig: {
            timeId: "trajectoryTime",
            timeLabel: "轨迹跟踪时间",
            remarkId: "msg",
            timeValueFormat: "yyyy/MM/dd hh:mm:ss",
          },
          formModel: {
            trajectoryTime: formatDate(new Date(), "/"),
            msg: data.msg,
          },
          httpRequest: (formData) => {
            // console.log(formData);
            const { trajectoryTime, msg } = formData;
            let params = {};
            const commonParams = {
              trajectoryTime,
              msg,
            };
            if (this.source === "inStoragePredic") {
              // const { orderId, orderType } = this.orderParams;
              // params = {
              //   ...commonParams,
              //   orderId,
              //   orderType,
              //   nodeCode: code,
              // };
            } else {
              const { id } = this.operateDetail;
              params = {
                ...commonParams,
                operationOrderIds: [id],
                // name: row.name,
                nodeCode: row.code,
                // tOperationOrderId: 18 || this.operateDetail.id,
              };
            }
            return reqs[this.source](params);
          },
          successFunction: this.handleSuccess,
        };
        if (id == 52) opts.timeConfig.timeLabel = "收货时间";
        if (id == 53) opts.timeConfig.timeLabel = "上架时间";
        this.$refs.confirmDialog.handleFormDialog("timeConfirm", opts);
      });
    },
    // 保险节点（nodeId: 49）
    insuranceDialog(row) {
      getNodeDetail(row.nodeId).then((res) => {
        const data = res.data;
        const { operationOrderNum } = this.listData.operateDetail;
        this.$refs.confirmDialog.handleFormDialog("customConfirmModel", {
          dialogTitle: data.name,
          formModel: {
            trajectoryTime: formatDate(new Date(), "/"),
            msg: data.msg,
            operationOrderNum,
          },
          customFormConfig: customInsuranceForm(),
          httpRequest: (formData) => {
            // console.log(1111, formData);
            const { trajectoryTime, msg, insuranceAttachId, insureNo } =
              formData;
            const params = {
              trajectoryTime,
              msg,
              name: row.name,
              nodeCode: row.code,
              insuranceAttachId,
              operationOrderIds: [this.operateDetail.id],
              insureNo,
            };
            return getLogisticsOrder(params);
          },
          successFunction: this.handleSuccess,
        });
      });
    },
    // 入仓核实（nodeId: 9）
    async handleWarehousing() {
      let verifyObj = this.listData.freightList;
      if (
        ["ec_operation_details"].includes(this.listData.viewBarSource) &&
        !verifyObj
      ) {
        const { id, orderId } = this.listData.operateDetail;
        verifyObj = await getFreightList({
          orderEcId: orderId,
          operationOrderId: id,
          pageNum: 1,
          pageSize: 99991,
        });
      }
      const {
        id,
        orderType,
        freightType,
        operationOrderNum,
        bailorPeople,
        createTime,
        operationOrderType,
        orderId,
        isMainBill,
      } = this.operateDetail;
      this.$refs.warehousingDialog.show({
        operationId: id,
        orderId,
        orderType,
        freightType,
        operationOrderNum,
        bailorPeople,
        createTime,
        operationOrderType,
        isMainBill,
        lists: verifyObj,
      });
    },
    // 排柜（11：已排柜）
    handleLoadContainer() {
      // orderId 订单ID
      const {
        orderId: idRows,
        bookingSpaceProxy,
        transactionWarehouse,
      } = this.operateDetail;
      this.$router.push({
        path: "/projectContainer/editLoadContainer",
        query: {
          idRows,
          bookingSpaceProxy,
          warehouseId: transactionWarehouse,
          backPath: this.$route.fullPath,
        },
      });
    },
    // 装柜（12：装柜完成）
    handleCabinetInstallation() {
      const { id } = this.operateDetail;
      getSortBoxStatus({
        operationId: id,
        status: 3,
      })
        .then(() => {
          this.handleSuccess();
        })
        .catch((err) => {
          // console.log(111,err);
          if (err.code === 1002) {
            const title = `当前出库计划存在<span class='draft-state'>${err.msg}票</span>未入库的货物 ！`;
            const className = "el-icon-warning text-warning";
            const msg = "全部货物入库之后才能进行最后出库";
            const html = `<div class='display-flex'><i class='${className}'></i><span>${title}</span></div><div class='subtitle'>${msg}</div>`;
            msgBox(
              this,
              {
                title: "",
                html,
                showClose: false,
                confirmButtonText: "知道了",
                customClass: "delivery-box",
              },
              () => {}
            );
          }
        });
    },
    // 订舱（5：订舱确认）
    async handleCheckIn() {
      const {
        id,
        freightType,
        proxyType,
        isBookingSpace,
        bookingSpaceProxyName: bookingSpaceProxy,
        orderType,
        operationOrderType,
        salesmanName: salesman,
        startPort: startPortId,
        endPort: endPortId,
      } = this.operateDetail;
      let pageLocation = 1; //1=市场订舱FCL；2=市场订舱LCL；操作订舱LCL
      if (freightType == 1 && proxyType == 0 && proxyType != null) {
        pageLocation = 2;
      }
      if (freightType == 1 && proxyType == 1) {
        pageLocation = 3;
      }
      const { rows = [] } = await getRouteNoWaitRouteNew({
        operationOrderIdIn: id,
        pageLocation,
        isBookingSpace,
      });
      if ((isBookingSpace == 1 || isBookingSpace == 2) && pageLocation !== 1) {
        this.handleSoNo({
          routeId: this.listData.operateDetail.airLineId,
          operationOrderId: id,
        });
      } else {
        this.$refs.BookingDialog?.show(
          rows[0] || {
            freightType,
          },
          isBookingSpace == 1 ? "register" : undefined,
          (isBookingSpace == 1 || isBookingSpace == 2) && freightType == 0 // FCL已订舱未登记SoNo
        );
      }
    },
    handleSoNo(row) {
      this.$refs.customDlgRef?.showCustomDialog({
        httpRequest: ({ sono }) => {
          const opt = {
            routeNoManageId: row.routeId, //航次id
            sono, //sono号
            orderId: row.operationOrderId, //操作单id
          };
          return addSono(opt);
        },
        successFunction: this.handleSuccess,
        customFormConfig: soNoCols,
      });
    },
    // 登记拖车（14：到港，39：离港，80/82: 一般拖车）
    async registerTrailer(nodeId) {
      const { id: operationOrderId, freightType } = this.operateDetail;

      const trailerType = {
        14: 0,
        39: 1,
        80: 2, // 一般拖车登记
        82: 2, // 一般拖车进度反馈
      };
      let trailerRow = {
        webViewSource: "operationTrailer", // 判断来源
        operationOrderId, // 操作单ID （集装箱拖车需要传）
        trailerType: trailerType[nodeId], //拖车类型  0 集装箱到港 1集装箱离港   2拖车到仓  3拖车离仓  4其他
        type: [80, 82].includes(nodeId) ? 1 : 0, // 0 集装箱拖车  1一般拖车 （操作单只有集装箱，传0即可）
      };
      if (nodeId === 82) {
        const gTrailerArr =
          (
            await this.comRepeatedRequest(this, getGeneralTrailer, {
              operationOrderId,
            })
          ).data || [];
        Object.assign(trailerRow, {
          id: gTrailerArr[gTrailerArr.length - 1]?.id,
          isSee: true,
          operationBtn: nodeId,
        });
      }
      this.$refs.trailerEditRef.show(trailerRow);
    },
    // 拖车(到港：拖车出发-nodeId-37、到达目的地-nodeId-15;离港：拖车出发-nodeId-41、到达目的地-nodeId-40)
    async handleTrailer(nodeId, mType = 0) {
      const { id: operationOrderId, operationOrderNum } = this.operateDetail;
      this.trailerNodeId = nodeId;
      let trailerInfoSingle = {};
      if (mType === 0) {
        const trailerInfo = await this["operateDetails/storeTrailerList"]({
          operationOrderId,
        });

        if (!trailerInfo.length) {
          return this.$message.error("无拖车数据");
        }
        trailerInfoSingle = trailerInfo[trailerInfo.length - 1];
      }

      const obj = {
        37: {
          title: "拖车出发",
          status: 1,
        },
        41: {
          title: "拖车出发",
          status: 1,
        },
        15: {
          title: "到达目的地",
          status: 2,
        },
        40: {
          title: "到达目的地",
          status: 2,
        },
        81: {
          title: "拖车完结",
          status: 2,
        },
      };
      if (nodeId == 37 || nodeId == 41) {
        const { id, trailerType } = trailerInfoSingle;
        this.$refs.trailerEditRef.show({
          id: id,
          trailerType: trailerType > 2 ? 2 : trailerType, //拖车类型  0 集装箱到港 1集装箱离港   2拖车到仓  3拖车离仓  4其他
          isSee: true,
          operationBtn: nodeId,
        });
        return;
      } else {
        let trailerStatusParams = {
          // 一般拖车
          operationOrderId, // 操作单ID
          operationOrderNum,
          status: obj[nodeId].status,
        };
        if (mType === 1) {
          const gTrailerArr =
            (
              await this.comRepeatedRequest(this, getGeneralTrailer, {
                operationOrderId,
              })
            ).data || [];
          this.preventRepeatedClicks = false; // 重置comRepeatedRequest方法中的状态值
          trailerStatusParams.id = gTrailerArr[gTrailerArr.length - 1]?.id;
        } else {
          Object.assign(trailerStatusParams, {
            type: 0, // 0: 集装箱拖车
            id: trailerInfoSingle.id,
            trailerType: [15, 37].includes(nodeId) ? 0 : 1, // 0: 到港 1: 离港
            status: obj[nodeId].status,
          });
        }
        this.comRepeatedRequest(
          this,
          setTrailerStatus,
          trailerStatusParams
        ).then(() => {
          this.handleSuccess();
          this.msgSuccess("当前拖车流程已完结");
        });
      }
    },
    // 报关信息(34：新增报关；20：编辑报关)
    async declareCustoms(nodeId, isRelease) {
      let declareObj = this.listData.customInfo || {};
      if (
        ["ec_operation_details"].includes(this.listData.viewBarSource) &&
        nodeId !== 46
      ) {
        declareObj =
          (await getCustomInfo({ operationOrderId: this.operateDetail.id }))
            .data || {};
      }
      this.$refs.declareCustomsDialog.show(
        {
          ...declareObj,
          toonId: this.operateDetail.id, // 传操作单id
          editDetailsId: declareObj.id ? false : true, // 是否需要调接口查询编辑详情
          status: nodeId === 46 ? 1 : 2,
          sortBoxId: this.operateDetail.sortBoxId,
          cusBId: declareObj.id ? `${declareObj.cusBId}` : "",
          operationOrderNum:
            declareObj.operationOrderNum ||
            this.operateDetail.operationOrderNum,
        },
        isRelease
      );
    },
    // 报关审核(nodeId:21)
    async examineDeclareCustoms() {
      let declareObj = this.listData.customInfo;
      if (
        ["ec_operation_details"].includes(this.listData.viewBarSource) &&
        !declareObj
      ) {
        declareObj =
          (await getCustomInfo({ operationOrderId: this.operateDetail.id }))
            .data || {};
      }
      const { id } = declareObj || {};
      if (!id) {
        return this.$message.error("请先处理报关信息");
      }
      this.$refs.examineFormRef.examineEvt(
        {
          id,
          operationOrderId: this.operateDetail.id,
        },
        {
          examineSuccess: () => {
            // 审核查验成功
            this.$emit("handleSuccess");
          },
        }
      );
    },
    // 提单(提单创建-nodeId-45、发DRAFT-nodeId-25、确认-nodeId-26)
    BOLManage(nodeId) {
      if (nodeId === 45) {
        this.$refs.BOLManageDialog.show(
          {
            operationOrderId: this.operateDetail.id,
            queryType: 1,
          },
          "add"
        );
      } else {
        //发DRAFT
        var obj = {
          status: 2,
          operationOrderId: this.operateDetail.id,
        };
        editPopBill(obj).then((res) => {
          this.$confirm("当前提单流程已完结!", "提单完结!", {
            confirmButtonText: "确定",
            showCancelButton: false,
            showClose: false,
            type: "success",
          }).then(() => {
            this.handleSuccess();
          });
        });
      }
    },
    // 整柜核实（nodeId: 32）
    handleCabinetVerify() {
      getPopBillGoods(this.operateDetail?.id).then((res) => {
        this.$refs.cabinetVerifyDialog.show({ ...res });
        return resolve(res);
      });
    },
    // 清关一审/二审交接（nodeId：54/44）
    handleCustomsClearance() {
      const { id: operationOrderId } = this.operateDetail;
      this.$refs.connectDlgRef?.show({
        operationOrderId,
        // webViewSource: "operationNode",
      });
    },
    // 清关审核交接（nodeId：54）
    // reviewHandover() {
    //   const { id: operationOrderId } = this.operateDetail;
    //   this.$refs.connectDlgRef?.show({
    //     operationOrderId,
    //   }, "examineFormLists");
    // },
    // 可操作按钮
    operableBtnArr(source) {
      const { orderType, isInvoice, isMainBill } = this.operateDetail;
      let filterBtn = []; // 需要过滤的按钮
      if (source === "operation") {
        // 不是传统操作单，不显示节点配置
        if (![3, 4].includes(orderType)) {
          filterBtn.push("nodeConfig");
        }
        if (![2].includes(orderType)) {
          filterBtn.push("printMarks");
        }
        if (![2].includes(orderType) || isInvoice !== 0 || this.isExtendOrder) {
          filterBtn.push("dispatchVehicles");
        }
        // 子系统操作单详情不显示“箱单发票导出”节点配置
        if (isMainBill === 5) {
          filterBtn.push("batchExportZip");
        }
        // 不是海运、空运，不显示节点配置
        // if (![2, 3, 4].includes(orderType)) {
        // }
        // 备注中不显示预计离港
        filterBtn.push("estimatedDeparture", "expectedArrival");
      } else {
        filterBtn.push("printMarks");
        filterBtn.push("dispatchVehicles");
      }
      const list = [...this.config.btnList[source]];
      if (!filterBtn.includes("dispatchVehicles")) {
        const arr = list.filter((e) => !filterBtn.includes(e.id));
        const index = arr.findIndex((e) => e.id === "dispatchVehicles");
        if (index > 0) {
          arr[index - 1].span = 12;
          arr[index].span = 12;
        }
        return arr;
      }
      return list.filter((e) => !filterBtn.includes(e.id));
    },
    // 离港到港操作按钮
    trajectoryBtnArr(source) {
      const { orderType, isMainBill } = this.operateDetail;
      let showBtn = []; // 展示的按钮
      if (source === "operation" && ![5, 6].includes(orderType)) {
        // 不是其他操作单，显示节点配置
        showBtn.push("estimatedDeparture", "expectedArrival");
        if (orderType === 2 && isMainBill !== 1) {
          showBtn.push("editGoodsAddress");
        }
      }
      return this.config.btnList[source].filter((e) => showBtn.includes(e.id));
    },
    // 处理点击
    handleClick(row) {
      if (row.isAlert) {
        // 时间确认弹窗
        switch (row.nodeId) {
          case 17: // 航次离港
            this.handleAirlineStatus(
              this.listData.airflight?.id,
              2,
              this.operateDetail.id
            );
            break;
          case 23: // 航次到港
            this.handleAirlineStatus(
              this.listData.airflight?.id,
              3,
              this.operateDetail.id
            );
            break;
          case 49:
            this.insuranceDialog(row);
            break;
          default:
            // 108-空运起飞、110-空运到达
            this.timeConfirmDialog(row);
            break;
        }
      } else {
        switch (row.nodeId) {
          case 5: // 订舱确定
            this.handleCheckIn();
            break;
          case 11:
            this.handleLoadContainer();
            break;
          case 12:
            this.handleCabinetInstallation();
            break;
          case 80: // 一般拖车登记
          case 82: // 一般拖车进度反馈
          case 39: // 登记拖车(离港)
          case 14: // 登记拖车(到港)
            this.registerTrailer(row.nodeId);
            break;
          case 37: // 拖车出发(到港)
            this.handleTrailer(row.nodeId);
            break;
          case 15: // 到达目的地(到港)
            this.handleTrailer(row.nodeId);
            break;
          case 41: // 拖车出发(离港)
            this.handleTrailer(row.nodeId);
            break;
          case 40: // 到达目的地(离港)
            this.handleTrailer(row.nodeId);
            break;
          case 81: // 一般拖车完结
            this.handleTrailer(row.nodeId, 1);
            break;
          case 9: // 入仓核实
            this.handleWarehousing();
            break;
          case 46: // 创建报关
            this.declareCustoms(row.nodeId);
            break;
          case 20: // 报关申报
            this.declareCustoms(row.nodeId, true);
            break;
          case 21: // 报关审核
            this.examineDeclareCustoms();
            break;
          case 45: // 提单创建
            this.BOLManage(row.nodeId);
            break;
          case 25: // 发DRAFT
            this.BOLManage(row.nodeId);
            break;
          case 26: // 提单确认
            this.BOLManage(row.nodeId);
            break;
          case 32: // 整柜核实
            this.handleCabinetVerify();
            break;
          case 44: // 电商二审/传统清关交接
            this.handleCustomsClearance();
            break;
          case 54: // 清关审核交接
            // this.reviewHandover();
            this.handleCustomsClearance();
            break;
          case 28: // 清关申报
          case 33: // 审核查验
          case 61: // 预计提拆柜
            this.examineCustomsClearance(row, this.operateDetail.id);
            break;
          case 62: // 实际提拆柜
            this.onStripping(this.operateDetail.id);
            break;
          case 57: // 操作接单
            this.operationSubmit(row);
            break;
          case 72:
          case 111:
          case 112:
          case 113:
            this.handleBillSending(row.code);
            break;
          case 114:
            this.handleMixinUploadDialogFile(this.operateDetail, () => {
              this.handleSuccess();
            });
            break;
          default:
            break;
        }
      }
    },
    /** 操作接单 */
    operationSubmit() {
      const { id, orderType, operationRemark } = this.operateDetail;
      const params = {
        id,
        isOperation: 1,
        operationRemark,
      };
      this.$refs.receivingRef.show(params, {}, orderType);
    },
    /** 账单发送 */
    handleBillSending(nodeCode) {
      msgTipBox(this, { msg: "确定发送账单？" }, () => {
        const sendOpt = {
          name: "账单已发送",
          nodeCode: nodeCode || "26000",
          operationOrderIds: [this.operateDetail.id],
        };
        this.comRepeatedRequest(this, putOrderBillSending, sendOpt).then(() => {
          this.handleSuccess();
        });
      });
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      // window.location.reload();
    },
    handleSuccessTrailer(row) {
      const obj = {
        37: {
          status: 1,
        },
        41: {
          status: 1,
        },
        15: {
          status: 2,
        },
        40: {
          status: 2,
        },
      };
      if (this.trailerNodeId && (this.trailerNodeId == 37 || 41)) {
        const { id: operationOrderId, operationOrderNum } = this.operateDetail;
        const params = {
          type: 0, // 0: 集装箱拖车
          trailerType: [15, 37].includes(this.trailerNodeId) ? 0 : 1, // 0: 到港 1: 离港
          id: row.data,
          operationOrderId,
          operationOrderNum,
          status: obj[this.trailerNodeId].status,
        };
        setTrailerStatus(params).then((res) => {
          this.$emit("handleSuccess");
        });
      } else {
        this.$emit("handleSuccess");
      }
    },
    ...mapActions(["operateDetails/storeTrailerList"]),
  },
  created() {},
};
/**
 * 字段说明
 * freightType 0-FCL整柜 1-LCL散货
 * operationOrderType 0-海运 1-空运
 */
</script>

<style lang="scss" scoped>
.com-operate {
  .operate-status {
    display: flex;
    font-size: 14px;
    height: 34px;
    line-height: 34px;
    border-radius: 4px;
    border: 1px solid #5094ff;
    margin-top: 44px;
    text-align: center;
    overflow: hidden;

    & > span:nth-child(1) {
      width: 74px;
      height: 34px;
      line-height: 34px;
      background: #5094ff;
      color: #fff;
    }
    // /deep/ .el-select {
    //   .el-input__inner {
    //     height: 34px;
    //     line-height: 34px;
    //     text-align: center;
    //     border-color: transparent;
    //   }
    // }
  }
  // .title {
  //   font-size: 14px;
  //   font-weight: bold;
  //   margin: 25px 0 10px;
  //   color: #515151;
  // }
  .trajectory-btn {
    /deep/ {
      .operate-btn {
        border: none;
      }
    }
  }
}
</style>
