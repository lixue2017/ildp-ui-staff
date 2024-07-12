const FORM_COLS_1 = {
  span: 12,
  id: "dealDate",
  label: "交易时间：",
  type: "txt",
};
const FORM_COLS_2 = {
  span: 12,
  id: "checkByName",
  label: "水单认领人：",
  type: "txt",
};
const FORM_COLS_3 = {
  span: 12,
  id: "bsAccountInfo",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_4 = {
  span: 12,
  id: "counterpartInfo",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_5 = {
  span: 24,
  id: "remark",
  label: "备注信息：",
  type: "txt",
};
export const comFormConfig = () => {
  return {
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  FORM_COLS_1,
                  FORM_COLS_2,
                  FORM_COLS_3,
                  FORM_COLS_4,
                  FORM_COLS_5,
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      // warehouseId: [
      //   { required: true, message: "请选择计费仓", trigger: "change" },
      // ],
    },
  };
};
