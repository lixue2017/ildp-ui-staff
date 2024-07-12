import { httpPortPublicSelect } from "@/comModel/httpSelect";
const searchColumns = [
  {
    id: "createTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd",
  },
  {
    id: "code",
    label: "航线代码：",
    placeholder: "航线代码",
    type: "text",
  },
  {
    id: "name",
    label: "航线名称：",
    placeholder: "航线名称",
    type: "text",
  },
  {
    id: "nameEn",
    label: "拼柜名称：",
    placeholder: "拼柜名称",
    type: "text",
  },
  {
    id: "isSortBox",
    label: "堡森拼柜：",
    placeholder: "堡森拼柜",
    type: "select",
    basicType: "trueOrFalse",
  },
  {
    id: "statusList",
    label: "状态：",
    placeholder: "状态",
    type: "select",
    multiple: true,
    basicType: "status",
  },
  {
    id: "startPort",
    label: "起始港：",
    placeholder: "起始港",
    ...httpPortPublicSelect(),
  },
  {
    id: "endPort",
    label: "目的港：",
    placeholder: "目的港",
    ...httpPortPublicSelect(),
  },
];

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "code",
  label: "航线代码",
  sortable: true,
  showOverflowTooltip: true,
  columnLink: true,
  width: 100,
  fixed: "left",
};
const TABLE_COL_2 = {
  prop: "name",
  label: "航线名称",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
  fixed: "left",
  render: (row) => row.nameCn || "--",
};
const TABLE_COL_3 = {
  prop: "routeCodeName",
  label: "航线组",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 140,
  render: (row) => {
    const { routeCode, routeCodeName } = row;
    return `${routeCode}[${routeCodeName}]`;
  },
};
const TABLE_COL_4 = {
  prop: "shipCompanyName",
  label: "航空/船公司",
  width: 150,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "startPortName",
  label: "起始港",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COL_6 = {
  prop: "endPortName",
  label: "目的港",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COL_7 = {
  prop: "transferName",
  label: "中转港",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 100,
};
const TABLE_COL_8 = {
  prop: "airGroup",
  label: "航线组",
  sortable: true,
  showOverflowTooltip: true,
  minWidth: 120,
  render: (row) => {
    return `${row.routeCode || "--"}[${row.routeCodeName || "--"}]`;
  },
};
const TABLE_COL_9 = {
  prop: "lineType",
  label: "航线类型",
  sortable: true,
  showOverflowTooltip: true,
  width: 100,
  basicType: "transportMode",
};
const TABLE_COL_10 = {
  prop: "routeProxy",
  sortable: true,
  showOverflowTooltip: true,
  label: "航线代理",
  minWidth: 100,
  basicType: "clientIdentity",
};
const TABLE_COL_11 = {
  prop: "status",
  label: "状态",
  customRow: true,
  sortable: true,
  showOverflowTooltip: true,
  basicType: "status",
  fixed: "right",
  width: 100,
};
const TABLE_COL_12 = {
  prop: "createTime",
  label: "创建时间",
  sortable: true,
  showOverflowTooltip: true,
  width: 200,
};
const TABLE_COL_13 = {
  prop: "createBy",
  label: "创建人",
  minWidth: 120,
  // fixed: 'right',
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_14 = {
  prop: "isSortBox",
  label: "堡森拼柜",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
  render: (row) => {
    const { isSortBox } = row;
    return isSortBox ? "是" : "否";
  },
};
const TABLE_COL_15 = {
  prop: "boxCwmName",
  label: "国内集货仓",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_16 = {
  prop: "boxCustomerName",
  label: "委托客户",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_17 = {
  prop: "boxOperateMainName",
  label: "拼柜主体",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_18 = {
  prop: "boxBookingSpaceProxyName",
  label: "订舱代理",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_19 = {
  prop: "boxCountryName",
  label: "目的国",
  minWidth: 120,
  sortable: true,
  showOverflowTooltip: true,
};
const TABLE_COL_20 = {
  prop: "nameEn",
  label: "拼柜名称",
  minWidth: 120,
  sortable: true,
  fixed: "left",
  showOverflowTooltip: true,
};
const TABLE_COL_OPERATION = {
  fixed: "right",
  label: "操作",
  prop: "operation",
  columnOperation: true, //MODEL中的配置
  width: 140,
};

const tableColumns = [
  TABLE_COL_INDEX,
  TABLE_COL_1, //航线代码
  TABLE_COL_2, //航线名称
  TABLE_COL_20, // 拼柜名称
  TABLE_COL_3, //航线组
  TABLE_COL_9, //航线类型
  TABLE_COL_5, //起始港
  TABLE_COL_6, //目的港
  TABLE_COL_7, //中转港
  TABLE_COL_4, //航空/船公司
  TABLE_COL_14, //堡森拼柜
  TABLE_COL_15, //国内集货仓
  TABLE_COL_16, //委托客户
  TABLE_COL_17, //拼柜主体
  TABLE_COL_18, //订舱代理
  TABLE_COL_19, //目的国
  TABLE_COL_12, //创建时间
  TABLE_COL_13, //创建人
  TABLE_COL_11, //状态
  TABLE_COL_OPERATION,
];

export { searchColumns, tableColumns };

const DIALOG_COLS_1 = {
  span: 12,
  id: "routeCodeName",
  label: "航线组：",
  placeholder: "--",
  type: "txt",
};

const DIALOG_COLS_2 = {
  span: 12,
  id: "lineTypeName",
  label: "航线类型：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_3 = {
  span: 12,
  id: "code",
  label: "航线代码：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_4 = {
  span: 12,
  id: "nameCn",
  label: "航线名称：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_5 = {
  span: 12,
  id: "startPortName",
  label: "起运港：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_6 = {
  span: 12,
  id: "endPortName",
  label: "目的港：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_7 = {
  span: 12,
  id: "transferName",
  label: "中转港：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_8 = {
  span: 12,
  id: "shipCompanyName",
  label: "航空/船公司：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_9 = {
  span: 12,
  id: "isSortBox",
  text: "堡森拼柜",
  type: "singleCheckbox",
  disabled: true,
};
const DIALOG_COLS_10 = {
  span: 12,
  id: "boxCwmName",
  label: "国内集货仓：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_11 = {
  span: 12,
  id: "boxCustomerName",
  label: "拼柜委托客户：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_12 = {
  span: 12,
  id: "boxCountryName",
  label: "目的国：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_13 = {
  span: 12,
  id: "boxOperateMainName",
  label: "拼柜主体：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_14 = {
  span: 12,
  id: "boxConsigneeName",
  label: "收货人：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_15 = {
  span: 12,
  id: "boxBookingSpaceProxyName",
  label: "拼柜订舱代理：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_16 = {
  span: 12,
  id: "boxConsignerName",
  label: "发货人：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_17 = {
  span: 12,
  id: "boxSalesmanName",
  label: "业务员：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_18 = {
  span: 12,
  id: "boxNotifierName",
  label: "通知人：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_19 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "--",
  type: "txt",
};
const DIALOG_COLS_20 = {
  span: 12,
  id: "nameEn",
  label: "拼柜名称：",
  placeholder: "--",
  type: "txt",
};

export const customDialogCols = (row = {}) => {
  const { isSortBox } = row;
  return {
    title: "航线信息(详情)",
    width: "800px",
    labelWidth: "105px",
    ftShowBtnArr: ["fBtnCancel"],
    simpleCustomCols: [
      DIALOG_COLS_1,
      DIALOG_COLS_2,
      DIALOG_COLS_3,
      DIALOG_COLS_4,
      DIALOG_COLS_5,
      DIALOG_COLS_6,
      DIALOG_COLS_7,
      DIALOG_COLS_8,
      DIALOG_COLS_9,
      ...(isSortBox
        ? [
            DIALOG_COLS_10,
            DIALOG_COLS_11,
            DIALOG_COLS_20,
            DIALOG_COLS_12,
            DIALOG_COLS_13,
            DIALOG_COLS_14,
            DIALOG_COLS_15,
            DIALOG_COLS_16,
            DIALOG_COLS_17,
            DIALOG_COLS_18,
            DIALOG_COLS_19,
          ]
        : []),
    ],
  };
};
