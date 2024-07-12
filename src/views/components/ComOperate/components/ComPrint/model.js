const tabType = [
  {
    span: 10,
    id: "type",
    labelWidth: "0px",
    type: "slot",
  },
];

const boxMai = [
  {
    span: 24,
    id: "isShowSku",
    label: "是否显示SKU：",
    type: "radio",
    dicsStr: "is_whether",
    customDicsArr: [1, 2],
  },
  {
    span: 24,
    id: "isShowOrderSn",
    label: "是否显示客户单号：",
    type: "radio",
    dicsStr: "is_whether",
    customDicsArr: [1, 2],
  },
  {
    span: 24,
    id: "isSign",
    label: "是否显示标记：",
    type: "radio",
    dicsStr: "print_sign",
    customDicsArr: [1, 2, 3],
  },
  {
    span: 24,
    id: "mtPrintType",
    label: "打印格式选择：",
    type: "radio",
    className: "print-type",
    dicsStr: "print_format",
    customDicsArr: [1, 2],
  },
];

const boxSelect = [
  {
    span: 24,
    id: "boxNum",
    labelWidth: "0px",
    type: "slot",
  },
];

const warehousingConfig = {
  lists: [
    {
      fieldList: [
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: tabType,
            },
          ],
        },
        {
          className: "border-bottom-solid",
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "printType",
                  label: "打印格式选择：",
                  type: "radio",
                  className: "print-type",
                  basicType: "printType",
                  hideList: [1],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {},
};

const onlyPrintConfig = {
  lists: [
    {
      fieldList: [
        {
          title: "slot",
          prop: "rowTitle",
          rows: [
            {
              cols: boxMai,
            },
          ],
        },
        {
          className: "print-data-type",
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "printDataType",
                  label: "选择数据：",
                  labelWidth: "462px",
                  type: "slot",
                },
              ],
            },
          ],
        },
        {
          rows: [
            {
              cols: boxSelect,
            },
          ],
        },
      ],
    },
  ],
  formRules: {},
};

export { warehousingConfig, onlyPrintConfig };
