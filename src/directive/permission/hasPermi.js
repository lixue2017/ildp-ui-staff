/**
* 操作权限处理 - 按钮权限
*/

import store from '@/store'

export const hasPermi = {
  inserted(el, binding, vnode) {
    const { value = undefined } = binding;
		if (value === undefined) {
			return true;
		}
    // const all_permission = "*:*:*";
    // const permissions = store.getters && store.getters.permissions

    if (value && value instanceof Array && value.length > 0) {
      // const permissionFlag = value

      // const hasPermissions = permissions.some(permission => {
      //   return all_permission === permission || permissionFlag.includes(permission)
      // })

      if (!hasBtnPermits(value)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}

// import { hasBtnPermits } from "@/directive/permission/hasPermi.js"
export const hasBtnPermits = (hasArr) => {
	const all_permission = "*:*:*";
	const { permissions = [] } = store.getters || {};
	if (hasArr && hasArr instanceof Array && hasArr.length > 0) {
		const hasPermissions = permissions.some(permission => {
			return all_permission === permission || hasArr.includes(permission)
		})
		return hasPermissions
	}
}