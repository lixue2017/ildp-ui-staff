// import variables from '@/assets/styles/element-variables.scss'
const state = {
  productImport: {},
  eCommerceImport: {},
  importChange: false,
};

const mutations = {
  PRODUCT_IMPORT: (state, data) => {
    state.productImport = {
      ...data,
    };
  },
  E_COMMERCE_IMPORT: (state, data) => {
    state.eCommerceImport = {
      ...data,
    };
  },
  E_IMPORT_CHANGE: (state) => {
    state.importChange = !state.importChange;
  },
};

const actions = {
  setProductImport({ commit }, data) {
    commit("PRODUCT_IMPORT", data);
  },
  setECommerceImport({ commit }, data) {
    commit("E_COMMERCE_IMPORT", data);
  },
  setImportChange({ commit }) {
    commit("E_IMPORT_CHANGE");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
