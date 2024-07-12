import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import { toFixedNum } from "@/utils/instructions";
const ADDRESS_COL_1 = {
  span: 8,
  id: "orderSn",
  label: "工作单号：",
  type: "txt",
};
const ADDRESS_COL_2 = {
  span: 8,
  id: "customerName",
  label: "委托人：",
  type: "txt",
};
const ADDRESS_COL_3 = {
  span: 8,
  id: "time",
  label: "接单时间：",
  type: "txt",
};
const ADDRESS_COL_4 = {
  span: 16,
  id: "titleTxt",
  label: "货物信息",
  type: "txt",
  customLabel: true,
  labelWidth: "70px",
  txtClassName: "base-flex-align",
  txtTagArr: [
    {
      basicType: "freightType",
      basicTypeVal: "freightType",
    },
  ],
};
const ADDRESS_COL_5 = ({ customerId, countryId }) => ({
  span: 8,
  id: "wmsSonId",
  selectLabelKey: "wmsCode",
  label: "收货地：",
  ...httpWarehousePublicSelect({
    itemId: "id",
    typeList: "0,1,2,3,4",
    customerId,
    countryId,
    includTypeList: "0,1,2,3",
  }),
});
const ADDRESS_COL_6 = {
  span: 24,
  id: "tableSlot",
  type: "slot",
  labelWidth: "0px",
};

export const addressDialogCols = (obj) => {
  const { freightType } = obj || {};
  return {
    title: "货物信息维护",
    width: "1050px",
    labelWidth: "85px",
    dictionaryWords: ["freightType"], // 需要字典词时，传字典词的key
    simpleCustomCols: [
      ADDRESS_COL_1,
      ADDRESS_COL_2,
      ADDRESS_COL_3,
      ADDRESS_COL_4,
      ...(freightType === 1 ? [ADDRESS_COL_5(obj)] : []),
      ADDRESS_COL_6,
    ],
    formRules: {
      wmsSonId: [
        { required: true, message: `请选择收货地`, trigger: "change" },
      ],
    },
  };
};

const ADDRESS_TABLE_COL_0 = {
  type: "index",
  width: 50,
  align: "center",
};
const ADDRESS_TABLE_COL_1 = {
  label: "Shipment ID",
  prop: "shipmentId",
  minWidth: 120,
  showOverflowTooltip: true,
};
const ADDRESS_TABLE_COL_2 = {
  label: "Reference ID",
  prop: "referenceId",
  minWidth: 106,
  showOverflowTooltip: true,
};
const ADDRESS_TABLE_COL_3 = {
  label: "箱数",
  prop: "num",
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
  decimal: 0,
};
const ADDRESS_TABLE_COL_4 = {
  prop: "boxLengthWidthHeight",
  label: "外箱尺寸/CM",
  minWidth: 100,
  showOverflowTooltip: true,
  render: (r) =>
    `${toFixedNum(r.boxLength)}*${toFixedNum(r.boxWidth)}*${toFixedNum(
      r.boxHeight
    )}`,
};
const ADDRESS_TABLE_COL_5 = {
  prop: "singleBoxVolume",
  label: "单箱体积/m³",
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
};
const ADDRESS_TABLE_COL_6 = {
  prop: "singleBoxWeight",
  label: "单箱重量/KG",
  minWidth: 100,
  showOverflowTooltip: true,
  align: "right",
  decimal: 2,
};
const ADDRESS_TABLE_COL_7 = {
  prop: "sku",
  label: "SKU",
  minWidth: 100,
  showOverflowTooltip: true,
};
export const tableAddressColumns = (obj) => {
  const { freightType, customerId, countryId } = obj || {};
  let COLS = [
    ADDRESS_TABLE_COL_0,
    ADDRESS_TABLE_COL_1,
    ADDRESS_TABLE_COL_2,
    ADDRESS_TABLE_COL_3,
    ADDRESS_TABLE_COL_4,
    ADDRESS_TABLE_COL_5,
    ADDRESS_TABLE_COL_6,
    ADDRESS_TABLE_COL_7,
  ];
  if (freightType === 0) {
    COLS.push({
      prop: "wmsCode",
      label: "收货地",
      minWidth: 136,
      showOverflowTooltip: true,
      customRow: true,
      request: true,
      fieldItem: {
        id: "wmsSonId",
        selectLabelKey: "wmsCode",
        size: "mini",
        ...httpWarehousePublicSelect({
          itemId: "id",
          typeList: "0,1,2,3,4",
          includTypeList: "0,1,2,3",
          customerId,
          countryId,
        }),
      },
    });
  }
  return COLS;
};
