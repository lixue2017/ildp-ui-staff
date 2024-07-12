import {
  httpCustomerSelect,
  httpUserSelect,
  httpLogisticsCustomerSelect,
  httpCompanySelect,
  httpgetCustlist
} from "@/comModel/httpSelect";
import { httpFBAWarehouseSelect,httpWarehousePublicSelect } from "@/comModel/warehouse";
import overseaLangObj from "@/language/overseasLang.js";

const FORM_COLS_1 = {
  span:6,
  id: "createTime",
  label: `${overseaLangObj.sc_time("计费时间")}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_2 = {
  span:6,
  id: "customerId",
  label: `${overseaLangObj.wtr_customer || "委托人"}：`,
  ...httpCustomerSelect(),
};
const FORM_COLS_3 = {
  span:12,
  id: "businessNum",
  label: `${overseaLangObj.gz_dh || "工作单号"}：`,
  placeholder: "请输入",
  type: "text",
};
const FORM_COLS_4 = {
  span:6,
  id: "salesManId",
  selectLabelKey:"salesManName",
  label: `${overseaLangObj.ywy_salesman || "业务员"}：`,
  ...httpUserSelect(),
};
const FORM_COLS_5 = {
  id: "updateTime",
  label: `${overseaLangObj.last_modified("费用最后时间")}：`,
  startPlaceholder: "开始日期",
  endPlaceholder: "结束日期",
  type: "daterange",
  valueFormat: "yyyy-MM-dd",
};
const FORM_COLS_6 = {
  span:6,
  id: "billWarehouseId",
  label: `${overseaLangObj.ck_lb("所在仓")}：`,
  ...httpFBAWarehouseSelect("2"),
};
const FORM_COLS_7 = {
  id: "warehouseBelongCompany",
  label: `${overseaLangObj.ss_gs("仓库所属公司")}：`,
  ...httpLogisticsCustomerSelect(),
};
const FORM_COLS_8 = {
  id: "isDirect",
  label: `${overseaLangObj.zj_kh("是否直接客户")}：`,
  placeholder: "请选择",
  type: "select",
  basicType: "trueOrFalse",
};
const FORM_COLS_9 = {
  startId: "receiveNumStart",
  endId: "receiveNumEnd",
  label: `${overseaLangObj.ys_fy("应收费用")}：`,
  startPlaceholder: "应收费用≤",
  endPlaceholder: "≤应收费用",
  type: "rangeSelect",
};
const FORM_COLS_10 = {
  id: "isFullReceipt",
  label: `${overseaLangObj.qb_sk("是否全部收款")}：`,
  placeholder: "请选择",
  type: "select",
  basicType: "isCoAndPay",
};
const FORM_COLS_11 = {
  startId: "payableNumStart",
  endId: "payableNumEnd",
  label: `${overseaLangObj.yf_fy("应付费用")}：`,
  startPlaceholder: "应付费用≤",
  endPlaceholder: "≤应付费用",
  type: "rangeSelect",
};
const FORM_COLS_12 = {
  id: "isFullPayment",
  label: `${overseaLangObj.qb_fk("是否全部付款")}：`,
  placeholder: "请选择",
  type: "select",
  basicType: "isCoAndPay",
};
const FORM_COLS_13 = {
  id: "batchNumber",
  label: `关联批次号：`,
  placeholder: "请输入",
  type: "text",
};
const FORM_COLS_14 = {
  id: "customerBelongCompanyId",
  label: `业务归属：`,
  placeholder: "请选择",
  ...httpCompanySelect({ status: "0,1,2,3,4,5", isQueryFirstDept: 1 }),
};
export const formOperationConfig = [
  //仓租日账单（操作单,订单）
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              FORM_COLS_1,//创建时间
              FORM_COLS_2,//委托人
              FORM_COLS_3,//工作单号
              FORM_COLS_13,//关联批次号
              FORM_COLS_6,//所在仓
              FORM_COLS_4,//业务员
              FORM_COLS_14,//业务归属
            ],
          },
        ],
      },
    ],
  },
];

export const formConfig = [
  //仓租日账单（海外仓）
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              FORM_COLS_1,//创建时间
              FORM_COLS_2,//委托人
              FORM_COLS_3,//工作单号
              FORM_COLS_13,//关联批次号
              FORM_COLS_4,//业务员
              FORM_COLS_14,//业务归属
            ],
          },
        ],
      },
    ],
  },
];

const TABLE_COLS_SELECTION = {
  type: "selection",
  align: "center",
  width: 50,
  fixed: "left",
};
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};
const TABLE_COLS_1 = {
  prop: "businessNum",
  label: overseaLangObj.gz_dh || "工作单号",
  columnLink: true,
  columnCopyTxt: true,
  sortable: true,
  align: "left",
  fixed: "left",
  minWidth: 200,
  showOverflowTooltip: true,
};
const TABLE_COLS_2 = {
  prop: "customerName",
  label: overseaLangObj.wtr_customer || "委托人",
  sortable: true,
  align: "left",
  fixed: "left",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_3 = {
  prop: "billWarehouseName",
  label: overseaLangObj.ck_lb("所在仓"),
  sortable: true,
  align: "left",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_4 = {
  prop: "warehouseBelongCompany",
  label: overseaLangObj.ss_gs("仓库所属公司"),
  sortable: true,
  align: "left",
  minWidth: 125,
  showOverflowTooltip: true,
};
const TABLE_COLS_5 = {
  prop: "receiveNum",
  label: overseaLangObj.ys_fy("应收费用数"),
  sortable: true,
  align: "right",
  minWidth: 110,
  showOverflowTooltip: true,
};
const TABLE_COLS_6 = {
  prop: "totalReceivables",
  label: overseaLangObj.ys_receivable || "应收",
  sortable: true,
  align: "left",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_7 = {
  prop: "totalReceived",
  label: overseaLangObj.hj_net_receipts || "合计实收",
  sortable: true,
  align: "left",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_8 = {
  prop: "payableNum",
  label: overseaLangObj.yf_fy("应付费用数"),
  sortable: true,
  align: "right",
  minWidth: 110,
  showOverflowTooltip: true,
};
const TABLE_COLS_9 = {
  prop: "totalPayable",
  label: overseaLangObj.yf_meet || "应付",
  sortable: true,
  align: "left",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TABLE_COLS_10 = {
  prop: "totalPayabled",
  label: overseaLangObj.hj_actual_payment || "合计实付",
  sortable: true,
  align: "left",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_11 = {
  prop: "updateTime",
  label: overseaLangObj.last_modified("费用最后时间"),
  sortable: true,
  align: "left",
  minWidth: 140,
  showOverflowTooltip: true,
};
const TABLE_COLS_12 = {
  prop: "remark",
  label: overseaLangObj.bz_remark("备注"),
  sortable: true,
  align: "left",
  showOverflowTooltip: true,
};
const TABLE_COLS_13 = {
  prop: "isDirect",
  label: overseaLangObj.zj_kh("直接客户"),
  sortable: true,
  align: "center",
  minWidth: 100,
  showOverflowTooltip: true,
  basicType: "trueOrFalse",
};
const TABLE_COLS_14 = {
  prop: "salesmanName",
  label: overseaLangObj.ywy_salesman || "业务员",
  sortable: true,
  align: "left",
  minWidth: 100,
  showOverflowTooltip: true,
};
const TABLE_COLS_15 = {
  prop: "createTime",
  label: overseaLangObj.create_time || "创建时间",
  sortable: true,
  align: "left",
  minWidth: 140,
  showOverflowTooltip: true,
};

const TABLE_COLS_16 = {
  prop: "isFullReceipt",
  label: overseaLangObj.qb_sk("是否全部收款"),
  sortable: true,
  align: "center",
  basicType: "isCoAndPay",
  minWidth: 130,
  showOverflowTooltip: true,
  render: (row, dict) => {
    const { isFullReceipt } = row;
    return isFullReceipt == 2 ? "--" : dict;
  },
};

const TABLE_COLS_17 = {
  prop: "isFullPayment",
  label: overseaLangObj.qb_fk("是否全部付款"),
  sortable: true,
  align: "center",
  basicType: "isCoAndPay",
  minWidth: 130,
  showOverflowTooltip: true,
  render: (row, dict) => {
    const { isFullPayment } = row;
    return isFullPayment == 2 ? "--" : dict;
  },
};

const TABLE_COLS_18 = {
  prop: "batchNumber",
  label: '关联批次号',
  sortable: true,
  align: "left",
  minWidth: 160,
  showOverflowTooltip: true,
  render:(row={})=>{
    const {batchNumber=[]}=row
    const length=batchNumber?.length||0
    return length>0?`${length}个：${batchNumber}`:'--'
  }
};

const TABLE_COLS_19 = {
  prop: "customerBelongCompany",
  label: '业务归属',
  sortable: true,
  align: "left",
  minWidth: 120,
  showOverflowTooltip: true,
};

const TABLE_COLS_20 = {
  prop: "lr",
  label: '利润',
  sortable: true,
  align: "left",
  minWidth: 140,
  showOverflowTooltip: true,
};

const TABLE_COLS_OPERATION = {
  label: overseaLangObj.cz_operation || "操作",
  prop: "operation",
  columnOperation: true,
  fixed: "right",
  minWidth: 140,
};

export const tableOperationConfig = [
  //仓租日账单(订单，操作单)
  TABLE_COLS_SELECTION,
  TABLE_COLS_INDEX,
  TABLE_COLS_1,//工作单号
  TABLE_COLS_2,//委托人
  TABLE_COLS_3,//所在仓
  TABLE_COLS_18,//关联批次号
  TABLE_COLS_5,//应收费用数
  TABLE_COLS_6,//合计应收
  TABLE_COLS_8,//应付费用数
  TABLE_COLS_9,//合计应付
  TABLE_COLS_20,//利润
  TABLE_COLS_12,//备注
  TABLE_COLS_19,//业务归属
  TABLE_COLS_14,//业务员
  TABLE_COLS_15,//创建时间
  TABLE_COLS_OPERATION
];

export const tableConfig = [
  //仓租日账单(海外仓)
  TABLE_COLS_SELECTION,
  TABLE_COLS_INDEX,
  TABLE_COLS_1,//工作单号
  TABLE_COLS_2,//委托人
  TABLE_COLS_3,//所在仓
  TABLE_COLS_18,//关联批次号
  TABLE_COLS_5,//应收费用数
  TABLE_COLS_6,//合计应收
  TABLE_COLS_8,//应付费用数
  TABLE_COLS_9,//合计应付
  TABLE_COLS_20,//利润
  TABLE_COLS_12,//备注
  TABLE_COLS_19,//业务归属
  TABLE_COLS_14,//业务员
  TABLE_COLS_15,//创建时间
  TABLE_COLS_OPERATION
];

const DIALOG_FORM_COLS_1={
  span: 24,
  id: "regenerationDate",
  label: "生成日期：",
  placeholder: "请选择",
  type: "date",
  valueFormat: "yyyy-MM-dd",
  pickerOptions: {
    disabledDate(time) {
      //当月至今日及之前的日期
      let now = new Date() //当前日期
      let monthEndDate = new Date(now.getFullYear(), now.getMonth()) // 获取本月的结束日期
      let timeEnd = Date.parse(monthEndDate)
      return  (time.getTime() < timeEnd) || (time.getTime() >= (now - 60 * 60 * 24 * 1000)+( 60 * 60 * 24 * 1000))
    },
  }
};


const DIALOG_FORM_COLS_2={
  span: 24,
  id: "warehouseId",
  label: "选择仓库：",
  placeholder: "请选择",
  ...httpWarehousePublicSelect({ typeList: "2", topFlag: true, permissionType: 2, isHaveComId: 1 }),
}

const DIALOG_FORM_COLS_3={
  span: 24,
  id: "customerId",
  label: "选择客户：",
  placeholder: "请选择",
  ...httpgetCustlist(),
}
const DIALOG_FORM_COLS_SLOT={
  span: 24,
  labelWidth:"35px",
  id: "titleSlot",
  type:"slot"
}



export const customDialogCols = () => {
  return {
    title: '重新生成',
    width: '600px',
    labelWidth: '105px',
    simpleCustomCols: [
      DIALOG_FORM_COLS_SLOT,
      DIALOG_FORM_COLS_1,
      DIALOG_FORM_COLS_2,
      DIALOG_FORM_COLS_3
    ],
    formRules: {
      regenerationDate: [
        { required: true, message: `请选择生成日期`, trigger: "blur" }
      ],
      warehouseId: [
        { required: true, message: `请选择仓库`, trigger: "blur" }
      ],
      customerId: [
        { required: true, message: `请选择客户`, trigger: "blur" }
      ]
    }
  }
}
