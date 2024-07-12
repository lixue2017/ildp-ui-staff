const SEARCH_COL_1 = {
  span:6,
  id: "currencyId",
  label: "币别：",
  placeholder: "请选择币别",
  type: "autocomplete",
  category: "currency",
  isAutoInitRequest: true
}
const SEARCH_COL_2 = {
  span:6,
  id: "isApplyInvoice",
  label: "是否开票：",
  placeholder: "请选择",
  type: "select",
  basicType: "trueOrFalse",
}
const SEARCH_COL_3 = {
  span:12,
  id: "name",
  label: "账号信息：",
  placeholder: "请输入账户名称/银行账号/开户行/地址/纳税号",
  type: "text",
}
export const searchForm = [
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              SEARCH_COL_1,
              SEARCH_COL_2,
              SEARCH_COL_3,
            ],
          },
        ],
      },
    ],
  },
]




const TABLE_COLS_index = {
  prop: "isDefault",
  label: "是否默认",
  customRow: true,
  width: 80
}
const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
}
const TABLE_COLS_1 = {
  prop: "bankAccount",
  label: "银行账号",
  minWidth: 120,
  align: "left",
  placeholder: "--",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_2 = {
  prop: "accountName",
  label: "账号名称",
  placeholder: "--",
  minWidth: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_3 = {
  prop: "openingBank",
  label: "开户行",
  placeholder: "--",
  minWidth: 120,
  align: "left",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_4 = {
  prop: "openAddress",
  label: "公司地址",
  minWidth: 120,
  align: "left",
  placeholder: "--",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_5 = {
  prop: "invoiceTitle",
  label: "Swift code",
  placeholder: "--",
  width: 140,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_6 = {
  prop: "taxNumber",
  label: "纳税号",
  minWidth: 100,
  align: "left",
  placeholder: "--",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_7 = {
  prop: "currencyCode",
  label: "币别",
  minWidth: 100,
  align: "center",
  placeholder: "--",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_8 = {
  prop: "phone",
  label: "电话",
  minWidth: 150,
  align: "left",
  placeholder: "--",
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_9 = {
  prop: "remark",
  placeholder: "--",
  label: "备注",
  minWidth: 160,
  sortable: true,
  showOverflowTooltip: true
}
const TABLE_COLS_46 = {
  prop: "isApplyInvoice",
  label: "是否开票",
  basicType: "trueOrFalse",
  fontColor: true,
  minWidth: 120,
  showOverflowTooltip: true,
  sortable: true,
  align:'center'
}
const TABLE_COLS_OPERATION = {
  prop: "operation",
  label: "操作",
  fixed: 'right',
  columnOperation: true,
}
export const bankTableConfig = [
  //客户列表详情银行开票信息tablelists
  TABLE_COLS_INDEX,
  // TABLE_COLS_index,
  TABLE_COLS_2,//账号名称
  TABLE_COLS_1,//银行账号
  TABLE_COLS_46,//是否开票
  TABLE_COLS_3,//开户行
  TABLE_COLS_4,//公司地址
  TABLE_COLS_5,//Swift code
  TABLE_COLS_6,//纳税号
  TABLE_COLS_7,//币别
  TABLE_COLS_8,//电话
  TABLE_COLS_9,//备注
  TABLE_COLS_OPERATION
]
