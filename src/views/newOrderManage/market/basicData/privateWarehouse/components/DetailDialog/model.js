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
    id: "nationName",
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
    id: "detailAddress",
    label: "详细地址：",
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
      label: "联系邮箱：",
      placeholder: "--",
      type: "text",
      disable: true
    },
    {
      span: 8,
      id: "nationName",
      label: "国家：",
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
      id: "detailAddress",
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

export function config(isPrivateWarehouse) {
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