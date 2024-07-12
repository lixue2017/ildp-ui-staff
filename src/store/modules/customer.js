import { getSystemSearchList } from "@/api/home";

const state = {
  customerList: [],
  curWarehouseObj: {}, // 当前所在仓库
  routeSearchData: {},
};

const mutations = {
  SET_CUSTOMER_LIST: (state, data) => {
    state.customerList = data;
  },
  SET_CUR_WAREHOUSE: (state, obj) => {
    state.curWarehouseObj = obj;
  },
  SET_ROUTE_SEARCH: (state, data) => {
    state.routeSearchData = {
      ...state.routeSearchData,
      ...(data || {}),
    };
  },
};

const actions = {
  setStoreCurWarehouse({ commit }, obj) {
    commit("SET_CUR_WAREHOUSE", obj);
  },
  storeRouteSearch({ commit }, obj) {
    return new Promise((resolve, reject) => {
      const { noWebRepeat, ...opt } = obj || {};
      if (noWebRepeat && opt.route && state.routeSearchData[opt.route]) {
        resolve(state.routeSearchData);
        return;
      }
      getSystemSearchList(opt)
        .then((res) => {
          commit("SET_ROUTE_SEARCH", res.data);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
