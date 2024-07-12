import { accumulationFn } from "@/utils/instructions";
import { httpFreightRate } from "@/comModel/httpSelect";
import { toFixedNum } from "@/utils/instructions";
const TABLE_COLS_INDEX = {
  prop: "boxSn",
  label: "箱序号",
  minWidth: 100,
  fixed: "left",
};
const TABLE_COLS_SPACE = {
  prop: "space",
  label: "",
  width: 45,
  render: () => "",
};
const TABLE_COLS_1 = {
  prop: "boxModelName",
  label: "柜型",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "boxCount",
  label: "柜量",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "price",
  label: "单价",
  minWidth: 100,
  showOverflowTooltip: true,
  render: (row) =>
    row.price ? `${toFixedNum(row.price, 2)}${row.currencyCode}` : "--",
};
const TABLE_COLS_4 = {
  prop: "totalPrice",
  label: "费用",
  minWidth: 100,
  showOverflowTooltip: true,
  render: (row) =>
    row.totalPrice
      ? `${toFixedNum(row.totalPrice, 2)}${row.currencyCode}`
      : "--",
};
const TABLE_COLS_5 = {
  prop: "boxCount",
  label: "箱/件数",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "evaluationValue",
  label: "单箱",
  minWidth: 100,
  showOverflowTooltip: true,
  decimal: 1,
};

const tableColumnsFCL = [
  TABLE_COLS_SPACE,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
];
const tableColumnsLCL = (label) => [
  TABLE_COLS_INDEX,
  TABLE_COLS_5,
  { ...TABLE_COLS_6, label },
  TABLE_COLS_3,
  TABLE_COLS_4,
];

const formConfig = (list) => {
  const formModel = {};
  const cols = list.map((item, i) => {
    const { costName, price, boxModelMap, currencyCode } = item;
    const id = `${costName}${1 + 1}`;
    let boxModelPrice = 0;
    if (!price && boxModelMap) {
      const totalNum = [];
      Object.keys(boxModelMap).forEach((key) =>
        totalNum.push(boxModelMap[key])
      );
      boxModelPrice = accumulationFn(totalNum, 2);
    }
    formModel[id] = `${price || boxModelPrice}${currencyCode}`;
    return {
      span: 6,
      id,
      label: `${costName}：`,
      type: "txt",
    };
  });
  return {
    formModel,
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols,
              },
            ],
          },
        ],
      },
    ],
    size: "small",
    labelWidth: "113px",
    formRules: {},
  };
};

const formConfigFreightRate = {
  formModel: {},
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 12,
                  id: "freightRateId",
                  label: "关联运价：",
                  placeholder: "请选择运价",
                  ...httpFreightRate({
                    state: 1,
                  }),
                  type: "slot",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  size: "small",
  labelWidth: "82px",
  // formRules: {
  //   freightRateId: [
  //     {
  //       required: true,
  //       message: "请选择运价",
  //       trigger: "change",
  //     },
  //   ],
  // },
};

export { tableColumnsFCL, tableColumnsLCL, formConfig, formConfigFreightRate };
