import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'

const pathArr = []
const comNameArr = []
const permission = {
  state: {
    routes: [],
    addRoutes: [],
    routesCollect: {
      path: [],
      name: []
    }
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_ROUTES_LIST: (state, routes) => {
      state.routesCollect = routes
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          const accessedRoutes = filterAsyncRouter(res.data)
          accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTES', accessedRoutes)
          commit('SET_ROUTES_LIST', {
            path: [...new Set(pathArr)],
            name: [...new Set(comNameArr)],
          })
          resolve(accessedRoutes)
        })
      })
    }
  }
}
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, parentsName = []) {
  return asyncRouterMap.filter(route => {
    const path = route.path.replace(/\//g, "")
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        if (!route.children) {
          pathArr.push(`/${[...parentsName, path].join("/")}`)
          comNameArr.push(route.name)
        }
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      const pathName = path ? [...parentsName, path] : parentsName
      route.children = filterAsyncRouter(route.children, pathName)
    }
    return true
  })
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
