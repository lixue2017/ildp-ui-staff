import overseaLangObj from "@/language/overseasLang.js";
import {
  MAX_PRODUCT_LWH,
  MAX_BOX_WEIGHT,
  MIN_PRODUCT_NUM,
  MAX_PRODUCT_NUM,
  MAX_SKU_NUM,
} from "@/utils/instructions.js";
import { httpProductSkuSelect } from "@/comModel/httpSelect";
import { getReturnWmsPackageList } from "@/api/warehouse/process";

const selectWmsOrderPackages = () => {
  return {
    type: "autocomplete",
    searchParamName: "name",
    httpRequest: (params) => {
      const { name, ...nParams } = params || {};
      return getReturnWmsPackageList({
        trackSn: name,
        ...nParams,
      });
    },
    getCustomData: (item) => {
      const label = item.trackSn || "--";
      return {
        value: item.id,
        key: item.id,
        label,
        title: label,
      };
    },
  };
};

const TC_TABLE_COL_1 = {
  type: "index",
  width: 50,
  align: "center",
};
const TC_TABLE_COL_2 = {
  type: "selection",
  width: 50,
  align: "center",
};
const TC_TABLE_COL_3 = {
  prop: "sku",
  label: "SKU",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TC_TABLE_COL_4 = {
  prop: "productNameCn",
  label: overseaLangObj.cp_name || "产品名称",
  minWidth: 120,
  showOverflowTooltip: true,
};
const TC_TABLE_COL_5 = {
  prop: "verifySkuLong",
  label: overseaLangObj.c_length("长(CM)"),
  minWidth: 90,
  align: "right",
  showOverflowTooltip: true,
  max: MAX_PRODUCT_LWH,
  decimal: 1,
};
const TC_TABLE_COL_6 = {
  prop: "verifySkuWide",
  label: overseaLangObj.k_width("宽(CM)"),
  minWidth: 90,
  align: "right",
  showOverflowTooltip: true,
  max: MAX_PRODUCT_LWH,
  decimal: 1,
};
const TC_TABLE_COL_7 = {
  prop: "verifySkuHigh",
  label: overseaLangObj.g_height("高(CM)"),
  minWidth: 90,
  align: "right",
  showOverflowTooltip: true,
  max: MAX_PRODUCT_LWH,
  decimal: 1,
};
const TC_TABLE_COL_8 = {
  prop: "verifySkuVolume",
  label: overseaLangObj.lf_cbm("体积(CBM)"),
  showOverflowTooltip: true,
  minWidth: 90,
  decimal: 3,
  align: "right",
};

const TC_TABLE_COL_9 = {
  prop: "verifySkuWeight",
  label: overseaLangObj.sp_mz || "商品毛重(KG)",
  showOverflowTooltip: true,
  minWidth: 100,
  align: "right",
  max: MAX_BOX_WEIGHT,
  decimal: 2,
};
const TC_TABLE_COL_10 = {
  prop: "forecastNum",
  label: overseaLangObj.ys_sku_num || "预收SKU数",
  minWidth: 90,
  decimal: 0,
  align: "right",
  showOverflowTooltip: true,
};
const TC_TABLE_COL_11 = {
  prop: "takeNum",
  label: overseaLangObj.received_sku_num || "已收SKU数",
  minWidth: 90,
  decimal: 0,
  align: "right",
  showOverflowTooltip: true,
};
const TC_TABLE_COL_12 = {
  prop: "takeAmountBox",
  label: overseaLangObj.sh_num || "收货数量",
  width: 100,
  align: "right",
  showOverflowTooltip: true,
  // max: MAX_PRODUCT_NUM,
  decimal: 0,
};
const TC_TABLE_COL_13 = {
  prop: "packingTrackingNum",
  label: "箱号/包裹跟踪号",
  showOverflowTooltip: true,
  minWidth: 120,
};
const TC_TABLE_COL_14 = {
  prop: "storageMode",
  label: overseaLangObj.storage_type || "存库方式",
  showOverflowTooltip: true,
  fontColor: true,
  width: 90,
  basicType: "wmsStorageMode",
};

const WMS_TABLE_COL_99 = {
  prop: "operation",
  label: overseaLangObj.cz_operation || "操作",
  width: 90,
  fixed: "right",
  columnOperation: true,
};

export const wmsTableCols = (isSee) => {
  const WMS_TABLE_COLS_2 = [
    TC_TABLE_COL_1,
    ...(isSee ? [] : [TC_TABLE_COL_2]),
    {
      ...TC_TABLE_COL_3,
      customRow: true,
      fieldItem: {
        id: "cpmId",
        size: "mini",
        selectLabelKey: "sku",
        selectEmitItem: true,
        ...httpProductSkuSelect("1,3"),
      },
    },
    {
      ...TC_TABLE_COL_13,
      customRow: true,
      editCellKeyName: "rBtnUpdate",
      fieldItem: {
        id: "packageId",
        size: "mini",
        // selectLabelKey: "packingTrackingNum",
        ...selectWmsOrderPackages(),
      },
    },
    TC_TABLE_COL_4,
    TC_TABLE_COL_14,
    {
      ...TC_TABLE_COL_5,
      customRow: !isSee,
    },
    {
      ...TC_TABLE_COL_6,
      customRow: !isSee,
    },
    {
      ...TC_TABLE_COL_7,
      customRow: !isSee,
    },
    TC_TABLE_COL_8,
    {
      ...TC_TABLE_COL_9,
      customRow: !isSee,
    },
    TC_TABLE_COL_10,
    TC_TABLE_COL_11,
    ...(isSee
      ? []
      : [
          {
            ...TC_TABLE_COL_12,
            customRow: !isSee,
            editCellKeyName: "temp_secondId",
            isEditEasyCell: true,
            fieldItem: {
              disableKey: "noVerifyFlag",
              type: "inputNumber",
              max: MAX_SKU_NUM,
              minGreaterZero: true,
              requiredKeyArr: ["takeAmountBox"],
            },
          },
        ]), // 收货完成不显示剩余收货数
    ...(isSee ? [] : [WMS_TABLE_COL_99]),
  ];
  return WMS_TABLE_COLS_2;
};

const TC_TABLE_COL_207 = {
  prop: "takeNum",
  label: overseaLangObj.ys_num || "已收数量",
  showOverflowTooltip: true,
  width: 90,
  // max: MAX_PRODUCT_NUM,
  align: "right",
  decimal: 0,
};
const TC_TABLE_COL_208 = {
  prop: "traySn",
  label: overseaLangObj.pallet_number() || "托盘号",
  showOverflowTooltip: true,
  minWidth: 136,
  columnLink: true,
};
const TC_TABLE_COL_209 = {
  prop: "orderNumFromTray",
  label: "托盘上货物批次",
  showOverflowTooltip: true,
  minWidth: 136,
  render: (r) =>
    `${r.orderNumFromTray || "--"}个：${r.orderSnFromTray || "--"}`,
};
const TC_TABLE_COL_210 = {
  prop: "takeTime",
  label: "收货时间",
  showOverflowTooltip: true,
  width: 132,
};
const TC_TABLE_COL_211 = {
  prop: "kq",
  label: "库位号",
  showOverflowTooltip: true,
  minWidth: 128,
  render: (r) => `${r.kq || "--"}${r.kw || ""}`,
};
const TC_TABLE_COL_212 = {
  prop: "attachList",
  label: "图片",
  width: 218,
  customRow: true,
  editCellKeyName: "temp_secondId",
  isEditEasyCell: true,
};
const TC_TABLE_COL_213 = {
  prop: "remark",
  label: "备注",
  width: 218,
  customRow: true,
  editCellKeyName: "temp_secondId",
  isEditEasyCell: true,
};
// 收货信息
export const wmsReceivedTableCols = (isSee, obj) => {
  const { httpDelImgRequest, onAreaChange } = obj || {};
  let WMS_RECEIVED_TABLE_COLS_2 = [
    TC_TABLE_COL_1,
    {
      ...TC_TABLE_COL_3,
      customRow: true,
    },
    TC_TABLE_COL_4,
    TC_TABLE_COL_9,
    TC_TABLE_COL_8,
    TC_TABLE_COL_13,
    {
      ...TC_TABLE_COL_207,
      editCellKeyName: "rBtnUpdate",
      customRow: !isSee,
      isEditEasyCell: true,
      fieldItem: {
        type: "inputNumber",
        max: MAX_SKU_NUM,
        minGreaterZero: true,
        requiredKeyArr: ["takeNum"],
      },
    },
    TC_TABLE_COL_208,
    TC_TABLE_COL_209,
    TC_TABLE_COL_210,
    TC_TABLE_COL_211,
    {
      ...TC_TABLE_COL_212,
      fieldItem: {
        type: "attachList",
        editUploadKey: "temp_secondId",
        httpDelImgRequest,
      },
    },
    {
      ...TC_TABLE_COL_213,
      fieldItem: {
        type: "textarea",
        onAreaChange,
      },
    },
    {
      ...WMS_TABLE_COL_99,
      width: 138,
      columnMoreOperation: true,
    },
  ];
  return WMS_RECEIVED_TABLE_COLS_2;
};
