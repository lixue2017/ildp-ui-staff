import overseaLangObj from "@/language/overseasLang.js";

const FORM_COL_1 = {
  span: 24,
  id: "estimatedTime",
  placeholder: "日期",
  type: "datetime",
  valueFormat: "yyyy-MM-dd HH:mm:ss",
};

const FORM_COL_2 = {
  span: 24,
  id: "msgSlot",
  label: `${overseaLangObj.gj_trajectory("轨迹内容")}：`,
  type: "slot",
};

// 表单模板
export const formDispatchCols = (obj) => {
  const { modelType = "" } = obj || {};
  const title =
    modelType === "estimate"
      ? overseaLangObj.yy_ps || "预约派送"
      : overseaLangObj.js_ps || "实际派送";
  const time_txt = `${overseaLangObj.yu_yan_lang === "en-us" ? " " : ""}${
    overseaLangObj.sj_time || "时间"
  }`;
  return {
    title,
    width: "620px",
    labelWidth: overseaLangObj.yu_yan_lang === "en-us" ? "148px" : "105px",
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  {
                    ...FORM_COL_1,
                    label: `${title}${time_txt}：`,
                    noSlotLabel: true,
                  },
                  {
                    ...FORM_COL_2,
                    placeholder: `${title}${time_txt}：`,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      estimatedTime: [
        { required: true, message: `请选择时间`, trigger: "change" },
      ],
    },
  };
};
