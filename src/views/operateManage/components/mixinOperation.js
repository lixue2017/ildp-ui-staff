import {
  seaEcommerceModel,
  seaTraditionModel,
  airEcommerce,
  airTradition,
  otherOperateModel,
} from "./model";
import { mapActions, mapState } from "vuex";
import {
  getOtherOperateList,
  traditionOperationList,
  getOperationListNew,
  exportDSOrderList,
  exportCTOrderList,
  exportQTOrderList,
  getTraditionAllOperationList,
} from "@/api/operateManage/common";
import {
  postBatchOrderReceiving,
  postBusinessRepulse,
} from "@/api/order/firstTransport.js";
import { comFileDownload } from "@/utils/download.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { remarkDialogCols } from "_comp/ConfirmDialog/customFormDialog/model.js";

export default {
  data() {
    return {
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        labelWidth: "98px",
      },
      operationBtn: [
        {
          text: "操作接单",
          status: [15],
          isEcMain: true,
          includesOperationAccept: [0],
          handleClick: this.operationSubmit,
        },
        {
          text: "打回",
          status: [20],
          isMainBill: 5, //0正常单   1,2是主单  3拆单后的主单   5是子系统接单   7是拆单后的子单   9拼柜子单
          color: "#FF6767",
          handleClick: (r) => this.handleRepulseDialog(r),
        },
      ],
      freightBtn: [
        {
          text: "操作接单",
          status: [24],
          isEcMain: true,
          handleClick: this.operationSubmit,
        },
        {
          text: "打回",
          status: [20],
          isMainBill: 5,
          color: "#FF6767",
          handleClick: (r) => this.handleRepulseDialog(r),
        },
      ],
      lists: {
        seaEcommerce: {
          exportHttpRequest: exportDSOrderList,
          search: seaEcommerceModel().search,
          searchFromData: {
            // operationOrderType: 0,//0海运，1空运，2-其他
            orderType: 2, //2电商，3海运，4空运，56其他订单
          },
        },
        seaTradition: {
          exportHttpRequest: exportCTOrderList,
          search: seaTraditionModel().search,
          searchFromData: {
            operationOrderType: 0,
            orderType: 3,
          },
        },
        airEcommerce: {
          //不确定空运电商是不是已经停用或已与海运电商合并至同一个页面
          exportHttpRequest: exportDSOrderList,
          search: airEcommerce.search,
          searchFromData: {
            // operationOrderType: 1,
            // orderType: 2
          },
        },
        airTradition: {
          exportHttpRequest: exportCTOrderList,
          search: airTradition.search,
          searchFromData: {
            operationOrderType: 1,
            orderType: 4,
          },
        },
        otherOperate: {
          exportHttpRequest: exportQTOrderList,
          search: otherOperateModel.search,
          searchFromData: {
            operationOrderType: 2,
          },
        },
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: (params) => {
          const { type, page_list } = this.tabsConfig;
          if (page_list == "traditionFlow") {
            // 传统流程(海运/空运/其他)
            const { operationOrderType, orderType, isDataFil, ...nParams } =
              params;
            return getTraditionAllOperationList(nParams);
          }
          if (type == "seaEcommerce" || type == "airEcommerce") {
            //海运电商，空运电商
            return getOperationListNew(params);
          }
          if (type == "otherOperate") {
            // 其他
            return getOtherOperateList(params);
          }
          // 海运传统，空运传统
          return traditionOperationList(params);
        },
        getQueryParams: this.getQueryParams,
      },
      tabBtnArr: [
        {
          table: "批量接单",
          disabled: true,
          hideTabBtn: false,
          handleClick: this.handleBatch,
        },
      ],
      selectionRows: [],
      queryParams: {},
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    if (this.tabsConfig) {
      this.tabsConfig.btnArr = [...this.tabBtnArr, ...this.tabsConfig.btnArr];
      // this.$set(this.tabsConfig, "btnArr", this.tabBtnArr);
      if (this.tabsConfig.page_list) {
        this.$set(
          this.lists.seaEcommerce,
          "search",
          seaEcommerceModel(this.tabsConfig.page_list).search
        );
        this.$set(
          this.lists.seaTradition,
          "search",
          seaTraditionModel(this.tabsConfig.page_list).search
        );
      }
    }
    this["dictionary/getDictionary"]("operateList").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    handleExport(type) {
      const exportHttpRequest = this.lists[type].exportHttpRequest;
      const params = {
        ...this.lists[this.tabsConfig.type]?.searchFromData,
        isDataFil: 1,
      };
      comFileDownload(this, exportHttpRequest, params);
    },
    handleInitParam() {
      let params = this.$route.params;
      const { params: queryParams, ...urlParam } = this.$route.query;
      if (queryParams) {
        params = JSON.parse(queryParams);
        let url = this.$route.path;
        if (Object.keys(urlParam).length) {
          url += `?${qs.stringify(urlParam)}`;
        }
        window.history.replaceState("", "", url);
      }
      if (
        (params && Object.keys(params).length) ||
        Object.keys(this.queryParams).length
      ) {
        const { type } = this.tabsConfig;
        let searchFromData = {
          ...(this.lists[type].searchFromData || {}),
        };
        if (Object.keys(params).length) {
          this.queryParams = params;
          searchFromData = {
            ...searchFromData,
            ...params,
          };
        } else {
          Object.keys(this.queryParams).forEach((key) => {
            if (searchFromData[key]) delete searchFromData[key];
          });
          this.queryParams = {};
        }
        this.searchFormConfig.formModel = {
          ...searchFromData,
        };
        this.lists[type].searchFromData = { ...searchFromData };
      }
    },
    getSearchList(searchFrom = {}) {
      // console.log('==', this.tabsConfig.type)
      const {
        beginTime,
        insured,
        operationOrderStatusIn,
        tradeClauseSearch,
        webAllSearchFormData,
        ...nSearchFrom
      } = searchFrom;
      let params = {};
      switch (this.tabsConfig.type) {
        case "seaEcommerce": // 海运电商
        case "airEcommerce": // 空运电商
          params = {
            orderBusinessTypeSearch:
              searchFrom.orderBusinessTypeSearch &&
              searchFrom.orderBusinessTypeSearch.join(","),
            reportCustomsWays:
              searchFrom.reportCustomsWays &&
              searchFrom.reportCustomsWays.join(","),
            orderType:
              this.lists[this.tabsConfig.type].searchFromData.orderType,
          };
          break;
        case "seaTradition": // 海运传统
        case "airTradition": // 空运传统
          // const orderTypeObj = {
          //   0: 3,
          //   1: 4
          // }
          // params = {
          //   orderType: orderTypeObj[nSearchFrom.operationOrderType]
          // }
          params = {
            operationOrderType:
              this.lists[this.tabsConfig.type].searchFromData
                .operationOrderType,
            orderType:
              this.lists[this.tabsConfig.type].searchFromData.orderType,
            tradeClauses: tradeClauseSearch && tradeClauseSearch.join(","),
          };
          break;
        default:
          params = {
            operationOrderType:
              this.lists[this.tabsConfig.type].searchFromData
                .operationOrderType,
          };
          break;
      }

      //获取FORM条件搜索参数
      this.lists[this.tabsConfig.type].searchFromData = {
        // operationOrderType:
        //   this.lists[this.tabsConfig.type].searchFromData.operationOrderType,
        // orderType: this.lists[this.tabsConfig.type].searchFromData.orderType,
        ...nSearchFrom,
        operationOrderStatusIn: operationOrderStatusIn?.length
          ? operationOrderStatusIn.join(",")
          : undefined,
        createTimeBegin: beginTime?.length && beginTime[0],
        createTimeEnd: beginTime?.length && beginTime[1],
        insured: insured === 0 || insured ? !!insured : undefined,
        ...params,
      };
      this.mixinkeepTable(true, {
        isTableSearch: true,
        webAllSearchFormData,
      });
      // this.$refs[`tableRef${this.tabsConfig.activeName}`][0].refreshTable();
    },
    getSearchFormConfig() {
      //获取搜索FORM列表
      return {
        ...this.searchFormConfig,
        residueCols: [2],
        searchColsHeight: true,
        isGetSearchAll: true,
        lists: this.lists[this.tabsConfig.type].search,
      };
    },
    getQueryParams() {
      //请求接口默认参数
      const { operationOrderStatusIn } =
        this.lists[this.tabsConfig.type].searchFromData;
      Array.isArray(operationOrderStatusIn) &&
        (this.lists[
          this.tabsConfig.type
        ].searchFromData.operationOrderStatusIn =
          operationOrderStatusIn.join(","));
      return {
        ...(this.mixinSearchConfParams || {}),
        ...this.lists[this.tabsConfig.type].searchFromData,
        isDataFil: 1,
      };
    },
    handleView(row, type) {
      //跳转详情
      const { operationOrderType, isMainBill } = row;
      let idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0].tableData
        .filter((f) => f.operationOrderType === operationOrderType)
        .map((e) => e.id);
      let extend = "";
      if (isMainBill === 5) {
        extend = "/extend";
      }
      let pathUrl = "";
      switch (operationOrderType) {
        case 0:
          pathUrl = `/operateManage/seaTransDetails${extend}`;
          break;
        case 1:
          pathUrl = `/operateManage/airTransDetails${extend}`;
          break;
        case 2:
          pathUrl = "/operateManage/otherDetails";
          break;
      }
      if (row.orderType === 2) {
        // 电商详情
        idList = this.$refs[
          `tableRef${this.tabsConfig.activeName}`
        ][0].tableData.map((e) => e.id);
        pathUrl = "/operateManage/ecOperateDetails";
      }
      this.$router.push({
        path: pathUrl,
        query: {
          id: row.id, // 操作单ID
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    getOperationBtn(row) {
      // const { orderType } = this.lists[this.tabsConfig.type]?.searchFromData;
      const {
        orderType,
        isMainBill,
        operationOrderNum,
        freightType,
        operationOrderStatus,
        isOperationAccept,
      } = row;
      if (isMainBill === 7) {
        return [];
      }
      if (operationOrderNum?.toLocaleUpperCase().includes("ZJB")) {
        // 中进宝主单没有操作接单
        if (isMainBill === 1) {
          return [];
        }
      }
      if (freightType === 0 && [2, 3, 4].includes(orderType)) {
        // 0-FCL整柜在订舱后接单
        return this.freightBtn.filter(
          (e) =>
            e.status.includes(operationOrderStatus) &&
            (!e.isMainBill || e.isMainBill !== isMainBill) &&
            (e.isEcMain && orderType == 2 ? ![1, 2].includes(isMainBill) : true)
        );
      }
      // return this.operationBtn.filter(
      //   (e) =>
      //     e.status.includes(operationOrderStatus) &&
      //     (!e.isMainBill || e.isMainBill !== isMainBill) &&
      //     (e.isEcMain && orderType == 2 ? ![1, 2].includes(isMainBill) : true)
      // );
      return this.operationBtn.filter((e) => {
        // operationAccept 传统空运LCL已订舱状态是否进行过操作接单   isOperationAccept   0未操作接单  1已操作接单
        const operationAccept = e.includesOperationAccept
          ? e.includesOperationAccept.includes(isOperationAccept) &&
            orderType == 4 &&
            freightType == 1 &&
            [18, 24].includes(operationOrderStatus)
          : e.status.includes(operationOrderStatus);
        return (
          (e.status.includes(operationOrderStatus) || operationAccept) &&
          (!e.isMainBill || e.isMainBill !== isMainBill) &&
          (e.isEcMain && orderType == 2 ? ![1, 2].includes(isMainBill) : true)
        );
      });
    },
    // getSearchHeight(height) {
    //   this.tableConfig.tableHeight = `calc(100vh - ${height + 210}px)`;
    // },
    operationSubmit(row) {
      const { id, operationRemark } = row;
      // const { orderType } = this.lists[this.tabsConfig.type]?.searchFromData;
      const params = {
        id,
        isOperation: 1,
        operationRemark,
      };
      this.$refs.OrderSubmit.show(params, {}, row.orderType);
    },
    onTableSelectionChange(rows = []) {
      // const { orderType } = this.lists[this.tabsConfig.type]?.searchFromData;
      const row = rows[0] || {};
      const nRows = rows.filter((e) => {
        const zjbReceiving =
          e.operationOrderNum?.toLocaleUpperCase().includes("ZJB") &&
          e.isMainBill === 1;
        if (zjbReceiving) {
          // 中进宝主单没有操作接单
          return false;
        }
        const isSelectable =
          e.freightType === 0 && [2, 3, 4].includes(e.orderType)
            ? e.operationOrderStatus === 24
            : e.operationOrderStatus === 15;

        if (this.tabsConfig.page_list === "traditionFlow") {
          // 传统流程 - 统一类型可选
          return (
            e.operationOrderType === row.operationOrderType && isSelectable
          );
        }
        return isSelectable;
      });
      this.selectionRows = nRows;
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    selectionRowEvt(row) {
      // const { orderType } = this.lists[this.tabsConfig.type]?.searchFromData;
      // 中进宝主单没有操作接单
      const zjbReceiving =
        row.operationOrderNum?.toLocaleUpperCase().includes("ZJB") &&
        row.isMainBill === 1;
      if (zjbReceiving) {
        return false;
      }
      let isSelectable = true;
      if (this.tabsConfig.page_list === "traditionFlow") {
        // 传统流程 - 统一类型可选
        isSelectable =
          !this.selectionRows.length ||
          this.selectionRows.some(
            (e) => e.operationOrderType === row.operationOrderType
          );
      }

      if (row.freightType === 0 && [2, 3, 4].includes(row.orderType)) {
        return row.operationOrderStatus === 24 && isSelectable;
      }
      // 列表条件选择，不满足条件置灰
      return row.operationOrderStatus === 15 && isSelectable;
    },
    handleBatch() {
      if (!this.selectionRows.length) {
        return;
      }
      this.$refs.OrderSubmit?.handleBatchFormDialog({
        formModel: {
          state: 0,
        },
        httpRequest: (fromData) => {
          const { state, remark } = fromData;
          return postBatchOrderReceiving({
            idlist: this.selectionRows.map((e) => e.id),
            status: state,
            auditRemark: remark,
          });
        },
        successFunction: () => {
          this.mixinkeepTable();
          this.onTableSelectionChange();
        },
      });
    },
    handleRepulseDialog(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: remarkDialogCols(),
        httpRequest: (obj) => {
          return postBusinessRepulse({
            repulseRemark: obj.remark,
            orderId: row.orderId,
            orderType: row.orderType,
            operationOrderId: row.id,
            orderNum: row.operationOrderNum,
            freightType: [2, 3, 4].includes(row.orderType)
              ? row.freightType
              : undefined, // 其他操作单不传
          });
        },
        errorFunction: (err) => {
          // console.log('err===', err)
          if (err.code === 1002) {
            customMessageBox(
              this,
              {
                msgTitle: "后续流程跟进中无法打回!",
                msgTxt1: "跟进中流程：",
                msgTxt2: err.msg,
                showCancelButton: false,
                confirmButtonText: "知道了",
              },
              () => {
                this.$refs.customDialogRef.customDialogHide();
              }
            );
          }
        },
        successFunction: () => {
          this.msgSuccess("操作成功");
          this.mixinkeepTable();
        },
      });
    },
  },
  watch: {
    "selectionRows.length"(sLen) {
      this.$set(this.tabsConfig.btnArr[0], "disabled", !sLen);
    },
    "mixinSearchConfParams.countType"(v) {
      if (
        [
          "/operateManage/seaEcommerceFlow",
          "/operateManage/seaTraditionFlow",
        ].includes(this.$route.path)
      ) {
        // 电商/传统流程
        this.mixinShowTable = false;
        this.$set(this.tabsConfig.btnArr[0], "hideTabBtn", v !== "130");
        this.$nextTick(() => {
          this.mixinShowTable = true;
        });
      }
    },
  },
  components: {
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
