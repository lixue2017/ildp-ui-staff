import { mapActions, mapState } from "vuex";
import { getClearanceEmailRecipient } from "@/api/performance/record.js";
import {
  PUTPopClearanceRegisterStatusOver,
  PUTPopClearanceRegisterStatusRevoke,
} from "@/api/operateRecord/customsClearance";
export const handoverListMixin = {
  data() {
    return {
      searchFromData: {},
      mEmailData: {},
      tableSubmitBtnList: [
        {
          text: "发送邮件",
          handleClick: (row) => {
            this.mEmailData = row;
            getClearanceEmailRecipient({
              isOverseaOrders: 0, // 0-电商/传统 1-海外
              businessId: row.tootId,
            }).then((eRes) => {
              this.$refs.emailRef?.show({ resRecipientStr: eRes.data });
            });
          },
        },
      ],
    };
  },
  methods: {
    searchList(searchFrom) {
      const { createTime, ...searchObj } = searchFrom || {};
      const [beginTime, endTime] = createTime || [];
      this.searchFromData = {
        ...searchObj,
        beginTime,
        endTime,
      };
      this.mixinkeepTable(true);
    },
    handleMixinHandover(row) {
      this.$refs.handoverDlgRef?.show({
        operationOrderId: row.tootId,
      });
    },
    handleView(row, vPage) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (e) => e.tootId
      );
      this.$router.push({
        path:
          vPage === "ct_detail"
            ? "/domesticBusiness/customsTraditionalDetail" // 传统
            : "/domesticBusiness/customsClearanceDetail", // 电商
        query: {
          id: row.tootId,
          viewPage: vPage, // 判断附件类型
          viewSource: activeName, // 判断是否显示交接按钮
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    mGetQueryParams(tab = 0, instancePage = 1) {
      return {
        ...this.searchFromData,
        tab, // 0-待处理, 1-已处理, 2-箱单发票
        instancePage, // 1-电商一审 2-电商二审 3-传统
        remarkPermissionTag: instancePage == 2 ? "QGJJRS" : "QGJJYS", // 备注权限标识
      };
    },
    handleMixinDrawer(row) {
      this.$refs.drawerRef?.show(row);
    },
    handlePackingDrawer(row) {
      this.$refs.packingDrawerRef?.show(row);
    },
    mTableStatusList(r, tName) {
      return this.tableBtnList.filter((e) => {
				if (tName === "2") {
					return !!r.xdfpLogCount && e.isLogCount;
				}
        return (!!r.xdfpLogCount ? true : !e.isLogCount)&&(e.statusArr?e.statusArr.includes(r.registerStatus):true);
      });
    },
    handleChangeRegisterStatus(row = {}) {
      //清关登记状态 10未登记  20已登记
      const { id, registerStatus } = row;
      const httpRequest = {
        10: PUTPopClearanceRegisterStatusOver,
        20: PUTPopClearanceRegisterStatusRevoke,
      }[registerStatus];
      httpRequest(id).then((res) => {
        this.mixinkeepTable();
      });
    },
    mTableSubmitStatusList(r) {
      let rBtnList = [];
      rBtnList.push({
        text: "交接内容",
        handleClick: (row) => {
          this.$refs.handoverDlgRef?.show({
            operationOrderId: row.tootId,
            isWebHandoverSee: true,
          });
        },
      });
      if (r && [4, 563].includes(r.overseaAgentId)) {
        // 海外代理为荷兰与湖南堡森发送邮件
        return this.tableSubmitBtnList.concat(rBtnList);
      }
      return rBtnList;
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]([
      "clearanceReview",
      "importExportType",
      "clearanceReservationWarehouse",
      "tradeClause",
      "registerStatusLists",
      "freightType",
      "overseasAgencyType",
      "orderProductAttribute",
      "clearanceStatus",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  components: {
    CustomsHandoverDialog: () =>
      import(
        "@/views/operateManage/operateRecord/components/connectDialog/index.vue"
      ),
    RemarkDrawer: () =>
      import(
        "@/views/operateManage/operateRecord/components/recordDrawer/remark.vue"
      ),
    DrawerPackingRecord: () =>
      import(
        "@/views/operateManage/operateRecord/components/recordDrawer/packing.vue"
      ),
    SendEmail: () => import("_comp/ComLogistTrack/components/SendEmail"),
  },
};
