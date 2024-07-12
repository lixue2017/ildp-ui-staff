import { mapActions, mapState } from "vuex";
import { overseasOrder, FBAorder } from "./model.js";
import { getFbaOrderList } from "@/api/overseas/fbaOrder.js";
import { getOverseasList } from "@/api/overseas/platformOrder.js";
export default {
  data() {
    return {
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        fold: true, // 模糊搜索是否需要展开按钮
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        labelWidth: "85px",
        residueCols: [2],
      },
      model: {
        1: {
          searchColumns: overseasOrder.search,
          tableColumns: overseasOrder.lists,
          httpRequest: getOverseasList,
        },
        3: {
          searchColumns: FBAorder.search,
          tableColumns: FBAorder.lists,
          httpRequest: getFbaOrderList,
        },
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
      },
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  // activated() {
  //   this.mixinkeepTable()
  // },
  created() {
    this["dictionary/getDictionary"]("overseasOrderTypeEn").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    // keepTableList(isRefreshPage = true) {
    //   const { activeName } = this.tabsConfig;
    //   this.$refs[`tableConfig${activeName}`] &&
    //     this.$refs[`tableConfig${activeName}`][0]?.refreshKeepTable(
    //       isRefreshPage,
    //       activeName
    //     );
    // },
    getSearchFormConfig(tab) {
      return {
        ...this.searchFormConfig,
        lists: this.model[tab].searchColumns,
      };
    },
    getList(searchFrom = {}) {
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchFrom,
        beginTime: searchFrom.beginTime && searchFrom.beginTime.join("@"),
        state: searchFrom.state && searchFrom.state.join(","),
        deliveryWarehouseid: searchFrom.deliveryWarehouseid || 0,
        deliveryChannelid: searchFrom.deliveryChannelid || 0,
        receivingWarehouseid: searchFrom.receivingWarehouseid || 0,
        contactsid: searchFrom.contactsid || 0,
        userId: searchFrom.userId || 0,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams(tab) {
      return this.searchFromData[tab];
    },
  },
};
