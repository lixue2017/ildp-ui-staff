const privateSearchColumns = [
  {
    id: "createTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "companyName",
    label: "创建客户：",
    placeholder: "创建来源客户",
    type: "text"
  },
  {
    id: "contacts",
    label: "联系人：",
    placeholder: "联系人",
    type: "text",
  },
  {
    id: "warehouseCode",
    label: "仓库代码：",
    placeholder: "仓库代码",
    type: "text",
  },
  {
    id: "statusList",
    label: "状态：",
    placeholder: "状态（多选）",
    type: "select",
    multiple: true,
    collapseTags: true,
    basicType: 'status'
  }
];

const FBASearchColumns = [
  {
    id: "createTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd"
  },
  {
    id: "warehouseCode",
    label: "仓库代码：",
    placeholder: "仓库代码",
    type: "text",
  },
  {
    id: "platformType",
    label: "平台类型：",
    type: "select",
    basicType: 'warehouseType'
  },
  {
    id: "statusList",
    label: "状态：",
    placeholder: "状态（多选）",
    type: "select",
    multiple: true,
    collapseTags: true,
    basicType: 'status'
  },
  {
    id: "address",
    label: "地址：",
    placeholder: "地址",
    type: "text",
  }
];

function searchColumns(isPrivateWarehouse) {
  return [
    {
      className: "search-form-width",
      fieldList: [
        {
          rows: [
            {
              cols: isPrivateWarehouse ? privateSearchColumns : FBASearchColumns,
            },
          ],
        },
      ],
    },
  ]
}

const privateTableColumns = [
  {
    type: "index",
    width: 50,
    align: "center"
  },
  {
    prop: "warehouseCode",
    label: "仓库代码",
    customRow: true,
    sortable: true,
    width: 100,
    showOverflowTooltip: true,
  },
  {
    prop: "cusWarehouse.contacts",
    label: "联系人",
    width: 100,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "cusWarehouse.postCode",
    label: "邮编",
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "cusWarehouse.warehouseName",
    label: "仓库名称",
    width: 100,
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "cusWarehouse.phone",
    label: "联系电话",
    sortable: true,
    width: "120px"
  },
  {
    prop: "cusWarehouse.email",
    label: "联系邮箱",
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "nationName",
    label: "国家",
    sortable: true,
    showOverflowTooltip: true,
    render: (row) => {
      return `${row.nationTwoCode}[${row.nationName}]`
    }
  },
  {
    prop: "cusWarehouse.address",
    label: "地址",
    sortable: true,
    showOverflowTooltip: true,
    width: '210px'
  },
  {
    prop: "dataStatus",
    label: "状态",
    width: '80px',
    sortable: true,
    customRow: true,
    basicType: 'status'
  },
  {
    prop: "createTime",
    label: "创建时间",
    sortable: true,
    showOverflowTooltip: true,
    width: 110
  },
  {
    prop: "companyName",
    label: "创建客户",
    width: 120,
    sortable: true,
    showOverflowTooltip: true,
  }
]


const FBATableColumns = [
  {
    type: "index",
    width: 50,
    align: "center"
  },
  {
    prop: "warehouseCode",
    label: "仓库代码",
    customRow: true,
    sortable: true,
    showOverflowTooltip: true,
    minWidth: 80,
  },
  {
    prop: "platformType",
    label: "平台",
    sortable: true,
    showOverflowTooltip: true,
    basicType: 'warehouseType'
  },
  {
    prop: "cusWarehouse.warehouseName",
    label: "仓库名称",
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "nationName",
    label: "国家",
    sortable: true,
    showOverflowTooltip: true,
    render: (row) => {
      return `${row.nationTwoCode}[${row.nationName}]`
    }
  },
  {
    prop: "cusWarehouse.address",
    label: "地址",
    sortable: true,
    showOverflowTooltip: true,
    width: '210px'
  },
  {
    prop: "cusWarehouse.postCode",
    label: "邮编",
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    prop: "dataStatus",
    label: "状态",
    sortable: true,
    customRow: true,
    basicType: 'status',
    align: "center"
  },
  {
    prop: "createBy",
    label: "创建人",
    sortable: true,
  },
  {
    prop: "createTime",
    label: "创建时间",
    fixed: 'right',
    sortable: true,
    showOverflowTooltip: true,
  },
  {
    label: "操作",
    prop: "operation",
    // customRow: true,
    columnOperation: true,
    fixed: 'right',
    width: 130
  },
]

