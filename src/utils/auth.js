import Cookies from 'js-cookie'
import store from '@/store'
import qs from 'querystring'

export const AdminTokenKey = 'Admin-Token'
export const CustomerTokenKey = 'Customer-Token'


export function getToken() {
  return Cookies.get(AdminTokenKey)
}

export function setToken(token, tokenKey) {
  return Cookies.set(AdminTokenKey, token)
}

export function removeToken() {
  return Cookies.remove(AdminTokenKey)
}
