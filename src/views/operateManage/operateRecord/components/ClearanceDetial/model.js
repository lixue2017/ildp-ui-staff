const FORM_COLS_1 = {
  span: 12,
  // id: "bailorPeople",
  id: "customerShortName", //这里取的是操作单的委托人不是清关的委托人
  label: "委托人：",
  type: "txt",
};
const FORM_COLS_2 = {
  span: 12,
  id: "countryName",
  label: "目的国：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_3 = {
  span: 12,
  id: "startPortName",
  label: "起运港：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_4 = {
  span: 12,
  id: "endPortName",
  label: "目的港：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_5 = {
  span: 12,
  id: "registerNo",
  label: "柜号：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_6 = {
  span: 12,
  id: "boxWeight",
  label: "柜型柜量：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_7 = {
  span: 12,
  id: "operatorName",
  label: "操作员：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_8 = {
  span: 12,
  id: "overseasOperatorName",
  label: "海外操作员：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_9 = {
  span: 12,
  id: "shipCompany",
  label: "船/航空公司：",
  type: "txt",
  txtTagArr: [
    {
      tagColor: "green",
      basicType: "navigationCompany",
      basicTypeVal: "operationOrderType",
    },
  ],
};
const FORM_COLS_10 = {
  span: 12,
  id: "shortNameVerseas",
  label: "海外代理：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_11 = {
  span: 12,
  id: "flightName",
  label: "船名/航名：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_12 = {
  span: 12,
  id: "openPositionTime",
  label: "ETD：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_13 = {
  span: 12,
  id: "voyageNumber",
  label: "船次/航次：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_14 = {
  span: 12,
  id: "etaTime",
  label: "ETA：",
  type: "txt",
};
const FORM_COLS_15 = {
  span: 12,
  id: "csOperatorName",
  label: "长沙操作员：",
  type: "txt",
};
const FORM_COLS_16 = {
  span: 12,
  id: "mblNum",
  label: "MBL：",
  type: "txt",
};

const FORM_COLS_18 = {
  span: 24,
  id: "tableData",
  labelWidth: "0px",
  type: "slot",
};
const FORM_COLS_19 = {
  span: 24,
  id: "operationRemark",
  label: "备注信息：",
  type: "txt",
  textLineClamp: 2,
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "operationOrderNum",
  label: "工作单号",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "freightType",
  label: "装箱方式",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
  basicType: "freightType",
};
const TABLE_COLS_3 = {
  prop: "bailorPeople",
  label: "委托人",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "stomsClearanceName",
  label: "清关方式",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "realFreightCount",
  label: "件数",
  minWidth: 120,
  sortable: true,
  align: "center",
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "realFreightWeight",
  label: "重量(KG)",
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  prop: "realFreightVolume",
  label: "体积(CBM)",
  minWidth: 120,
  sortable: true,
  align: "right",
  decimal: 2,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  prop: "desWarehouseName",
  label: "目的仓",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "createTime",
  label: "接单时间",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "salesmanName",
  label: "业务员",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "operatorName",
  label: "业务操作员",
  minWidth: 120,
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  prop: "UNCHARTED_TABLE_12",
  label: "箱单发票",
  minWidth: 120,
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  prop: "UNCHARTED_TABLE_13",
  label: "HBL资料",
  minWidth: 120,
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_14 = {
  prop: "vatNo",
  label: "VAT No.",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  prop: "eoriNo",
  label: "EORI No.",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  fixed: "right",
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  minWidth: 120,
};

export const detailFormCols = (row = {}) => {
  const { orderType } = row;
  const txtTagArr =
    orderType == 2
      ? [
          {
            basicType: "freightType",
            basicTypeVal: "freightType",
          },
        ]
      : [
          {
            basicType: "freightType",
            basicTypeVal: "freightType",
          },
          {
            tagColor: "green",
            basicType: "tradeClause",
            basicTypeVal: "tradeClause",
          },
        ];
  return [
    //表单展示
    {
      className: "border-right",
      scaleWidth: 2,
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  ...FORM_COLS_1,
                  txtTagArr,
                },
                FORM_COLS_2,
                FORM_COLS_3,
                FORM_COLS_4,
                FORM_COLS_5,
                FORM_COLS_6,
                FORM_COLS_7,
                FORM_COLS_8,
                FORM_COLS_19,
              ],
            },
          ],
        },
      ],
    },
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_9,
                FORM_COLS_10,
                FORM_COLS_11,
                FORM_COLS_12,
                FORM_COLS_13,
                FORM_COLS_14,
                FORM_COLS_15,
                FORM_COLS_16,
              ],
            },
          ],
        },
      ],
    },
  ];
};

export const customsClearanceTable = () => {
  //table和upload
  const config = {
    width: "420px",
    labelWidth: "66px",
    isAttachFileId: true,
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [FORM_COLS_18],
              },
            ],
          },
        ],
      },
    ],
  };
  return config;
};

const publicTable = [
  // TABLE_COLS_INDEX,
  // TABLE_COLS_1,
  // TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_11,
];
export const tableColumns = (type) => {
  let config = [];
  if (type == 2) {
    config = [
      TABLE_COLS_INDEX,
      TABLE_COLS_1,
      TABLE_COLS_2,
      TABLE_COLS_14,
      TABLE_COLS_15,
      ...publicTable,
      TABLE_COLS_12,
      TABLE_COLS_13,
      TABLE_COLS_OPERATION,
    ];
  } else {
    config = [
      TABLE_COLS_INDEX,
      TABLE_COLS_1,
      TABLE_COLS_2,
      ...publicTable,
      TABLE_COLS_13,
    ];
  }
  return config;
};
