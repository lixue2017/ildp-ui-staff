import { mapActions, mapState } from "vuex";
import { singleEmitEvents } from "@/utils/emit-events";
import {
  getRouteStateCount,
  setRouteDefaultState,
  postSetHideStateTab,
} from "@/api/home";
export const mixinConfSearch = {
  data() {
    return {
      tabName: 1,
      routeKey: this.$route.path,
      routeQuery: this.$route.query,
      tabsConfig: {
        activeName: "",
        slotTabs: true,
        searchTabShow: "",
        handleTabsClick: () => {
          const { activeName } = this.tabsConfig;
          const sItem = this.stateSearchSumList(1).find(
            (item) => item.countType == activeName
          );
          this.handleStateChangeSearch(sItem);
          this.initMixinColumnConf(false);
        },
        tabs: [],
        btnArr: [],
      },
      countList: [],
      tabState: {},
      cVisible: false,
      contextMenuX: 0,
      contextMenuY: 0,
      curCustomSearch: {},
      showCount: true,
    };
  },
  computed: {
    ...mapState({
      stateSearchList: (state) => state.customer.routeSearchData || {},
    }),
  },
  created() {
    singleEmitEvents.on(`onChangeStateCountEvt${this.routeKey}`, (arr) => {
      this.countList = arr;
    });
  },
  mounted() {
    this["customer/storeRouteSearch"]({
      route: this.routeKey,
      tab: this.tabName,
      noWebRepeat: true,
    }).then((res) => {
      const tabs = res[this.routeKey].map((item) => ({
        ...item,
        label: item.nameCn,
        name: `${item.countType}`,
      }));
      let stateDefault = tabs ? tabs.find((e) => e.isDefault) || tabs[0] : {};
      let { params } = this.routeQuery;
      if (params) {
        params = JSON.parse(params);
        if (params.countType) {
          stateDefault = tabs
            ? tabs.find((e) => params.countType == e.countType) || tabs[0]
            : {};
        }
      }
      setTimeout(() => {
        // 初始化时表单与表格要先加载完
        this.handleStateChangeSearch(stateDefault);
        if (this.showCount) this.handleRouteStateCount();
        this.initMixinColumnConf(false);
      }, 100);
    });
  },
  methods: {
    ...mapActions(["customer/storeRouteSearch"]),
    handleStateChangeSearch(sItem, isClear = true) {
      this.curCustomSearch = isClear ? {} : sItem;
      this.tabsConfig.activeName = `${sItem.countType}`;
      this.tabsConfig.searchTabShow = `${sItem.countType}`;
      singleEmitEvents.emit(
        `onChangeSearchEvt${this.$route.path}`,
        sItem.searchObj
      );
    },
    handleRouteStateCount() {
      getRouteStateCount({
        route: this.routeKey,
        tab: this.tabName,
      }).then((res) => {
        singleEmitEvents.emit(
          `onChangeStateCountEvt${this.routeKey}`,
          res.data || []
        );
      });
    },
    stateSearchSumList(stateNum) {
      const countStateList = (this.stateSearchList[this.routeKey] || []).map(
        (ele) => {
          const countSumObj = this.countList.find(
            (c) => c.countType === ele.countType
          );
          return {
            ...countSumObj,
            ...ele,
          };
        }
      );
      if (stateNum === 2) {
        return countStateList.filter((e) => e.isHide);
      }
      return countStateList.filter((e) => !e.isHide);
    },
    handleRightClick(ev, sItem) {
      this.cVisible = false;
      const { left, top } = this.$el.getBoundingClientRect(); // 滚动条偏移量
      this.contextMenuX = ev.clientX;
      this.contextMenuY = ev.clientY;
      this.tabState = sItem;
      this.$nextTick(() => {
        this.cVisible = true;
      });
    },
    getRouteSearch() {
      this["customer/storeRouteSearch"]({
        route: this.routeKey,
        tab: this.tabName,
      });
    },
    handleDefaultState() {
      setRouteDefaultState(this.tabState.id).then(() => {
        this.cVisible = false;
        this.msgSuccess("操作成功");
        this.getRouteSearch();
      });
    },
    handleHideState() {
      postSetHideStateTab(this.tabState.id).then(() => {
        this.cVisible = false;
        this.msgSuccess("操作成功");
        this.getRouteSearch();
      });
    },
  },
};
