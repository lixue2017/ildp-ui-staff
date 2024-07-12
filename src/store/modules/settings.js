// import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const themeColor = "#00ADB2"

const state = {
  theme: themeColor,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
	isRepeatedClick: false, // 是否重复点击
	isFormSubmit: false // 是否为表单提交
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
	PREVENT_REPEATED_CLICK: (state, value) => {
		// console.log('value==', value)
		state.isRepeatedClick = value
  },
	FORM_SUBMIT_CLICK: (state, value) => {
		state.isFormSubmit = value;
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
	actionRepeatedClick({ commit }, data) {
    commit('PREVENT_REPEATED_CLICK', data)
  },
	// 表单提交
	actionFormSubmit({ commit }, data) {
    commit('FORM_SUBMIT_CLICK', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

