export const comDetailTopConfig = {
  columnConfig: [
    {
      label: "业务员",
      prop: "salesmanName",
    },
    {
      label: "创建时间",
      prop: "createTime",
    },
  ],
  rightBtn: [
    // 右侧按钮集合
    {
      icon: "el-icon-arrow-left",
      text: "上一条",
      iconPosition: "left",
      type: "pre",
    },
    {
      icon: "el-icon-arrow-right el-icon--right",
      text: "下一条",
      type: "next",
    },
    {
      icon: "iconfont icon-fanhui",
      text: "返回",
      type: "back",
      className: "back",
    },
  ],
}


const FORM_COLS_1 = {
  span: 8,
  id: "customerBelongCompany",
  label: "客户归属：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_2 = {
  span: 8,
  id: "billWarehouseName",
  label: "入库仓：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_3 = {
  span: 8,
  id: "warehouseBelongCompany",
  label: "仓库所属公司：",
  placeholder: "--",
  type: "txt",
  txtTagArr: [{
    // fontTagColor: true, // 字典词tag字体色
    // bgTagColor: true, // 字典词tag背景色
    tagColor: 'green', // 默认blue色
    basicType: 'warehouseCustomerType',
    basicTypeVal: 'isDirect'
  }]
}
const FORM_COLS_4 = {
  span: 8,
  id: "remark",
  label: "备注：",
  placeholder: "--",
  type: "txt",
}
const FORM_COLS_5 = {
  span: 8,
  id: "isDirect",
  label: "直接客户：",
  fontColor: true,
  placeholder: "--",
  type: "txt",
  basicType: "trueOrFalse"
}

// const FORM_COLS_6 = {
//   id: "accountingTime",
//   label: "账单日期：",
//   placeholder: "账单日期",
//   type: "date",
//   valueFormat: "yyyy/MM/dd"
// }

const FORM_COLS_6 = {
  id: "accountingTime",
  label: "账单日期：",
  placeholder: "请选择账单日期",
  type: "datetime",
  valueFormat: "yyyy/MM/dd HH:mm",
  pickerOptions: {
    // disabledDate(time) {
    //   return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
    // },
  }
}

const FORM_COLS_7 = {
  id: "businessType",
  label: "业务类型：",
  placeholder: "业务类型",
  type: "select",
  basicType: "warehouseBusinessType"

}
const FORM_COLS_8 = {
  id: "batchNumber",
  label: "批次号：",
  placeholder: "批次号",
}
const FORM_COLS_9 = {
  id: "trayNum",
  label: "托盘号：",
  placeholder: "托盘号",
}
const FORM_COLS_10 = {
  span: 24,
  type: "customUploadFile",
  labelWidth: '0px',
  tipsTop: true,
}
const FORM_COLS_11 = {
  span: 24,
  id: "slotImgList",
  labelWidth: '0px',
  type: "slot"
}
const FORM_COLS_TABLE = {
  span: 24,
  id: "slotTable",
  labelWidth: '0px',
  type: "slot",
}
const FORM_COLS_REMARKTITLE = {
  span: 24,
  labelWidth: "30px",
  label: "备注",
  type: "txt",
  className: "custom-remark",
}
const FORM_COLS_REMARK = {
  span: 24,
  id: "remark",
  labelWidth: '0px',
  placeholder: "请输入备注",
  type: "textarea",
}
const FORM_COLS_SLOT = {
  span: 24,
  id: "formSlot",
  labelWidth: '0px',
  type: "slot",
}
// const orderForm = [
//   //订单仓库月租
//   FORM_COLS_1,//客户归属
//   FORM_COLS_2,//入库仓
//   FORM_COLS_3,//仓库所属公司
//   FORM_COLS_4,//备注
//   FORM_COLS_TABLE,
//   FORM_COLS_REMARKTITLE,
//   FORM_COLS_REMARK
// ]
// const operationForm = [
//   //操作单仓库月租
//   FORM_COLS_1,//客户归属
//   FORM_COLS_2,//入库仓
//   FORM_COLS_3,//仓库所属公司
//   FORM_COLS_4,//备注
//   FORM_COLS_TABLE,
//   FORM_COLS_REMARKTITLE,
//   FORM_COLS_REMARK
// ]
// const overSeaWarehouseForm = [
//   //海外仓仓库月租
//   FORM_COLS_2,//入库仓
//   FORM_COLS_3,//仓库所属公司
//   FORM_COLS_5,//直接客户
//   FORM_COLS_4,//备注
//   FORM_COLS_TABLE,
//   FORM_COLS_REMARKTITLE,
//   FORM_COLS_REMARK
// ]

