import { mapActions, mapState } from "vuex";
export const clearanceMixin = {
  //该混入文件只有海外清关管理----待审核（电商，传统）,已提交(电商，传统)列表使用
  components: {
    ConnectDialog: () =>
      import(
        "@/views/operateManage/operateRecord/components/connectDialog/index.vue"
      ),
    AddDrawer: () =>
      import(
        "@/views/operateManage/operateRecord/components/addDrawer/index.vue"
      ),
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("customsClearance").then((res) => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchList(searchFrom = {}) {
      const { createTime, customsClearanceStatusType, ...searchObj } =
        searchFrom;
      this.searchFromData = {
        ...searchObj,
        startTime: createTime && createTime[0],
        endTime: createTime && createTime[1],
        customsClearanceStatusType: customsClearanceStatusType
          ? +customsClearanceStatusType
          : "",
      };
      this.mixinkeepTable(true);
    },
    handleView(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.operationOrderId
      );
      this.$router.push({
        path: "/domesticBusiness/customsClearanceDetail",
        query: {
          id: row.operationOrderId,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    handleHandover(row) {
      this.$refs.ConnectDialog?.show(row);
    },
    handleDrawer(row) {
      this.$refs.addDrawer?.show(row);
    },
  },
};
