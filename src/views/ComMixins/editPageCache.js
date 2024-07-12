/** 编辑页与详情页，页面切换参数相同时缓存数据 */
import { mapActions, mapState } from "vuex";
import { paramUrl, urlParamObj } from "@/utils/index";

export const mixinEditCache = {
  data() {
    return {
      mixinDetailCacheTabList: [], // 缓存已加载的页签数据
      urlQueryObj: {},
      isMixinCreatedMounted: "created", // 在哪个钩子调接口
      // cacheTag: (`${new Date().getTime()}`).substring(2, 9), // 更新缓存标识
      isEditDeactivated: false, // 防止初始化重复调用接口
    };
  },
  methods: {
    mixinInitData() {},
    handleMixinCacheChange() {
      // 在页面里调用
      // this.handleMixinTestChange();
    },
    handleMixinTestChange(testObj) {
      // 检测缓存页面的数据是否已被更新
      const {
        testHttpRequest, // 接口
        testParams, // 接口参数
        testChangeKeys, // 检验是否改变的key
        cacheTestData = {}, // 对比的数据
      } = testObj || {};
      if (testHttpRequest && testChangeKeys?.length) {
        testHttpRequest(testParams).then((res) => {
          if (res.data) {
            for (let [i, ele] of testChangeKeys.entries()) {
              if (cacheTestData[ele] !== res.data[ele]) {
                this.mixinInitData();
                break;
              }
            }
          }
        });
      }
    },
    // routePathUrl(fObj, to) {
    //   const { query, path } = fObj || {};
    //   let c_route = { ...this.$route };
    //   c_route.fullPath = `${path}?${paramUrl(query)}`;
    //   this.$router.history.cb(c_route); // 上下页切换后更新URL后再跳转页面
    //   setTimeout(() => {
    //     this.$router.push({
    //       path: to.fullPath,
    //     });
    //   }, 10);
    // },
    ...mapActions(["operateDetails/storeBackRefresh"]),
  },
  created() {
    if (this.isMixinCreatedMounted === "created") {
      this.mixinInitData();
    }
  },
  mounted() {
    if (this.isMixinCreatedMounted === "mounted") {
      this.mixinInitData();
    }
  },
  activated() {
    const { query, path } = this.$route;
    if (this.storeBackQuery[path] && this.storeBackQuery[path].isBackRefresh) {
      this["operateDetails/storeBackRefresh"]({
        pathKey: path,
      });
      this.mixinInitData({
        goRefreshBackPage: true, // 跳转页面后处理返回，更新页面数据。如：操作单详情去生成对账单
      });
      return;
    }
    if (this.isEditDeactivated) {
      const { backPath, pageSign, ...nQuery } = query || {};
      // 参数不同更新数据;
      let isQuerySame = true;
      for (let key in this.urlQueryObj) {
        if (this.urlQueryObj[key] != nQuery[key] && key !== "pageSign") {
          isQuerySame = false;
          this.mixinInitData();
          break;
        }
      }
      if (isQuerySame) {
        // 参数完成相同，调接口判断其他值是否被改变，如状态改变更新页面数据
        this.handleMixinCacheChange();
      }
    }
  },
  // 离开页面前，获取URL上的参数
  beforeRouteLeave(to, from, next) {
    // console.log('from==', to, from, this.$route, urlParamObj(this.$route.fullPath))
    const { backPath, pageSign, ...nQuery } = from.query || {};
    // const { id: curId } = urlParamObj(this.$route.fullPath) || {};
    this.urlQueryObj = nQuery;
    // if (curId && nQuery.id && curId != nQuery.id) {
    //   this.routePathUrl(from, to);
    // } else {
    //   next();
    // }
    next();
  },
  deactivated() {
    this.isEditDeactivated = true;
  },
  computed: {
    ...mapState({
      storeBackQuery: (state) => state.operateDetails.backQueryObj || {},
    }),
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
};
