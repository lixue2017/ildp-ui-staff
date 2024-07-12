import { httpProductSkuSelect } from "@/comModel/httpSelect";
const tableColumns = [
  {
    type: "index",
    width: 55,
    align: "center",
    fixed: "left",
  },
  {
    label: "SKU",
    prop: "sku",
    showOverflowTooltip: true,
    width: 160,
    customRow: true,
    request: true,
    config: {
      noMerge: true,
      id: "sku",
      selectLabelKey: "sku",
      ...httpProductSkuSelect(),
      getCustomData: (item, dics) => {
        const { sku, productNameCn, productNameEn } = item;
        const label = `${sku} | ${productNameCn}(${productNameEn})`;
        return {
          label,
          value: item.cusProductId,
          key: item.cusProductId,
        };
      },
      size: "mini",
      isBackAll: true,
      noClearable: true,
      placeholder: "sku",
      message: "请选择SKU！",
    },
    fixed: "left",
  },
  {
    label: "唛头",
    prop: "shippingMark",
    showOverflowTooltip: true,
    width: 120,
    fixed: "left",
  },
  {
    label: "货物中文名称",
    prop: "declaredNameCn",
    showOverflowTooltip: true,
    width: 120,
    fixed: "left",
  },
  {
    label: "货物英文名称",
    prop: "declaredNameEn",
    customRow: true,
    request: true,
    width: 120,
    fixed: "left",
    config: {
      placeholder: "货物英文名称",
      type: "text",
      maxlength: 50,
    },
  },
  {
    labelTop: "海关编码",
    labelBtm: "(海关使用编码)",
    prop: "customsCode",
    showOverflowTooltip: true,
    customHeader: true,
    width: 120,
    fixed: "left",
  },
  {
    label: "计价数量",
    prop: "quantityNum",
    showOverflowTooltip: true,
    customRow: true,
    request: true,
    width: 100,
    config: {
      noMerge: true,
      placeholder: "计价数量",
      type: "inputNumber",
      decimal: 0,
      max: 999999999,
    },
    fixed: "left",
  },
  {
    label: "申报单价",
    prop: "declaredValue",
    align: "right",
    showOverflowTooltip: true,
    width: 100,
  },
  {
    label: "申报总价",
    prop: "totalDeclaredValue",
    align: "right",
    showOverflowTooltip: true,
    width: 100,
  },
  {
    label: "每箱净重",
    prop: "productNetWeight",
    align: "right",
    width: 100,
    showOverflowTooltip: true,
  },
  {
    label: "总净重",
    prop: "totalProductNetWeight",
    align: "right",
    width: 100,
    showOverflowTooltip: true,
  },
  {
    label: "产品材质(中文)",
    prop: "materialCn",
    width: 120,
    showOverflowTooltip: true,
  },
  {
    label: "产品材质(英文)",
    prop: "materialEn",
    width: 120,
    showOverflowTooltip: true,
  },
  {
    labelTop: "用途",
    labelBtm: "(中文/英文)",
    prop: "businessUseEn",
    customHeader: true,
    width: 100,
    showOverflowTooltip: true,
  },
  {
    label: "品牌",
    prop: "brand",
    width: 100,
    showOverflowTooltip: true,
  },
  {
    label: "产品图片",
    prop: "img",
    width: 100,
    showOverflowTooltip: true,
    customRow: true,
    request: true,
    config: {
      noMerge: true,
      placeholder: "产品图片",
    },
    // render: () => {
    //   return "jpg";
    // },
  },
  {
    label: "销售价",
    prop: "productUnitPrice",
    align: "right",
    width: 100,
    showOverflowTooltip: true,
  },
  {
    label: "申报单价/网页售价*100%",
    prop: "declaredValues",
    align: "center",
    width: 120,
    showOverflowTooltip: true,
  },
  {
    label: "ASIN",
    prop: "asin",
    width: 100,
    showOverflowTooltip: true,
  },
  {
    label: "产品型号",
    prop: "boxNumber",
    width: 100,
    showOverflowTooltip: true,
  },
  {
    label: "对应清关店铺的平台销售链接",
    prop: "productLink",
    width: 120,
    showOverflowTooltip: true,
  },
  {
    label: "后台定价截图",
    prop: "priceImg",
    width: 100,
    showOverflowTooltip: true,
    render: () => {
      return "jpg";
    },
  },
  {
    label: "FBA ID",
    prop: "shipmentId",
    customRow: true,
    request: true,
    width: 100,
    config: {
      placeholder: "FBA ID",
      type: "text",
      maxlength: 50,
    },
    className: "border-left border-right",
  },
  {
    label: "Reference ID",
    prop: "referenceId",
    customRow: true,
    width: 100,
    config: {
      placeholder: "内部参考号",
      type: "text",
      maxlength: 50,
    },
    showOverflowTooltip: true,
  },
  {
    label: "包装箱数",
    prop: "boxCount",
    align: "right",
    customRow: true,
    request: true,
    width: 100,
    config: {
      placeholder: "包装箱数",
      type: "inputNumber",
      decimal: 0,
      max: 999999999,
    },
    className: "border-left",
  },
  {
    label: "外箱长(CM)",
    prop: "boxLength",
    align: "right",
    customRow: true,
    request: true,
    width: 110,
    config: {
      placeholder: "箱长",
      type: "inputNumber",
      decimal: 1,
      max: 99999999.9,
    },
    className: "border-left",
  },
  {
    label: "外箱宽(CM)",
    prop: "boxWidth",
    align: "right",
    customRow: true,
    request: true,
    width: 110,
    config: {
      placeholder: "箱宽",
      type: "inputNumber",
      decimal: 1,
      max: 99999999.9,
    },
    className: "border-left",
  },
  {
    label: "外箱高(CM)",
    prop: "boxHeight",
    align: "right",
    customRow: true,
    request: true,
    width: 110,
    config: {
      placeholder: "箱高",
      type: "inputNumber",
      decimal: 1,
      max: 99999999.9,
    },
    className: "border-left",
  },
  {
    label: "每箱毛重(KG)",
    prop: "boxWeight",
    align: "right",
    customRow: true,
    request: true,
    width: 120,
    config: {
      placeholder: "每箱毛重",
      type: "inputNumber",
      decimal: 4,
      max: 99999999.9999,
    },
    className: "border-left border-right",
  },
  {
    label: "总毛重(KG)",
    prop: "boxTotalWeight",
    align: "right",
    width: 100,
    className: "border-left border-right",
    render: (row) => {
      return Number(row.boxTotalWeight || 0).toFixed(4);
    },
    config: {}, // 需要合并单元格
  },
  {
    label: "体积(m³)",
    prop: "boxVolume",
    align: "right",
    width: 100,
    render: (row) => {
      return Number(row.boxVolume || 0).toFixed(4);
    },
    config: {}, // 需要合并单元格
    className: "border-left border-right",
  },
  {
    label: "FBA仓库地址 海外仓地址",
    prop: "consigneeWarehouseId",
    customRow: true,
    customHeader: true,
    request: true,
    width: 110,
    config: {
      type: "autoComplete",
      id: "consigneeWarehouseId",
      selectLabelKey: "consigneeWarehouseCode",
      size: "mini",
      isBackAll: true,
      noClearable: true,
      placeholder: "海外仓地址",
      message: "请选择海外仓地址！",
    },
    className: "border-left border-right",
    showOverflowTooltip: true,
  },
];

const formRule = {};
const slotInputProp = [];
const customHeaderColor = [];
const mergeColumn = [];
const mergeColumnName = [];
function handleColumns() {
  tableColumns.forEach((item, index) => {
    if (item.config) {
      if (!item.config.noMerge) {
        mergeColumn.push(index);
        mergeColumnName.push(item.prop);
      }
      if (Object.keys(item.config).length) {
        slotInputProp.push(item.prop);
      }
      if (item.customHeader) {
        customHeaderColor.push(item.prop);
      }
      if (item.request) {
        formRule[item.prop] =
          item.config.message || `请输入${item.config.placeholder}！`;
      }
    }
  });
}
handleColumns();

export function handleRule(params) {
  for (let key in formRule) {
    console.log(key);
    if (!params[key]) {
      //  && params[key] !== 0
      return formRule[key];
    }
  }
  return false;
}
export {
  tableColumns,
  slotInputProp,
  customHeaderColor,
  mergeColumn,
  mergeColumnName,
};
