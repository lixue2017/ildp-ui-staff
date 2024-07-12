// 中英文切换

const state = {
  languageType: localStorage.languageType || "zh-cn", // zh-cn-简体中文，en-us-英文
};

const mutations = {
  SET_CUR_LANGUAGE: (state, lang) => {
    state.languageType = lang;
  },
};

const actions = {
  setStoreCurLanguage({ commit }, obj) {
    const { languageType = "zh-cn" } = obj || {};
    localStorage.languageType = languageType;
    commit("SET_CUR_LANGUAGE", languageType);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
