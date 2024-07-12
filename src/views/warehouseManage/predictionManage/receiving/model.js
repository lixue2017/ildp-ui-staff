const SEARCH_COL_1 = {
  span: 6,
  id: "type",
  label: `类型：`,
  placeholder: "请选择",
  type: "select",
  basicType: "searchReceiptType",
};
const SEARCH_COL_2 = {
  span: 6,
  id: "search",
  label: `工作单号：`,
  placeholder: "请输入",
  type: "text",
};
const SEARCH_COL_3 = {
  span: 6,
  id: "receivingSource",
  label: `业务类型：`,
  type: "txt",
  basicType: "haiwaiWarehousingSource",
};
const SEARCH_COL_4 = {
  span: 6,
  id: "customerShortName",
  label: `委托人：`,
  type: "txt",
};
export const searchColumns = () => {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: [SEARCH_COL_1, SEARCH_COL_2, SEARCH_COL_3, SEARCH_COL_4],
            },
          ],
        },
      ],
    },
  ];
};

export const formRules = {
  type: [{ required: true, message: "请选择类型", trigger: "change" }],
  search: [{ required: true, message: "请输入工作单号", trigger: "blur" }],
};
