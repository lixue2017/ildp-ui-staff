const FORM_COLS_1 = {
  span: 12,
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
  id: "gxgl",
  label: "柜型柜量：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_7 = {
  span: 12,
  id: "overseasOperatorName",
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
  id: "airlineName",
  label: "船/航空公司：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_10 = {
  span: 12,
  id: "agentName",
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
  id: "departureTime",
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
  id: "reachTime",
  label: "ETA：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_15 = {
  span: 12,
  id: "csOperatorName",
  label: "长沙操作员：",
  placeholder: "--",
  type: "txt",
};
export const detailFormCols = (row = {}) => {
  const txtTagArr = [
    {
      basicType: "freightType",
      basicTypeVal: "freightType",
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
              ],
            },
          ],
        },
      ],
    },
  ];
};

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  // fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "orderSN",
  label: "工作单号",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "vat",
  label: "vat No.",
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "eori",
  label: "EORI No.",
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "wtr",
  label: "委托人",
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "UNCHARTED_TABLE_",
  label: "清关方式",
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "js",
  label: "件数",
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  prop: "zl",
  label: "重量",
  decimal: 2,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  prop: "tj",
  label: "体积",
  decimal: 2,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "wmsName",
  label: "目的仓",
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "jdsj",
  label: "接单时间",
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "yew",
  label: "业务员",
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  prop: "hwczy",
  label: "海外操作员",
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  prop: "sfwh",
  label: "是否维护",
  showOverflowTooltip: true,
};
const TABLE_COLS_OPERATION = {
  label: "操作",
  prop: "operation",
};
export const tableColumns = (row = {}) => {
  return [
    TABLE_COLS_INDEX,
    TABLE_COLS_1,
    TABLE_COLS_2,
    TABLE_COLS_3,
    TABLE_COLS_4,
    // TABLE_COLS_5,
    TABLE_COLS_6,
    TABLE_COLS_7,
    TABLE_COLS_8,
    TABLE_COLS_9,
    TABLE_COLS_10,
    TABLE_COLS_11,
    TABLE_COLS_12,
    TABLE_COLS_13,
    // TABLE_COLS_OPERATION,
  ];
};
