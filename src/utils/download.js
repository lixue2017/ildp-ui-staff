import { download as httpDownload } from "@/utils/ruoyi.js";
import { Message } from "element-ui";

export function comFileDownload(_self, downloadRequest, opt = {}, fileName) {
  if (_self.is_temp_throttle) {
    return;
  }
  // 防止重复点击多次
  _self.is_temp_throttle = true;
  const loadMsg = _self.$message({
    message: "文件准备中，请稍等。。。",
    type: "warning",
    duration: 0,
  });
  return downloadRequest(opt)
    .then((res) => {
      loadMsg.close();
      _self.is_temp_throttle = false;
      comDownload(res, fileName);
    })
    .catch((err) => {
      loadMsg.close();
      _self.is_temp_throttle = false;
    });
}

// 轮询下载
export function pollingDownload(_self, printRequest, opt, pollingRequest) {
  return new Promise((resolve, reject) => {
    _self.loadMsg = _self.$message({
      message: "文件准备中，请稍等。。。",
      type: "warning",
      duration: 0,
    });
    printRequest(opt)
      .then((res) => {
        printPolling(res);
      })
      .catch(() => {
        _self.loadMsg.close();
        reject();
      });

    function printPolling(res) {
      pollingRequest({ fileName: res.msg })
        .then((dRes) => {
          if (dRes.msg) {
            comDownload(dRes);
            _self.loadMsg.close();
            resolve();
          } else {
            setTimeout(() => {
              printPolling(res);
            }, 3000);
          }
        })
        .catch(() => {
          _self.loadMsg.close();
          reject();
        });
    }
  });
}

// 通用下载方法
export function comDownload(res, fileName) {
  let resUrl = res.data ? res.data : res.msg;
  if (res.data && res.data.msg) {
    resUrl = res.data.msg;
  }
  if (!resUrl) {
    Message.error({
      message: "无效文件！",
    });
    return;
  }
  if (resUrl.includes("http")) {
    // 完整路径
    download(resUrl, fileName);
  } else {
    // 不是完整路径
    httpDownload(resUrl);
  }
}

// url是文件下载路径
// filename是下载文件的名称
export const download = (url, filename) => {
  if (!url) {
    return Promise.reject();
  }
  if (!filename) {
    const urlArr = url.split("/");
    filename = urlArr[urlArr.length - 1];
  }

  return getBlob(url).then((blob) => {
    saveAs(blob, filename);
  });
};

export const getBlob = (url) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };
    xhr.send();
  });
};

export const saveAs = (blob, filename) => {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    const body = document.querySelector("body");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    // fix Firefox
    link.style.display = "none";
    body.appendChild(link);
    link.click();
    body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }
};
