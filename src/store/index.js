import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import user from "./modules/user";
import dictionary from "./modules/dictionary";
import tagsView from "./modules/tagsView";
import permission from "./modules/permission";
import settings from "./modules/settings";
import getters from "./getters";
import customer from "./modules/customer";
import operateDetails from "./modules/operateDetails";
import msgNotice from "./modules/msgNotice";
import home from "./modules/home";
import dataImport from "./modules/dataImport";
import langCnEn from "./modules/langCnEn";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    dictionary,
    tagsView,
    permission,
    settings,
    customer,
    operateDetails,
    msgNotice,
    home,
    dataImport,
		langCnEn,
  },
  getters,
});

export default store;

// import Vue from 'vue';
// import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate';
// Vue.use(Vuex);

// // https://webpack.js.org/guides/dependency-management/#requirecontext
// const modulesFiles = require.context('./modules', true, /\.js$/);
// // you do not need `import app from './modules/app'`
// // it will auto require all vuex module from modules file
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   // set './app.js' => 'app'
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
//   const value = modulesFiles(modulePath);
//   modules[moduleName] = value.default;
//   return modules;
// }, {});

// const store = new Vuex.Store({
//   modules,
//   getters,
//   plugins: [createPersistedState()]
// });

// export default store;
