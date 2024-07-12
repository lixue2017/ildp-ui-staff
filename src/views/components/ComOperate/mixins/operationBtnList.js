// 操作按钮事件
import { postNodeTime } from "@/api/operateManage/common";
import { changeMembers } from "@/api/warehouse/prediction";
import { formDlgCols } from "../model";
import { examineFormConfig } from "@/views/overseasBusiness/components/Trajectory/model.js";
import {
  addExamine,
  POSTBatchAddOperation,
} from "@/api/operateRecord/customsClearance";
import { batchExportDownload } from "@/api/operateManage/common.js";
import { exportClearanceInvoice } from "@/api/operateRecord/clearanceGoods.js";
import { comFileDownload } from "@/utils/download.js";
export const mixinOperable = {
  data() {
    return {
      showBarTabArr: [
        {
          isTabShow: false,
          tabKey: "stateBar",
          name: this.overseaLangObj.gj_trajectory() || "轨迹",
        },
        {
          isTabShow: false,
          tabKey: "remarkBar",
          className: "remarks-bar",
          name: this.overseaLangObj.bz_remark() || "备注",
        },
      ],
      operateDetail: {},
    };
  },
  methods: {
    handleDispatchVehicles() {
      const { orderId } = this.operateDetail;
      this.$router.push({
        path: "/newOrderManage/dispatchVehicles",
        query: {
          orderId,
        },
      });
    },
    handleBtnClick(bItem, obj) {
      const { id: oId } = bItem || {};
      const {
        id: operateId,
        orderType,
        customerId,
        countryId,
        country,
      } = this.operateDetail;
      switch (oId) {
        case "changeMembers":
          this.$refs.changeMembersDialog?.show(this.operateDetail);
          break;
        case "dispatchVehicles":
          this.handleDispatchVehicles();
          break;
        case "releaseGoods":
          this.$refs.releaseGoodsDialog?.show(this.operateDetail);
          break;
        case "declareCustoms":
          this.$refs.declareCustomsDialog?.show({
            toonId: this.operateDetail.id, // 传操作单id
            editDetailsId: true, // 是否需要调接口查询编辑详情
          });
          break;
        case "registration":
          const {
            id: operationOrderId,
            operator: followUserid,
            fileMember: busUserid,
            operationOrderNum: operationOrderNum,
          } = this.operateDetail;
          const { cabinProxy: agent, shipCompany } =
            this.listData.airflight || {};
          this.$refs.addDOCDialog?.show({
            operationOrderId,
            operationOrderNum,
            followUserid,
            busUserid,
            agent,
            shipCompany,
          });
          break;
        case "changeNewMembers":
          const { operator, fileMember, id } = this.operateDetail;
          this.$refs.confirmDialog?.handleFormDialog("changeMembers", {
            formModel: {
              overseasOperator: operator,
              csOperator: fileMember,
            },
            httpRequest: (formData) => {
              // console.log(formData);
              const params = {
                ...formData,
                operationOrderId: id,
              };
              return changeMembers(params);
            },
            successFunction: this.handleSuccess,
          });
          break;
        case "addBill":
          // this.$emit("handleAddBill");
          break;
        case "createdBill":
          //20220914新增操作单详情生成对账单
          // this.createdBill();
          break;
        case "nodeConfig":
          // console.log('nodeConfig=', '节点配置')
          const { transportMode } = this.listData.basicInfo || {};
          const {
            operationOrderType,
            freightType,
            tradeClause,
            orderType: nodeConfigOrderType,
            transportMode: operateTransportMode,
          } = this.operateDetail;
          this.$refs.nodeConfRef?.showNodeDialog({
            operateId,
            operationOrderType,
            freightType,
            tradeClause,
            orderType:
              freightType == 1 && //散货
              ["1", "2", "0"].includes(tradeClause) && //D开头贸易条款
              transportMode == 4 //快递
                ? 9
                : nodeConfigOrderType,
            transportMode: operateTransportMode,
          });
          break;
        case "estimatedDeparture":
          // console.log('nodeConfig=', '预计离港')
          this.$refs.customDlgRef?.showCustomDialog({
            httpRequest: ({ estimatedTime }) => {
              return postNodeTime({
                trajectoryTime: estimatedTime,
                nodeId: 17, // 离港-17；到港-23
                // msg: "",
                operationOrderId: this.operateDetail.id,
              });
            },
            successFunction: this.handleSuccess,
            customFormConfig: formDlgCols(),
          });
          break;
        case "expectedArrival":
          // console.log('nodeConfig=', '预计到港')
          this.$refs.customDlgRef?.showCustomDialog({
            httpRequest: ({ estimatedTime }) => {
              return postNodeTime({
                trajectoryTime: estimatedTime,
                nodeId: 23, // 离港-17；到港-23
                // msg: "",
                operationOrderId: this.operateDetail.id,
              });
            },
            successFunction: this.handleSuccess,
            customFormConfig: formDlgCols({ modelType: "arrival" }),
          });
          break;
        // case "changeContent":
        //   // console.log('==', oId, obj, this.operateDetail)
        //   const {  id: cOId } = this.operateDetail;
        //   if (obj.value === '1') {
        //     // 收发通更换
        //     this.$refs.contactRef.show(cOId, {
        //       successFunction: this.handleSuccess,
        //     });
        //   }
        //   if (obj.value === "2") {
        //     // 内容更换
        //     this.$refs.contentRef.show(cOId, {
        //       successFunction: this.handleSuccess,
        //     });
        //   }
        //   break;
        case "sofaTownChange":
          //收发通更换
          this.$refs.contactRef.show(operateId, {
            orderType,
            successFunction: this.handleSuccess,
          });
          break;
        case "contentChange":
          //内容更换
          this.$refs.contentRef.show(operateId, {
            successFunction: this.handleSuccess,
          });
          break;
        /** 清关详情操作 */
        case "customsRegistration": // 清关登记
          this.$emit("handleRegistration");
          break;
        case "customsEstimate": // 预约、实际派送
        case "customsActual":
          this.$refs.dispatchRef?.dispatchDialog(bItem.btnType, {
            successFunction: this.handleSuccess,
          });
          break;
        case "batchExportZip":
          comFileDownload(this, exportClearanceInvoice, {
            operationOrderId: this.operateDetail.id,
            importType: 5,
          });
          break;
        case "customsExamineInfo":
          const {
            joinOrderId: operationId,
            id: clearanceId,
            orderType,
          } = this.formData;
          this.$refs.customDlgRef?.showCustomDialog({
            httpRequest: (formData) => {
              const { examine, ...obj } = formData;
              const details = (examine || []).map((e) => {
                return {
                  operationOrderId: e.operationId,
                  examineNo: e.bsNo,
                  customerId: e.customerId,
                  customerName: e.customerName,
                  index: orderType == 2 ? e.index : undefined,
                };
              });
              const params = {
                ...obj,
                clearanceId,
                details,
              };
              return POSTBatchAddOperation(params);
            },
            successFunction: this.handleSuccess,
            customFormConfig: examineFormConfig({
              operationId,
              orderType,
              clearanceId,
            }),
          });
          break;
        case "devanning": // 预计提拆柜
        case "warehousing": // 入仓登记
          this.$emit("devanningWarehousing", bItem);
          break;
        case "clearanceConfig": //业务配置
          this.$refs.ServiceConfigDialogRef?.show(this.formData);
          break;
        case "release":
          const {
            joinOrderId,
            packingMethod,
            nlCode,
            operationOrderNum: releaseOperationOrderNum,
            bailorPeopleName,
            operationMainName,
            businessNnitName,
          } = this.formData;
          const params = {
            type_num: 2, //清关放行，列表也是定死的
            operationOrderId: joinOrderId,
            packingMethod,
            nlCode,
            operationOrderNum: releaseOperationOrderNum,
            bailorPeopleName,
            operationMainName,
            businessNnitName,
          };
          this.$refs.dialogFormRef?.show(params);
          break;
        case "printMarks":
          this.showPrint();
          break;
        case "editGoodsAddress":
          // 维护货物地址
          this.$refs.addressDlgRef?.editShow(
            {
              operationOrderId: operateId,
              customerId,
              countryId: countryId || country,
            },
            {
              editSuccess: () => this.handleSuccess(),
            }
          );
          break;
        default:
          break;
      }
    },
    showPrint() {
      this.$refs.comPrintRef.show({
        type: 2,
      });
    },
    handleSuccess() {
      this.$emit("handleSuccess");
    },
  },
  created() {},
  activated() {},
  deactivated() {},
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
    NodeConfigDialog: () =>
      import("_comp/ComOperate/components/NodeConfigDialog"), // 节点配置
    OperateSidebarCard: () => import("../components/operateCard"),
    OperatingRemarks: () => import("../components/remarks"), // 备注信息
    ChangeOperateContacts: () =>
      import("../components/contentChange/contacts.vue"), // 收发通人员更换
    ChangeOperateContent: () =>
      import("../components/contentChange/content.vue"), // 更改内容
    editDialogForm: () =>
      import(
        "@/views/operateManage/operateRecord/customsClearance/editDialog.vue"
      ),
    SoNoCheckIn: () =>
      import(
        "@/views/marketManage/forBooking/components/SoNoCheckIn/index.vue"
      ), // 登记sono
  },
};
