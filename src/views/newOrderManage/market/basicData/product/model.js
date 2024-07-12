import { toFixedNum } from "@/utils/instructions";
import { formatMoney } from "@/utils/index";

const searchColumns = [
  {
    id: "createTime",
    label: "创建时间：",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    type: "daterange",
    valueFormat: "yyyy-MM-dd",
  },
  {
    id: "customerName",
    label: "创建来源客户：",
    placeholder: "请输入创建来源客户",
    type: "text",
    labelWidth: "120px",
  },
  {
    id: "sku",
    label: "唛头：",
    placeholder: "请输入SKU",
    type: "text",
  },
  {
    id: "name",
    label: "产品名称：",
    placeholder: "请输入名称",
    type: "text",
  },
  {
    id: "dataStatus",
    label: "状态：",
    placeholder: "请选择状态",
    type: "select",
    basicType: "status",
  },
];

const TABLE_COLS_SELECTION = {
  type: "selection",
  width: 50,
  align: "center",
};

const TABLE_COL_OPERATION = {
  label: "操作",
  prop: "operation",
  // customRow: true,
  columnOperation: true,
  fixed: "right",
  minWidth: 140,
};

const tableColumns = [
  TABLE_COLS_SELECTION,
  {
    type: "index",
    width: 50,
    align: "center",
    fixed: "left",
  },
  {
    prop: "sku",
    labelTop: "唛头",
    labelBtm: "名称",
    customRow: true,
    customHeader: true,
    minWidth: 320,
    fixed: "left",
    showOverflowTooltip: true,
  },
  {
    prop: "productInfo",
    label: "产品信息",
    sortable: true,
    customRow: true,
    minWidth: 600,
    showOverflowTooltip: true,
  },
  {
    labelTop: "产品毛重KG",
    labelBtm: "产品净重KG",
    prop: "singleBoxValue",
    customRow: true,
    customHeader: true,
    minWidth: 150,
    align: "right",
  },
  {
    labelTop: "申报价格",
    labelBtm: "销售单价",
    prop: "declaredValue",
    customRow: true,
    customHeader: true,
    minWidth: 150,
    basicType: "declaredUnit",
    basicTypeVal: "declaredNum",
    align: "right",
  },
  {
    labelTop: "长*宽*高(CM)",
    labelBtm: "单箱数量",
    prop: "productValue",
    customRow: true,
    customHeader: true,
    minWidth: 200,
  },
  {
    labelTop: "状态",
    labelBtm: "修订次数",
    prop: "dataStatus",
    customRow: true,
    customHeader: true,
    minWidth: 100,
    basicType: "status",
    // fixed: 'right'
  },
  {
    label: "创建信息",
    prop: "createBy",
    minWidth: 320,
    sortable: true,
    customRow: true,
    showOverflowTooltip: true,
    // fixed: 'right',
  },
  TABLE_COL_OPERATION,
];

const addTpList = [
  {
    label: "magnetic",
    value: "带磁",
  },
  {
    label: "liquid",
    value: "液体",
  },
  {
    label: "fragile",
    value: "易碎",
  },
];

const tableTpList = [
  {
    label: "magnetic",
    value: "磁",
  },
  {
    label: "electrified",
    value: "电",
  },
  {
    label: "liquid",
    value: "液体",
  },
  {
    label: "fragile",
    value: "易碎",
  },
];

