import { getUnreadCount } from '@/api/messageService'

const msgNotice = {
  namespaced: true,
  state: {
    unreadCount: undefined,
    unReadTimer: null
  },
  mutations: {
    SET_UNREAD_COUNT: (state, count) => {
      if (state.unreadCount !== count) {
        state.unreadCount = count
      }
    },
    SET_UNREAD_TIMER: (state, timer) => {
      state.unReadTimer = timer
    },
    CLEAR_UNREAD_TIMER: (state) => {
      if (state.unReadTimer) {
        clearTimeout(state.unReadTimer)
        state.unReadTimer = null
      }
    },
  },
  actions: {
    // 获取未读数
    GetUnreadCount({ commit }) {
      loopFetch(commit)
    },
    // 停止获取
    stopTimer({ commit }) {
      commit('CLEAR_UNREAD_TIMER')
    }
  }
}

function loopFetch(commit) {
  getUnreadCount().then(res => {
    commit('SET_UNREAD_COUNT', res.data)
    // commit('SET_UNREAD_TIMER', setTimeout(() => {
    //   loopFetch(commit)
    // }, (window.location && window.location.hostname === 'localhost') ? 90000 : 10000))
  })
}

export default msgNotice
