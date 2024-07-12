const FORM_COL_1 = {
  span: 21,
  id: "tradeClause",
  label: "贸易条款：",
  type: "select",
  basicType: "tradeClause",
  clearable: false,
};
const FORM_COL_2 = {
  span: 24,
  id: "nodeIds",
  label: "业务节点：",
  // labelWidth: "0px",
  type: "slot",
};

export const nodeCols = (obj) => {
  const { oType, tradeHandle, showList } = obj || {};
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...FORM_COL_1,
                  showList,
                  handle: tradeHandle,
                },
                FORM_COL_2,
              ],
            },
          ],
        },
      ],
    },
  ];
};
