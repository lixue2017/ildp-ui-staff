export const config = {
  from: [{
    span: 8,
    id: "code",
    label: "联系人代码：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "company",
    label: "公司名字：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "contactsName",
    label: "类型：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "countryName",
    label: "国家：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "postCode",
    label: "邮编：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "contacts",
    label: "联系人：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "phone",
    label: "联系电话：",
    placeholder: "--",
    type: "txt"
  },
  {
    span: 8,
    id: "email",
    label: "联系邮箱：",
    placeholder: "--",
    type: "txt",
  },
  // {
  //   span: 8,
  //   id: "taxId",
  //   label: "税号：",
  //   type: "slot",
  //   basicType: 'taxIdType'
  // },
  {
    span: 8,
    id: "province",
    label: "省(州)/城市：",
    placeholder: "--",
    type: "txt",
    render: (row) => {
      return `${row.province || '--'}/${row.city || '--'}`
    }
  },
  {
    span: 8,
    id: "area",
    label: "区(县)：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "street",
    label: "街道：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "isDefault",
    text: "设为默认",
    type: "singleCheckbox",
    disabled: true
  },
  {
    span: 24,
    id: "detailsAddr",
    label: "详细地址：",
    placeholder: "--",
    type: "txt",
  }],
  clearanceTable: [{
    type: "index",
    width: "50",
    align: "center"
  },
  {
    label: "资料类型",
    prop: "customsClearanceType",
    width: "110px",
    customRow: true,
    basicType: 'customsClearanceType',
    basicTypeVal: 'customsClearanceType'
  },
  {
    label: "文件编码",
    prop: "code",
  },
  {
    label: "状态",
    prop: "status",
    customRow: true,
    basicType: 'status'
  },
  {
    label: "创建人",
    prop: "createBy",
  },
  {
    label: "创建时间",
    prop: "createTime",
    width: 160
  },
  {
    label: "清关文件",
    prop: "attachList",
    customRow: true,
    width: 200
  }],
  table: [{
    type: "index",
    width: "50",
    align: "center"
  },
  {
    labelTop: "失效操作人",
    labelBtm: "失效时间",
    prop: "invalid",
    customRow: true,
    customHeader: true,
    width: 160
  },
  {
    labelTop: "联系人",
    labelBtm: "联系电话",
    prop: "contacts",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true,
    width: 110
  },
  {
    labelTop: "税号",
    labelBtm: "联系邮箱",
    prop: "taxId",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true,
    basicType: 'taxIdType',
    basicTypeVal: 'taxIdType',
    width: 120,
  },
  {
    labelTop: "国家",
    labelBtm: "邮编",
    prop: "nation",
    customRow: true,
    customHeader: true,
    width: 140,
    showOverflowTooltip: true
  },
  {
    labelTop: "地址",
    labelBtm: "公司名称",
    prop: "detailsAddr",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true
  }]
}