function tableColumns(isPrivateWarehouse) {
  return isPrivateWarehouse ? privateTableColumns : FBATableColumns
}

const updateConfig = {
  columns: [{
    span: 12,
    id: "platformType",
    label: "平台类型：",
    type: "select",
    basicType: 'warehouseType'
  },
  {
    span: 12,
    id: "warehouseCode",
    label: "仓库代码：",
    placeholder: "此处填写仓库代码",
    type: "text",
  },
  {
    span: 12,
    id: "warehouseName",
    label: "仓库名称：",
    placeholder: "此处填写仓库名称",
    type: "text",
  },
  {
    span: 24,
    id: "company",
    label: "公司名：",
    placeholder: "此处填写公司名字",
    type: "text",
  },
  {
    span: 12,
    id: "contacts",
    label: "联系人：",
    placeholder: "此处填写联系人姓名",
    type: "text",
  },
  {
    span: 12,
    id: "phone",
    label: "联系电话：",
    placeholder: "此处填写联系电话",
    type: "text",
    inputType: "number"
  },
  {
    span: 12,
    id: "email",
    label: "联系邮箱：",
    placeholder: "此处填写联系邮箱",
    type: "text",
  },
  {
    span: 12,
    id: "postCode",
    label: "邮编：",
    placeholder: "此处填写联系人邮编",
    type: "text",
  },
  {
    span: 12,
    id: "countryId",
    label: "国家：",
    placeholder: "请选择国家",
    type: "autocomplete",
    category: "country",
    defaultProp: {
      value: 'id',
      label: 'twoCode,nameCn'
    }
  },
  {
    span: 12,
    id: "province",
    label: "省(州)：",
    placeholder: "此处填写省/州",
    type: "text",
  },
  {
    span: 12,
    id: "city",
    label: "城市：",
    placeholder: "此处填写城市",
    type: "text",
  },
  {
    span: 12,
    id: "area",
    label: "区(县)：",
    placeholder: "此处填写区/县",
    type: "text",
  },
  {
    span: 12,
    id: "street",
    label: "街道：",
    placeholder: "此处填写详细地址",
    type: "text",
  },
  {
    span: 12,
    id: "detailsAddr",
    label: "详细地址：",
    placeholder: "此处填写小区楼栋/乡村名称",
    type: "text",
  },
  {
    span: 24,
    id: "remark",
    label: "备注：",
    placeholder: "此处填写备注",
    type: "text"
  }],
  formRules: {
    platformType: [
      { required: true, message: "请选择平台类型", trigger: "blur" },
    ],
    warehouseCode: [
      { required: true, message: "请输入仓库代码", trigger: "blur" },
    ],
    contacts: [{ required: true, message: "请输入联系人", trigger: "blur" }],
    phone: [
      { required: true, message: "请输入联系电话", trigger: "blur" },
    ],
    postCode: [{ required: true, message: "请输入邮编", trigger: "blur" }],
    countryId: [
      { required: true, message: "请选择国家", trigger: "blur" },
    ],
    province: [{ required: true, message: "请输入省/州", trigger: "blur" }],
    city: [{ required: true, message: "请输入城市", trigger: "blur" }],
    area: [{ required: true, message: "请输入区/县", trigger: "blur" }],
    detailsAddr: [
      { required: true, message: "请输入详细地址", trigger: "blur" },
    ],
  }, // 表单校验规则
}


