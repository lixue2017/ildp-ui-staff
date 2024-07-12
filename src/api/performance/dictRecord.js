import store from "@/store";
import request from "@/utils/request";

// 获取字典词做为请求参数
export function httpDictRequest(obj, params) {
  return new Promise((resolve, reject) => {
    const { pageRemarkNameKey, requestKey } = obj || {};
    store
      .dispatch("dictionary/getDictionary", ["pageGetRemarkPermissionTag"])
      .then(() => {
        const { pageGetRemarkPermissionTag } = store.getters.dictData;
        const dictFind =
          pageGetRemarkPermissionTag.find(
            (e) => e.value === (pageRemarkNameKey || "GNQGYSBZ")
          ) || {};
        const http_obj = {
          postAddBusinessRemark,
          getBusinessRemarkList,
        };
        http_obj[requestKey || "getBusinessRemarkList"]({
          ...(params || {}),
          dictFind,
        })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch(() => {
        reject();
      });
  });
}

// 添加备注
export function postAddBusinessRemark(obj) {
  const { dictFind, ...nObj } = obj || {};
  const { expandVal, code } = dictFind || {};
  return request({
    url: "/businessRemark/add",
    method: "post",
    data: {
      remarkFormat: 1, // 备注格式: 1-文本, 2-富文本
      businessType: code,
      tag: expandVal,
      ...(nObj || {}),
    },
  });
}
// 备注列表
export function getBusinessRemarkList(obj) {
  const { dictFind, ...nObj } = obj || {};
  const { expandVal, code, nameEn } = dictFind || {};
  return request({
    url: "/businessRemark/remarkList",
    method: "post",
    data: {
      businessType: code,
      permissionTag: nameEn,
      // tag: expandVal,
      ...(nObj || {}),
    },
  });
}
