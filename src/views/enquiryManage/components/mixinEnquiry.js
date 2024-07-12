import { mapActions, mapState, mapGetters } from "vuex";
import { msgBox } from "@/utils/confirmBox.js";
import {
  updateQuotationState,
  rollbackQuotationSheet,
} from "@/api/enquiryManage";
export const mixinEnquiry = {
  components: {
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  computed: {
    ...mapState(["dictionary"]),
    ...mapGetters(["userId", "name"]),
  },
  created() {
    this["dictionary/getDictionary"]("enquiryList").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    operationBtn(rItem, state, domesticState, foreignState) {
      const { showState, showDomesticState, showForeignState } = rItem;
      if (showState.includes(state)) {
        if (
          showDomesticState &&
          showForeignState &&
          !showDomesticState.includes(domesticState) &&
          !showForeignState.includes(foreignState)
        ) {
          return false;
        }
        return true;
      } else {
        return false;
      }
    },
    getEnquiryList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      const searchFromData = {
        ...searchObj,
        createTimeGe: createTime && createTime[0],
        createTimeLe: createTime && createTime[1],
      };
      if (this.queryPage === 1) {
        const { stateList } = searchFromData;
        stateList && !stateList.length && delete searchFromData.stateList;
      } else {
        const { quotedPriceStateList } = searchFromData;
        quotedPriceStateList &&
          !quotedPriceStateList.length &&
          delete searchFromData.quotedPriceStateList;
      }
      if (this.queryPage === 3) {
        this.searchFromData = searchFromData;
      } else {
        this.searchFromData[this.tabsConfig.activeName] = searchFromData;
      }
      this.mixinkeepTable(true);
    },
    getQueryParams(tab) {
      let searchFromData = {};
      if (this.queryPage === 3) {
        searchFromData = this.searchFromData;
      } else {
        searchFromData = {
          ...(this.searchFromData[tab] || {}),
          shippingModeEq: Number(tab),
        };
      }
      return {
        ...searchFromData,
        queryPage: this.queryPage,
      };
    },
    handleVoid(id, state) {
      const obj = {
        1: {
          title: "市场打回",
          remarkTitle: "打回",
        },
        4: {
          title: "业务退回",
          remarkTitle: "退回",
        },
      };
      this.$refs.confirmDlgRef.handleFormDialog("textareaDialog", {
        confObj: {
          title: obj[state]?.title || '说明',
          label: `${obj[state]?.remarkTitle || ''}说明：`,
          message: `请输入${obj[state]?.remarkTitle || ''}说明`,
					maxlength: 50
        },
        formModel: {},
        httpRequest: ({ remark }) => {
          return rollbackQuotationSheet({
            quotationSheetId: id,
            state,
            rollbackRemark: remark,
          });
        },
        successFunction: this.mixinkeepTable,
      });
    },
    handleView({ id }, path = "/enquiryManage/myEnquiryDetail") {
      const idList = this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0].tableData.map((e) => e.id);
      this.$router.push({
        path,
        query: {
          id,
          backPath: this.$route.fullPath,
          pageSign: idList.join(","), // 详情显示上一页/下一页
          queryPage: this.queryPage,
        },
      });
    },
    handleUpdate(quotationSheetId, state, msg = "提交成功") {
      // 状态：0=待报价；1=市场打回；2=报价中；3=已报价；4=业务退回；5=已完结
      this.comRepeatedRequest(this, updateQuotationState, {
        quotationSheetId,
        state,
      }).then(() => {
        this.msgSuccess(msg);
        this.mixinkeepTable();
      });
    },
    handleRecall(quotationSheetId) {
      const msg = "撤回后询价人无法查看方案！";
      const title = "确定撤回报价方案";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        this.handleUpdate(quotationSheetId, 2, "撤回成功");
      });
    },
  },
};