const detailColumns = {
  from: [
    {
      span: 8,
      id: "sku",
      label: "产品SKU：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "customsCode",
      label: "HS CODE：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "declaredNameEn",
      label: "申报品名(EN)：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "declaredNameCn",
      label: "申报品名(CN)：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "productModel",
      label: "产品型号：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "singleBoxNetWeight",
      label: "单箱净重：",
      type: "txt",
      render: (rows) => {
        return `${toFixedNum(rows.singleBoxNetWeight)}KG`;
      },
    },
    {
      span: 8,
      id: "declaredValue",
      label: "申报单价：",
      placeholder: "--",
      type: "txt",
      render: (rows, dics) => {
        const list = [];
        if (rows.declaredUnit) list.push(rows.declaredUnit);
        if (dics) list.push(dics);
        return `${formatMoney(rows.declaredValue)} ${list.join("/")}`;
      },
      basicType: "declaredUnit",
      basicTypeVal: "declaredNum",
    },
    {
      span: 8,
      id: "productWeight",
      label: "产品毛重：",
      type: "txt",
      render: (rows) => {
        return `${toFixedNum(rows.productWeight)}KG`;
      },
    },
    {
      span: 8,
      id: "productNetWeight",
      label: "产品净重：",
      type: "txt",
      render: (rows) => {
        return `${toFixedNum(rows.productNetWeight)}KG`;
      },
    },
    {
      span: 8,
      id: "asin",
      label: "ASIN：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "productTypeName",
      label: "产品品类：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "singleBoxNum",
      label: "单箱数量：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "userSetCode",
      label: "自定义编码：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "materialCn",
      label: "产品材质(CN)：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "singleBoxWeight",
      label: "单箱毛重：",
      type: "txt",
      render: (rows) => {
        return `${toFixedNum(rows.singleBoxWeight)}KG`;
      },
    },
    {
      span: 8,
      id: "size",
      label: "长*宽*高：",
      type: "txt",
      render: (rows) => {
        return `${toFixedNum(rows.productLength)} * ${toFixedNum(
          rows.productWidth
        )} * ${toFixedNum(rows.productHigh)}CM`;
      },
    },
    {
      span: 8,
      id: "materialEn",
      label: "产品材质(EN)：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "productLink",
      label: "产品信息链接：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "brand",
      label: "品牌：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "businessUseCn",
      label: "产品用途(CN)：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "productUnitPrice",
      label: "销售单价：",
      decimal: 2,
      colFormat: "thousandthMark",
      type: "txt",
    },
    {
      span: 8,
      id: "businessUseEn",
      label: "产品用途(EN)：",
      placeholder: "--",
      type: "txt",
    },
  ],
  table: [
    {
      type: "index",
      width: 50,
      align: "center",
      fixed: "left",
    },
    {
      labelTop: "失效操作人",
      labelBtm: "失效时间",
      prop: "invalid",
      customRow: true,
      customHeader: true,
      minWidth: 200,
      fixed: "left",
    },
    {
      prop: "productInfo",
      label: "产品信息",
      customRow: true,
      minWidth: 400,
      showOverflowTooltip: true,
    },
    {
      labelTop: "产品毛重KG",
      labelBtm: "产品净重KG",
      prop: "productWeight",
      customRow: true,
      customHeader: true,
      minWidth: 150,
    },
    {
      labelTop: "单箱毛重KG",
      labelBtm: "单箱净重KG",
      prop: "singleBoxWeight",
      customRow: true,
      customHeader: true,
      minWidth: 150,
    },
    {
      labelTop: "申报价格",
      labelBtm: "销售单价",
      prop: "declaredValue",
      customRow: true,
      customHeader: true,
      minWidth: 150,
      basicType: "declaredUnit",
      basicTypeVal: "declaredNum",
    },
    {
      labelTop: "长*宽*高(CM)",
      labelBtm: "单箱数量",
      prop: "productValue",
      customRow: true,
      customHeader: true,
      minWidth: 150,
    },
    {
      labelTop: "产品材质(CN)",
      labelBtm: "产品材质(EN)",
      prop: "materialCn",
      customRow: true,
      customHeader: true,
      minWidth: 150,
      showOverflowTooltip: true,
    },
    {
      labelTop: "ASIN",
      labelBtm: "自定义编码",
      prop: "customAsin",
      customRow: true,
      customHeader: true,
      minWidth: 150,
    },
    {
      labelTop: "产品用途(CN)",
      labelBtm: "产品用途(EN)",
      prop: "businessUse",
      customRow: true,
      customHeader: true,
      minWidth: 150,
    },
    {
      labelTop: "产品信息链接",
      labelBtm: "产品属性",
      prop: "productLink",
      customRow: true,
      customHeader: true,
      minWidth: 250,
      showOverflowTooltip: true,
    },
    {
      prop: "pricingScreenshot",
      label: "定价截图",
      customRow: true,
      minWidth: 150,
    },
  ],
};

export { searchColumns, tableColumns, addTpList, tableTpList, detailColumns };
