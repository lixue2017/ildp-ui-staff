import {httpOverseasWarehouseSkuPage} from "@/comModel/httpSelect.js"

const FORM_COL_1 = {
  span: 24,
  id: "productTips",
  labelWidth: "0px",
  type: "slot",
};

const FORM_COL_2 = {
  span: 24,
  id: "customerName",
  label: "企业信息：",
  placeholder: "--",
  type: "txt",
  render: (row = {}) => {
    const { name = "", customerName = "" } = row;
    return `${customerName || "--"}${name ? `(${name})` : ""}`;
  },
};

const FORM_COL_3 = {
  span: 24,
  id: "tableTitle",
  labelWidth: "0px",
  type: "slot",
};

const FORM_COL_4 = {
  span: 24,
  id: "productTable",
  labelWidth: "0px",
  type: "slot",
};

export const searchForm = (row = {}) => {
  return [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [FORM_COL_1, FORM_COL_2, FORM_COL_3, FORM_COL_4],
            },
          ],
        },
      ],
    },
  ];
};




const TABLE_PRODIFF_COL_SELECTION = {
  type: "selection",
  align: "center",
  width: 50,
  fixed: "left",
};

const TABLE_PRODIFF_COL_INDEX = {
  type: "index",
  width: 50,
  align: "center",
  fixed: "left",
};

const TABLE_PRODIFF_COL_1 = {
  prop: "wmsName",
  label: "堡森云仓",
  showOverflowTooltip: true,
};

const TABLE_PRODIFF_COL_2 = {
  prop: "productName",
  label: "堡森云SKU",
  minWidth:120,
  showOverflowTooltip: true,
};

const TABLE_PRODIFF_COL_3 = {
  prop: "inventory",
  label: "堡森云库存",
  minWidth:120,
  showOverflowTooltip: true,
};
const TABLE_PRODIFF_COL_4 = {
  prop: "erpSku",
  label: "海外仓商品SKU",
  minWidth:180,
  showOverflowTooltip: true,
  customRow:true,
  fieldItem: {
    id: "erpSku",
    size: "mini",
    placeholder: "请选择ERP商品",
    ...httpOverseasWarehouseSkuPage(),
  },
};
const TABLE_PRODIFF_COL_5 = {
  prop: "erpApiProductState",
  label: "关联状态",
  showOverflowTooltip: true,
  fontColor:true,
  basicType:"erpApiProductState"
};

const TABLE_PRODIFF_COL_6 = {
  prop: "erpInventory",
  label: "马帮库存",
  showOverflowTooltip: true,
};

const TABLE_PRODIFF_COL_OPERATION = {
  prop: "operation",
  label: "操作",
  fixed: 'right',
  minWidth:120,
  columnOperation: true,
}
// const TABLE_PRODIFF_COL_1 = {
//   prop: "type",
//   label: "类型",
//   basicType:"apiProductDifferenceType",
//   showOverflowTooltip: true,
// };

// const TABLE_PRODIFF_COL_2 = {
//   prop: "erpSku",
//   label: "客户商品编码",
//   minWidth:120,
//   showOverflowTooltip: true,
// };





export const productDiffTableColumns = [
  TABLE_PRODIFF_COL_SELECTION,
  TABLE_PRODIFF_COL_INDEX,
  TABLE_PRODIFF_COL_1,
  TABLE_PRODIFF_COL_2,
  TABLE_PRODIFF_COL_3,
  TABLE_PRODIFF_COL_4,
  TABLE_PRODIFF_COL_5,
  TABLE_PRODIFF_COL_6,
  TABLE_PRODIFF_COL_OPERATION
];