export const formConfig = (row = {}) => {
  // const { orderSource } = row
  // const formList = {
  //   1: operationForm,
  //   2: orderForm,
  //   3: overSeaWarehouseForm
  // }
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                FORM_COLS_1,//客户归属
                FORM_COLS_2,//入库仓
                FORM_COLS_3,//仓库所属公司
                // FORM_COLS_4,//备注
                FORM_COLS_TABLE,
                FORM_COLS_REMARKTITLE,
                // FORM_COLS_REMARK,
                FORM_COLS_SLOT
              ]
            }
          ]
        }
      ]
    }
  ]

}


export const goodsFormInfoConfig = [
  //货物信息
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              FORM_COLS_7,
              FORM_COLS_8,
              FORM_COLS_9
            ]
          }
        ]
      }
    ]
  }
]
export const attachmentInfoConfig = [
  //附件资料
  {
    fieldList: [
      {
        rows: [
          {
            cols: [
              FORM_COLS_10,
              FORM_COLS_11
            ]
          }
        ]
      }
    ]
  }
]

const TABLE_COLS_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
}
const TABLE_COLS_1 = {
  prop: "batchNumber",
  label: "批次号",
  minWidth: 140,
  align: "left",
  showOverflowTooltip: true
}
const TABLE_COLS_2 = {
  prop: "trayNum",
  label: "所在托盘号",
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true
}
const TABLE_COLS_3 = {
  prop: "businessType",
  label: "业务类型",
  fontColor: true,
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true,
  basicType: "warehouseBusinessType"
}
const TABLE_COLS_4 = {
  prop: "storageType",
  label: "存库方式",
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true,
  basicType: "stockNumType"
}
const TABLE_COLS_5 = {
  prop: "locationCode",
  label: "库位",
  minWidth: 80,
  align: "left",
  showOverflowTooltip: true
}
const TABLE_COLS_6 = {
  prop: "productName",
  label: "产品名称",
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true
}
const TABLE_COLS_7 = {
  prop: "stockNum",
  label: "当前库存",
  minWidth: 120,
  decimal: 0,
  align: "right",
  showOverflowTooltip: true
}
const TABLE_COLS_8 = {
  prop: "stockAge",
  label: "库龄/天",
  minWidth: 120,
  decimal: 0,
  align: "right",
  showOverflowTooltip: true
}
const TABLE_COLS_9 = {
  prop: "singleVolume",
  label: "单件体积(CBM)",
  minWidth: 120,
  align: "right",
  decimal: 6,
  showOverflowTooltip: true
}
const TABLE_COLS_10 = {
  prop: "singleWeight",
  label: "单件重量(KG)",
  minWidth: 120,
  align: "right",
  decimal: 3,
  showOverflowTooltip: true
}
const TABLE_COLS_11 = {
  prop: "putShelfTime",
  label: "存仓上架时间",
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true
}
const TABLE_COLS_12 = {
  prop: "customerName",
  label: "客户名称",
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true
}
const TABLE_COLS_13 = {
  prop: "sku",
  label: "产品SKU",
  minWidth: 120,
  align: "left",
  showOverflowTooltip: true
}
export const goodsTableInfoConfig = [
  TABLE_COLS_INDEX,
  TABLE_COLS_1,
  TABLE_COLS_2,
  TABLE_COLS_3,
  TABLE_COLS_4,
  TABLE_COLS_5,
  TABLE_COLS_13,
  TABLE_COLS_6,
  TABLE_COLS_7,
  TABLE_COLS_8,
  TABLE_COLS_9,
  TABLE_COLS_10,
  TABLE_COLS_11,
  // TABLE_COLS_12,
]


export const cardConfig = [
  {
    backgroundColor: '#FFF4EE',
    topLabel: "委托人",
    topValue: "customerName",
    fontColor: "#FA541C",
    // topDictVal: "",
  },
  {
    backgroundColor: "#EBECFE",
    topLabel: "工作单号",
    topValue: "businessNum",
    fontColor: "#6C2CD6",
    // topDictVal: "invoiceType",
  },
  {
    backgroundColor: "#ECF2FF",
    topLabel: "合计应收",
    topValue: "totalReceiveRMB",
    bottomLabel: "合计应付",
    bottomValue: "totalPayRMB",
    fontColor: "#3179EF",
    // topDictVal: "",
    // bottomDictVal: "",
  },
  {
    backgroundColor: "#D1F1FE",
    topLabel: "合计实收",
    topValue: "totalRealityReceiveRMB",
    bottomLabel: "合计实付",
    bottomValue: "totalRealityPayRMB",
    fontColor: "#409EFF",
    // topDictVal: "",
    // bottomDictVal: "",
  },
]






