import { getComponentInfo } from "@/api/home";
import { getInitDate } from "@/utils/index";

const state = {
  searchFromData: {
    headOverview: {},
    orderPending: {},
    dsVolumeInfo: {
      selectDate: getInitDate(),
      field: "volume",
      top: 5,
    },
    ctVolumeInfo: {
      selectDate: getInitDate(),
      field: "volume",
      top: 5,
    },
    orderQuantity: {},
    cargoVolumeTrend: {
      field: "volume",
    },
    operationProcess: {
      type: 1
    },
    dayPayment: {
      currencyId: 1
    }
  },
  homeCompData: {
    financialProcess: null
  },
  affixActive: 1
}

const mutations = {
  SET_HOME_COMP_DATA: (state, data) => {
    state.homeCompData = {
      ...state.homeCompData,
      ...data
    }
  },
  SET_AFFIX_ACTIVE: (state, index) => {
    state.affixActive = index
  }
}

const actions = {
  getCompInfo({ state, commit }, { component = [], paramsField = null }) {
    /** 参数类型: [String, Array] */
    return new Promise((resolve, reject) => {
      const params = {};
      if (!paramsField) {
        component.forEach((name) => {
          const { selectDate, ...data } = state.searchFromData[name] || {};
          let createTimeBegin, createTimeEnd
          if (selectDate) {
            [createTimeBegin, createTimeEnd] = selectDate
          }
          if (name === "operationProcess" && Array.isArray(data.type)) {
            data.type = data.type.join(",")
          }
          params[name] = {
            ...data,
            createTimeBegin, createTimeEnd
          }
        });
      }
      getComponentInfo(paramsField || params).then(res => {
        commit('SET_HOME_COMP_DATA', res.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  switchAffix({ commit, dispatch }, { component = [], affixActive = 1 }) {
    commit('SET_AFFIX_ACTIVE', affixActive)
    const { top = [], left = [], right = [] } = component;
    dispatch("getCompInfo", { component: [...top, ...left, ...right] })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

