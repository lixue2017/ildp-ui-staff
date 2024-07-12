import request from "@/utils/request";
import { requestUrl } from "@/api/downloadUrl.js";
import { Message } from "element-ui";

// 流文件下载
export function getStreamFileDownload(urlName, params, obj) {
  const {
    method = "get",
    customFileName,
    isCustomFileName = false,
  } = obj || {};
  const loadMsg = Message({
    message: "文件准备中，请稍等。。。",
    type: "warning",
    duration: 0,
  });
  let rOpt = {
    url: requestUrl[urlName] || urlName,
    method,
    responseType: "blob",
    customStreamFileParam: true, // 自定义参数
  };
  if (["get"].includes(method.toLocaleLowerCase())) {
    rOpt.params = params;
  }
  if (["post", "put"].includes(method.toLocaleLowerCase())) {
    rOpt.data = params;
  }
  if (customFileName) {
    rOpt.isCustomFileName = isCustomFileName;
    rOpt.customFileName = customFileName;
  }
  return request(rOpt)
    .then((res) => {
      resolveBlob(res);
    })
    .finally(() => {
      loadMsg.close();
    });
}

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 */
export function resolveBlob(res) {
  // console.log("res==", res);
  if (res.data?.type === "application/json") {
    Message({
      message: "无文件",
      showClose: true,
      type: "error",
    });
    return;
  }
  const aLink = document.createElement("a");
  const blob = new Blob([res.data], { type: res.data.type });
  const contentDisposition =
    decodeURI(
      res.headers["content-disposition"] || res.headers["Content-Disposition"]
    ) || "";
  // console.log("下载=x", res.headers, contentDisposition);
  const { isCustomFileName, customFileName } = res.config;
  let fileName =
    contentDisposition.split("filename=")[1] ||
    contentDisposition.split("fileName=")[1] ||
    "";
  fileName = fileName.replace(/\"/g, "");
  // console.log('fileName=', fileName)
  if (isCustomFileName && customFileName) {
    // 优先使用自定义文件名
    fileName = customFileName;
  }
  aLink.href = URL.createObjectURL(blob);
  aLink.setAttribute("download", fileName || customFileName); // 设置下载文件名称, 后缀名不一致不能在此处写默认值
  document.body.appendChild(aLink);
  aLink.click();
  document.body.appendChild(aLink);
}

// 客户/服务商列表导出
export function exportCustomerContractList(obj) {
  const { clientIdentity, status } = obj || {};
  getStreamFileDownload(
    `/crm/info/exportCustomerContractInfo/${clientIdentity}/${status}`
  );
}
