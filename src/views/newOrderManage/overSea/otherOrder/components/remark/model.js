// const FORM_COL_1 = {
//   span: 24,
//   id: "orderRemark",
//   label: "客户备注：",
//   textLineClamp: 10,
//   showMoreTextBtn: true,
//   type: "txt",
// };
const FORM_COL_1 = {
  span: 24,
  id: "orderRemark",
  label: "订单备注：",
  textLineClamp: 10,
  showMoreTextBtn: true,
  type: "txt",
};
const FORM_COL_2 = {
  span: 24,
  id: "businessRemark",
  label: "业务备注：",
  textLineClamp: 10,
  showMoreTextBtn: true,
  type: "txt",
};
const FORM_COL_3 = {
  span: 24,
  id: "operationRemark",
  label: "操作备注：",
  placeholder: "请输入",
  type: "textarea",
  rows: 5,
};

export const formRemarksCols = () => [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              FORM_COL_1,
              FORM_COL_2,
              FORM_COL_3,
            ],
          },
        ],
      },
    ],
  },
];
