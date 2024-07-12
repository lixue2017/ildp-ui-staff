export const tableColumns = [
  {
    prop: "content",
    label: "附件资料",
    customRow: true,
    customHeader: true,
    basicType: "SOAEnclosureType",
    basicTypeVal: "type",
  },
  {
    prop: "operation",
    label: "操作",
    width: 120,
    fixed: "right",
    customRow: true,
  }]

export const ATTACH_TYPE = [
  {
    label: '发票资料',
    value: 'invoiceInfo '
  },
  {
    label: '财务执照',
    value: 'financeInfo'
  },
  {
    label: '其他资料',
    value: 'customerOther'
  },
]
