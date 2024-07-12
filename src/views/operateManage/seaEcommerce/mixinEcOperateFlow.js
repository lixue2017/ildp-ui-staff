// 电商操作流程
import { editOperationRemark } from "@/api/operateManage/common";
import { getCustomInfo } from "@/api/operateManage/details.js";
import {
  getRouteNoWaitRouteNew,
  putBookingUnCheck,
  addSono,
} from "@/api/marketManage/airline.js";
import { remarkDialogCols } from "_comp/ConfirmDialog/customFormDialog/model.js";
import { soNoCols } from "_comp/ComOperate/model";
import { customMessageBox } from "@/utils/confirmBox.js";

export const mixinEcOperateFlow = {
  data() {
    return {
      stateTabBtn: [
        {
          text: "操作备注",
          cTypeArr: ["120"], // 接单前
          handleClick: (r) => this.handleOperationRemark(r),
        },
        {
          text: "报关登记",
          nodeIndex: 0,
          cTypeArr: ["150"], // 报关
          handleClick: (r) => {
            this.$refs.declareCustomsDialog.show({
              toonId: r.id, // 操作单id
              editDetailsId: true, // 是否需要调接口查询编辑详情
              status: 1,
              sortBoxId: r.sortBoxId,
              operationOrderNum: r.operationOrderNum,
            });
          },
        },
        {
          text: "报关放行",
          cTypeArr: ["150"], // 报关
          nodeIndex: 1,
          handleClick: (r) => this.handleOperationDeclare(r, true, "报关放行"),
        },
        {
          text: "报关修改",
          nodeIndex: 1,
          cTypeArr: ["150"], // 报关
          handleClick: (r) => this.handleOperationDeclare(r),
        },
        {
          text: "订舱登记",
          nodeIndex: 0,
          cTypeArr: ["140"], // 操作订舱
          handleClick: (r) => this.handleCheckIn(r),
        },
        {
          text: "解绑",
          bookingSpaceState: [1],
          cTypeArr: ["140"],
          handleClick: (r) => this.handleUnCheck(r),
        },
      ],
    };
  },
  methods: {
    handleOperationRemark(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols({
          title: "备注",
          label: "操作备注：",
          id: "operationRemark",
        }),
        formModel: {
          ...row, // 需要后台返回回显值
        },
        httpRequest: (obj) => {
          return editOperationRemark({
            id: row.id,
            operationOrderNum: row.operationOrderNum,
            operationRemark: obj.operationRemark || "", // 后台返回为null时转为字符串类型
          });
        },
        successFunction: () => {
          this.msgSuccess("操作备注保存成功");
          this.mixinkeepTable();
        },
      });
    },
    // 操作订舱-市场订舱无需按钮
    async handleCheckIn(row) {
      const { airLineId, freightType, isBookingSpace } = row || {};
      let pageLocation = 3; // 3-操作订舱LCL
      if (isBookingSpace == 1) {
        this.$refs.customDialogRef?.showCustomDialog({
          customFormConfig: soNoCols,
          httpRequest: ({ sono }) => {
            const opt = {
              routeNoManageId: airLineId, // 航次id
              sono, //sono号
              orderId: row.id,
            };
            return addSono(opt);
          },
          successFunction: () => this.mixinkeepTable(),
        });
      } else {
        const { rows = [] } = await getRouteNoWaitRouteNew({
          operationOrderIdIn: row.id,
          pageLocation,
          isBookingSpace,
        });
        this.$refs.BookingDialog?.show(
          rows[0] || {
            freightType,
          }
        );
      }
    },
    handleUnCheck(row) {
      customMessageBox(
        this,
        {
          msgTitle: "解绑",
          msgTxt1: "确定解绑？",
          msgTxt2: "",
          httpMsgRequest: () => putBookingUnCheck({ id: row.id }),
        },
        () => {
          this.mixinkeepTable();
        }
      );
    },
    // 报关
    handleOperationDeclare(r, isRelease, title) {
      getCustomInfo({ operationOrderId: r.id }).then((res) => {
        const { status, exportType, ...rData } = res.data || {};
        this.$refs.declareCustomsDialog.show(
          {
            ...rData,
            status: isRelease ? 2 : status || 1,
            exportType: this.typeConversion(exportType),
            registerNo: r.wholeCabinetSn,
            operationOrderNum: r.operationOrderNum,
          },
          isRelease,
          title
        );
      });
    },
  },
  components: {
    OrderSubmit: () =>
      import("@/views/newOrderManage/components/OrderSubmit/index.vue"),
    TabSearchColumn: () => import("_comp/ComColumnConf/SearchColumn"),
    BookingDialog: () =>
      import("@/views/marketManage/components/bookingRegistration/index.vue"),
    DeclareCustomsDlg: () =>
      import(
        "@/views/operateManage/operateRecord/declareCustoms/editDeclareDlg.vue"
      ), // 报关
  },
};
