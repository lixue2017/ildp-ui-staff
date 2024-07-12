import { getCurrencyList } from "@/api/basicData/index";
import { httpEnterprisetSelect } from "@/comModel/httpSelect.js"
const searchColumns = [
  {
    id: "createTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "customerName",
    label: "公司名称：",
    placeholder: "输入公司名称/代码",
    type: "text",
  },
  {
    id: "currencyId",
    label: "币别：",
    type: "autocomplete",
    httpRequest: getCurrencyList,
    defaultProp: {
      value: 'id',
      label: 'code,nameCn'
    }
  },
];


const TABLE_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: 'left'
}

const TABLE_COL_1 = {
  prop: "customerName",
  label: "公司名称",
  minWidth: 210,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
  fixed: 'left'
}
const TABLE_COL_2 = {
  prop: "bankAccount",
  label: "银行账号",
  minWidth: 180,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
  fixed: 'left'
}
const TABLE_COL_3 = {
  prop: "accountName",
  label: "账号名称",
  minWidth: 200,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
}
const TABLE_COL_4 = {
  prop: "openingBank",
  label: "开户行",
  minWidth: 200,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
}
const TABLE_COL_5 = {
  prop: "openAddress",
  label: "开户地址",
  minWidth: 200,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
}
const TABLE_COL_6 = {
  prop: "currencyCode",
  label: "币别",
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
}
const TABLE_COL_7 = {
  prop: "phone",
  label: "电话",
  minWidth: 140,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
}
const TABLE_COL_8 = {
  prop: "invoiceTitle",
  label: "swift code",
  minWidth: 180,
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
}
const TABLE_COL_9 = {
  prop: "remark",
  label: "备注",
  showOverflowTooltip: true,
  sortable: true,
  align: "left",
}
const TABLE_COL_10 = {
  prop: "createBy",
  label: "创建人",
  minWidth: 100,
  align: "left",
  sortable: true,
}
const TABLE_COL_11 = {
  prop: "createTime",
  label: "创建时间",
  align: "left",
  width: 160,
  sortable: true,
}
const TABLE_COL_12 = {
  prop: "isApplyInvoice",
  label: "是否开票",
  showOverflowTooltip: true,
  fontColor: true,
  minWidth: 100,
  sortable: true,
  basicType: "trueOrFalse",
  align: "center",
  fixed: 'right'
}
const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  fixed: 'right',
  // customRow: true,
  columnOperation: true,
	width: 95,
}







const publicTableCols = [
  TABLE_COL_INDEX,
  TABLE_COL_1,
  TABLE_COL_2,
  TABLE_COL_3,
  TABLE_COL_4,
  TABLE_COL_5,
  TABLE_COL_6,
  TABLE_COL_7,
  TABLE_COL_8,
  TABLE_COL_9,
  TABLE_COL_10,
  TABLE_COL_11,
]
const tableColumns = (tName) => {
  let colsLists = []
  if (tName == 1) {
    colsLists = [
      ...publicTableCols,
      TABLE_COL_12,
      TABLE_COL_OPERATION
    ]
  } else {
    colsLists = [
      ...publicTableCols,
      TABLE_COL_OPERATION
    ]
  }
  return colsLists
}

