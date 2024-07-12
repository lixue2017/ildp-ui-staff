import {
  httpRoleDeptUserSelect,
  shipCompanyList,
  httpPortPublicSelect,
  httpCabinetTypeSelect,
  httpCostTypeSelect,
  httpAccountSelect
} from "@/comModel/httpSelect.js";
import { httpCurrencySelect } from "@/comModel/httpSelect";
const FORM_COLS_1 = {
  span: 12,
  id: "customer",
  label: "客户名称：",
  placeholder: "请输入客户名称",
  type: "text",
};
const FORM_COLS_2 = {
  span: 12,
  id: "typeId",
  label: "账单类型：",
  placeholder: "请选择账单类型",
  type: "radio",
  disable:true,
  basicType: "billType",
};
const FORM_COLS_3 = {
  span: 12,
  id: "lxrname",
  label: "联系人：",
  placeholder: "请输入联系人",
  type: "text",
};
const FORM_COLS_4 = {
  span: 12,
  id: "billNo",
  label: "账单类型：",
  placeholder: "--",
  type: "txt",
};
const FORM_COLS_21 = {
  span: 12,
  id: "shipCompanyId",
  label: "船公司/航空公司：",
  placeholder: "请输入航空公司",
  labelWidth: "140px",
  selectLabelKey:"shipCompany",
  ...shipCompanyList(),
  currData:true,
  type:"slot"
};
const FORM_COLS_22 = {
  span: 12,
  id: "mblNo",
  label: "航空主运单/船东单：",
  placeholder: "请输入航空主运单/船东单",
  labelWidth: "140px",
  type: "text",
};
const FORM_COLS_23 = {
  span: 12,
  id: "sono",
  label: "订舱号：",
  placeholder: "请输入订舱号",
  labelWidth: "140px",
  type: "text",
};
const FORM_COLS_24 = {
  span: 12,
  id: "hblNo",
  label: "航空分运单/货代单：",
  placeholder: "请输入航空分运单/货代单",
  labelWidth: "140px",
  type: "text",
};
const FORM_COLS_25 = {
  span: 12,
  id: "startPortId",
  label: "启运港：",
  placeholder: "请输入启运港",
  labelWidth: "140px",
  selectLabelKey:"startPort",
  ...httpPortPublicSelect(),
  currData:true,
  type:"slot"
};
const FORM_COLS_26 = {
  span: 12,
  id: "sailOpenTime",
  label: "离港日期/起飞日期：",
  labelWidth: "140px",
  placeholder: "年/月/日",
  type: "date",
  valueFormat: "yyyy/MM/dd",
};
const FORM_COLS_27 = {
  span: 12,
  id: "endPortId",
  label: "目的港：",
  placeholder: "请输入目的港",
  labelWidth: "140px",
  selectLabelKey:"endPort",
  ...httpPortPublicSelect(),
  currData:true,
  type:"slot"
};
const FORM_COLS_28 = {
  span: 12,
  id: "etaTime",
  label: "到港日期/落地日期：",
  labelWidth: "140px",
  placeholder: "年/月/日",
  type: "date",
  valueFormat: "yyyy/MM/dd",
};
const FORM_COLS_29 = {
  span: 8,
  id: "flightName",
  label: "船名/航班：",
  placeholder: "请输入船名/航班",
  labelWidth: "140px",
  type: "text",
};
const FORM_COLS_30 = {
  span: 8,
  id: "routeCode",
  label: "航次：",
  placeholder: "请输入航次",
  labelWidth: "140px",
  type: "text",
};
const FORM_COLS_31 = {
  span: 8,
  id: "boxModel",
  label: "柜型/柜量：",
  placeholder: "请输入柜型/柜量",
  labelWidth: "140px",
  type: "text",
  // ...httpCabinetTypeSelect
};
const FORM_COLS_32 = {
  span: 8,
  id: "quantity",
  label: "货物件数：",
  placeholder: "请输入",
  labelWidth: "140px",
  type: "text",
};
const FORM_COLS_33 = {
  span: 8,
  id: "totalWeight",
  label: "货物毛量：",
  placeholder: "请输入货物毛量",
  labelWidth: "140px",
  type: "text",
};
const FORM_COLS_34 = {
  span: 8,
  id: "totalVolume",
  label: "货物体积：",
  placeholder: "请输入货物体积",
  labelWidth: "140px",
  type: "text",
};
const FORM_COLS_35 = {
  span: 8,
  id: "boxNo",
  label: "箱号：",
  placeholder: "请输入箱号",
  labelWidth: "140px",
  type: "text",
};
const FORM_COLS_36 = {
  span: 8,
  id: "customerOrderNum",
  label: "客户单号：",
  placeholder: "请输入客户单号",
  labelWidth: "140px",
  type: "text",
};

const FORM_COLS_50 = {
  span: 24,
  id: "TABLE_SLOT",
  labelWidth: "0px",
  type: "slot",
};

const FORM_COLS_80 = {
  span: 12,
  id: "accountId",
  label: "开户名：",
  placeholder: "请输入开户名",
  // selectLabelKey:"accountName",
  ...httpAccountSelect(),
  type:'slot',
  currData:true,
  multiple: true,
};

