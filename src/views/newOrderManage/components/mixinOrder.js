import { allConfig,seaTransport, airTransport, otherOrder, eCommerce } from "./model";
import { mapActions, mapState, mapGetters } from "vuex";
import {
  msgBox,
  customMessageBox,
  handleCopyText,
} from "@/utils/confirmBox.js";
import { getOceanTraditionList } from "@/api/trandition/oceanModel"; //海运订单
import { getAirTraditionList } from "@/api/trandition/airModel"; //空运订单
import { getOrderOtherList } from "@/api/trandition/otherModel"; //其他订单
import { postInvoicingVoid } from "@/api/settlementManage/paymentReceived";
import {
  exportTraditionNewExportList
} from "@/api/order/firstTransport.js";
import { comFileDownload } from "@/utils/download.js";
import {
  getECList,
  businessSubmitGather,
  businessRepulse,
  operateById,
  getOrderConfigList,
} from "@/api/order/firstTransport";

export default {
  components: {
    BusinessSubmit: () => import("./BusinessSubmit"),
  },
  data() {
    return {
      handleCopyText,
      searchFormConfig: {
        formModel: {
          salesmanName: this.salesmanId,
        },
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        size: "small",
        labelWidth: "85px",
        formRules: {},
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        columnConfig: [
          allConfig.lists,
          airTransport.lists,
          otherOrder.lists,
          eCommerce.lists,
        ],
        httpRequest: {
          0: getOceanTraditionList,
          1: getAirTraditionList,
          2: getOrderOtherList,
          3: getECList,
        },
      },
      tableStatusBtnList: [
        {
          text: "接单",
          status: [1],
          handleClick: (row) => {
            this.handleReceiving(row);
          },
        },
        {
          text: "打回",
          status: [1],
          color: "#FF6767",
          handleClick: (row) => {
            this.repulseType = 1;
            this.handleVoid(row, 0);
          },
        },
        // {
        // 	text: "撤回",
        // 	status: [3],
        // 	handleClick: this.handleWithdraw,
        // },
        // {
        //   text: "作废",
        //   status: [2, 3, 4, 5, 6, 7, 8],
        //   handleClick: (row) => {
        //     this.handleVoid(row, 1)
        //   },
        // },
        {
          text: "提交",
          status: [10],
          handleClick: (row) => {
            this.handleReceiving(row, "businessSubmit");
          },
        },
        {
          text: "打回",
          status: [10],
          color: "#FF6767",
          handleClick: (row) => {
            this.repulseType = 2;
            this.handleVoid(row, 0);
          },
        },
        {
          text: "撤回提交",
          status: [15],
          handleClick: this.handleWithdraw,
        },
        {
          text: "物流轨迹",
          orderType: [2],
          status: [10, 15, 20, 22, 23, 24, 25, 26, 27, 29, 70, 100, 95, 99], //打回，草稿，已预报，其他，暂无不用暂时
          handleClick: (row) => {
            this.$refs?.LogisticsRef.show(row.id, 2);
          },
        },
      ],
      searchFromData: {
        salesmanName: this.salesmanId,
      },
      dialogTip: "", // '打回会删除已录入的费用和已生成的操作单等信息',
      repulseType: 1,
      customMessageBox,
    };
  },
  computed: {
    ...mapState(["dictionary"]),
    ...mapGetters(["salesmanId", "salesmanName"]),
  },
  created() {
    this.searchDictionary();
  },
  methods: {
    ...mapActions([
      "dictionary/getDictionary",
      "operateDetails/storeUrlTempParam",
    ]),
    handleExport() {
      // const {countType}=row
      // const exportHttpRequest = {
      //   540:exportTraditionList,
      //   541:exportTraditionList,
      //   542:exportOtherList,
      // }[countType];
      const {countType=undefined}=this.mixinSearchConfParams
      const params = {
        ...this.searchFromData,
        countType,
        isDataFil:1
      };
      comFileDownload(this, exportTraditionNewExportList, params);
    },
    searchDictionary() {
      this.searchFormConfig.formModel = {
        ...this.searchFormConfig.formModel,
        salesmanName: this.salesmanId,
        salesman: this.salesmanName,
      };
      this.searchFromData = {
        ...this.searchFromData,
        salesmanName: this.salesmanId,
      };
      this["dictionary/getDictionary"]("tranditionTypeEn").then(() => {
        this.showSearchForm = true;
      });
    },
    getList(searchFrom = {}) {
      const {webAllSearchFormData,beginTime,...obj}=searchFrom
      this.searchFromData = {
        ...obj,
        beginTime:beginTime&&beginTime[0],
        endTime:beginTime&&beginTime[1],
        dataStatus: searchFrom.dataStatus && searchFrom.dataStatus.join(","),
        contactsType: this.tabsConfig.activeName - 1,
        tradeClauseSearch:
          searchFrom.tradeClauseSearch &&
          searchFrom.tradeClauseSearch.join(","),
        // transportModeSearch:
        //   searchFrom.transportModeSearch &&
        //   searchFrom.transportModeSearch.join(","),
        // orderBusinessTypeSearch:
        //   searchFrom.orderBusinessTypeSearch &&
        //   searchFrom.orderBusinessTypeSearch.join(","),
        // freightType: searchFrom.freightType && searchFrom.freightType.join(","),
        statusSearch:
          searchFrom.statusSearch && searchFrom.statusSearch.join(","),
          transportModeSearch:searchFrom.transportModeSearch && searchFrom.transportModeSearch.join(","),
      };
      this.mixinkeepTable(true, {
        isTableSearch: true,
        webAllSearchFormData,
      });
    },
    getSearchFormConfig(tab) {
      const searchArr = [
        allConfig.search,
        airTransport.search,//员工端没看到页面,但是近期又有改动，不知道是否已经弃用
        otherOrder.search,
        eCommerce.search,//电商写在自己的组件里，可以弃用
      ];
      return {
        ...this.searchFormConfig,
        ...searchArr[tab],
        // residueCols: [2],
        searchColsHeight: true,
        isDataFil: 1, //数据隔离
      };
    },
    getDynamicConfig(){
      const {countType}=this.mixinSearchConfParams
      const searchConfig={
        1000:allConfig.search,
        10:allConfig.search,
        540:seaTransport.search,
        541:airTransport.search,
        542:otherOrder.search,
        100:allConfig.search,
      }[countType]
      return {
        ...this.searchFormConfig,
        ...searchConfig,
        searchColsHeight: true,
        isGetSearchAll: true,
        isDataFil: 1, //数据隔离
      };
    },
    // getSearchHeight(height) {
    //   this.tableConfig.tableHeight = `calc(100vh - ${height + 211}px)`;
    // },
    async handleReceiving(row, type) {
      if (type) {
        if (type === "operationSubmit") {
          //操作提单
          this.$refs.OrderSubmit.show(row, type);
        } else if (type === "businessSubmit") {
          //业务提交
          const { orderType, id } = row;
          if ([3, 4].includes(orderType)) {
            this.$refs.businessSubmitRef?.show(row);
          } else {
            businessSubmitGather(orderType, id)
              .then(() => {
                this.mixinkeepTable();
              })
              .catch((err) => {
                this.businessSubmitErr(row, err);
              });
          }
        }
      } else {
        let type = 4; // 接单：传统-其他
        let refs = this.$refs.orderReceiving;
        let dicts = {};
        if ([3, 4].includes(row.orderType)) {
          await getOrderConfigList(row.id, 2).then((res) => {
            dicts = res.data || {};
            if (row.freightType == 0) {
              type = 1; // 接单：传统-整柜
            } else {
              type = 2; // 接单：传统-散货
            }
            if (row.orderType === 3) {
              row.operationOrderType = 0; // 海运操作单
            } else {
              row.operationOrderType = 1; // 空运操作单
              refs = this.$refs.AirOrderReceiving;
            }
          });
        } else {
          row.operationOrderType = 2; // 其他操作单
        }
        row.bailorPeople = row.customerName;
        refs.show(row, type, { proxyTypeDicts: dicts });
      }
    },
    businessSubmitErr(row, err) {
      if (err && err.code === 1002) {
        this["operateDetails/storeUrlTempParam"]({
          pageTab: "30",
        });
        this.handleView(row);
      }
    },
    businessRepulse({ id, orderType: type = 2 }) {
      businessRepulse({
        id,
        type,
      }).then(() => {
        this.mixinkeepTable();
      });
    },
    handleWithdraw({ operationOrderId }) {
      this.withdraw().then(() => {
        operateById(operationOrderId, 1, { callbackType: 1 }).then(() => {
          this.mixinkeepTable();
        });
      });
    },
    withdraw() {
      return new Promise((resolve) => {
        const title = "撤回提示";
        const className = "el-icon-warning text-warning";
        const msg = "撤回操作不可逆！";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    getQueryParams(orderType = "", isDataFil = 1) {
      const { dataStatus, statusSearch } = this.searchFromData;
      Array.isArray(dataStatus) &&
        (this.searchFromData.dataStatus = dataStatus.join(","));
      Array.isArray(statusSearch) &&
        (this.searchFromData.statusSearch = statusSearch.join(","));
      return { orderType, ...this.searchFromData, isDataFil,...this.mixinSearchConfParams }; //数据隔离;
    },
    getStatusList(row, oStatus = "orderStatus") {
      const { orderType } = row;
      const btnLists = this.tableStatusBtnList.filter(
        (e) =>
          e.allStatus ||
          (e.status.includes(row[oStatus]) &&
            (e.orderType ? e.orderType.includes(orderType) : true))
      );
      if (btnLists.length) {
        return btnLists;
      }
      return []; // 用于显示
    },
    handleView(row) {
      const idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0].tableData.map((item) => item.id);
      this.$router.push({
        path: "/newOrderManage/tranditionDetails",
        query: {
          id: row.id,
          orderType: row.orderType,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","),
        },
      });
    },
    handleVoid(
      { id, orderType = 2, orderNum, number, operationOrderId },
      type = 0
    ) {
      const obj = {
        0: "打回",
        1: "作废",
      };
      const repulseType = this.repulseType;
      this.$refs.confirmDlgRef.handleFormDialog("textareaDialog", {
        confObj: {
          title: obj[type],
          label: `${obj[type]}说明：`,
          message: `请输入${obj[type]}说明`,
        },
        formModel: {},
        httpRequest: ({ remark }) => {
          const opt = {
            id,
            type: orderType || 2,
            repulseRemark: remark,
            orderNum: orderNum || number,
            repulseType,
          };
          if (type === 0 && repulseType === 2) {
            opt.operationOrderId = operationOrderId;
          }
          return new Promise((resolve, reject) => {
            businessRepulse(opt)
              .then((res) => {
                this.mixinkeepTable();
                resolve(res);
              })
              .catch((err) => {
                resolve();
                if (err.code === 1002) {
                  this.handleNotRepulse();
                }
              });
          });
        },
        successFunction: () => {},
      });
    },
    /** 打回失败 */
    handleNotRepulse() {
      customMessageBox(this, {
        msgTitle: "订单已有费用，无法打回",
        msgTxt1: "如需打回",
        msgTxt2: "，请先删除费用信息!",
        msgTxtColor: "#FF6767",
        showCancelButton: false,
        confirmButtonText: "关 闭",
      });
    },
  },
};