const DIALOG_COL_1 = {
  span: 12,
  id: "customerId",
  label: "公司名称(CN)：",
  placeholder: "请选择公司名称(CN)",
  ...httpEnterprisetSelect(),
  isBackAll: true,
}
const DIALOG_COL_2 = {
  span: 12,
  id: "code",
  label: "公司代码：",
  type: "txt"
}
const DIALOG_COL_3 = {
  span: 12,
  id: "bankAccount",
  label: "银行账号：",
  placeholder: "此处填写银行账号",
  type: "text"
}
const DIALOG_COL_4 = {
  span: 12,
  id: "accountName",
  label: "账号名称：",
  placeholder: "此处填写账号名称",
  type: "text"
}
const DIALOG_COL_5 = {
  span: 12,
  id: "openingBank",
  label: "开户行：",
  placeholder: "此处填写开户行",
  type: "text"
}
const DIALOG_COL_6 = {
  span: 12,
  id: "currency",
  label: "币别：",
  placeholder: "请选择币别",
  type: "autocomplete",
  category: "currency",
  isAutoInitRequest: true,
  type: "slot"
}
const DIALOG_COL_7 = {
  span: 12,
  id: "openAddress",
  label: "公司地址：",
  placeholder: "此处填写公司地址",
  type: "text"
}
const DIALOG_COL_8 = {
  span: 12,
  id: "invoiceTitle",
  label: "发票抬头：",
  placeholder: "此处填写发票抬头",
  type: "text"
}
const DIALOG_COL_9 = {
  span: 12,
  id: "taxNumber",
  label: "纳税号：",
  placeholder: "此处填写纳税号",
}
const DIALOG_COL_10 = {
  span: 12,
  id: "invoiceTitle",
  label: "swift code：",
  placeholder: "此处填写swift code",
}
const DIALOG_COL_11 = {
  span: 24,
  id: "phone",
  label: "电话：",
  placeholder: "此处填写电话",
}
const DIALOG_COL_12 = {
  span: 24,
  id: "remark",
  label: "备注：",
  placeholder: "请此处填写备注",
}
const DIALOG_COL_13 = {
  span: 24,
  id: "isDefault",
  text: "设为默认",
  type: "singleCheckbox"
}
const DIALOG_COL_14 = {
  span: 12,
  id: "openingBankEn",
  label: "BANK NAME：",
  placeholder: "此处填写BANK NAME",
  type: "text"
}
const DIALOG_COL_15 = {
  span: 12,
  id: "accountNameEn",
  label: "ACCOUNT NAME：",
  placeholder: "此处填写ACCOUNT NAME",
  type: "text"
}
const DIALOG_COL_16 = {
  span: 12,
  id: "openAddressEn",
  label: "BANK ADDRESS：",
  placeholder: "此处填写BANK ADDRESS",
  type: "text"
}
const FORM_COL_17 = {
  span: 3,
  id: "isApplyInvoice",
  text: "是否开票",
  type: "singleCheckbox"
}


export const accountOperation = (row) => {
  const { id, activeName, } = row
  const title = `${id ? '修改' : '新增'}${activeName == '0' ? '堡森' : '外部'}账户`
  const isApplyInvoice = activeName == 1 ? {
    type: 'slot'
  } : FORM_COL_17
  return {
    title: title,
    width: '900px',
    labelWidth: '140px',
    isAttachFileId: true,
    className: 'content-padding-20',
    lists: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: [
                  {
                    ...DIALOG_COL_1,//公司名称
                    ...httpEnterprisetSelect({ typeList: `${activeName == '0' ? '0' : '2,3,9'}` }),
                    isAutoInitRequest: true,
                    defaultKey: 'id',
                    id: id ? "customerName" : "customerId",
                    type: id ? 'txt' : "slot",
                  },
                  DIALOG_COL_2,//公司代码
                  DIALOG_COL_3,//银行账号
                  DIALOG_COL_6,//币别
                  DIALOG_COL_5,//开户行
                  DIALOG_COL_14,//BANK NAME
                  DIALOG_COL_4,//账号名称
                  DIALOG_COL_15,//ACCOUNT NAME
                  DIALOG_COL_7,//开户地址
                  DIALOG_COL_16,//BANK ADDRESS
                  DIALOG_COL_9,//纳税号
                  DIALOG_COL_10,//swift code
                  DIALOG_COL_11,//电话
                  DIALOG_COL_12,//备注
                  isApplyInvoice,//是否开票
                ],
              },
            ],
          }
        ],
      }
    ],
    formRules: {
      customerId: [
        { required: true, message: "请选择公司名称", trigger: "change" },
      ],
      bankAccount: [
        { required: true, message: "请选择银行账号", trigger: "change" },
      ],
      openingBank: [
        { required: true, message: "请选择开户行", trigger: "change" },
      ],
      currency: [
        { required: true, message: "请选择币别", trigger: "change" },
      ],
      accountName: [
        { required: true, message: "请选择账号名称", trigger: "change" },
      ],
    }
  }
}

export { searchColumns, tableColumns };
