import { FullscreenLoading } from "@/utils/loading.js";
import { systemColumnList } from "@/api/common.js";
import { getRouteStateCount } from "@/api/home";
import { singleEmitEvents } from "@/utils/emit-events";
import { set } from "nprogress";
import qs from "qs";

export const mixinColsConf = {
  data() {
    return {
      extraHeight: 212,
      formHeight: 52,
      fullscreenLoading: new FullscreenLoading(),
      tabTableObj: {}, // tab下的表格列
      mixinTableColArr: [], // 表格列集合
      mixinSearchColArr: [], //模糊搜索集合
      showSearchForm: false,
      mixinShowTable: true,
      isMixinDeactivated: false, // 防止初始化重复调用接口
      mixinInitTableCols: false, // 列设置数据请求完成，仓库先获取列设置再获取当前所在仓
      isArrMixinTable: true, // 是否取数组里的表格
      mixinTableRef: "tableRef",
      mixinFormRef: "formRef",
      queryParams: {},
      mixinSearchConfParams: {}, // 后台返回的查询参数
      mixinSearchFormData: {},
      mixinColumnSetParams: {}, // 列设置保存时参数
      tableDomTimeout: 0,
    };
  },
  methods: {
    searchHeight(formHeight) {
      this.formHeight = formHeight || 52;
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
        if (params.activeName) {
          this.tabsConfig.activeName = params.activeName;
        }
        window.history.replaceState("", "", url);
      }
      if (Object.keys(params).length || Object.keys(this.queryParams).length) {
        let { tabs, activeName } = this.tabsConfig;
        if (!activeName) {
          activeName = "1";
          this.tabsConfig.activeName = activeName;
        }
        const isMultiple = tabs?.length > 1 || this.tabsConfig.isMultiple;
        let searchFromData = {
          ...(isMultiple
            ? this.searchFromData[activeName] || {}
            : this.searchFromData || {}),
        };
        if (Object.keys(params).length) {
          this.queryParams = params;
          searchFromData = {
            ...searchFromData,
            ...params,
          };
        } else if (Object.keys(this.queryParams).length) {
          Object.keys(this.queryParams).forEach((key) => {
            if (searchFromData[key]) delete searchFromData[key];
          });
          this.queryParams = {};
        }
        this.searchFormConfig.formModel = {
          ...searchFromData,
        };
        if (isMultiple) {
          this.searchFromData[activeName] = searchFromData;
        } else {
          this.searchFromData = searchFromData;
        }
      }
    },
    setColumnMixinConf(arr = [], obj) {
      const { activeName: tName } = this.tabsConfig;
      const { mountedNoRequest = false, noChangeShowRequest = false } =
        obj || {};
      const allCols = this.mixinTableColArr[tName - 1];
      let nTable = [];
      const serialNoCol = allCols.find((e) => e.type === "index"); // 序号
      const multiSelectCol = allCols.find((e) => e.type === "selection"); // 多选
      const expandCol = allCols.find((e) => e.type === "expand"); // 展开行
      const operationCol = allCols.find((e) => e.prop === "operation"); // 操作列
      if (expandCol) {
        nTable.push(expandCol);
      }
      if (serialNoCol) {
        nTable.push(serialNoCol);
      }
      if (multiSelectCol) {
        nTable.push(multiSelectCol);
      }
      const nAllCols = allCols.filter(
        (e) =>
          !["index", "selection", "expand"].includes(e.type) &&
          !["operation"].includes(e.prop)
      );
      const groupTypes = [];
      arr.forEach((ele) => {
        const nObj = nAllCols.find((e) => e.prop === ele.prop) || {};
        const isShowCol = [0, 1].includes(ele.showEnable)
          ? ele.showEnable === 1
          : true;
        if (isShowCol) {
          if (nObj.groupType || nObj.groupType === 0) {
            groupTypes.push(nObj.groupType);
          }
          nTable.push({
            ...nObj,
            ...ele,
          });
        }
      });
      if (operationCol) {
        nTable.push(operationCol);
      }
      if (this.setGroupTypes) {
        this.setGroupTypes(groupTypes);
      }
      if (!noChangeShowRequest) {
        // 表头前后拖拽更新列设置无需刷新列表数据
        this.mixinShowTable = false;
      }
      this.tabTableObj[tName] = nTable;
      this.$nextTick(() => {
        this.mixinShowTable = true;

        if (mountedNoRequest) {
          // 表格isMountedRequest为false初始不调接口，点击列设置后需要传true更新列表
          this.$nextTick(() => {
            this.mixinkeepTable();
          });
        }
      });
    },
    initMixinColumnConf(tabRefresh = true) {
      const { activeName } = this.tabsConfig;
      if (
        !this.tabTableObj[activeName] &&
        this.mixinTableColArr[activeName - 1]
      ) {
        // 初始化与tab切换调接口获取默认列设置
        this.tabTableObj[activeName] = this.mixinTableColArr[activeName - 1]; // 初始默认值
        this.getInitTableCols(activeName, tabRefresh);
      } else {
        if (tabRefresh) {
          // tab切换请求表格数据，第一次切换回初始Tab时因为keep-alive失效，表格加载会调一次接口
          this.$nextTick(() => {
            this.mixinkeepTable();
          });
        }
      }

      if (
        this.mixinSearchColArr[activeName - 1] &&
        this.showSearchForm &&
        this.searchFormConfig
      ) {
        this.$set(
          this.searchFormConfig,
          "lists",
          this.mixinSearchColArr[activeName - 1]
        );
      }
    },
    tableMixinConfig(tName) {
      // 显示设置后的表格列
      return this.tabTableObj[tName];
    },
    tableAllMixinConfig(tName = "1") {
      // 列设置 - 显示默认的全部
      return this.mixinTableColArr[tName - 1];
    },
    // 获取表格列初始化数据
    getInitTableCols(tName, tabRefresh) {
      const opt = {
        routeType: this.$route.path,
        tab: tName,
      };
      this.mixinShowTable = false;
      systemColumnList(opt)
        .then((res) => {
          const { columnFields = [], id } = res.data || {};
          this.mixinColumnSetParams = {
            id,
            ...opt,
          };
          if (columnFields.length) {
            this.setColumnMixinConf(columnFields, {
              mountedNoRequest: tabRefresh,
            });
          } else {
            // 防止初始化时重复调接口
            this.mixinShowTable = true;
            if (tabRefresh) {
              // tab切换请求表格数据
              this.$nextTick(() => {
                this.mixinkeepTable();
              });
            }
          }
        })
        .catch(() => {
          this.mixinShowTable = true;
          if (tabRefresh) {
            // tab切换请求表格数据
            this.$nextTick(() => {
              this.mixinkeepTable();
            });
          }
        })
        .finally(() => {
          this.mixinInitTableCols = true;
          if (
            this.queryParams.warehouseId &&
            this["customer/setStoreCurWarehouse"]
          ) {
            this["customer/setStoreCurWarehouse"]({
              value: this.queryParams.warehouseId,
            }); // 同步更改当前所在仓
          }
        });
    },
    mixinkeepTable(isRefreshPage = false, obj) {
      const { activeName, isTabStateCount } = this.tabsConfig;
      const { isTableSearch, webAllSearchFormData } = obj || {};
      const refEl = this.$refs[`${this.mixinTableRef}${activeName}`];
      // console.log("==x=", this.tableDomTimeout, refEl);
      if (!refEl && this.tableDomTimeout < 1000) {
        this.tableDomTimeout += 100;
        setTimeout(() => {
          // 自调, 初始化时防止DOM未加载完获取不到表格元素
          this.mixinkeepTable((isRefreshPage = false), obj);
        }, 100);
        return;
      }
      this.tableDomTimeout = 0;
      if (this.isArrMixinTable) {
        // 有tab切换
        refEl[0]?.refreshKeepTable(isRefreshPage, activeName);
      } else {
        // 无tab切换
        refEl?.refreshKeepTable(isRefreshPage, activeName);
      }
      if (isRefreshPage) {
        // 查询时直接清除
        this.mixinResetSelection();
      } else {
        // 点击头部按钮操作时，延时清除
        this.mixinTimeResetSelection();
      }
      if (isTableSearch) {
        // 获取查询值
        this.mixinSearchFormData = webAllSearchFormData || {};
      }
      if (isTabStateCount) {
        // 电商操作单获取统计数据
        this.handleRouteStateCount();
      }
    },
    mixinTimeResetSelection() {
      // 请求成功后加延时，防止按钮防抖延时后又重置按钮状态，时间需要大于防抖时间
      setTimeout(() => {
        this.mixinResetSelection();
      }, 820);
    },
    mixinResetSelection() {
      // 行操作、页面跳转重置选择项，查询、分页时不重置
      if (this.selectionRows) {
        const { activeName, tabs } = this.tabsConfig;
        if (Array.isArray(this.selectionRows)) {
          this.selectionRows = [];
        } else {
          /* 多个tab页都有复选框时，tab切换需要重置一次选中项，如：存仓上架 */
          if (this.selectionRows[activeName]) {
            if (tabs?.length) {
              tabs.map((e) => (this.selectionRows[e.name] = []));
            } else {
              this.selectionRows[activeName] = [];
            }
          }
        }
        if (this.isArrMixinTable) {
          this.$refs[`${this.mixinTableRef}${activeName}`] &&
            this.$refs[
              `${this.mixinTableRef}${activeName}`
            ][0]?._toggleRowSelectionMixin({
              newCheckRows: [],
            });
        } else {
          this.$refs[
            `${this.mixinTableRef}${activeName}`
          ]?._toggleRowSelectionMixin({
            newCheckRows: [],
          });
        }
      }
    },
    handleRouteStateCount() {
      const { searchColumnParams = {} } = this.tabsConfig;
      getRouteStateCount({
        route: this.$route.path,
        tab: this.tabsConfig.activeName || "1",
        ...searchColumnParams,
      }).then((res) => {
        singleEmitEvents.emit(
          `onChangeStateCountEvt${this.$route.path}`,
          res.data || []
        );
      });
    },
  },
  created() {
    singleEmitEvents.on(`onChangeSearchEvt${this.$route.path}`, (vObj) => {
      // console.log("val==", vObj);
      this.mixinSearchConfParams = vObj || {};
      setTimeout(() => {
        // 初始化先加载表格组件
        if (
          [
            "/operateManage/seaEcommerceFlow",
            "/operateManage/seaTraditionFlow",
          ].includes(this.$route.path)
        ) {
          // 电商/传统流程
          singleEmitEvents.emit(`onCustomSearchEvt${this.$route.path}`, {
            nodeStatus: vObj.nodeStatus || [],
            isWebChangeAttr: true, // 切换页签带出默认查询值
          });
        } else if (
          ![
            "/operateManage/fileProgressTable",
            "/operateManage/ecTrackingTable",
          ].includes(this.$route.path)
        ) {
          this.mixinkeepTable(true);
        }
      }, 120);
    });
    this.handleInitParam();
    this.initMixinColumnConf(false);
  },
  activated() {
    if (this.isMixinDeactivated) {
      this.mixinkeepTable();
    }
  },
  watch: {
    $route(to, from) {
      // 重新
      this.handleInitParam();
    },
  },
  deactivated() {
    // 离开页面清空选中项，不在当前tab离开页面时，不能使用ref情空
    this.mixinResetSelection();
    this.isMixinDeactivated = true;
  },
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComColumnConf: () => import("_comp/ComColumnConf"),
  },
};