const FORM_COLS_81 = {
  span: 12,
  id: "openingBank",
  label: "开户行：",
  placeholder: "请输入开户行",
  type: "txt",
};
const FORM_COLS_82 = {
  span: 12,
  id: "bankAccount",
  label: "账户：",
  placeholder: "请输入账户",
  type: "txt",
};
const FORM_COLS_83 = {
  span: 12,
  id: "UNCHARTED_COLS_SLOT",
  type: "slot",
};

// 更换成员
export const dialogConfig = () => {
  return {
    title: "账单编辑",
    width: "1080px",
    labelWidth: "100px",
    // className: 'content-padding-20',
    lists: [
      {
        fieldList: [
          {
            className: "border-bottom-solid form-cols-2",
            title: "客户信息",
            rows: [
              {
                cols: [FORM_COLS_1, FORM_COLS_2, FORM_COLS_3, FORM_COLS_4],
              },
            ],
          },
          {
            className: "border-bottom-solid form-cols-2",
            title: "货物信息",
            rows: [
              {
                cols: [
                  FORM_COLS_21,
                  FORM_COLS_22,
                  FORM_COLS_23,
                  FORM_COLS_24,
                  FORM_COLS_25,
                  FORM_COLS_26,
                  FORM_COLS_27,
                  FORM_COLS_28,
                  FORM_COLS_29,
                  FORM_COLS_30,
                  FORM_COLS_31,
                  FORM_COLS_32,
                  FORM_COLS_33,
                  FORM_COLS_34,
                  FORM_COLS_35,
                  FORM_COLS_36,
                ],
              },
            ],
          },
          {
            title: "费用明细",
            rows: [
              {
                cols: [FORM_COLS_50],
              },
            ],
          },
          {
            className: "border-bottom-solid form-cols-2",
            title: "我司账号资料",
            rows: [
              {
                cols: [
                  FORM_COLS_80,
                  FORM_COLS_83,
                  FORM_COLS_81,
                  FORM_COLS_83,
                  FORM_COLS_82,
                  FORM_COLS_83,
                ],
              },
            ],
          },
        ],
      },
    ],
    formRules: {
      customer: [
        { required: true, message: "请输入客户名称", trigger: "change" },
      ],
      // lxrname: [
      //   { required: true, message: "请输入联系人", trigger: "change" },
      // ],
      // shipCompanyId: [
      //   { required: true, message: "请选择船公司", trigger: "change" },
      // ],
      // mblNo: [
      //   { required: true, message: "请输入船东单", trigger: "change" },
      // ],
      // sono: [
      //   { required: true, message: "请输入订舱号", trigger: "change" },
      // ],
      // hblNo: [
      //   { required: true, message: "请输入货代单", trigger: "change" },
      // ],
      // startPortId: [
      //   { required: true, message: "请选择启运港", trigger: "change" },
      // ],
      // sailOpenTime: [
      //   { required: true, message: "请选择离岗日期", trigger: "change" },
      // ],
      // endPortId: [
      //   { required: true, message: "请选择目的港", trigger: "change" },
      // ],
      // etaTime: [
      //   { required: true, message: "请选择到岗日期", trigger: "change" },
      // ],
      // flightName: [
      //   { required: true, message: "请输入船名/航班", trigger: "change" },
      // ],
      // routeCode: [
      //   { required: true, message: "请输入航次", trigger: "change" },
      // ],
      // boxModel: [
      //   { required: true, message: "请输入柜型/柜量", trigger: "change" },
      // ],
      // quantity: [
      //   { required: true, message: "请输入货物件数", trigger: "change" },
      // ],
      // totalWeight: [
      //   { required: true, message: "请输入货物毛重", trigger: "change" },
      // ],
      // totalVolume: [
      //   { required: true, message: "请输入货物体积", trigger: "change" },
      // ],
      // boxNo: [
      //   { required: true, message: "请输入箱号", trigger: "change" },
      // ],
      // customerOrderNum: [
      //   { required: true, message: "请输入客户单号", trigger: "change" },
      // ],
      accountId: [
        { required: true, message: "请选择开户名", trigger: "change" },
      ],
    },
  };
};

const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COL_1 = {
  prop: "costId",
  label: "收费项目",
  customRow: true,
  showOverflowTooltip: true,
  fieldItem: {
    id: "costId",
    size: "mini",
    selectLabelKey: "costName",
    placeholder: "费用名称",
    ...httpCostTypeSelect({type:0}),
  },
};
const TABLE_COL_2 = {
  prop: "currencyId",
  label: "币种",
  customRow: true,
  showOverflowTooltip: true,
  fieldItem: {
    id: "currencyId",
    size: "mini",
    selectLabelKey: "currencyCode",
    placeholder: "币种",
    ...httpCurrencySelect,
  },
};
const TABLE_COL_3 = {
  prop: "unitPrice",
  label: "单价",
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COL_4 = {
  prop: "num",
  label: "数量",
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COL_5 = {
  prop: "totalMoney",
  label: "金额",
  // customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COL_6 = {
  prop: "remark",
  label: "备注",
  customRow: true,
  showOverflowTooltip: true,
};
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
};

export const tableColumns = (row = {}) => {
  return [
    TABLE_COL_INDEX,
    TABLE_COL_1,
    TABLE_COL_2,
    TABLE_COL_3,
    TABLE_COL_4,
    TABLE_COL_5,
    TABLE_COL_6,
    TABLE_COL_OPERATION,
  ];
};
