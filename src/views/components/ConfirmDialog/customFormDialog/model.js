/**
 * import { simpleTimeCols } from "_comp/ConfirmDialog/customFormDialog/model.js"
 * 简易时间与备注模板
 */
import overseaLangObj from "@/language/overseasLang.js";

export const simpleTimeCols = (obj) => {
  const {
    title = "",
    label = "时间：",
    isRemark,
    timeRules = "time",
    maxlength = 200,
    valueFormat = "yyyy-MM-dd HH:mm:ss",
    dateType = "datetime",
    itemCols,
  } = obj || {};
  let simpleCustomCols = [
    {
      span: 24,
      id: "time",
      label,
      placeholder: "日期",
      type: dateType,
      valueFormat,
      noSlotLabel: true,
    },
  ];
  if (itemCols?.length) {
    simpleCustomCols.push(...itemCols);
  }
  if (isRemark) {
    simpleCustomCols.push({
      span: 24,
      id: "remark",
      label: `${overseaLangObj.bz_remark("备注")}：`,
      placeholder: "请输入",
      type: "textarea",
      maxlength,
    });
  }

  return {
    title,
    width: "500px",
    labelWidth: "105px",
    simpleCustomCols,
    formRules: {
      [timeRules]: [
        { required: true, message: `请选择时间`, trigger: "change" },
      ],
    },
  };
};

/** 简易备注模板，如：打回 */
export const remarkDialogCols = (obj) => {
  const {
    title = "打回",
    label = "打回备注：",
    rulesKey = "remark", // 非必填: "not_required"
    id = "remark",
    maxlength = 2000,
    labelWidth = "100px",
  } = obj || {};
  const simpleCustomCols = [
    {
      span: 24,
      id,
      label,
      placeholder: "请输入",
      type: "textarea",
      maxlength,
    },
  ];

  return {
    title,
    width: "500px",
    labelWidth,
    simpleCustomCols,
    formRules: {
      [rulesKey]: [
        // 默认必填
        { required: true, message: `请输入`, trigger: "blur" },
      ],
    },
  };
};