const privateDetailColumns = {
  from: [{
    span: 8,
    id: "warehouseCode",
    label: "仓库代码：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "warehouseName",
    label: "仓库名称：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "postCode",
    label: "邮编：",
    placeholder: "--",
    type: "text",
    disable: true
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
    type: "text",
    disable: true
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
    id: "countryName",
    label: "所在国家：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "province",
    label: "省(州)：",
    placeholder: "--",
    type: "text",
    disable: true
  },
  {
    span: 8,
    id: "city",
    label: "城市：",
    placeholder: "--",
    type: "text",
    disable: true
  },
  {
    span: 8,
    id: "area",
    label: "区(县)：",
    placeholder: "--",
    type: "text",
    disable: true
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
    span: 8,
    id: "street",
    label: "门牌号：",
    placeholder: "--",
    type: "text",
    disable: true
  },
  {
    span: 16,
    id: "remark",
    label: "备注：",
    placeholder: "--",
    type: "text",
    disable: true
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
    width: "110px"
  },
  {
    labelTop: "联系人",
    labelBtm: "联系电话",
    prop: "contacts",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true
  },
  {
    labelTop: "仓库名称",
    labelBtm: "联系邮箱",
    prop: "name",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true
  },
  {
    labelTop: "国家",
    labelBtm: "邮编",
    prop: "postCode",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true
  },
  {
    labelTop: "地址",
    labelBtm: "备注",
    prop: "detailsAddr",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true
  }]
}

const FBADetailColumns = {
  from: [
    {
      span: 8,
      id: "platformType",
      label: "平台类型：",
      type: "txt",
      // disable: true,
      basicType: 'warehouseType'
    },
    {
      span: 8,
      id: "warehouseCode",
      label: "仓库代码：",
      type: "text",
      disable: true
    },
    {
      span: 8,
      id: "warehouseName",
      label: "仓库名称：",
      placeholder: "--",
      type: "text",
      disable: true
    },
    {
      span: 8,
      id: "company",
      label: "公司名：",
      placeholder: "--",
      type: "text",
      disable: true
    },
    {
      span: 8,
      id: "postCode",
      label: "邮编：",
      placeholder: "--",
      type: "text",
      disable: true
    },
    {
      span: 8,
      id: "contacts",
      label: "联系人：",
      type: "text",
      disable: true
    },
    {
      span: 8,
      id: "phone",
      label: "联系电话：",
      placeholder: "--",
      type: "text",
      disable: true
    },
    {
      span: 8,
      id: "email",
      label: "联系邮箱",
      placeholder: "--",
      type: "text",
      disable: true
    },
    {
      span: 8,
      id: "countryName",
      label: "国家",
      type: "text",
      disable: true
    },
    {
      span: 8,
      id: "province",
      label: "省(州)：",
      placeholder: "--",
      type: "text",
      disable: true
    },
    {
      span: 8,
      id: "city",
      label: "城市：",
      placeholder: "--",
      type: "text",
      disable: true
    },
    {
      span: 8,
      id: "area",
      label: "区(县)：",
      placeholder: "--",
      type: "text",
      disable: true
    },
    {
      span: 8,
      id: "street",
      label: "街道：",
      placeholder: "--",
      type: "text",
      disable: true
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
      id: "remark",
      label: "备注：",
      placeholder: "--",
      type: "text",
      disable: true
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
    width: "110px"
  },
  {
    labelTop: "仓库名称",
    labelBtm: "公司名",
    prop: "FBAName",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true
  },
  {
    labelTop: "联系人",
    labelBtm: "联系电话/联系邮箱",
    prop: "FBAContacts",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true
  },
  {
    labelTop: "国家",
    labelBtm: "邮编",
    prop: "postCode",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true
  },
  {
    labelTop: "地址",
    labelBtm: "备注",
    prop: "detailsAddr",
    customRow: true,
    customHeader: true,
    showOverflowTooltip: true
  }]
}

function detailColumns(isPrivateWarehouse) {
  return {
    from: [
      {
        fieldList: [
          {
            rows: [
              {
                cols: isPrivateWarehouse ? privateDetailColumns.from : FBADetailColumns.from,
              },
            ],
          },
        ],
      },
    ], // 表单渲染列表
    table: isPrivateWarehouse ? privateDetailColumns.table : FBADetailColumns.table
  }
}


export { searchColumns, tableColumns, updateConfig, detailColumns };
