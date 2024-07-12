import { Message } from "element-ui";
import overseaLangObj from "@/language/overseasLang.js";

export function msgBox(
  vue,
  {
    title = "",
    html = "",
    msg = "",
    className = "",
    showCancelButton = false,
    showClose = true,
    cancelButtonText = "取 消",
    showConfirmButton = true,
    confirmButtonText = "确 定",
    customClass = "",
  },
  cb = () => {},
  cancelFn = () => {}
) {
  vue.$msgbox({
    title,
    message: html
      ? html
      : `<div class='display-flex'><i class='${className}'></i><span>${msg}</span></div>`,
    dangerouslyUseHTMLString: true,
    confirmButtonText:
      overseaLangObj.qr_confirm(confirmButtonText) || confirmButtonText,
    cancelButtonText:
      overseaLangObj.qx_cancel(cancelButtonText) || cancelButtonText,
    customClass: `confirm-class ${customClass}`,
    showConfirmButton,
    showCancelButton,
    showClose,
    callback: (action) => {
      if (action === "confirm") {
        cb();
      } else {
        cancelFn();
      }
    },
  });
}

/**
 * import { msgTipBox } from "@/utils/confirmBox.js";
 * 提示信息
 */
export function msgTipBox(vue, obj, cb = () => {}) {
  const {
    title = "提示",
    html = "",
    msg = "删除操作不可逆！",
    className = "el-icon-warning text-warning",
    showCancelButton = false,
    showClose = true,
    confirmButtonText = "确 定",
    customClass = "",
  } = obj || {};
  msgBox(
    vue,
    {
      title,
      html,
      msg,
      className,
      showCancelButton,
      showClose,
      confirmButtonText,
      customClass,
    },
    cb
  );
}
/**
 * 提示信息2
 */
export function msgInfoBox(vue, obj) {
  const { msgTitle, msgTxt } = obj || {};
  vue
    .$confirm(msgTxt || "请确认", msgTitle || "提示", {
      showCancelButton: false,
      confirmButtonText: "关 闭",
      type: "warning",
    })
    .then(() => {});
}

/** 自定义提示 */
export function customMessageBox(vue, obj, cb = () => {}) {
  const {
    customHtml,
    customClass,
    type = "warning",
    msgTitle = overseaLangObj.ts_tip("提示"),
    msgTxt1 = overseaLangObj.del_tip("删除不可逆"),
    msgTxtColor = "",
    msgTxt2 = `，${overseaLangObj.sf_jx("你还要继续吗")}？`,
    httpMsgRequest,
    distinguishCancelAndClose = false, // 区分取消与关闭
    confirmButtonText = overseaLangObj.qr_confirm() || "确定",
    cancelButtonText = overseaLangObj.qx_cancel() || "取消",
    showCancelButton = true,
    cancelCallBack = () => {},
    cancelBtnCallBack = () => {},
  } = obj || {};
  const html =
    customHtml ||
    `<div>
		${
      msgTxt1
        ? `<span style="${
            msgTxtColor ? "color: " + msgTxtColor : ""
          }">${msgTxt1}</span>`
        : ""
    }
		<span>${msgTxt2}</span>
	</div>`;
  vue
    .$msgbox({
      title: msgTitle,
      message: html,
      type,
      dangerouslyUseHTMLString: true,
      customClass,
      showCancelButton,
      distinguishCancelAndClose,
      confirmButtonText,
      cancelButtonText,
      beforeClose: (action, instance, done) => {
        if (action === "confirm") {
          // cancel
          if (httpMsgRequest) {
            instance.confirmButtonLoading = true;
            httpMsgRequest()
              .then((res) => {
                cb(res);
              })
              .finally(() => {
                done();
                instance.confirmButtonLoading = false;
              });
          } else {
            cb(action); // 只做确认回调
            done();
          }
        } else {
          cancelCallBack(action);
          done();
        }
      },
    })
    .then((action) => {
      if (action !== "confirm") {
        cancelCallBack();
      }
    })
    .catch((action) => {
      if (distinguishCancelAndClose) {
        if (action === "cancel") {
          // 取消按钮回调
          cancelBtnCallBack && cancelBtnCallBack();
        }
      }
    });
}

/** 数组类型提示 */
export function messageListTip(vue, obj) {
  const { msgList, type = "error" } = obj || {};
  let message = "";
  msgList.forEach((ele) => {
    message += `<p>${ele}</p>`;
  });
  vue.$message({
    dangerouslyUseHTMLString: true,
    showClose: true,
    message,
    type,
  });
}

// 获取数组重复值与提示信息
export function getArrayDuplicateData(arr = [], keyNameArr = [], vue, tipObj) {
  // getArrayDuplicateData(
  //   [
  //     { id: 1, name: 1 },
  //     { id: 2, name: 1 },
  //     { id: 1, name: 2 },
  //   ],
  //   ["id", "name"] // 校验的属性名
  // );
  let checkObj = {};
  let repeatKeyObj = {};
  arr.forEach((ele, idx) => {
    keyNameArr.forEach((k) => {
      if (ele[k]) {
        if (!checkObj[k]) {
          checkObj[k] = [];
        }
        const rFind = checkObj[k].find((r) => r.value === ele[k]);
        if (rFind) {
          if (!repeatKeyObj[k]) {
            repeatKeyObj[k] = {};
            repeatKeyObj[k].firstIndex = rFind.index; // 第一个数据
            repeatKeyObj[k].repeatIndexArr = []; // 重复下标
            repeatKeyObj[k].repeatSerialNumArr = []; // 重复序号, 提示用
          }
          repeatKeyObj[k].repeatIndexArr.push(idx); // 重复的属性名与下标
          repeatKeyObj[k].repeatSerialNumArr.push(idx + 1);
        } else {
          checkObj[k].push({
            index: idx,
            value: ele[k],
          });
        }
      }
    });
  });
  // console.log("==repeatKeyObj", repeatKeyObj);
  if (tipObj) {
    const thereDuplicates = Object.keys(repeatKeyObj);
    if (thereDuplicates.length) {
      let msgList = [];
      thereDuplicates.forEach((tKey) => {
        tipObj[tKey] &&
          msgList.push(
            `第${repeatKeyObj[tKey].repeatSerialNumArr.join("、")}行与第${
              repeatKeyObj[tKey].firstIndex + 1
            }行 ${tipObj[tKey] || "数据"}重复`
          );
      });
      messageListTip(vue, {
        msgList,
      });
    }
  }
  return repeatKeyObj;
}

// 复制文案
export function handleCopyText(number, vue, msg = "复制成功") {
  const input = document.createElement("input");
  input.setAttribute("readonly", "readonly");
  input.setAttribute("value", number);
  document.body.appendChild(input);
  input.select();
  if (document.execCommand("copy")) {
    document.execCommand("copy");
    // console.log("复制成功");
    if (msg) {
      if (vue) {
        vue.msgSuccess(msg);
      } else {
        Message.success({
          message: msg,
        });
      }
    }
  }
  document.body.removeChild(input);
}

// 复制多行文案
export function handleCopyTextarea(content, vue, msg = "复制成功") {
  const textarea = document.createElement("TEXTAREA");
  textarea.setAttribute("readonly", "readonly");
  textarea.value = content;
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange &
    textarea.setSelectionRange(0, textarea.value.length);
  if (document.execCommand("copy")) {
    document.execCommand("copy");
    if (msg) {
      if (vue) {
        vue.$message.success(msg);
      } else {
        Message.success({
          message: msg,
        });
      }
    }
  }
  document.body.removeChild(textarea);
}
