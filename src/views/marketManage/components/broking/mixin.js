import {
  getRouteNoWaitRouteNew,
  putBookingUnCheck,
  addSono,
  sendBackFcl,
} from "@/api/marketManage/airline.js";
import {
  marketBookingFcl,
  marketBookingLcl,
  workSheetBookingLcl,
  soNoCols,
} from "@/views/marketManage/components/broking/model.js";
import { msgTipBox } from "@/utils/confirmBox.js";
import { remarkDialogCols } from "_comp/ConfirmDialog/customFormDialog/model.js";

export const mixinBroking = {
  data() {
    return {
      statusList: [
        {
          text: "订舱登记",
          tabName: "1",
          handleClick: (r) => this.handleRegistration(r),
        },
        {
          text: "打回",
          tabName: "1",
          hideMainBill: [1, 2, 5],
          freightType: [0],
          color: "#ff6767",
          handleClick: (r) => this.handleRepulseDialog(r),
        },
        {
          text: "解绑",
          tabName: "2",
          showisBookingSpace: [1, 2],
          handleClick: (r) => this.handleUnCheck(r),
        },
        {
          text: "登记SONo",
          tabName: "2",
          showSono: [0, "0"],
          handleClick: (r) => this.handleRegistration(r, "register"),
        },
      ],
    };
  },
  methods: {
    handleRepulseDialog(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols(),
        httpRequest: (obj) => {
          return sendBackFcl({
            id: row.id,
            remark: obj.remark,
          });
        },
        successFunction: () => {
          this.msgSuccess("打回成功");
          this.mixinkeepTable();
        },
      });
    },
    getSearchFormConfig(tab) {
      //获取搜索条件列表
      const { activeName, type } = this.tabsConfig;
      const lists = {
        marketBookingFcl: marketBookingFcl().formColumns[activeName],
        marketBookingLcl: marketBookingLcl().formColumns[activeName],
        workSheetBookingLcl: workSheetBookingLcl().formColumns[activeName],
      };
      return {
        ...this.searchFormConfig,
        lists: lists[type],
      };
    },
    searchList(searchFrom = {}) {
      //搜索字段
      const { activeName } = this.tabsConfig;
      const { createTime, ...searchObj } = searchFrom;
      this.searchFromData[activeName] = {
        ...searchObj,
        createTimeBegin: createTime && createTime[0],
        createTimeEnd: createTime && createTime[0],
      };
      this.mixinkeepTable(true);
    },
    getTableQueryParams(row) {
      //接口请求的参数
      const { activeName, type } = this.tabsConfig;
      //1=市场订舱FCL；2=市场订舱LCL；操作订舱LCL
      const pageLocation = {
        marketBookingFcl: 1,
        marketBookingLcl: 2,
        workSheetBookingLcl: 3,
      };
      return {
        ...this.searchFromData[activeName],
        pageLocation: pageLocation[type],
        isBookingSpace: activeName - 1,
      };
    },
    httpRequest(row) {
      return getRouteNoWaitRouteNew(row);
    },
    handleView(row) {
      //sono跳转详情
      const { operationOrderNum } = row;
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((item) => item.routeNoId);
      this.$router.push({
        path: "/marketManage/airlineFlightDetails",
        query: {
          id: row.routeNoId,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
          operationOrderNum,
        },
      });
    },
    handleRegistration(row, type) {
      const { type: tabType } = this.tabsConfig;
      const freightTypeLists = {
        //装柜方式 0-整柜  1-拼柜
        marketBookingFcl: "0",
        marketBookingLcl: "1",
        workSheetBookingLcl: "1",
      };
      const freightType = freightTypeLists[tabType];
      const { isMainBill, routeNoId: routeId, id: operationOrderId } = row;
      if (
        type === "register" &&
        freightType === "1" &&
        [0, 5].includes(isMainBill)
      ) {
        this.handleSoNo({
          routeId,
          operationOrderId,
        });
      } else {
        this.$refs.BookingDialog?.show(
          row,
          type,
          freightType === "0" && this.tabsConfig.activeName == 2
        );
      }
    },
    handleCheckIn(row) {
      const { type } = this.tabsConfig;
      const freightTypeLists = {
        //装柜方式 0-整柜  1-拼柜
        marketBookingFcl: "0",
        marketBookingLcl: "1",
        workSheetBookingLcl: "1",
      };
      const freightType = freightTypeLists[type];
      let bookType; //订舱类型
      if (freightType == 0) {
        //整柜
        bookType = 20;
      } else if (freightType == 1) {
        //散货
        bookType = 30;
      }
      const {
        id,
        operationOrderNum,
        isMainBill,
        routeNoId,
        orderType,
        orderId,
        operationOrderType,
        shippingMode,
      } = row;
      if (
        +freightType == 0 ||
        (orderType == 2 && freightType == 1 && operationOrderType == 0)
      ) {
        // 堡森订舱：整柜/电商头程海运散货
        this.$refs.dialog.show({
          operationOrderIds: id,
          operationOrderId: id,
          orderNo: operationOrderNum,
          type: orderType,
          orderId,
          orderType: orderType,
          operationType: "operation",
          routeId: routeNoId,
          freightType: freightType,
          isMainBill: isMainBill,
          bookType: bookType,
          shippingMode,
        });
      } else {
        // 同行订舱（传统订单）
        this.$refs.dialog.show({
          operationOrderIds: id,
          operationOrderId: id,
          orderNo: operationOrderNum,
          operationType: "operation",
          orderId,
          orderType: orderType,
          routeId: routeNoId,
          freightType: freightType,
          isMainBill: isMainBill,
          bookType: bookType,
          shippingMode,
        });
      }
    },
    handleUnCheck(row) {
      msgTipBox(this, { title: "解绑", msg: "确定解绑？" }, () => {
        this.comRepeatedRequest(this, putBookingUnCheck, { id: row.id }).then(
          () => {
            this.mixinkeepTable();
          }
        );
      });
    },
    statusBtnListFn(tName, row) {
      let { isSoNo, isBookingSpace, isMainBill, freightType } = row;
      // isSoNo = isSoNo === 0 ? 0 : 1;
      // return this.statusList.filter(
      //   (e) =>
      //   e.tabName === tName
      //   && (!e.sono || e.sono.includes(isSoNo))
      // );
      return this.statusList.filter(
        (e) =>
          e.tabName === tName &&
          (e.showisBookingSpace
            ? e.showisBookingSpace.includes(isBookingSpace)
            : true) &&
          (e.hideMainBill ? !e.hideMainBill.includes(isMainBill) : true) &&
          (e.freightType ? e.freightType.includes(freightType) : true) &&
          (e.showSono ? e.showSono.includes(isSoNo) : true)
      );
    },
    openSoNoCheckIn(row) {
      const { type } = this.tabsConfig;
      const freightTypeLists = {
        //装柜方式 0-整柜  1-拼柜
        marketBookingFcl: "0",
        marketBookingLcl: "1",
        workSheetBookingLcl: "1",
      };
      const freightType = freightTypeLists[type];
      let bookType; //订舱类型
      if (freightType == 0) {
        //整柜
        bookType = 20;
      } else if (freightType == 1) {
        //散货
        bookType = 30;
      }
      const {
        id,
        operationOrderNum,
        isMainBill,
        routeNoId,
        orderType,
        orderId,
        operationOrderType,
      } = row;
      let params = {};
      if (
        +freightType == 0 ||
        (orderType == 2 && freightType == 1 && operationOrderType == 0)
      ) {
        // 堡森订舱：整柜/电商头程海运散货
        params = {
          operationOrderIds: id,
          operationOrderId: id,
          orderNo: operationOrderNum,
          type: orderType,
          orderId,
          orderType: orderType,
          operationType: "operation",
          routeId: routeNoId,
          freightType: freightType,
          isMainBill: isMainBill,
          bookType: bookType,
        };
      } else {
        // 同行订舱（传统订单）
        params = {
          operationOrderIds: id,
          operationOrderId: id,
          orderNo: operationOrderNum,
          operationType: "operation",
          orderId,
          orderType: orderType,
          routeId: routeNoId,
          freightType: freightType,
          isMainBill: isMainBill,
          bookType: bookType,
        };
      }
      if (freightType === "1" && isMainBill === 0) {
        this.handleSoNo(params);
      } else {
        this.$refs.soNoCkInDialog.show(params, true);
      }
    },
    handleSoNo(row) {
      this.$refs.confirmDlgRef?.showCustomDialog({
        httpRequest: ({ sono }) => {
          const opt = {
            routeNoManageId: row.routeId, //航次id
            sono, //sono号
            orderId: row.operationOrderId, //操作单id
          };
          return addSono(opt);
        },
        successFunction: this.mixinkeepTable,
        customFormConfig: soNoCols,
      });
    },
  },
  components: {
    AddEditDialog: () =>
      import(
        "@/views/marketManage/airlineFlight/components/AddEditDialog/index.vue"
      ),
  },
};
