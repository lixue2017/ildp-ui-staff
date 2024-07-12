import { getTrailerInfo } from "@/api/operateManage/details.js";

const state = {
  trailerList: [],
  isRefresh: false,
  detailShowBar: {}, // 订单详情状态栏显示隐藏
  sidebarShowObj: {
    /* 订单管理默认隐藏状态栏 */
    "/newOrderManage/eCommerceDetails": {
      isTabShow: false,
    },
    "/newOrderManage/tranditionDetails": {
      isTabShow: false,
    },
    "/newOrderManage/overSeaOtherOrder/detailCustomsClearance": {
      isTabShow: false,
    },
    "/newOrderManage/overSeaOtherOrder/detailDelivery": {
      isTabShow: false,
    },
    "/warehouseManage/inStorage/orderThirdParty": {
      isTabShow: false,
    },
    "/warehouseManage/outStorage/wholeSaleOrderDetails": {
      isTabShow: false,
    },
    "/warehouseManage/outStorage/fbaOrderDetails": {
      isTabShow: false,
    },
  }, // 操作单详情状态栏显示隐藏
  backQueryObj: {}, // 页面跳转有操作时，返回后刷新缓存页面
  tempUrlParam: {}, // 不需要在URL上显示的参数，刷新页面时不用的参数
};

const mutations = {
  SET_TRAILER_LIST: (state, obj) => {
    state.trailerList = obj.arr;
    // state.isRefresh = obj.isRequest;
  },
  SET_SHOW_SIDEBAR: (state, obj) => {
    const { pathKey, ...pathObj } = obj;
    if (state.detailShowBar[pathKey]) {
      state.sidebarShowObj[pathKey] = {};
    } else {
      state.sidebarShowObj[pathKey] = pathObj;
    }
  },
  SET_BACK_REFRESH: (state, obj) => {
    const { pathKey, ...pathObj } = obj;
    state.backQueryObj[pathKey] = pathObj;
  },
  SET_URL_PARAM: (state, obj) => {
    state.tempUrlParam = obj;
  },
};

const actions = {
  storeTrailerList({ commit }, obj = {}) {
    const { operationOrderId } = obj;
    return new Promise((resolve, reject) => {
      if (state.isRefresh) {
        // 已有的拖车信息，直接返回数据
        return resolve(state.trailerList);
      }
      getTrailerInfo({ operationOrderId })
        .then((res) => {
          commit("SET_TRAILER_LIST", {
            arr: res?.data || [],
            // isRequest: true // 不做缓存
          });
          resolve(res.data || []);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  storeTrailerReset({ commit }) {
    commit("SET_TRAILER_LIST", {
      arr: [],
      isRequest: false,
    });
  },
  storeShowSidebar({ commit }, obj) {
    commit("SET_SHOW_SIDEBAR", obj);
  },
  storeBackRefresh({ commit }, obj) {
    commit("SET_BACK_REFRESH", obj);
  },
  storeUrlTempParam({ commit }, obj) {
    commit("SET_URL_PARAM", obj);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
