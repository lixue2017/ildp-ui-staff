import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import { httpProductSkuSelect } from "@/comModel/httpSelect";
import {
  MAX_PRODUCT_LWH,
  MAX_PRODUCT_NUM,
  MAX_BOX_WEIGHT,
  toFixedNum,
} from "@/utils/instructions.js";

export const config = {
  goods: (Fn, isCabinet) => [
    {
      span: 8,
      id: "shipmentId",
      label: "Shipment ID：",
      placeholder: "Shipment ID",
      labelWidth: "120px",
      type: "text",
      maxlength: 50,
      // ...(!isCabinet ? { type: "txt", placeholder: "--" } : {}),
      ...{ type: "txt", placeholder: "--" },
    },
    {
      span: 4,
      id: "warehousingBoxNum",
      label: "箱数：",
      placeholder: "箱数",
      type: "inputNumber",
      numDecimal: 0,
      max: MAX_PRODUCT_NUM,
      // ...!isCabinet ? {
      //   decimal: 0,
      //   type: "txt",
      //   placeholder: "--"
      // } : {}
    },
    {
      span: 8,
      id: "boxSize",
      label: "外箱尺寸：",
      placeholder: "外箱尺寸",
      decimal: 1,
      colMax: MAX_PRODUCT_LWH,
      type: "slot",
      className: "box-size",
      // ...(!isCabinet
      //   ? {
      //       type: "txt",
      //       placeholder: "--",
      //       className: "",
      //       render: (r) => {
      //         return `${toFixedNum(r.warehousingLength, 1)} * ${toFixedNum(
      //           r.warehousingWidth,
      //           1
      //         )} * ${toFixedNum(r.warehousingHeight, 1)}`;
      //       },
      //     }
      //   : {}),
      ...{
        type: "txt",
        placeholder: "--",
        className: "",
        render: (r) => {
          return `${toFixedNum(r.warehousingLength, 1)} * ${toFixedNum(
            r.warehousingWidth,
            1
          )} * ${toFixedNum(r.warehousingHeight, 1)}`;
        },
      },
    },
    {
      span: 4,
      id: "warehousingVolume",
      label: "单箱体积：",
      placeholder: "--",
      type: "slot",
      decimal: 2,
      // ...(!isCabinet
      //   ? {
      //       type: "txt",
      //       placeholder: "--",
      //     }
      //   : {}),
      ...{
        type: "txt",
        placeholder: "--",
      },
    },
    {
      span: 8,
      id: "referenceId",
      label: "Reference ID：",
      placeholder: "Reference ID",
      labelWidth: "120px",
      type: "text",
      // ...(!isCabinet
      //   ? {
      //       type: "txt",
      //       placeholder: "--",
      //     }
      //   : {}),
      ...{
        type: "txt",
        placeholder: "--",
      },
    },
    {
      span: 4,
      id: "warehousingWeight",
      label: "单箱重量：",
      placeholder: "单箱重量",
      type: "inputNumber",
      numDecimal: 2,
      max: MAX_BOX_WEIGHT,
      // ...(!isCabinet
      //   ? {
      //       type: "txt",
      //       placeholder: "--",
      //       decimal: 2,
      //     }
      //   : {}),
      ...{
        type: "txt",
        placeholder: "--",
        decimal: 2,
      },
    },
    {
      span: 8,
      id: "consigneeWarehouseName",
      label: "目的地：",
      placeholder: "目的地",
      ...httpWarehousePublicSelect({ itemId: "id", typeList: "0,1,2,3,4" }),
      isBackAll: true,
      type: "slot",
      handle: (val) => {
        Fn && Fn(val);
      },
      ...(!isCabinet
        ? {
            type: "txt",
            placeholder: "--",
          }
        : {}),
    },
    {
      span: 4,
      id: "addProduct",
      type: "slot",
      className: "icon-btn",
    },
  ],
  previewGoods: [
    {
      span: 8,
      id: "shipmentId",
      label: "Shipment ID/Reference ID：",
      labelWidth: "180px",
      tipWidth: "200px",
      placeholder: "--",
      type: "txt",
      render: (row) => {
        return `${row.shipmentId}/${row.referenceId || "--"}`;
      },
    },
    {
      span: 4,
      id: "warehousingBoxNum",
      label: "箱数：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 8,
      id: "consigneeWarehouseName",
      label: "目的地：",
      placeholder: "--",
      type: "txt",
      render: (row) => {
        if (
          typeof row.consigneeWarehouseName === "object" &&
          !row.consigneeWarehouseId
        ) {
          const { code: consigneeWarehouseCode, name: warehouseName } =
            row.consigneeWarehouseName;
          return `${consigneeWarehouseCode || "--"}/${warehouseName || "--"}`;
        }
        return `${row.consigneeWarehouseCode || "--"}/${
          row.warehouseName || "--"
        }`;
      },
    },
  ],
  product: (i, Fn) => [
    {
      span: 8,
      id: "product",
      label: `产品${i + 1}：`,
      labelWidth: "50px",
      placeholder: "产品",
      ...httpProductSkuSelect(),
      isBackAll: true,
      type: "slot",
      handle: (val) => {
        Fn && Fn(val, i);
      },
      getCustomData: (item, dics) => {
        const { sku, productNameCn, productNameEn } = item;
        const label = `${sku} | ${productNameCn}(${productNameEn})`;
        return {
          label,
          value: item.id,
          key: item.id,
        };
      },
    },
    {
      span: 4,
      id: "productCount",
      label: "数量：",
      placeholder: "数量",
      type: "inputNumber",
      numDecimal: 0,
      max: MAX_PRODUCT_NUM,
    },
    {
      span: 5,
      id: "customsCode",
      label: "H S CODE：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 3,
      id: "inlandExportParam",
      labelWidth: "0px",
      type: "slot",
      basicType: "productSituation",
      basicTypeVal: "inlandExportParam",
    },
    {
      span: 4,
      id: "addProduct",
      type: "slot",
      className: "icon-btn",
    },
  ],
  previewProduct: [
    {
      span: 8,
      id: "product",
      label: "产品：",
      labelWidth: "50px",
      placeholder: "--",
      type: "txt",
      render: (row) => {
        return `${row.sku} | ${row.productNameCn}(${row.productNameEn})`;
      },
    },
    {
      span: 4,
      id: "productCount",
      label: "数量：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 6,
      id: "customsCode",
      label: "H S CODE：",
      placeholder: "--",
      type: "txt",
    },
    {
      span: 6,
      id: "inlandExportParam",
      labelWidth: "0px",
      type: "slot",
      basicType: "productSituation",
    },
  ],
};
export const formConfig = [
  {
    span: 8,
    id: "shipmentId",
    label: "Shipment ID：",
    placeholder: "Shipment ID",
    type: "text",
  },
  {
    span: 4,
    id: "num",
    label: "箱数：",
    placeholder: "箱数",
    type: "inputNumber",
    numDecimal: 2,
  },
  {
    span: 8,
    id: "boxSize",
    label: "外箱尺寸：",
    placeholder: "外箱尺寸",
    type: "slot",
  },
  {
    span: 4,
    id: "boxVolume",
    label: "单箱体积：",
    placeholder: "箱数",
    type: "txt",
  },
  {
    span: 8,
    id: "referenceId",
    label: "ReferenceId：",
    placeholder: "ReferenceId",
    type: "text",
  },
  {
    span: 4,
    id: "boxWeight",
    label: "单箱重量：",
    placeholder: "单箱重量",
    type: "text",
    inputType: "number",
  },
  {
    span: 8,
    id: "consigneeWarehouseId",
    label: "目的地：",
    placeholder: "目的地",
    type: "slot",
  },
];

export const previewFormConfig = [
  {
    span: 8,
    id: "shipmentId",
    label: "Shipment ID/Reference ID：",
    labelWidth: "180px",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 4,
    id: "num",
    label: "箱数：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 8,
    id: "consigneeWarehouseId",
    label: "目的地:",
    placeholder: "--",
    type: "txt",
  },
];

export const productConfig = [
  {
    span: 8,
    id: "product",
    label: "产品1：",
    labelWidth: "50px",
    placeholder: "产品",
    type: "AutoComplete",
  },
  {
    span: 4,
    id: "num",
    label: "数量：",
    placeholder: "数量",
    type: "AutoComplete",
  },
  {
    span: 6,
    id: "hsCode",
    label: "H S CODE：",
    placeholder: "--",
    type: "txt",
  },
  {
    span: 6,
    id: "inlandExportParam",
    labelWidth: "0px",
    type: "slot",
  },
];
