import { DATA_STATUS } from "@/utils/mixin"
const searchColumns = [
  {
    id: "beginTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "customerShortName",
    label: "创建来源客户：",
    placeholder: "请输入创建来源客户",
    type: "text",
    labelWidth: "120px",
  },
  {
    id: "contacts",
    label: "联系人：",
    placeholder: "联系人",
    type: "text",
  },
  {
    id: "company",
    label: "联系公司：",
    placeholder: "联系公司",
    type: "text",
  },
  {
    id: "statusSearch",
    label: "状态：",
    placeholder: "状态（多选）",
    type: "select",
    multiple: true,
    collapseTags: true,
    basicType: "status",
  }
];

const tableColumns = [
  {
    type: "index",
    width: 50,
    align: "center"
  },
  {
    prop: "code",
    label: "联系人代码",
    sortable: true,
    customRow: true,
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: "cusContacts.contacts",
    label: "联系人",
    sortable: true,
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: "cusContacts.company",
    label: "公司名",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "cusContacts.phone",
    label: "联系电话",
    width: 120,
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "cusContacts.email",
    label: "联系邮箱",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "cusContacts.countryName",
    label: "国家",
    sortable: true,
    showOverflowTooltip: true
  },
  {
    prop: "cusContacts.address",
    label: "详细地址",
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "cusContacts.postCode",
    label: "邮编",
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "dataStatus",
    label: "状态",
    width: '120px',
    sortable: true,
    customRow: true,
    basicType: 'status'
  },
  {
    prop: "createTime",
    label: "创建时间",
    sortable: true,
    width: '180px'
  },
  {
    prop: "customerShortName",
    label: "创建客户",
    sortable: true,
    minWidth: 120,
    fixed: 'right',
    showOverflowTooltip: true,
  }
]

const detailColumns = {
  from: [{
    span: 8,
    id: "code",
    label: "联系人代码：",
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
    id: "contactsName",
    label: "类型：",
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
    type: "text",
    disable: true
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
    id: "countryName",
    label: "国家：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "taxId",
    label: "税号：",
    type: "slot",
    basicType: 'taxIdType'
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
    id: "province",
    label: "省(州)：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "city",
    label: "城市：",
    placeholder: "--",
    type: "txt",
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
    span: 16,
    id: "detailsAddr",
    label: "详细地址：",
    placeholder: "--",
    type: "text",
    disable: true
  },
  {
    span: 24,
    id: "isDefault",
    text: "设为默认",
    type: "singleCheckbox",
    labelWidth: "20px",
    disabled: true
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
    render: (row) => {
      const names = row.attachList.map((item) => item ? item.name : '--')
      return names.join('、')
    },
    showOverflowTooltip: true,
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


export { searchColumns, tableColumns, detailColumns, DATA_STATUS };
