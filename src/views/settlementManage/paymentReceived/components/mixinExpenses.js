import { mapActions, mapState } from "vuex";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
export default {
  data() {
    return {
      searchFromData: {},
    };
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    getList(searchFrom = {}) {
      const { activeName, tabs } = this.tabsConfig;
      const { createTime, dealDate, ...searchObj } = searchFrom;
      const isMultiple = tabs.length > 1;
      const params = {
        ...searchObj,
        startTime: createTime && createTime[0],
        endTime: createTime && createTime[1],
        startDealDate: dealDate && dealDate[0],
        endDealDate: dealDate && dealDate[1],
      };

      isMultiple
        ? (this.searchFromData[activeName] = params)
        : (this.searchFromData = params);
      this.mixinkeepTable(true);
    },
    // getQueryParams(tName) {
    //   const { tabs } = this.tabsConfig
    //   const isMultiple = tabs.length > 1
    //   console.log('tName',tName)
    //   console.log('this.searchFromData',this.searchFromData)
    //   const params={
    //     ...(isMultiple && (tName||tName==0))?this.searchFromData[tName]:this.searchFromData,
    //     flowType:tName==1?[0,1,3,4]:[2]
    //   }
    //   return params
    // },
    getOperationList(row) {
      const { status, type, applicant, flowType } = row;
      const { userId } = this.curUserInfo;
      const { activeName } = this.tabsConfig;
      const operationLists = this.tableConfig.statusList.filter((e) => {
        return (
          (e.statusBtnArr ? e.statusBtnArr.includes(status) : true) &&
          (e.typeArr ? e.typeArr.includes(type) : true) &&
          ((e.hasPermission ? hasBtnPermits(e.hasPermission) : true) ||
            applicant == userId) && //符合角色权限或创建人是自己
          (e.showActive ? e.showActive.includes(activeName) : true) &&
          (e.hideFlowType ? !e.hideFlowType.includes(flowType) : true)
        );
      });
      return operationLists;
    },
    handleView(row, idKey = "id", pageSource) {
      const idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0].tableData.map((e) => e[idKey]);
      let pageRoute = {
        paymentDetails: "financialPaymentDetails",
        receiptsDetails: "financialReceiptsDetails",
      };
      if (row.costType == 0) {
        pageRoute = {
          paymentDetails: "taskInfo",
          receiptsDetails: "collectionTaskInfo",
        };
        this.$router.push({
          path: `/settlementManagement/paymentReceived/${pageRoute[pageSource]}`,
          query: {
            id: row[idKey],
            backPath: this.$route.fullPath,
          },
        });
      } else {
        this.$router.push({
          path: `/settlementManagement/dailyReimbursement/${
            pageRoute[pageSource] || "costExpensesDetails"
          }`,
          query: {
            id: row[idKey], // 报销单ID
            costType: row.costType,
            pageSource: pageRoute[pageSource]
              ? pageRoute[pageSource]
              : pageSource, // 页面来源
            backPath: this.$route.fullPath,
            pageSign: idList.join(","), // 详情显示上一页/下一页
          },
        });
      }
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "expenseStatus",
      "expenseType",
      "expenseFlow",
      "billType",
      "RVPStatus",
      "userRoles",
      "collectionTaskState",
    ]).then(() => {
      this.getInitialData();
    });
  },
};
